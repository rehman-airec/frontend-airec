'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatsCardSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { useAdminJobs } from '@/hooks/useJobs';
import { useApplicationStats } from '@/hooks/useApplications';
import { useTenant } from '@/hooks/useTenant';
import { Briefcase, Users, TrendingUp, Clock, Building2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { getTenantUrl } from '@/lib/tenantUtils';

const AdminDashboard: React.FC = () => {
  const { data: jobsData, isLoading: jobsLoading } = useAdminJobs({ limit: 5 });
  const { data: statsData, isLoading: statsLoading } = useApplicationStats();
  const { tenant, isLoading: tenantLoading } = useTenant();

  const recentJobs = jobsData?.jobs || [];
  const stats = statsData || { total: 0, byStatus: [] };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your recruitment.</p>
      </div>

      {/* Tenant Info Card (if tenant context exists) */}
      {tenant && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                  <p className="text-sm text-gray-600">
                    {getTenantUrl(tenant.subdomain)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">User Quota</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {tenant.currentUsersCount}
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="text-xl text-gray-600">{tenant.maxUsers}</span>
                </div>
                <Badge 
                  variant={
                    tenant.currentUsersCount >= tenant.maxUsers 
                      ? 'destructive' 
                      : tenant.currentUsersCount / tenant.maxUsers >= 0.9
                      ? 'warning'
                      : 'default'
                  }
                  className="mt-2"
                >
                  {tenant.maxUsers - tenant.currentUsersCount} remaining
                </Badge>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  tenant.currentUsersCount >= tenant.maxUsers
                    ? 'bg-red-500'
                    : tenant.currentUsersCount / tenant.maxUsers >= 0.9
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ 
                  width: `${Math.min((tenant.currentUsersCount / tenant.maxUsers) * 100, 100)}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {jobsLoading || statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{recentJobs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Applications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.byStatus.find(s => s._id === 'New')?.count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hired</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.byStatus.find(s => s._id === 'Hired')?.count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobsLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              </CardHeader>
              <CardContent>
                {recentJobs.length > 0 ? (
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.department}</p>
                        <p className="text-xs text-gray-500">
                          Created {formatDate(job.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No jobs created yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.byStatus.map((status) => (
                      <div key={status._id} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{status._id}</span>
                        <span className="text-sm text-gray-600">{status.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
