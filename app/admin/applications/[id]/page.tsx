'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApplication } from '@/hooks/useApplications';
import { ApplicationDetails } from '@/components/admin/applications/ApplicationDetails';
import { PageLoader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

const ApplicationDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { data: application, isLoading } = useApplication(applicationId, true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <PageLoader message="Loading application details..." />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-6">
              <UserCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h2>
            <p className="text-gray-600 mb-8">The application you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/admin/applications')} size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
      'New': 'info',
      'In Review': 'secondary',
      'Interview': 'warning',
      'Offer': 'success',
      'Hired': 'success',
      'Rejected': 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div>
                {(() => {
                  const candidate = (application as any).candidate || application.candidateSnapshot;
                  const firstName = candidate?.firstName || '';
                  const lastName = candidate?.lastName || '';
                  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Unknown Candidate';
                  return (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {fullName}
                      </h1>
                      <p className="text-gray-600">
                        {application.job?.title || 'Unknown Position'}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
          
          {/* Status and Info Cards */}
          <div className="flex space-x-4">
            {(application as any).isGuestApplication && (
              <Card className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <UserCircle className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Application Type</p>
                    <Badge variant="secondary" size="sm">
                      Guest Application
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
            <Card className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Applied</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Application Details */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <ApplicationDetails application={application} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
