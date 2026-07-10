import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { Database } from 'lucide-react';

export const metadata = { title: 'Question Bank' };

export default function QuestionBankPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Question Bank' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Question Bank
        </h1>
      </div>

      <EmptyState
        title="Question Bank is empty"
        description="The central repository of all parsed questions."
        icon={Database}
      />
    </PageContainer>
  );
}
