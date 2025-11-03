'use client';

import React, { useMemo } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useTenant } from '@/hooks/useTenant';
import { JobsList } from '@/components/shared/JobsList';
import { JobFilter, JobsHeader } from '@/components/shared';
import { TenantContextGuard } from './TenantContextGuard';
import { NoTenantState } from './NoTenantState';
import { JobFilters } from '@/types/job.types';

interface TenantAwareJobsListProps {
  filters?: JobFilters;
  onFiltersChange?: (filters: JobFilters) => void;
  showFilters?: boolean;
  showHeader?: boolean;
}

/**
 * TenantAwareJobsList Component
 * 
 * Wrapper component that handles tenant-aware job listing.
 * Automatically filters jobs by current tenant and shows appropriate states.
 */
export const TenantAwareJobsList: React.FC<TenantAwareJobsListProps> = ({
  filters: initialFilters,
  onFiltersChange,
  showFilters = true,
  showHeader = true,
}) => {
  const { tenant, isLoading: tenantLoading, subdomain, error: tenantError } = useTenant();
  const [filters, setFilters] = React.useState<JobFilters>(
    initialFilters || { page: 1, limit: 20 }
  );

  const { data: jobsData, isLoading, refetch } = useJobs(filters);

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || { current: 1, pages: 1, total: 0 };

  // Extract unique departments from jobs for filter dropdown
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    jobs.forEach(job => {
      if (job.department && job.department.trim()) {
        deptSet.add(job.department.trim());
      }
    });
    return Array.from(deptSet).sort();
  }, [jobs]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSearch = () => {
    refetch();
  };

  const handleClearFilters = () => {
    const clearedFilters = { page: 1, limit: filters.limit || 20 };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Show loading state while checking tenant
  if (tenantLoading) {
    return <div className="animate-pulse space-y-4">Loading...</div>;
  }

  // If no tenant context, show appropriate message
  if (!tenant) {
    return <NoTenantState subdomain={subdomain} isLoading={tenantLoading} error={tenantError} />;
  }

  return (
    <>
      {/* Search and Filters */}
      {showFilters && (
        <div className="mb-6">
          <JobFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            onClear={handleClearFilters}
            isLoading={isLoading}
            departments={departments}
          />
        </div>
      )}

      {/* Results Header */}
      {showHeader && (
        <JobsHeader
          pagination={pagination}
          filters={filters}
          isLoading={isLoading}
        />
      )}

      {/* Jobs List */}
      <JobsList
        jobs={jobs}
        isLoading={isLoading}
        pagination={pagination}
        filters={filters}
        onPageChange={handlePageChange}
        onClearFilters={handleClearFilters}
      />
    </>
  );
};

