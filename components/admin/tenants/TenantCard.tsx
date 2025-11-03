'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, Users, ExternalLink, Calendar, User } from 'lucide-react';
import { TenantInfo } from '@/hooks/useTenant';
import { formatDate } from '@/lib/utils';
import { TenantQuotaDisplay } from './TenantQuotaDisplay';
import { getTenantUrl } from '@/lib/tenantUtils';
import { getBaseDomainWithPort } from '@/lib/env';

interface TenantCardProps {
  tenant: TenantInfo;
  onView?: (tenant: TenantInfo) => void;
}

/**
 * TenantCard Component
 * Displays individual tenant information in a card format
 */
export const TenantCard: React.FC<TenantCardProps> = ({ tenant, onView }) => {
  const handleViewClick = () => {
    if (onView) {
      onView(tenant);
    } else {
      // Default: open tenant subdomain in new tab (environment-aware)
      const tenantUrl = getTenantUrl(tenant.subdomain);
      window.open(tenantUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Header with name and status */}
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                {tenant.name}
              </h3>
              <Badge 
                variant={tenant.isActive ? 'success' : 'destructive'}
                size="sm"
              >
                {tenant.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Tenant Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-start">
                <span className="font-medium mr-2">Subdomain:</span>
                <div className="flex items-center">
                  <code className="px-2 py-1 bg-gray-100 rounded text-blue-600 font-mono text-xs">
                    {tenant.subdomain}
                  </code>
                  <span className="text-gray-500 ml-1 text-xs">.{getBaseDomainWithPort()}</span>
                </div>
              </div>
              
              {tenant.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium mr-2">Created:</span>
                  <span>{formatDate(tenant.createdAt)}</span>
                </div>
              )}

              {tenant.ownerUserId && (
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium mr-2">Owner:</span>
                  <span>{tenant.ownerUserId.name || tenant.ownerUserId.email}</span>
                </div>
              )}

              <div className="flex items-center">
                <span className="font-medium mr-2">Tenant ID:</span>
                <code className="text-xs font-mono text-gray-500">
                  {tenant._id.substring(0, 8)}...
                </code>
              </div>
            </div>

            {/* Quota Display */}
            <TenantQuotaDisplay
              currentUsersCount={tenant.currentUsersCount}
              maxUsers={tenant.maxUsers}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={handleViewClick}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Tenant
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

