'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Loader';

/**
 * Admin Tenants Page
 * This page should redirect superadmin users to /superadmin/tenants
 * Regular admins should not access tenant management
 */
const AdminTenantsPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user?.role === 'superadmin') {
        // Redirect superadmin to the correct route
        router.replace('/superadmin/tenants');
      } else {
        // Regular admins should go to their dashboard
        router.replace('/admin/dashboard');
      }
    }
  }, [user, isLoading, router]);

  return <PageLoader message="Redirecting..." />;
};

export default AdminTenantsPage;

