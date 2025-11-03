'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { JobCard } from '@/components/shared/JobCard';
import { Pagination } from '@/components/ui/Pagination';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { Heart, Briefcase, ArrowLeft, Search } from 'lucide-react';
import { useRolePath } from '@/hooks/useRolePath';
import { useUIStore } from '@/stores/uiStore';

const SavedJobsPage: React.FC = () => {
  const router = useRouter();
  const rolePath = useRolePath();
  const { formData, setFormData } = useUIStore();
  const currentPage = formData['saved-jobs-page'] || 1;
  const pageSize = 12;

  const setCurrentPage = (page: number) => {
    setFormData('saved-jobs-page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { data: savedJobsData, isLoading, error } = useSavedJobs({
    page: currentPage,
    limit: pageSize,
  });

  const jobs = savedJobsData?.jobs || [];
  const pagination = savedJobsData?.pagination || { current: 1, pages: 1, total: 0, limit: pageSize };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApply = (jobId: string) => {
    router.push(rolePath.jobs.apply(jobId));
  };

  const handleView = (jobId: string) => {
    router.push(rolePath.jobs.view(jobId));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mr-4"></div>
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
            </div>
          </div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Jobs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Search className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Failed to load saved jobs</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              There was an error loading your saved jobs.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          </div>
        </div>
        <p className="text-gray-600">
          {pagination.total > 0 
            ? `You have ${pagination.total} saved job${pagination.total === 1 ? '' : 's'}`
            : 'Jobs you save will appear here'
          }
        </p>
      </div>

      {/* Content */}
      {jobs.length > 0 ? (
        <>
          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApply}
                onView={handleView}
                showSaveButton={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.current}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Saved Jobs Yet
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              When you find jobs you're interested in, click the heart icon to save them here for easy access later.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/candidate/jobs/list')}>
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/candidate/profile')}
              >
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {jobs.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/candidate/jobs/list')}
          >
            <Search className="h-4 w-4 mr-2" />
            Find More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
