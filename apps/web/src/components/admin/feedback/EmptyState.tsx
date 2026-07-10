import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileQuestion,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-4)',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-subtle)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-sunken)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          color: 'var(--text-secondary)',
        }}
      >
        <Icon size={24} />
      </div>
      <h3 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p
        className="text-body"
        style={{
          color: 'var(--text-secondary)',
          maxWidth: '400px',
          marginBottom: 'var(--space-5)',
        }}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
