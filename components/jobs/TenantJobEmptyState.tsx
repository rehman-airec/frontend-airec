'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Briefcase, Building2 } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';

interface TenantJobEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * TenantJobEmptyState Component
 * 
 * Shows empty state when tenant has no jobs.
 * Displays tenant-specific messaging.
 */
export const TenantJobEmptyState: React.FC<TenantJobEmptyStateProps> = ({
  hasFilters = false,
  onClearFilters,
}) => {
  const { tenant } = useTenant();

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="h-8 w-8 text-gray-400" />
        </div>
        <div className="flex items-center justify-center mb-4">
          <Building2 className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">
            {tenant ? `No Jobs Available for ${tenant.name}` : 'No Jobs Available'}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          {hasFilters
            ? 'No jobs match your search criteria. Try adjusting your filters.'
            : 'There are currently no open positions. Please check back later for new opportunities.'}
        </p>
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </CardContent>
    </Card>
  );
};

