'use client';

import React from 'react';
import { RoleBasedHeader } from '@/components/layout/RoleBasedHeader';
import { RoleBasedFooter } from '@/components/layout/RoleBasedFooter';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import withAuth from '@/lib/withAuth';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RoleBasedHeader />
      <div className="flex flex-1">
        <SuperAdminSidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
      <RoleBasedFooter />
    </div>
  );
};

export default withAuth<SuperAdminLayoutProps>(['superadmin'])(SuperAdminLayout);

