import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { LoadingSkeleton } from '@/components/admin/feedback/LoadingSkeleton';
import { SectionCard } from '@/components/admin/containers/SectionCard';

export default function AdminLoading() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <LoadingSkeleton width="150px" height="20px" />
        <LoadingSkeleton width="300px" height="36px" className="mt-2" />
      </div>
      <SectionCard>
        <LoadingSkeleton width="100%" height="200px" />
      </SectionCard>
    </PageContainer>
  );
}
