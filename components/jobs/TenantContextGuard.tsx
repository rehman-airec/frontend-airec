'use client';

import React, { ReactNode } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { NoTenantState } from './NoTenantState';
import { PageLoader } from '@/components/ui/Loader';

interface TenantContextGuardProps {
  children: ReactNode;
  showLoader?: boolean;
  requireTenant?: boolean;
  fallback?: ReactNode;
}

/**
 * TenantContextGuard Component
 * 
 * Ensures tenant context exists before rendering children.
 * Shows appropriate message if tenant context is missing.
 * 
 * @param children - Content to render if tenant context exists
 * @param showLoader - Show loader while checking tenant (default: true)
 * @param requireTenant - If true, requires tenant. If false, allows no-tenant state (default: true)
 * @param fallback - Custom fallback component (overrides default NoTenantState)
 */
export const TenantContextGuard: React.FC<TenantContextGuardProps> = ({
  children,
  showLoader = true,
  requireTenant = true,
  fallback,
}) => {
  const { tenant, isLoading, subdomain, error } = useTenant();

  // Show loader while checking tenant
  if (isLoading && showLoader) {
    return <PageLoader message="Loading company information..." />;
  }

  // If tenant is required but not found
  if (requireTenant && !tenant && !isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <NoTenantState subdomain={subdomain} isLoading={isLoading} error={error} />;
  }

  // If tenant context exists or not required, render children
  return <>{children}</>;
};

