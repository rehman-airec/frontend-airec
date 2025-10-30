'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApplyAsGuest } from '@/hooks/useGuestApplications';
import { ScreeningAnswersForm } from '@/components/forms/ScreeningQuestionsForm';
import { GuestApplicationForm } from '@/components/forms/GuestApplicationForm';
import { JobDetails } from '@/components/shared/JobDetails';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, User, UserPlus, ArrowRight } from 'lucide-react';
import { Job } from '@/types/job.types';

interface JobApplicationFlowProps {
  job: Job;
  onSuccess?: (trackingToken: string) => void;
}

const JobApplicationFlow: React.FC<JobApplicationFlowProps> = ({ 
  job, 
  onSuccess 
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [candidateInfo, setCandidateInfo] = useState<any>(null);
  const [trackingToken, setTrackingToken] = useState<string | null>(null);

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

  // Navigate to any step (allow free navigation between all steps)
  const navigateToStep = (stepNumber: number) => {
    // Allow navigation to any step from 1 to 4
    if (stepNumber >= 1 && stepNumber <= 4 && stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Check if a step is accessible (all steps are accessible)
  const isStepAccessible = (stepNumber: number): boolean => {
    return stepNumber >= 1 && stepNumber <= 4;
  };

  // Check if a step has data (for visual indication)
  const hasStepData = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true; // Job Details is always accessible
    if (stepNumber === 2) return true; // Your Information is the starting step
    if (stepNumber === 3) return applicationData !== null;
    if (stepNumber === 4) return candidateInfo !== null && resumeFile !== null;
    return false;
  };

  const handleCandidateInfoSubmit = (info: any, resume: File) => {
    setCandidateInfo(info);
    setResumeFile(resume);
    setCurrentStep(3);
  };

  const handleScreeningSubmit = (data: any) => {
    setApplicationData(data);
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    if (!resumeFile || !candidateInfo) return;

    try {
      const result = await applyAsGuestMutation.mutateAsync({
        data: {
          jobId: job._id,
          candidateInfo,
          screeningAnswers: applicationData?.answers || [],
          source: 'company_website',
        },
        file: resumeFile,
      });
      
      setTrackingToken(result.application.trackingToken);
      setCurrentStep(5);
      
      if (onSuccess) {
        onSuccess(result.application.trackingToken);
      }
    } catch (error) {
      console.error('Application failed:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <JobDetails 
              job={job} 
              showApplyButton={false}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={() => setCurrentStep(2)}>
                Continue to Your Information
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <GuestApplicationForm
            onSubmit={handleCandidateInfoSubmit}
            onBack={() => setCurrentStep(1)}
            isLoading={applyAsGuestMutation.isPending}
          />
        );

      case 3:
        return (
          <ScreeningAnswersForm
            questions={job.screeningQuestions}
            onSubmit={handleScreeningSubmit}
            onBack={() => setCurrentStep(2)}
            isLoading={applyAsGuestMutation.isPending}
          />
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Review Application</h2>
              <p className="text-gray-600">Review your application before submitting</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-600">{candidateInfo?.firstName} {candidateInfo?.lastName}</p>
                  <p className="text-gray-600">{candidateInfo?.email}</p>
                  <p className="text-gray-600">{candidateInfo?.phone}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Resume</h3>
                  <p className="text-gray-600">{resumeFile?.name}</p>
                </div>
                
                {applicationData?.answers && applicationData.answers.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Screening Answers</h3>
                    <div className="space-y-2">
                      {applicationData.answers.map((answer: any, index: number) => (
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
                  <Button onClick={handleFinalSubmit} loading={applyAsGuestMutation.isPending}>
                    Submit Application
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in this position. We'll review your application and get back to you soon.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Guest Application
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        You applied as a guest. You'll receive email updates about your application status. 
                        You can also track your application using the link we'll send to your email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={() => router.push('/guest/track/' + trackingToken)}>
                  Track Application
                </Button>
                <Button variant="outline" onClick={() => router.push('/auth/signup')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
                <Button variant="outline" onClick={() => router.push('/jobs')}>
                  Browse More Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps - Responsive */}
      <Card>
        <CardContent className="p-4 sm:p-6">
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
                    <div
                      className={`flex-1 flex items-center justify-center ${
                        step.number === steps.length ? '' : 'flex-1'
                      }`}
                    >
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
              {currentStep <= steps.length && (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    {steps[currentStep - 1]?.title || 'Application Complete'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {steps[currentStep - 1]?.description || 'Your application has been submitted'}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {renderCurrentStep()}
    </div>
  );
};

export { JobApplicationFlow };
