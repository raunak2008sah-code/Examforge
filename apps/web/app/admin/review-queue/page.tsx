import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { CheckSquare } from 'lucide-react';

export const metadata = { title: 'Review Queue' };

export default function ReviewQueuePage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Review Queue' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Review Queue
        </h1>
      </div>

      <EmptyState
        title="No items to review"
        description="Questions awaiting manual review will appear here."
        icon={CheckSquare}
      />
    </PageContainer>
  );
}
