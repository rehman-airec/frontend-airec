'use client';

import React from 'react';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardFooter } from '@/components/layout/DashboardFooter';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <RouteGuard allowedRoles={['admin', 'superadmin']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar role="admin" />
          <main className="flex-1 min-h-screen">
            {children}
          </main>
        </div>
        <DashboardFooter role="admin" />
      </div>
    </RouteGuard>
  );
};

export default AdminLayout;
