'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApplication } from '@/hooks/useApplications';
import { ApplicationWithJob } from '@/types/application.types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { CvViewerModal } from '@/components/shared/CvViewerModal';
import { ArrowLeft, Calendar, MapPin, Briefcase, Clock, FileText, User } from 'lucide-react';
import { formatDate, formatSalaryRange } from '@/lib/utils';
import { getFileUrl } from '@/lib/config';
import { useRolePath } from '@/hooks/useRolePath';
import { useApplicationStore } from '@/stores/applicationStore';

const ApplicationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  const { showCvViewer, setShowCvViewer } = useApplicationStore();
  const rolePath = useRolePath();

  const { data: application, isLoading, error } = useApplication(applicationId) as { 
    data: ApplicationWithJob | undefined, 
    isLoading: boolean, 
    error: any 
  };

  // Debug logging
  console.log('Application ID:', applicationId);
  console.log('Application data:', application);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push(rolePath.applications.list)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-gray-100 text-gray-800';
      case 'In Review': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/candidate/applications')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-600 mt-2">View your application status and details</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Job Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{application.job?.title || 'Job Title'}</h3>
                    <p className="text-gray-600">{application.job?.department || 'Department'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {application.job?.location?.city}, {application.job?.location?.country}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {application.job?.employmentType}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {application.job?.experienceLevel}
                    </div>
                  </div>

                  {application.job?.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {application.job.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Screening Answers */}
            {application.screeningAnswers && application.screeningAnswers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Your Screening Answers
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.screeningAnswers.map((answer: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-900 mb-1">
                          Question {index + 1}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {answer.question || `Question ${index + 1}`}
                        </p>
                        <p className="text-gray-900 font-medium">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Notes (if any) */}
            {application.notes && application.notes.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Notes from Hiring Team</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {application.notes.map((note: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-900 text-sm">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied:</span>
                      <span className="font-medium">{formatDate(application.appliedAt)}</span>
                    </div>
                    {application.reviewedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reviewed:</span>
                        <span className="font-medium">{formatDate(application.reviewedAt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium">{application.priority || 'Medium'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Your Resume</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 break-all leading-relaxed">
                      {application.resumeFilename || 'resume.pdf'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => setShowCvViewer(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>If you have questions about your application, please contact our HR team.</p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact HR
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CV Viewer Modal */}
      {application && (
        <CvViewerModal
          isOpen={showCvViewer}
          onClose={() => setShowCvViewer(false)}
          fileUrl={getFileUrl(`/api/v1/files/resume/${application.resumeFilename}`)}
          fileName={application.resumeFilename || 'resume.pdf'}
          candidateName="Your Resume"
        />
      )}
    </div>
  );
};

export default ApplicationDetailPage;
