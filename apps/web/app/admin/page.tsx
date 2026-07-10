import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { SectionCard } from '@/components/admin/containers/SectionCard';

export const metadata = { title: 'Dashboard' };

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin' }, { label: 'Dashboard' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Dashboard
        </h1>
      </div>

      <SectionCard>
        <p className="text-body">Welcome to the ExamForge Administration Portal.</p>
        {/* Statistics and quick actions will be implemented in future phases */}
      </SectionCard>
    </PageContainer>
  );
}
