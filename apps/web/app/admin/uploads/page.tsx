import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { Upload } from 'lucide-react';

export const metadata = { title: 'Uploads' };

export default function UploadsPage() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Uploads' }]} />
        <h1 className="text-display" style={{ marginTop: 'var(--space-2)' }}>
          Uploads
        </h1>
      </div>

      <EmptyState
        title="No recent uploads"
        description="Upload history will appear here."
        icon={Upload}
      />
    </PageContainer>
  );
}
