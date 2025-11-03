'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useJob, useDeleteJob, usePublishJob, useCloseJob } from '@/hooks/useJobs';
import { useJobApplications } from '@/hooks/useApplications';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Loader } from '@/components/ui/Loader';
import { formatDate, formatSalaryRange } from '@/lib/utils';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Archive, 
  Users, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign,
  Calendar,
  FileText,
  User,
  Mail
} from 'lucide-react';

const AdminJobViewPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const { data: job, isLoading: jobLoading, error: jobError } = useJob(jobId);
  const { data: applicationsData, isLoading: applicationsLoading } = useJobApplications(jobId, { limit: 5 });
  const { showConfirm, showSuccess, showError } = useGlobalAlert();
  
  const deleteJobMutation = useDeleteJob();
  const publishJobMutation = usePublishJob();
  const closeJobMutation = useCloseJob();

  const applications = applicationsData && typeof applicationsData === 'object' && 'applications' in applicationsData
    ? (applicationsData as { applications: any[] }).applications 
    : [];
  const applicationsPagination = applicationsData && typeof applicationsData === 'object' && 'pagination' in applicationsData
    ? (applicationsData as { pagination: any }).pagination
    : { total: 0 };

  const handleDeleteJob = () => {
    if (!job) return;
    
    showConfirm(
      'Delete Job',
      `Are you sure you want to delete "${job.title}"? This action cannot be undone. If the job has applications, it cannot be deleted.`,
      async () => {
        try {
          await deleteJobMutation.mutateAsync(job._id);
          router.push('/admin/jobs/list');
        } catch (error: any) {
          // Error handled by mutation
        }
      }
    );
  };

  const handlePublishJob = async () => {
    if (!job) return;
    
    try {
      await publishJobMutation.mutateAsync({
        id: job._id,
        data: {}
      });
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  const handleCloseJob = async () => {
    if (!job) return;
    
    showConfirm(
      'Close Job',
      `Are you sure you want to close "${job.title}"? This will stop accepting new applications.`,
      async () => {
        try {
          await closeJobMutation.mutateAsync(job._id);
        } catch (error: any) {
          // Error handled by mutation  
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <Loader className="h-8 w-8 mx-auto mb-4" />
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
              The job you're looking for doesn't exist or may have been deleted.
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
          <div className="flex items-center space-x-4 cursor-pointer">
            <Link href="/admin/jobs/list">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/admin/jobs/${job._id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
            </Link>
            
            {job.status === 'draft' && (
              <Button
                onClick={handlePublishJob}
                loading={publishJobMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
            
            {job.status === 'published' && (
              <Button
                onClick={handleCloseJob}
                loading={closeJobMutation.isPending}
                variant="outline"
                className="text-orange-600 hover:text-orange-700"
              >
                <Archive className="h-4 w-4 mr-2" />
                Close
              </Button>
            )}
            
            <Button
              onClick={handleDeleteJob}
              loading={deleteJobMutation.isPending}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Job Overview</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{job.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">
                        {job.location.city && job.location.country 
                          ? `${job.location.city}, ${job.location.country}`
                          : job.location.city || job.location.country || 'Not specified'
                        }
                        {job.location.remote && ' (Remote)'}
                      </p>
                      {job.location.alternateLocations && job.location.alternateLocations.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">Alternate locations:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.location.alternateLocations.map((altLoc, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {altLoc.city}{altLoc.country ? `, ${altLoc.country}` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Employment Type</p>
                      <p className="font-medium">{job.employmentType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Experience Level</p>
                      <p className="font-medium">{job.experienceLevel}</p>
                    </div>
                  </div>
                  
                  {job.experienceRequiredYears && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Experience Required</p>
                        <p className="font-medium">{job.experienceRequiredYears} years</p>
                      </div>
                    </div>
                  )}
                  
                  {job.workplaceTypes && job.workplaceTypes.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Workplace Type</p>
                        <p className="font-medium">{job.workplaceTypes.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  
                  {(job.salaryRange || job.salaryBudget) && (
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Salary Range</p>
                        <p className="font-medium">
                          {job.salaryRange ? 
                            formatSalaryRange(
                              job.salaryRange.min,
                              job.salaryRange.max,
                              job.salaryRange.currency
                            ) :
                            formatSalaryRange(
                              job.salaryBudget?.min,
                              job.salaryBudget?.max,
                              job.salaryBudget?.currency
                            )
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Job Description</h2>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-gray-700 leading-relaxed max-w-none [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-2 [&>strong]:font-semibold [&>strong]:text-gray-900 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:text-gray-900 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Key Responsibilities</h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-2 text-xs">•</span>
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Requirements</h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-2 text-xs">•</span>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Required Skills</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tools & Technologies */}
            {job.toolsTechnologies && job.toolsTechnologies.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tools & Technologies</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.toolsTechnologies.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education & Certifications */}
            {job.educationCertifications && job.educationCertifications.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Education & Certifications</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.educationCertifications.map((education, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {education}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Statistics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Job Statistics</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {applicationsPagination.total}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Max Applications</span>
                  <span className="text-lg font-semibold">
                    {job.maxApplications || 'Unlimited'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Positions</span>
                  <span className="text-lg font-semibold">
                    {job.positions || 1}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-lg font-semibold capitalize">
                    {job.status}
                  </span>
                </div>
                
                {job.publishedAt && (
                  <div>
                    <span className="text-gray-600 block">Published On</span>
                    <span className="text-sm font-medium">
                      {formatDate(job.publishedAt)}
                    </span>
                  </div>
                )}
                
                {job.expiryDate && (
                  <div>
                    <span className="text-gray-600 block">Expires On</span>
                    <span className="text-sm font-medium">
                      {formatDate(job.expiryDate)}
                    </span>
                  </div>
                )}
                
                {job.publishedOn && job.publishedOn.length > 0 && (
                  <div>
                    <span className="text-gray-600 block">Published On</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.publishedOn.map((platform, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Applications</h3>
                  <Link href={`/admin/jobs/${job._id}/applications`}>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application: any, index: number) => {
                      const candidate = application.candidateSnapshot || application.candidate || {};
                      const key = application._id || application.id || candidate.email || index;
                      const appliedAt = application.appliedAt || application.createdAt;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {candidate.firstName || ''} {candidate.lastName || ''}
                            </p>
                            <p className="text-sm text-gray-600">
                              Applied {formatDate(appliedAt)}
                            </p>
                          </div>
                          <StatusBadge
                            status={application.status}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No applications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hiring Team */}
            {job.hiringTeam && job.hiringTeam.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Hiring Team</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {job.hiringTeam.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hiring Manager */}
            {job.hiringManager && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Hiring Manager</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{job.hiringManager.name}</p>
                        <p className="text-sm text-gray-600">{job.hiringManager.email}</p>
                        {job.hiringManager.phone && (
                          <p className="text-sm text-gray-600">{job.hiringManager.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Screening Questions */}
            {job.screeningQuestions && job.screeningQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Screening Questions</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.screeningQuestions.map((question, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {question.type}
                          </span>
                          {question.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Options:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {question.options.map((option, optIndex) => (
                                <li key={optIndex}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Workflow Stages */}
            {job.workflow && job.workflow.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Application Workflow</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {job.workflow.map((stage, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{stage}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobViewPage;
