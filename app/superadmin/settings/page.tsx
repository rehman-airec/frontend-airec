'use client';

import React from 'react';
import withAuth from '@/lib/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Settings, Database, Mail, Shield } from 'lucide-react';

/**
 * Super Admin Settings Page
 * Global system settings for super admin
 */
const SuperAdminSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Database configuration and maintenance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Email service configuration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Security and access control settings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">General system configuration</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default withAuth(['superadmin'])(SuperAdminSettingsPage);

