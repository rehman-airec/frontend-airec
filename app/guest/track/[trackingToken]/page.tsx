'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGuestApplicationByToken, useConvertGuestToUser } from '@/hooks/useGuestApplications';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ArrowLeft, UserPlus, Mail, Phone, Calendar, FileText, ExternalLink } from 'lucide-react';
import { formatSalaryRange } from '@/lib/utils';

const GuestApplicationTrackingPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const trackingToken = params.trackingToken as string;
  
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { data: applicationData, isLoading, error } = useGuestApplicationByToken(trackingToken);
  const convertToUserMutation = useConvertGuestToUser();

  const handleConvertToUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      await convertToUserMutation.mutateAsync({
        trackingToken,
        password
      });
      
      // Redirect to login page with success message
      router.push('/auth/login?message=Account created successfully. Please sign in.');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to create account');
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading application details..." />;
  }

  if (error || !applicationData?.success) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <p className="text-gray-600 mb-6">
            The application you're looking for doesn't exist or the tracking link is invalid.
          </p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const { application, job, candidate } = applicationData;
  const guestApp = application.guestApplication;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
          <p className="text-gray-600 mt-2">
            Track your application for {job.title} at {job.department}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Status */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Application Status</h2>
                  <StatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {application.reviewedAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Last updated on {new Date(application.reviewedAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
                    <p className="text-gray-600">
                      {application.status === 'New' && 'Your application has been received and is being reviewed by our team.'}
                      {application.status === 'In Review' && 'Your application is currently being reviewed by our hiring team.'}
                      {application.status === 'Interview' && 'Congratulations! You have been selected for an interview. We will contact you soon to schedule it.'}
                      {application.status === 'Offer' && 'Great news! We would like to extend an offer to you. Our team will contact you with details.'}
                      {application.status === 'Hired' && 'Congratulations! You have been hired for this position.'}
                      {application.status === 'Rejected' && 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.department}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="text-gray-600">
                        {job.location.city}, {job.location.country}
                        {job.location.remote && ' (Remote)'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Employment Type</h4>
                      <p className="text-gray-600">{job.employmentType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Experience Level</h4>
                      <p className="text-gray-600">{job.experienceLevel}</p>
                    </div>
                    {job.salaryRange && (
                      <div>
                        <h4 className="font-medium text-gray-900">Salary</h4>
                        <p className="text-gray-600">
                          {formatSalaryRange(
                            job.salaryRange.min,
                            job.salaryRange.max,
                            job.salaryRange.currency
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{candidate.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{candidate.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{candidate.totalExperience} years experience</span>
                  </div>
                  {candidate.linkedinUrl && (
                    <div className="flex items-center text-sm">
                      <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                      <a 
                        href={candidate.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Account */}
            {!showSignupForm ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create an Account
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get full access to track all your applications and receive job recommendations.
                  </p>
                  <Button onClick={() => setShowSignupForm(true)} className="w-full">
                    Create Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Create Account</h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleConvertToUser} className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        error={passwordError}
                        disabled={convertToUserMutation.isPending}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        disabled={convertToUserMutation.isPending}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        loading={convertToUserMutation.isPending}
                        disabled={convertToUserMutation.isPending}
                        className="flex-1"
                      >
                        Create Account
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowSignupForm(false)}
                        disabled={convertToUserMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Additional Actions */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/candidate/jobs/list')}
                    className="w-full"
                  >
                    Browse More Jobs
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/auth/login')}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestApplicationTrackingPage;
