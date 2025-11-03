'use client';

import React from 'react';
import { RoleBasedHeader } from '@/components/layout/RoleBasedHeader';
import { RoleBasedFooter } from '@/components/layout/RoleBasedFooter';
import { TenantAwareJobsList } from '@/components/jobs';

/**
 * Public Jobs Page
 * 
 * Displays jobs filtered by tenant subdomain.
 * Shows appropriate message if no tenant context is detected.
 */
const PublicJobsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RoleBasedHeader />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Tenant-Aware Jobs List */}
        <TenantAwareJobsList />

        {/* Call to Action - Only show if tenant context exists */}
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

      <RoleBasedFooter />
    </div>
  );
};

export default PublicJobsPage;
