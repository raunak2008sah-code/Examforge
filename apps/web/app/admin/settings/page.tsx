import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { Settings } from 'lucide-react';

export const metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Settings
        </h1>
      </div>

      <EmptyState
        title="Configuration"
        description="System settings and configuration options."
        icon={Settings}
      />
    </PageContainer>
  );
}
