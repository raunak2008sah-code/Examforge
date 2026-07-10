import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { prisma } from '@examforge/db';
import { auth } from '../src/server/auth/auth';

const verificationEmail = 'auth-verification@example.invalid';
const verificationPassword = `Auth-${randomUUID()}-1a`;

const getSessionCookie = (headers: Headers) => {
  const cookie = headers.get('set-cookie');
  if (!cookie) {
    throw new Error('Better Auth did not set a session cookie.');
  }

  const sessionCookie = cookie.split(';')[0];
  if (!sessionCookie) {
    throw new Error('Better Auth returned an empty session cookie.');
  }

  return sessionCookie;
};

async function main() {
  const studentRole = await prisma.role.findUnique({
    where: { name: 'STUDENT' },
    select: { id: true },
  });

  if (!studentRole) {
    throw new Error('STUDENT role is required before auth verification.');
  }

  await prisma.session.deleteMany({
    where: {
      user: {
        email: verificationEmail,
      },
    },
  });
  await prisma.account.deleteMany({
    where: {
      user: {
        email: verificationEmail,
      },
    },
  });
  const password = await hashPassword(verificationPassword);
  const user = await prisma.user.upsert({
    where: { email: verificationEmail },
    update: {
      name: 'Auth Verification',
      emailVerified: true,
      roleId: studentRole.id,
      isActive: true,
      deletedAt: null,
      accounts: {
        create: {
          accountId: verificationEmail,
          providerId: 'credential',
          password,
        },
      },
    },
    create: {
      email: verificationEmail,
      name: 'Auth Verification',
      emailVerified: true,
      roleId: studentRole.id,
      isActive: true,
      accounts: {
        create: {
          accountId: verificationEmail,
          providerId: 'credential',
          password,
        },
      },
    },
    select: { id: true },
  });

  const signInResponse = await auth.api.signInEmail({
    body: {
      email: verificationEmail,
      password: verificationPassword,
      rememberMe: true,
    },
    asResponse: true,
    headers: new Headers({
      origin: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    }),
  });

  if (!signInResponse.ok) {
    throw new Error(`Better Auth sign-in failed with HTTP ${signInResponse.status}.`);
  }

  const sessionCookie = getSessionCookie(signInResponse.headers);
  const sessionHeaders = new Headers();
  sessionHeaders.set('cookie', sessionCookie);

  const session = await auth.api.getSession({
    headers: sessionHeaders,
  });

  if (!session || session.user.id !== user.id) {
    throw new Error('Better Auth session lookup did not return the verification user.');
  }

  const sessionRowCount = await prisma.session.count({
    where: { userId: user.id },
  });

  if (sessionRowCount !== 1) {
    throw new Error(`Expected one persisted session, found ${sessionRowCount}.`);
  }

  const signOutHeaders = new Headers();
  signOutHeaders.set('cookie', sessionCookie);
  signOutHeaders.set('origin', process.env.BETTER_AUTH_URL ?? 'http://localhost:3000');

  const signOutResponse = await auth.api.signOut({
    headers: signOutHeaders,
    asResponse: true,
  });

  if (!signOutResponse.ok) {
    throw new Error(`Better Auth sign-out failed with HTTP ${signOutResponse.status}.`);
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  console.info('Auth verification passed: sign-in, session persistence, lookup, and sign-out.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
