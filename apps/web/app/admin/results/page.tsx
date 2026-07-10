import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { BarChart2 } from 'lucide-react';

export const metadata = { title: 'Results' };

export default function ResultsPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Results' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Results
        </h1>
      </div>

      <EmptyState
        title="No results found"
        description="Completed exam attempts and student scores will be listed here."
        icon={BarChart2}
      />
    </PageContainer>
  );
}
