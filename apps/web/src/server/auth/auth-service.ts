import { headers } from 'next/headers';
import { prisma, type RoleName } from '@examforge/db';
import { auth, type BetterAuthSession } from './auth';

export type AuthenticatedSession = BetterAuthSession & {
  user: BetterAuthSession['user'] & {
    role: RoleName;
    isActive: boolean;
  };
};

export class AuthServiceError extends Error {
  constructor(
    public readonly code: 'UNAUTHENTICATED' | 'FORBIDDEN',
    message: string,
  ) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

const loadActiveUserRole = async (userId: string) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      isActive: true,
      deletedAt: null,
    },
    select: {
      isActive: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
};

const enrichSession = async (
  session: BetterAuthSession | null,
): Promise<AuthenticatedSession | null> => {
  if (!session) {
    return null;
  }

  const user = await loadActiveUserRole(session.user.id);
  if (!user) {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      role: user.role.name,
      isActive: user.isActive,
    },
  };
};

export const authService = {
  async getSession(): Promise<AuthenticatedSession | null> {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return enrichSession(session);
  },

  async requireRole(role: RoleName): Promise<AuthenticatedSession> {
    const session = await this.getSession();

    if (!session) {
      throw new AuthServiceError('UNAUTHENTICATED', 'Authentication is required.');
    }

    if (session.user.role !== role) {
      throw new AuthServiceError('FORBIDDEN', 'Insufficient permissions.');
    }

    return session;
  },

  async requireOwnership(resource: { userId: string }): Promise<void> {
    const session = await this.getSession();

    if (!session) {
      throw new AuthServiceError('UNAUTHENTICATED', 'Authentication is required.');
    }

    if (session.user.role === 'ADMIN' || session.user.id === resource.userId) {
      return;
    }

    throw new AuthServiceError('FORBIDDEN', 'Resource ownership is required.');
  },
};
