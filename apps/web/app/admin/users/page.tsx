import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { Users } from 'lucide-react';

export const metadata = { title: 'Users Management' };

export default function UsersPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Users
        </h1>
      </div>

      <EmptyState
        title="No users yet"
        description="User management features will be available in a future phase."
        icon={Users}
      />
    </PageContainer>
  );
}
