'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface TenantQuotaDisplayProps {
  currentUsersCount: number;
  maxUsers: number;
  showDetails?: boolean;
}

/**
 * TenantQuotaDisplay Component
 * Reusable component for displaying tenant user quota information
 */
export const TenantQuotaDisplay: React.FC<TenantQuotaDisplayProps> = ({
  currentUsersCount,
  maxUsers,
  showDetails = true,
}) => {
  const remainingUsers = maxUsers - currentUsersCount;
  const quotaPercentage = (currentUsersCount / maxUsers) * 100;

  const getQuotaColor = () => {
    if (quotaPercentage >= 100) return 'bg-red-500';
    if (quotaPercentage >= 90) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getQuotaVariant = (): 'default' | 'warning' | 'destructive' => {
    if (remainingUsers === 0) return 'destructive';
    if (remainingUsers <= maxUsers * 0.1) return 'warning';
    return 'default';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              User Quota
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {currentUsersCount}
            </span>
            {' / '}
            <span className="text-gray-600">{maxUsers}</span>
            {' users'}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${getQuotaColor()}`}
          style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
        />
      </div>

      {/* Status Info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {remainingUsers > 0 
            ? `${remainingUsers} user${remainingUsers !== 1 ? 's' : ''} remaining`
            : 'Quota reached'
          }
        </span>
        <Badge variant={getQuotaVariant()} size="sm">
          {Math.round(quotaPercentage)}% used
        </Badge>
      </div>
    </div>
  );
};

