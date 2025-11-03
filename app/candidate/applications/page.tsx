'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateApplications } from '@/hooks/useApplications';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/lib/utils';
import { Eye, FileText, Calendar, MapPin } from 'lucide-react';
import { useRolePath } from '@/hooks/useRolePath';
import { useApplicationStore } from '@/stores/applicationStore';

const CandidateApplicationsPage: React.FC = () => {
  const router = useRouter();
  const rolePath = useRolePath();
  const {
    statusFilter,
    currentPage,
    pageSize,
    setStatusFilter,
    setCurrentPage,
  } = useApplicationStore();

  const { data: applicationsData, isLoading } = useCandidateApplications({
    page: currentPage,
    limit: pageSize,
    status: statusFilter || undefined,
  });

  const applications = applicationsData && typeof applicationsData === 'object' && 'applications' in applicationsData
    ? (applicationsData as { applications: any[] }).applications 
    : [];
  const pagination = applicationsData && typeof applicationsData === 'object' && 'pagination' in applicationsData
    ? (applicationsData as { pagination: any }).pagination
    : { current: 1, pages: 1, total: 0 };

  // Debug logging
  console.log('Applications data:', applicationsData);
  console.log('Applications array:', applications);
  console.log('First application:', applications[0]);
  console.log('First application job:', applications[0]?.job);

  const paginationState = usePagination({
    totalItems: pagination.total,
    itemsPerPage: pageSize,
    initialPage: currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-gray-100 text-gray-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'Offer':
        return 'bg-purple-100 text-purple-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track the status of your job applications</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Applications</option>
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
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
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.job?.title || 'Job Title Not Available'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{application.job.department}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {application.job.location.city}, {application.job.location.country}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Applied {formatDate(application.appliedAt)}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Employment Type:</span> {application.job.employmentType} • 
                        <span className="font-medium ml-2">Experience Level:</span> {application.job.experienceLevel}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(rolePath.applications.detail(application._id))}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
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
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {statusFilter
                  ? 'No applications match your current filter'
                  : 'You haven\'t applied to any jobs yet'
                }
              </p>
              <Button onClick={() => window.location.href = rolePath.jobs.list}>
                Browse Jobs
              </Button>
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

        {/* Quick Stats */}
        {!isLoading && applications.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {applications.length}
                </h3>
                <p className="text-gray-600">Total Applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">
                  {applications.filter(app => app.status === 'In Review').length}
                </h3>
                <p className="text-gray-600">In Review</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">
                  {applications.filter(app => app.status === 'Interview').length}
                </h3>
                <p className="text-gray-600">Interviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  {applications.filter(app => app.status === 'Hired').length}
                </h3>
                <p className="text-gray-600">Hired</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplicationsPage;
