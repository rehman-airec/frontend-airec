'use client';

import React from 'react';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardFooter } from '@/components/layout/DashboardFooter';

interface CandidateLayoutProps {
  children: React.ReactNode;
}

const CandidateLayout: React.FC<CandidateLayoutProps> = ({ children }) => {
  return (
    <RouteGuard allowedRoles={['candidate']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar role="candidate" />
          <main className="flex-1 min-h-screen">
            {children}
          </main>
        </div>
        <DashboardFooter role="candidate" />
      </div>
    </RouteGuard>
  );
};

export default CandidateLayout;
