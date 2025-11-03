'use client';

import React from 'react';
import withAuth from '@/lib/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building2, Users, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * Super Admin Dashboard
 * Main dashboard for product owner to manage all tenants
 */
const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-blue-600" />
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all company tenants and system-wide configurations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                </div>
                <Building2 className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                </div>
                <Users className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Tenant Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create, view, and manage all company tenants
              </p>
              <Link href="/superadmin/tenants">
                <Button className="w-full">Manage Tenants</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configure global system settings and preferences
              </p>
              <Link href="/superadmin/settings">
                <Button variant="outline" className="w-full">System Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default withAuth(['superadmin'])(SuperAdminDashboard);

