'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatSalaryRange, formatDate } from '@/lib/utils';
import { Job } from '@/types/job.types';

interface JobSidebarProps {
  job: Job;
  showApplyCard?: boolean;
  showDetailsCard?: boolean;
  showHelpCard?: boolean;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ 
  job, 
  showApplyCard = true,
  showDetailsCard = true,
  showHelpCard = true
}) => {
  return (
    <div className="space-y-6">
      {/* Apply Now Card */}
      {showApplyCard && (
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Ready to Apply?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Apply as a guest or create an account for full access to your applications.
              </p>
              <div className="space-y-3">
                <Link href={`/jobs/${job._id}/apply`} className="block">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                    Apply Now
                  </Button>
                </Link>
                <div className="text-sm text-gray-500 font-medium">
                  or
                </div>
                <Link href="/auth/signup" className="block">
                  <Button variant="outline" size="lg" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 py-3">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Details */}
      {showDetailsCard && (
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Department</h4>
              <p className="text-gray-900 font-medium">{job.department}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</h4>
              <p className="text-gray-900 font-medium">
                {job.location.city}, {job.location.country}
                {job.location.remote && ' (Remote)'}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Employment Type</h4>
              <p className="text-gray-900 font-medium">{job.employmentType}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Experience Level</h4>
              <p className="text-gray-900 font-medium">{job.experienceLevel}</p>
            </div>
            {job.salaryBudget && job.salaryBudget.min && job.salaryBudget.max ? (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Salary Range</h4>
                <p className="text-green-700 font-bold text-lg">
                  {formatSalaryRange(
                    job.salaryBudget.min,
                    job.salaryBudget.max,
                    job.salaryBudget.currency
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Salary Range</h4>
                <p className="text-gray-600 font-medium">Salary not specified</p>
              </div>
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Posted</h4>
              <p className="text-gray-900 font-medium">{formatDate(job.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      {showHelpCard && (
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Need Help?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Have questions about this position or the application process?
              </p>
              <Button variant="outline" size="lg" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 py-3">
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { JobSidebar };
