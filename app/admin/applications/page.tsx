'use client';

import React, { useMemo } from 'react';
import { useAdminJobTitles } from '@/hooks/useJobs';
import { useJobApplications } from '@/hooks/useApplications';
import { ApplicantsTable } from '@/components/admin/applications/ApplicantsTable';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { Users, Filter, TrendingUp } from 'lucide-react';
import { useApplicationStore } from '@/stores/applicationStore';

const AdminApplicationsPage: React.FC = () => {
  const {
    selectedJobId,
    currentPage,
    pageSize,
    setSelectedJobId,
    setCurrentPage,
  } = useApplicationStore();

  // Only fetch job titles once when component mounts (cached for 5 minutes)
  // This query won't refetch on window focus or component remount
  const { data: jobsData, isLoading: jobsLoading } = useAdminJobTitles();
  
  // Memoize filters to prevent unnecessary re-renders and API calls
  const filters = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
  }), [currentPage, pageSize]);
  
  // Only fetch applications if jobId is valid (including 'all')
  // Query is cached for 2 minutes and won't refetch unnecessarily
  // The enabled check ensures we only fetch when we have a valid jobId
  const { data: applicationsData, isLoading: applicationsLoading, isFetching } = useJobApplications(
    selectedJobId,
    filters
  );

  // Only show loading on initial load, not during background refetches
  const isLoading = applicationsLoading && !applicationsData;

  const jobs = jobsData?.jobs || [];
  const rawApplications = applicationsData && typeof applicationsData === 'object' && 'applications' in applicationsData
    ? (applicationsData as { applications: any[] }).applications 
    : [];
  const pagination = applicationsData && typeof applicationsData === 'object' && 'pagination' in applicationsData
    ? (applicationsData as { pagination: any }).pagination
    : { current: 1, pages: 1, total: 0 };

  // Transform normalized API response back into table-friendly shape
  const applications = rawApplications.map((app: any) => {
    // Backend now returns: { id, name, email, phone, jobTitle, status, appliedAt }
    const fullName: string = app.name || 'Unknown Candidate';
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    return {
      _id: app.id,
      candidate: {
        firstName: firstName,
        lastName: lastName,
        email: app.email || 'Not provided',
        phone: app.phone || 'Not provided',
      },
      status: app.status || 'Unknown',
      appliedAt: app.appliedAt,
      job: { title: app.jobTitle || 'Unknown Job' },
    };
  });

  const jobOptions = jobs.map(job => ({
    value: job._id,
    label: job.title,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-1">Manage and review job applications</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex space-x-4">
            <Card className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Filter Applications</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Job to Filter
                </label>
                <Select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value || 'all');
                    // Reset to first page when filter changes
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'all', label: 'All Jobs' },
                    ...jobOptions,
                  ]}
                  placeholder="Select a job to filter"
                  className="w-full max-w-md"
                  disabled={jobsLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <ApplicantsTable 
              applicants={applications} 
              isLoading={isLoading}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
