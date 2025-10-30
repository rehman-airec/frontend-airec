'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useJob } from '@/hooks/useJobs';
import { UnifiedApplicationFlow } from '@/components/shared/UnifiedApplicationFlow';
import { PageLoader } from '@/components/ui/Loader';
import { Card, CardContent } from '@/components/ui/Card';

const ApplyJobPage: React.FC = () => {
  const params = useParams();
  const jobId = params.jobId as string;
  
  const { data: job, isLoading } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Job Not Found
            </h2>
            <p className="text-gray-600">
              The job you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UnifiedApplicationFlow job={job} />
      </div>
    </div>
  );
};

export default ApplyJobPage;
