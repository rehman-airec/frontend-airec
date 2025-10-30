'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApplyForJob } from '@/hooks/useApplications';
import { useApplyAsGuest } from '@/hooks/useGuestApplications';
import { useAuth } from '@/hooks/useAuth';
import { ScreeningAnswersForm } from '@/components/forms/ScreeningQuestionsForm';
import { GuestApplicationForm } from '@/components/forms/GuestApplicationForm';
import { JobDetails } from '@/components/shared/JobDetails';
import { Button } from '@/components/ui/Button';
import { CheckCircle, User, UserPlus, ArrowRight } from 'lucide-react';
import { Job } from '@/types/job.types';

interface UnifiedApplicationFlowProps {
  job: Job;
  onSuccess?: (trackingToken?: string) => void;
}

interface ApplicationState {
  resumeFile: File | null;
  applicationData: any;
  candidateInfo: any;
  trackingToken: string | null;
}

const UnifiedApplicationFlow: React.FC<UnifiedApplicationFlowProps> = ({ 
  job, 
  onSuccess 
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [appState, setAppState] = useState<ApplicationState>({
    resumeFile: null,
    applicationData: null,
    candidateInfo: null,
    trackingToken: null,
  });

  const applyMutation = useApplyForJob();
  const applyAsGuestMutation = useApplyAsGuest();

  const steps = [
    { number: 1, title: 'Job Details', description: 'Review the position' },
    { number: 2, title: 'Your Information', description: 'Provide details & upload resume' },
    { number: 3, title: 'Screening', description: 'Answer questions' },
    { number: 4, title: 'Submit', description: 'Complete application' },
  ];

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Navigate to any step
  const navigateToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= 4 && stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Check if step has data
  const hasStepData = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!appState.candidateInfo;
    if (stepNumber === 3) return !!appState.applicationData;
    if (stepNumber === 4) return !!appState.candidateInfo && !!appState.resumeFile;
    return false;
  };

  // Handle candidate info submission
  const handleCandidateInfoSubmit = (info: any, resume: File) => {
    setAppState(prev => ({ ...prev, candidateInfo: info, resumeFile: resume }));
    setCurrentStep(3);
  };

  // Handle screening submission
  const handleScreeningSubmit = (data: any) => {
    setAppState(prev => ({ ...prev, applicationData: data }));
    setCurrentStep(4);
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    // Validation based on authentication status
    if (isAuthenticated) {
      // Authenticated users only need resume
      if (!appState.resumeFile) return;
    } else {
      // Guest users need both resume and candidate info
      if (!appState.resumeFile || !appState.candidateInfo) return;
    }

    try {
      if (isAuthenticated) {
        // Authenticated user application - no candidate info needed
        await applyMutation.mutateAsync({
          jobId: job._id,
          data: {
            jobId: job._id,
            screeningAnswers: appState.applicationData?.answers || [],
            source: 'company_website',
          },
          file: appState.resumeFile,
        });
      } else {
        // Guest application - requires candidate info
        const result = await applyAsGuestMutation.mutateAsync({
          data: {
            jobId: job._id,
            candidateInfo: appState.candidateInfo,
            screeningAnswers: appState.applicationData?.answers || [],
            source: 'company_website',
          },
          file: appState.resumeFile,
        });
        
        setAppState(prev => ({ ...prev, trackingToken: result.application.trackingToken }));
      }
      
      setCurrentStep(5);
      onSuccess?.(isAuthenticated ? undefined : appState.trackingToken || '');
    } catch (error) {
      console.error('Application failed:', error);
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="space-y-6">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between">
          {steps.map((step, index) => {
            const hasData = hasStepData(step.number);
            const isCurrent = currentStep === step.number;
            
            return (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <button
                    onClick={() => navigateToStep(step.number)}
                    className="text-left cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : hasData
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-2 min-w-[120px]">
                      <p className={`text-sm font-medium ${
                        isCurrent ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </button>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4 min-w-[40px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const hasData = hasStepData(step.number);
              const isCurrent = currentStep === step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex-1 flex items-center justify-center">
                    <button
                      onClick={() => navigateToStep(step.number)}
                      className="cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : hasData
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                    </button>
                  </div>
                  {step.number < steps.length && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {steps[currentStep - 1].title}
            </p>
            <p className="text-xs text-gray-500">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <JobDetails job={job} showApplyButton={false} />
            <div className="flex justify-end mt-6">
              <Button onClick={() => setCurrentStep(2)}>
                Continue to Your Information
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        // For authenticated users, populate form with their profile data
        // For guest users, form starts empty
        const initialFormData = isAuthenticated && user ? {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          totalExperience: user.totalExperience || 0,
          linkedinUrl: user.linkedinUrl || ''
        } : undefined;

        return (
          <GuestApplicationForm
            onSubmit={handleCandidateInfoSubmit}
            isLoading={applyMutation.isPending || applyAsGuestMutation.isPending}
            initialData={initialFormData}
            showGuestNote={!isAuthenticated}
            isAuthenticated={isAuthenticated}
          />
        );

      case 3:
        return (
          <ScreeningAnswersForm
            questions={job.screeningQuestions}
            onSubmit={handleScreeningSubmit}
            onBack={() => setCurrentStep(2)}
            isLoading={applyMutation.isPending || applyAsGuestMutation.isPending}
          />
        );

      case 4:
        return renderReviewStep();

      case 5:
        return renderSuccessStep();

      default:
        return null;
    }
  };

  // Render review step
  const renderReviewStep = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Application</h2>
        
        <div className="space-y-4">
          {/* Only show contact info for guest users */}
          {!isAuthenticated && appState.candidateInfo && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
              <p className="text-gray-600">{appState.candidateInfo.firstName} {appState.candidateInfo.lastName}</p>
              <p className="text-gray-600">{appState.candidateInfo.email}</p>
              <p className="text-gray-600">{appState.candidateInfo.phone}</p>
            </div>
          )}
          
          {/* Show account info for authenticated users */}
          {isAuthenticated && user && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Your Account</h3>
              <p className="text-gray-600">{user.firstName} {user.lastName}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Resume</h3>
            <p className="text-gray-600">{appState.resumeFile?.name}</p>
          </div>
          
          {appState.applicationData?.answers && appState.applicationData.answers.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Screening Answers</h3>
              <div className="space-y-2">
                {appState.applicationData.answers.map((answer: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-gray-700">Q{index + 1}:</span>
                    <span className="text-gray-600 ml-2">{answer.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button 
              onClick={handleFinalSubmit} 
              loading={applyMutation.isPending || applyAsGuestMutation.isPending}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Render success step
  const renderSuccessStep = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in this position. We'll review your application and get back to you soon.
        </p>
        
        {/* Guest-specific messaging */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3 text-left">
                <h3 className="text-sm font-medium text-blue-800">Guest Application</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You applied as a guest. You'll receive email updates about your application status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons based on authentication status */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {/* Guest-only buttons */}
          {!isAuthenticated && (
            <>
              {appState.trackingToken && (
                <Button onClick={() => router.push('/guest/track/' + appState.trackingToken)}>
                  Track Application
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/auth/signup')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </>
          )}
          
          {/* Authenticated user buttons */}
          {isAuthenticated && (
            <Button variant="outline" onClick={() => router.push('/candidate/applications')}>
              View My Applications
            </Button>
          )}
          
          {/* Common button for all users */}
          <Button variant="outline" onClick={() => router.push(isAuthenticated ? '/candidate/jobs/list' : '/jobs')}>
            Browse More Jobs
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStepIndicators()}
      {renderStepContent()}
    </div>
  );
};

export { UnifiedApplicationFlow };
