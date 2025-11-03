'use client';

import React from 'react';
import withAuth from '@/lib/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, Search, FileText, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

/**
 * Employee Dashboard
 * Main dashboard for employees/candidates with limited access
 */
const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back{user?.name ? `, ${user.name}` : ''}</h1>
          <p className="text-gray-600 mt-2">
            Find and apply for jobs in your company
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/employee/jobs/list">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                  </div>
                  <Briefcase className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/employee/jobs/saved">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                  </div>
                  <Heart className="h-12 w-12 text-red-600 opacity-20" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/employee/applications">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Applications</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                  </div>
                  <FileText className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/employee/profile">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profile</p>
                    <p className="text-xs text-gray-500 mt-1">View & Edit</p>
                  </div>
                  <Search className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              No recent jobs. <Link href="/employee/jobs/list" className="text-blue-600 hover:underline">Browse available jobs</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(['candidate', 'employee'])(EmployeeDashboard);

