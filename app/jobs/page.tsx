'use client';

import React, { useState, useMemo } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobFilter, JobsList, JobsHeader } from '@/components/shared';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JobFilters } from '@/types/job.types';

const PublicJobsPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 20,
  });

  const { data: jobsData, isLoading, refetch } = useJobs(filters);

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || { current: 1, pages: 1, total: 0 };

  // Extract unique departments from jobs
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
  };

  const handleSearch = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
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

        {/* Results Header */}
        <JobsHeader
          pagination={pagination}
          filters={filters}
          isLoading={isLoading}
        />

        {/* Jobs List */}
        <JobsList
          jobs={jobs}
          isLoading={isLoading}
          pagination={pagination}
          filters={filters}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />

        {/* Call to Action */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ready to Apply?
          </h2>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
            You can apply for jobs as a guest or create an account to save jobs, 
            track applications, and get personalized recommendations.
          </p>
          <div className="flex justify-center space-x-3">
            <a href="/auth/signup">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                Create Account
              </button>
            </a>
            <a href="/auth/login">
              <button className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm">
                Sign In
              </button>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicJobsPage;
