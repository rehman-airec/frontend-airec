'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobDetailsForm } from '@/components/forms/JobDetailsForm';
import { ScreeningQuestionsManager } from '@/components/forms/ScreeningQuestionsManager';
import { WorkflowForm } from '@/components/forms/WorkflowForm';
import { PublishSummaryForm } from '@/components/forms/PublishSummaryForm';
import { Card, CardContent } from '@/components/ui/Card';
import { useCreateJob, usePublishJob } from '@/hooks/useJobs';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { CheckCircle } from 'lucide-react';

interface JobData {
  title: string;
  jobFunctions: string[];
  department: string;
  description: string;
  experienceRequiredYears: string;
  toolsTechnologies: string[];
  educationCertifications: string[];
  skills: string[];
  location: {
    city: string;
    country: string;
    remote: boolean;
    alternateLocations?: Array<{ city: string; country: string }>;
  };
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary' | 'Volunteer';
  workplaceTypes?: ('Remote' | 'On-site' | 'Hybrid')[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryRange?: {
    min?: number;
    max?: number;
    currency: string;
    hideFromCandidates?: boolean;
    type?: 'Fixed' | 'Variable' | 'Commission' | 'Hourly';
    period?: 'Yearly' | 'Monthly' | 'Weekly' | 'Hourly';
  };
  salaryBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  expiryDate?: string;
  leaderboard?: boolean;
  positions?: number;
  interviewQuestions?: string[];
  hiringManager?: {
    name: string;
    email: string;
    phone?: string;
  };
  assignProjectClient?: string;
  interviewers?: Array<{
    name: string;
    email: string;
    role?: string;
  }>;
  screeningQuestions: any[];
  hiringTeam: any[];
  workflow: string[];
}

const CreateJobPage: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useGlobalAlert();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState<Partial<JobData>>({
    jobFunctions: [],
    toolsTechnologies: [],
    educationCertifications: [],
    skills: [],
    screeningQuestions: [],
    hiringTeam: [],
    workflow: ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected']
  });
  const [jobId, setJobId] = useState<string | null>(null);

  const createJobMutation = useCreateJob();
  const publishJobMutation = usePublishJob();

  const steps = [
    { number: 1, title: 'Job Details', description: 'Basic job information' },
    { number: 2, title: 'Screening', description: 'Pre-screening questions' },
    { number: 3, title: 'Workflow', description: 'Hiring process & team' },
    { number: 4, title: 'Publish', description: 'Review and publish' },
  ];

  const handleStep1Submit = (data: any) => {
    setJobData({ ...jobData, ...data });
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: any) => {
    // Handle screening questions data structure
    const screeningQuestions = data.questions || [];
    setJobData({ ...jobData, screeningQuestions });
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: any) => {
    setJobData({ ...jobData, ...data });
    setCurrentStep(4);
  };

  const handleStep4Submit = async (data: any) => {
    try {
      console.log('Step 4 - Job data:', jobData);
      console.log('Step 4 - Current jobId:', jobId);
      
      let currentJobId = jobId;
      
      // Create job if not already created
      if (!currentJobId) {
        console.log('Creating job with data:', jobData);
        console.log('Job data keys:', Object.keys(jobData));
        console.log('Job data values:', Object.values(jobData));
        
        try {
          // Ensure all required fields are present
          const completeJobData = {
            ...jobData,
            jobFunctions: jobData.jobFunctions || [],
            toolsTechnologies: jobData.toolsTechnologies || [],
            educationCertifications: jobData.educationCertifications || [],
            skills: jobData.skills || [],
            screeningQuestions: jobData.screeningQuestions || [],
            hiringTeam: jobData.hiringTeam || [],
            workflow: jobData.workflow || ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected']
          };
          
          console.log('Complete job data for API:', completeJobData);
          
          const job = await createJobMutation.mutateAsync(completeJobData as any);
          console.log('Job created successfully:', job);
          currentJobId = job._id;
          setJobId(job._id);
          console.log('Job created with ID:', currentJobId);
        } catch (createError: any) {
          console.error('Job creation failed:', createError);
          console.error('Create error response:', createError.response?.data);
          throw createError;
        }
      }

      console.log('Publishing job with ID:', currentJobId);
      console.log('Publish data:', data);
      console.log('PublishedOn array:', data.publishedOn);
      
      // Ensure we have at least one job board selected
      const publishData = {
        publishedOn: data.publishedOn && data.publishedOn.length > 0 ? data.publishedOn : ['company']
      };
      console.log('Final publish data:', publishData);
      
      // Publish job
      try {
        const publishedJob = await publishJobMutation.mutateAsync({
          id: currentJobId,
          data: publishData,
        });
        console.log('Job published successfully:', publishedJob);
        console.log('Published job status:', publishedJob.status);
        console.log('Published job isPublished:', publishedJob.isPublished);
        showSuccess(
          'Job Published Successfully!',
          `"${jobData.title}" has been created and published successfully. Candidates can now view and apply for this position.`,
          () => router.push('/admin/jobs/list')
        );
        return; // Don't auto-navigate, let the modal handle it
      } catch (publishError: any) {
        console.error('Job publishing failed:', publishError);
        console.error('Publish error response:', publishError.response?.data);
        console.error('Publish error status:', publishError.response?.status);
        console.error('Publish error message:', publishError.message);
        
        // Don't throw the error - just log it and continue
        // The job is created, just not published yet
        console.warn('Job created but not published. You can publish it manually from the jobs list.');
        showError(
          'Job Created - Publishing Failed',
          `"${jobData.title}" has been created successfully, but there was an issue publishing it. You can publish it manually from the jobs list.`,
          () => router.push('/admin/jobs/list')
        );
        return; // Don't auto-navigate, let the modal handle it
      }
    } catch (error: any) {
      console.error('Error creating/publishing job:', error);
      console.error('Error details:', error.response?.data);
      
      showError(
        'Job Creation Failed',
        error.response?.data?.message || 'There was an error creating the job. Please check your information and try again.',
        () => {
          // Stay on the current page to allow user to fix issues
        }
      );
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Allow clicking on any completed step or the next step
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  const isStepClickable = (stepNumber: number) => {
    return stepNumber <= currentStep + 1;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JobDetailsForm
            initialData={jobData as any}
            onSubmit={handleStep1Submit}
            onNext={() => setCurrentStep(2)}
            isLoading={createJobMutation.isPending}
          />
        );
      case 2:
        return (
          <ScreeningQuestionsManager
            initialQuestions={jobData.screeningQuestions || []}
            onSubmit={handleStep2Submit}
            onBack={goBack}
            isLoading={createJobMutation.isPending}
          />
        );
      case 3:
        return (
          <WorkflowForm
            initialData={jobData as any}
            onSubmit={handleStep3Submit}
            onNext={() => setCurrentStep(4)}
            onBack={goBack}
            isLoading={createJobMutation.isPending}
          />
        );
      case 4:
        return (
          <PublishSummaryForm
            jobSummary={jobData as any}
            onSubmit={handleStep4Submit}
            onBack={goBack}
            isLoading={publishJobMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
          <p className="text-gray-600 mt-2">
            Follow the steps below to create and publish a new job posting
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isClickable = isStepClickable(step.number);
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                            : isClickable
                            ? 'bg-gray-200 text-gray-600 cursor-pointer hover:bg-gray-300 hover:scale-105'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => isClickable && handleStepClick(step.number)}
                        title={
                          isClickable
                            ? `Click to ${isCompleted ? 'review' : 'continue'} ${step.title}`
                            : 'Complete previous steps first'
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <div className={`ml-3 ${isClickable ? 'cursor-pointer' : ''}`}>
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-600' : isClickable ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className={`text-xs ${
                          isActive ? 'text-blue-500' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default CreateJobPage;
