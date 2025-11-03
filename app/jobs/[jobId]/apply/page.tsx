'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { RoleBasedHeader } from '@/components/layout/RoleBasedHeader';
import { RoleBasedFooter } from '@/components/layout/RoleBasedFooter';
import { JobApplicationFlow } from '@/components/shared';
import { ArrowLeft } from 'lucide-react';

const PublicJobApplicationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const { data: job, isLoading } = useJob(jobId);

  const handleSuccess = (trackingToken: string) => {
    // Optional: Handle success callback
    console.log('Application submitted with tracking token:', trackingToken);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <RoleBasedHeader />
        <div className="flex-1 flex items-center justify-center">
          <PageLoader message="Loading job details..." />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <RoleBasedHeader />
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/jobs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
        <RoleBasedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RoleBasedHeader />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Details
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Apply for Position</h1>
        </div>

        {/* Application Flow */}
        <JobApplicationFlow job={job} onSuccess={handleSuccess} />
      </div>

      <RoleBasedFooter />
    </div>
  );
};

export default PublicJobApplicationPage;
