'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon } from 'lucide-react';
import { EmptyState } from '@/components/admin/feedback/EmptyState';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string; code?: string };
  reset: () => void;
}) {
  const isForbidden = error.name === 'AuthServiceError' && error.message.includes('permission');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PageContainer>
        <EmptyState
          title={isForbidden ? 'Access Denied' : 'Something went wrong'}
          description={
            isForbidden
              ? "You don't have permission to view this page. If you believe this is an error, contact an administrator."
              : error.message || 'An unexpected error occurred while loading this page.'
          }
          icon={isForbidden ? ShieldAlert : AlertOctagon}
          action={
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-sunken)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
              {isForbidden && (
                <Link
                  href="/"
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Return Home
                </Link>
              )}
            </div>
          }
        />
      </PageContainer>
    </div>
  );
}
