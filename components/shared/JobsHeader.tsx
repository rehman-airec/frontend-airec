'use client';

import React from 'react';
import { JobFilters } from '@/types/job.types';

interface JobsHeaderProps {
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
  filters: JobFilters;
  isLoading: boolean;
}

const JobsHeader: React.FC<JobsHeaderProps> = ({
  pagination,
  filters,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {isLoading ? 'Loading jobs...' : `${pagination.total || 0} job${pagination.total === 1 ? '' : 's'} found`}
        </h2>
        {filters.q && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            "{filters.q}"
          </span>
        )}
      </div>
      
      {!isLoading && pagination.total > 0 && (
        <div className="text-sm text-gray-500">
          Page {pagination.current} of {pagination.pages}
        </div>
      )}
    </div>
  );
};

export { JobsHeader };
