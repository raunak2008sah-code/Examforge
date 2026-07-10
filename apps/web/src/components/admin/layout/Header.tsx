import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: {
    email: string;
    role: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-breadcrumbs">
        {/* Breadcrumb component will go here later */}
      </div>

      <div
        className="admin-header-actions"
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
      >
        <div style={{ textAlign: 'right' }}>
          <div className="text-body" style={{ fontWeight: 500 }}>
            {user.email}
          </div>
          <div className="text-meta">{user.role}</div>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title="Sign out"
            style={{
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            <LogOut size={20} />
          </button>
        </form>
      </div>
    </header>
  );
}
