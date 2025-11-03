'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building2, Plus } from 'lucide-react';
import { TenantInfo } from '@/hooks/useTenant';
import { TenantCard } from './TenantCard';
import Link from 'next/link';

interface TenantsListProps {
  tenants: TenantInfo[];
  isLoading?: boolean;
  searchQuery?: string;
  statusFilter?: 'all' | 'active' | 'inactive';
}

/**
 * TenantsList Component
 * Renders a list of tenant cards with empty state handling
 */
export const TenantsList: React.FC<TenantsListProps> = ({
  tenants,
  isLoading = false,
  searchQuery = '',
  statusFilter = 'all',
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first tenant'
            }
          </p>
          <Link href="/superadmin/tenants/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tenants.map((tenant) => (
        <TenantCard key={tenant._id} tenant={tenant} />
      ))}
    </div>
  );
};

