'use client';

import React from 'react';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { RoleBasedHeader } from '@/components/layout/RoleBasedHeader';
import { RoleBasedFooter } from '@/components/layout/RoleBasedFooter';
import { Sidebar } from '@/components/layout/Sidebar';

interface CandidateLayoutProps {
  children: React.ReactNode;
}

const CandidateLayout: React.FC<CandidateLayoutProps> = ({ children }) => {
  return (
    <RouteGuard allowedRoles={['candidate']}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <RoleBasedHeader />
        <div className="flex flex-1">
          <Sidebar role="candidate" />
          <main className="flex-1 min-h-screen">
            {children}
          </main>
        </div>
        <RoleBasedFooter />
      </div>
    </RouteGuard>
  );
};

export default CandidateLayout;
