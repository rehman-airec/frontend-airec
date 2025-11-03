'use client';

import React from 'react';
import { RoleBasedHeader } from '@/components/layout/RoleBasedHeader';
import { RoleBasedFooter } from '@/components/layout/RoleBasedFooter';
import { EmployeeSidebar } from '@/components/layout/EmployeeSidebar';
import withAuth from '@/lib/withAuth';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RoleBasedHeader />
      <div className="flex flex-1">
        <EmployeeSidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
      <RoleBasedFooter />
    </div>
  );
};

export default withAuth<EmployeeLayoutProps>(['candidate', 'employee'])(EmployeeLayout);

