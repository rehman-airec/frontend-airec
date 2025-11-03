'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Building2, Users } from 'lucide-react';
import { TenantInfo } from '@/hooks/useTenant';

interface TenantsStatsProps {
  tenants: TenantInfo[];
  pagination: {
    total: number;
  };
  isLoading?: boolean;
}

/**
 * TenantsStats Component
 * Displays summary statistics for tenants
 */
export const TenantsStats: React.FC<TenantsStatsProps> = ({
  tenants,
  pagination,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeTenantsCount = tenants.filter(t => t.isActive).length;
  const totalUsersCount = tenants.reduce((sum, t) => sum + t.currentUsersCount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Tenants */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Tenants */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{activeTenantsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsersCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

