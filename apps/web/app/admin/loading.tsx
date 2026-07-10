import React from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { LoadingSkeleton } from '@/components/admin/feedback/LoadingSkeleton';
import { SectionCard } from '@/components/admin/containers/SectionCard';

export default function AdminLoading() {
  return (
    <PageContainer>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <LoadingSkeleton width="150px" height="20px" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 'var(--space-2)',
          }}
        >
          <div>
            <LoadingSkeleton
              width="200px"
              height="36px"
              style={{ marginBottom: 'var(--space-1)' }}
            />
            <LoadingSkeleton width="350px" height="20px" />
          </div>
          <LoadingSkeleton width="100px" height="36px" />
        </div>
      </div>

      <div className="ef-grid-responsive" style={{ marginBottom: 'var(--space-6)' }}>
        <LoadingSkeleton width="100%" height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
        <LoadingSkeleton width="100%" height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
        <LoadingSkeleton width="100%" height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
        <LoadingSkeleton width="100%" height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
      </div>

      <SectionCard>
        <LoadingSkeleton width="150px" height="24px" style={{ marginBottom: 'var(--space-4)' }} />
        <LoadingSkeleton width="100%" height="250px" />
      </SectionCard>
    </PageContainer>
  );
}
