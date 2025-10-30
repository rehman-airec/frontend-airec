'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JobDetails, JobSidebar } from '@/components/shared';
import { ArrowLeft, MapPin, Building2, Users, DollarSign, Calendar } from 'lucide-react';
import { formatSalaryRange, formatDate } from '@/lib/utils';

const PublicJobDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const { data: job, isLoading } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <PageLoader message="Loading job details..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/jobs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/jobs')}
            className="mb-6 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          {/* Job Header Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="space-y-6">
              {/* Title and Department */}
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="text-xl text-gray-700 font-medium">{job.department}</span>
                </div>
              </div>
              
              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {job.location.city}, {job.location.country}
                      {job.location.remote && ' (Remote)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-900">{job.employmentType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">{job.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              {job.salaryBudget && job.salaryBudget.min && job.salaryBudget.max ? (
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Salary Range</p>
                    <p className="text-xl font-bold text-green-700">
                      {formatSalaryRange(
                        job.salaryBudget.min,
                        job.salaryBudget.max,
                        job.salaryBudget.currency
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="text-lg font-medium text-gray-600">Salary not specified</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 border-gray-200">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => router.push('/jobs')}
                  className="px-8 py-3"
                >
                  Browse More Jobs
                </Button>
                <Link href={`/jobs/${job._id}/apply`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-3 px-8">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Job Description Only */}
        <div className="max-w-7xl mx-auto">
          <JobDetails job={job} showApplyButton={false} showHeader={false} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicJobDetailsPage;
