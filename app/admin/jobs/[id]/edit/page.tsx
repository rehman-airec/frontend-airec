'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useJob, useUpdateJob } from '@/hooks/useJobs';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { JobDetailsForm } from '@/components/forms/JobDetailsForm';
import { ScreeningQuestionsManager } from '@/components/forms/ScreeningQuestionsManager';
import { WorkflowForm } from '@/components/forms/WorkflowForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ArrowLeft, FileText, Save } from 'lucide-react';

interface JobData {
  title: string;
  department: string;
  location: {
    city: string;
    country: string;
    remote: boolean;
    alternateLocations?: Array<{ city: string; country?: string }>;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills?: string; // Changed from string[] to string to match form type
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline?: string;
  maxApplications?: number;
  screeningQuestions: any[];
  hiringTeam: any[];
  workflow: string[];
  toolsTechnologies?: string;
  educationCertifications?: string;
  jobFunctions?: string[];
  jobType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary' | 'Volunteer';
  workplaceTypes?: ('Remote' | 'On-site' | 'Hybrid')[];
  interviewQuestions?: string[];
  hiringManager?: any;
  assignProjectClient?: string;
  interviewers?: any[];
}

const AdminJobEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const { data: job, isLoading: jobLoading, error: jobError } = useJob(jobId);
  const updateJobMutation = useUpdateJob();
  const { showSuccess, showError } = useGlobalAlert();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState<Partial<JobData>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when job loads
  useEffect(() => {
    if (job) {
      const formData = {
        title: job.title || '',
        department: job.department || '',
        location: {
          city: job.location?.city || '',
          country: job.location?.country || '',
          remote: job.location?.remote || false,
          alternateLocations: job.location?.alternateLocations || [],
        },
        description: job.description || '',
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
        toolsTechnologies: Array.isArray(job.toolsTechnologies) ? job.toolsTechnologies.join(', ') : job.toolsTechnologies || '',
        educationCertifications: Array.isArray(job.educationCertifications) ? job.educationCertifications.join(', ') : job.educationCertifications || '',
        jobFunctions: job.jobFunctions || [],
        jobType: job.jobType || job.employmentType,
        workplaceTypes: job.workplaceTypes || [],
        employmentType: (job.employmentType as 'Full-time' | 'Part-time' | 'Contract' | 'Internship') || 'Full-time',
        experienceLevel: (job.experienceLevel as 'Entry' | 'Mid' | 'Senior' | 'Executive') || 'Mid',
        salaryRange: job.salaryRange ? {
          min: job.salaryRange.min || 0,
          max: job.salaryRange.max || 0,
          currency: job.salaryRange.currency || 'USD',
        } : undefined,
        salaryBudget: job.salaryBudget ? {
          min: job.salaryBudget.min ?? undefined,
          max: job.salaryBudget.max ?? undefined,
          currency: job.salaryBudget.currency ?? 'USD',
        } : undefined,
        applicationDeadline: job.applicationDeadline ? 
          (typeof job.applicationDeadline === 'string' ? job.applicationDeadline.split('T')[0] : 
           new Date(job.applicationDeadline).toISOString().split('T')[0]) : undefined,
        maxApplications: job.maxApplications || 1000,
        screeningQuestions: job.screeningQuestions || [],
        hiringTeam: job.hiringTeam || [],
        workflow: job.workflow || ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected'],
        hiringManager: job.hiringManager || undefined,
        assignProjectClient: job.assignProjectClient || '',
        interviewers: job.interviewers || [],
      };
      setJobData(formData);
    }
  }, [job]);

  const steps = [
    { number: 1, title: 'Job Details', description: 'Basic job information' },
    { number: 2, title: 'Screening', description: 'Pre-screening questions' },
    { number: 3, title: 'Workflow', description: 'Hiring process & team' },
  ];

  const handleStep1Submit = (data: any) => {
    setJobData({ ...jobData, ...data });
    setHasChanges(true);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: any) => {
    const screeningQuestions = data.questions || [];
    setJobData({ ...jobData, screeningQuestions });
    setHasChanges(true);
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: any) => {
    const finalJobData = { ...jobData, ...data };
    setJobData(finalJobData);
    setHasChanges(true);
    
    // Auto-save when completing workflow step
    await handleSave(finalJobData);
  };

  const handleSave = async (dataToSave = jobData) => {
    if (!job) return;

    try {
      // Transform data to match API expectations
      // Convert string fields to arrays where needed
      const updateData: any = {
        ...dataToSave,
        // Convert comma-separated strings back to arrays
        skills: typeof dataToSave.skills === 'string' ? dataToSave.skills.split(',').map(s => s.trim()).filter(s => s) : dataToSave.skills,
        toolsTechnologies: typeof dataToSave.toolsTechnologies === 'string' ? dataToSave.toolsTechnologies.split(',').map(s => s.trim()).filter(s => s) : dataToSave.toolsTechnologies,
        educationCertifications: typeof dataToSave.educationCertifications === 'string' ? dataToSave.educationCertifications.split(',').map(s => s.trim()).filter(s => s) : dataToSave.educationCertifications,
        // Keep applicationDeadline as string for API
        applicationDeadline: dataToSave.applicationDeadline || undefined,
      };

      await updateJobMutation.mutateAsync({
        id: job._id,
        data: updateData
      });
      
      setHasChanges(false);
      showSuccess(
        'Job Updated',
        'Job has been updated successfully.',
        () => {
          router.push(`/admin/jobs/${job._id}`);
        }
      );
    } catch (error: any) {
      console.error('Error updating job:', error);
      showError(
        'Update Failed',
        error.response?.data?.message || 'Failed to update job. Please try again.'
      );
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    if (!job || !jobData.title) {
      return null; // Wait for both job and jobData to be populated
    }

    switch (currentStep) {
      case 1:
        return (
          <JobDetailsForm
            key={`job-details-${job._id}`} // Force re-mount when job changes
            initialData={jobData as any}
            onSubmit={handleStep1Submit}
            onNext={() => setCurrentStep(2)}
            isLoading={updateJobMutation.isPending}
            isEdit={true}
          />
        );
      case 2:
        return (
          <ScreeningQuestionsManager
            key={`screening-${job._id}`} // Force re-mount when job changes
            initialQuestions={jobData.screeningQuestions || []}
            onSubmit={handleStep2Submit}
            onBack={goBack}
            isLoading={updateJobMutation.isPending}
            isEdit={true}
          />
        );
      case 3:
        return (
          <WorkflowForm
            key={`workflow-${job._id}`} // Force re-mount when job changes
            initialData={jobData}
            onSubmit={handleStep3Submit}
            onNext={() => {}} // Not used in edit mode
            onBack={goBack}
            isLoading={updateJobMutation.isPending}
            isEdit={true}
            showPublishOption={false}
          />
        );
      default:
        return null;
    }
  };

  // Show loading while job is loading or jobData is not populated yet
  if (jobLoading || (job && !jobData.title)) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Job Not Found</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              The job you're trying to edit doesn't exist or may have been deleted.
            </p>
            <Link href="/admin/jobs/list">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href={`/admin/jobs/${job._id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
              <p className="text-gray-600 mt-1">{job.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <Button
                onClick={() => handleSave()}
                loading={updateJobMutation.isPending}
                variant="outline"
                className="text-blue-600 hover:text-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isClickable = step.number <= currentStep + 1; // allow navigating to completed and next step
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => isClickable && setCurrentStep(step.number)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : isClickable
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      title={
                        isClickable
                          ? `${isCompleted ? 'Review' : 'Go to'} ${step.title}`
                          : 'Complete previous steps first'
                      }
                    >
                      {step.number}
                    </button>
                    <button
                      type="button"
                      onClick={() => isClickable && setCurrentStep(step.number)}
                      className={`ml-3 text-left ${isClickable ? '' : 'cursor-not-allowed'}`}
                      title={
                        isClickable
                          ? `${isCompleted ? 'Review' : 'Go to'} ${step.title}`
                          : 'Complete previous steps first'
                      }
                    >
                      <p
                        className={`text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-700'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    </button>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white">
          {renderCurrentStep()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={goBack}>
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <p className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </p>
            {currentStep < steps.length && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="outline"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobEditPage;
