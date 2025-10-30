'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/hooks/useJobs';
import { JobFilter } from '@/components/shared/JobFilter';
import { Pagination } from '@/components/ui/Pagination';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { JobFilters } from '@/types/job.types';
import { ClockIcon, MapPin, Search, Building2, Clock, DollarSign, Users, Heart } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useIsJobSaved, useToggleSaveJob } from '@/hooks/useSavedJobs';

// Save Job Button Component
const SaveJobButton: React.FC<{ jobId: string }> = ({ jobId }) => {
  const { data: isSaved, isLoading: isCheckingIfSaved } = useIsJobSaved(jobId);
  const { toggleSaveJob, isLoading: isToggling } = useToggleSaveJob();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveJob(jobId, isSaved || false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={isToggling || isCheckingIfSaved}
      className="flex items-center space-x-2"
    >
      <Heart
        className={`h-4 w-4 ${
          isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'
        }`}
      />
      <span>{isSaved ? 'Saved' : 'Save'}</span>
    </Button>
  );
};

const CandidateJobsListPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 12,
  });
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const { data: jobsData, isLoading, refetch } = useJobs(filters);

  const jobs = jobsData?.jobs || [];
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(j => { if (j.department && j.department.trim()) set.add(j.department.trim()); });
    return Array.from(set).sort();
  }, [jobs]);
  const pagination = jobsData?.pagination || { current: 1, pages: 1, total: 0 };
  
  const formatSalary = (job: any) => {
    const r = job?.salaryRange;
    const b = job?.salaryBudget;
    const rangeHasNumbers = r && typeof r.min === 'number' && typeof r.max === 'number';
    const budgetHasNumbers = b && typeof b.min === 'number' && typeof b.max === 'number';
    if (!rangeHasNumbers && !budgetHasNumbers) return '';
    const min = rangeHasNumbers ? r.min : b.min;
    const max = rangeHasNumbers ? r.max : b.max;
    const currency = (rangeHasNumbers ? r.currency : b.currency) || 'USD';
    const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
    const symbol = currency === 'USD' ? '$' : currency === 'PKR' ? '₨' : currency === 'EUR' ? '€' : '';
    const prefix = symbol || (currency ? currency + ' ' : '');
    return `${prefix}${nf.format(min)} - ${prefix}${nf.format(max)}`;
  };

  const formatLocation = (job: any) => {
    const city = job?.location?.city?.trim();
    const country = job?.location?.country?.trim();
    const isRemote = job?.location?.remote || (Array.isArray(job?.workplaceTypes) && job.workplaceTypes.includes('Remote'));
    const parts: string[] = [];
    if (city) parts.push(city);
    if (country) parts.push(country);
    const joined = parts.join(', ');
    return joined || (isRemote ? 'Remote' : '');
  };

  const toPlainText = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };
  
  // Debug logging
  console.log('Candidate jobs data:', jobsData);
  console.log('Jobs array:', jobs);
  console.log('Jobs count:', jobs.length);
  console.log('Pagination:', pagination);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleApply = (jobId: string) => {
    setApplyingJobId(jobId);
    setIsNavigating(true);
    router.push(`/candidate/jobs/apply/${jobId}`);
    
    // Clear loading state after a timeout to prevent stuck loading state
    setTimeout(() => {
      setApplyingJobId(null);
      setIsNavigating(false);
    }, 3000);
  };

  const handleSave = (jobId: string) => {
    // Save functionality is now handled by the JobCard component internally
    console.log('Save job:', jobId);
  };

  const handleView = (jobId: string) => {
    // Navigate to job details
    window.location.href = `/candidate/jobs/${jobId}`;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8">
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
          
          {!isLoading && jobs.length > 0 && (
            <div className="text-sm text-gray-500">
              Page {pagination.current} of {pagination.pages}
            </div>
          )}
        </div>

        {/* Jobs List */}
        {isLoading && !isNavigating ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card 
                key={job._id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => handleView(job._id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-4">
                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                            {job.title}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            {job.department && (
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                {job.department}
                              </div>
                            )}
                            {formatLocation(job) && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {formatLocation(job)}
                              </div>
                            )}
                            {job.employmentType && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {job.employmentType}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            {job.experienceLevel && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {job.experienceLevel}
                              </span>
                            )}
                            {formatSalary(job) && (
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatSalary(job)}
                              </div>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {toPlainText(job.description)}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {job.currentApplications || 0} applications
                            </div>
                            <span>Posted {formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <SaveJobButton jobId={job._id} />
                      <Button
                        size="sm"
                        loading={applyingJobId === job._id}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleApply(job._id);
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">
                {filters.q || Object.keys(filters).some(key => 
                  key !== 'page' && key !== 'limit' && filters[key as keyof JobFilters]
                )
                  ? 'Try adjusting your search criteria or filters'
                  : 'No job postings available at the moment'
                }
              </p>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
              showInfo={true}
              totalItems={pagination.total}
              itemsPerPage={filters.limit || 12}
            />
          </div>
        )}

        {/* Quick Stats */}
        {!isLoading && jobs.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {new Set(jobs.map(job => job.location.city)).size}
                </h3>
                <p className="text-gray-600">Cities</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {new Set(jobs.map(job => job.employmentType)).size}
                </h3>
                <p className="text-gray-600">Job Types</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {new Set(jobs.map(job => job.department)).size}
                </h3>
                <p className="text-gray-600">Departments</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateJobsListPage;
