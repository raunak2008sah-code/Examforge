import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { Activity } from 'lucide-react';

export const metadata = { title: 'Parser Queue' };

export default function ParserQueuePage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Parser Queue' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Parser Queue
        </h1>
      </div>

      <EmptyState
        title="Queue is empty"
        description="No documents are currently being processed by the parser engine."
        icon={Activity}
      />
    </PageContainer>
  );
}
