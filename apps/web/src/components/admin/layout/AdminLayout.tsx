import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '@/styles/admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: {
    email: string;
    role: string;
  };
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <div className="admin-layout-root">
      <Sidebar />
      <div className="admin-main-content">
        <Header user={user} />
        <main className="admin-page-content">{children}</main>
      </div>
    </div>
  );
}
