import React from 'react';
import { authService } from '@/server/auth/auth-service';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Authorization: Requires Admin or Reviewer role.
  // If this fails, it throws AuthServiceError which is caught by error.tsx
  const session = await authService.requireAnyRole(['ADMIN', 'REVIEWER']);

  return (
    <AdminLayout user={{ email: session.user.email, role: session.user.role }}>
      {children}
    </AdminLayout>
  );
}
