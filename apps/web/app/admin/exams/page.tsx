import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { FileText } from 'lucide-react';

export const metadata = { title: 'Exams' };

export default function ExamsPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Exams' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Exams
        </h1>
      </div>

      <EmptyState
        title="No exams yet"
        description="Upload a question paper to create your first test."
        icon={FileText}
        action={
          <button
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            New Exam
          </button>
        }
      />
    </PageContainer>
  );
}
