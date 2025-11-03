'use client';

import React from 'react';
import { useJob } from '@/hooks/useJobs';
import { useTenant } from '@/hooks/useTenant';
import { TenantJobErrorHandler } from './TenantJobErrorHandler';
import { PageLoader } from '@/components/ui/Loader';

interface TenantJobDetailGuardProps {
  jobId: string;
  children: (job: any) => React.ReactNode;
}

/**
 * TenantJobDetailGuard Component
 * 
 * Wrapper for job detail pages that handles tenant verification.
 * Shows error if job doesn't belong to current tenant.
 */
export const TenantJobDetailGuard: React.FC<TenantJobDetailGuardProps> = ({
  jobId,
  children,
}) => {
  const { data: job, isLoading, error } = useJob(jobId);
  const { tenant } = useTenant();

  if (isLoading) {
    return <PageLoader message="Loading job details..." />;
  }

  if (error) {
    return <TenantJobErrorHandler error={error} jobId={jobId} />;
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
        <p className="text-gray-600">The job you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Verify job belongs to current tenant
  // Note: Backend already enforces this, but we can add client-side check for UX
  if (tenant && job.tenantId) {
    const jobTenantId = typeof job.tenantId === 'object' 
      ? job.tenantId._id || job.tenantId 
      : job.tenantId;
    
    if (jobTenantId.toString() !== tenant._id.toString()) {
      return (
        <TenantJobErrorHandler
          error={{
            response: {
              status: 403,
              data: { message: 'Job does not belong to your company' }
            }
          }}
          jobId={jobId}
        />
      );
    }
  }

  return <>{children(job)}</>;
};

