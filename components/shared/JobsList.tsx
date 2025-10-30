'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { PublicJobCard } from '@/components/shared/PublicJobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { Search } from 'lucide-react';
import { Job } from '@/types/job.types';

interface JobsListProps {
  jobs: Job[];
  isLoading: boolean;
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
  filters: {
    q?: string;
  };
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const JobsList: React.FC<JobsListProps> = ({
  jobs,
  isLoading,
  pagination,
  filters,
  onPageChange,
  onClearFilters
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            No jobs found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <Button onClick={onClearFilters}>
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {jobs.map((job) => (
          <PublicJobCard key={job._id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

export { JobsList };
