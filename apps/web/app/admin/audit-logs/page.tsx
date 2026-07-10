import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { ShieldAlert } from 'lucide-react';

export const metadata = { title: 'Audit Logs' };

export default function AuditLogsPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Audit Logs' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Audit Logs
        </h1>
      </div>

      <EmptyState
        title="No audit events"
        description="Security and system activity logs will be recorded here."
        icon={ShieldAlert}
      />
    </PageContainer>
  );
}
