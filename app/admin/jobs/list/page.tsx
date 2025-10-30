'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminJobs, usePublishJob, useDeleteJob } from '@/hooks/useJobs';
import { NormalizedAdminJob } from '@/types/job.types';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/shared/SearchBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { formatDate, formatSalaryRange } from '@/lib/utils';
import { Plus, Eye, Edit, Archive, Trash2, Play } from 'lucide-react';

const AdminJobsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: jobsData, isLoading, refetch } = useAdminJobs({
    page: currentPage,
    limit: pageSize,
    status: statusFilter || undefined,
  });

  const publishJobMutation = usePublishJob();
  const deleteJobMutation = useDeleteJob();
  const { showConfirm, showError } = useGlobalAlert();

  const jobs: NormalizedAdminJob[] = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || { current: 1, pages: 1, total: 0 };

  const paginationState = usePagination({
    totalItems: pagination.total,
    itemsPerPage: pageSize,
    initialPage: currentPage,
  });

  const handleSearch = () => {
    // Implement search functionality
    refetch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    refetch();
  };

  const handleDeleteJob = (job: any) => {
    showConfirm(
      'Delete Job',
      `Are you sure you want to delete "${job.title}"? This action cannot be undone. If the job has applications, it cannot be deleted.`,
      async () => {
        try {
          await deleteJobMutation.mutateAsync(job._id);
          refetch(); // Refresh the list
        } catch (error: any) {
          // Error is already handled by the mutation's onError
        }
      },
      'Delete Job',
      'Cancel'
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600 mt-2">Manage and track your job postings</p>
          </div>
          <Link href="/admin/jobs/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search jobs by title, department..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                  loading={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Department:</span> {job.department}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {job.location}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {job.type}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Salary:</span> {job.salary}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>
                          {job.numberOfApplications} applications
                        </span>
                        <span>
                          Created {formatDate(job.createdAt)}
                        </span>
                        {job.publishedAt && (
                          <span>
                            Published {formatDate(job.publishedAt)}
                          </span>
                        )}
                      </div>
                      
                      {job.additionalRequirement && job.additionalRequirement !== 'None' && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Additional Requirement:</span> {job.additionalRequirement}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/jobs/${job._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/jobs/${job._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      {job.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={async () => {
                            console.log('Publishing job:', job._id);
                            try {
                              await publishJobMutation.mutateAsync({
                                id: job._id,
                                data: { publishedOn: ['company'] }
                              });
                              console.log('Job published successfully');
                              refetch(); // Refresh the list
                            } catch (error) {
                              console.error('Failed to publish job:', error);
                            }
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteJob(job)}
                      >
                        <Trash2 className="h-4 w-4" />
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first job posting'
                }
              </p>
              <Link href="/admin/jobs/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
              showInfo={true}
              totalItems={pagination.total}
              itemsPerPage={pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobsListPage;
