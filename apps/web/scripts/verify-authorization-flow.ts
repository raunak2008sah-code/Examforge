import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma, type RoleName } from '@examforge/db';
import { auth } from '../src/server/auth/auth';
import { authService, AuthServiceError } from '../src/server/auth/auth-service';
import { withApiRoles } from '../src/server/auth/api';
import { hasPermission, permissions } from '../src/server/auth/permissions';
import { middleware } from '../middleware';

const roleNames = ['ADMIN', 'REVIEWER', 'STUDENT'] as const satisfies readonly RoleName[];

const createSessionCookie = async (email: string, password: string) => {
  const signInResponse = await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe: true,
    },
    asResponse: true,
    headers: new Headers({
      origin: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    }),
  });

  if (!signInResponse.ok) {
    throw new Error(`Sign-in failed for ${email} with HTTP ${signInResponse.status}.`);
  }

  const setCookie = signInResponse.headers.get('set-cookie');
  const sessionCookie = setCookie?.split(';')[0];
  if (!sessionCookie) {
    throw new Error(`No session cookie returned for ${email}.`);
  }

  return sessionCookie;
};

const createHeadersWithCookie = (sessionCookie: string) => {
  const requestHeaders = new Headers();
  requestHeaders.set('cookie', sessionCookie);
  return requestHeaders;
};

const assertAuthError = async (
  action: () => Promise<unknown>,
  expectedCode: AuthServiceError['code'],
) => {
  try {
    await action();
  } catch (error) {
    if (error instanceof AuthServiceError && error.code === expectedCode) {
      return;
    }
    throw error;
  }

  throw new Error(`Expected AuthServiceError ${expectedCode}.`);
};

const prepareUser = async (role: RoleName) => {
  const roleRecord = await prisma.role.findUnique({
    where: { name: role },
    select: { id: true },
  });

  if (!roleRecord) {
    throw new Error(`${role} role is required before authorization verification.`);
  }

  const email = `authz-${role.toLowerCase()}@example.invalid`;
  const password = `Authz-${randomUUID()}-1a`;

  await prisma.session.deleteMany({
    where: {
      user: {
        email,
      },
    },
  });
  await prisma.account.deleteMany({
    where: {
      user: {
        email,
      },
    },
  });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: `Authorization ${role}`,
      emailVerified: true,
      roleId: roleRecord.id,
      isActive: true,
      deletedAt: null,
      accounts: {
        create: {
          accountId: email,
          providerId: 'credential',
          password: passwordHash,
        },
      },
    },
    create: {
      email,
      name: `Authorization ${role}`,
      emailVerified: true,
      roleId: roleRecord.id,
      isActive: true,
      accounts: {
        create: {
          accountId: email,
          providerId: 'credential',
          password: passwordHash,
        },
      },
    },
    select: { id: true },
  });

  const sessionCookie = await createSessionCookie(email, password);
  return { email, password, role, sessionCookie, userId: user.id };
};

const verifyMiddleware = (sessionCookie: string) => {
  const adminRequest = new NextRequest('http://localhost:3000/admin');
  const adminResponse = middleware(adminRequest);
  if (adminResponse.status !== 307) {
    throw new Error(
      `Expected unauthenticated /admin request to redirect, got ${adminResponse.status}.`,
    );
  }

  const apiRequest = new NextRequest('http://localhost:3000/api/v1/exams');
  const apiResponse = middleware(apiRequest);
  if (apiResponse.status !== 401) {
    throw new Error(
      `Expected unauthenticated /api/v1 request to return 401, got ${apiResponse.status}.`,
    );
  }

  const healthRequest = new NextRequest('http://localhost:3000/api/v1/health');
  const healthResponse = middleware(healthRequest);
  if (healthResponse.status !== 200) {
    throw new Error(
      `Expected public health route to pass middleware, got ${healthResponse.status}.`,
    );
  }

  const authenticatedApiRequest = new NextRequest('http://localhost:3000/api/v1/exams', {
    headers: createHeadersWithCookie(sessionCookie),
  });
  const authenticatedApiResponse = middleware(authenticatedApiRequest);
  if (authenticatedApiResponse.status !== 200) {
    throw new Error(
      `Expected authenticated API route to pass middleware, got ${authenticatedApiResponse.status}.`,
    );
  }
};

async function main() {
  const users = await Promise.all(roleNames.map((role) => prepareUser(role)));
  const usersByRole = Object.fromEntries(users.map((user) => [user.role, user])) as Record<
    RoleName,
    (typeof users)[number]
  >;

  for (const user of users) {
    const session = await authService.getSessionFromHeaders(
      createHeadersWithCookie(user.sessionCookie),
    );
    if (!session) {
      throw new Error(`No enriched session loaded for ${user.role}.`);
    }
    if (session.user.role !== user.role) {
      throw new Error(`Expected ${user.role} role, got ${session.user.role}.`);
    }
  }

  const adminHeaders = createHeadersWithCookie(usersByRole.ADMIN.sessionCookie);
  const reviewerHeaders = createHeadersWithCookie(usersByRole.REVIEWER.sessionCookie);
  const studentHeaders = createHeadersWithCookie(usersByRole.STUDENT.sessionCookie);

  await authService.requireRoleFromHeaders(adminHeaders, 'ADMIN');
  await authService.requireRoleFromHeaders(reviewerHeaders, 'REVIEWER');
  await authService.requireRoleFromHeaders(studentHeaders, 'STUDENT');

  await assertAuthError(
    () => authService.requireRoleFromHeaders(studentHeaders, 'ADMIN'),
    'FORBIDDEN',
  );
  await assertAuthError(() => authService.requireAuthFromHeaders(new Headers()), 'UNAUTHENTICATED');

  if (!hasPermission('ADMIN', permissions.manageUsers)) {
    throw new Error('ADMIN should be able to manage users.');
  }
  if (hasPermission('REVIEWER', permissions.manageUsers)) {
    throw new Error('REVIEWER must not be able to manage users.');
  }
  if (!hasPermission('STUDENT', permissions.manageOwnAttempts)) {
    throw new Error('STUDENT should be able to manage own attempts.');
  }

  await authService.requireOwnershipFromHeaders(studentHeaders, {
    userId: usersByRole.STUDENT.userId,
  });
  await authService.requireOwnershipFromHeaders(adminHeaders, {
    userId: usersByRole.STUDENT.userId,
  });
  await assertAuthError(
    () =>
      authService.requireOwnershipFromHeaders(reviewerHeaders, {
        userId: usersByRole.STUDENT.userId,
      }),
    'FORBIDDEN',
  );

  const adminOnlyHandler = withApiRoles(['ADMIN'], async () => {
    return NextResponse.json({ ok: true });
  });
  const deniedResponse = await adminOnlyHandler(
    new NextRequest('http://localhost:3000/api/v1/admin/users', {
      headers: reviewerHeaders,
    }),
  );
  if (deniedResponse.status !== 403) {
    throw new Error(`Expected protected API helper to return 403, got ${deniedResponse.status}.`);
  }

  const allowedResponse = await adminOnlyHandler(
    new NextRequest('http://localhost:3000/api/v1/admin/users', {
      headers: adminHeaders,
    }),
  );
  if (allowedResponse.status !== 200) {
    throw new Error(`Expected protected API helper to return 200, got ${allowedResponse.status}.`);
  }

  verifyMiddleware(usersByRole.STUDENT.sessionCookie);

  for (const user of users) {
    await prisma.user.delete({
      where: { id: user.userId },
    });
  }

  console.info(
    'Authorization verification passed: middleware, role loading, role checks, permissions, API helpers, and ownership.',
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
