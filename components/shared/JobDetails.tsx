'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Building2, Users, DollarSign, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Job } from '@/types/job.types';

interface JobDetailsProps {
  job: Job;
  showApplyButton?: boolean;
  showHeader?: boolean;
  applyButtonText?: string;
  onApplyClick?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ 
  job, 
  showApplyButton = true,
  showHeader = true,
  applyButtonText = "Apply Now",
  onApplyClick
}) => {
  const handleApplyClick = () => {
    if (onApplyClick) {
      onApplyClick();
    }
  };

  // Format salary from either salaryRange or salaryBudget
  const formatSalary = () => {
    const r = job?.salaryRange;
    const b = job?.salaryBudget;
    const rangeHasNumbers = r && typeof r.min === 'number' && typeof r.max === 'number';
    const budgetHasNumbers = b && typeof b.min === 'number' && typeof b.max === 'number';
    
    if (!rangeHasNumbers && !budgetHasNumbers) return null;
    
    const min = rangeHasNumbers ? r!.min : b!.min;
    const max = rangeHasNumbers ? r!.max : b!.max;
    
    // Additional type guards
    if (typeof min !== 'number' || typeof max !== 'number') return null;
    
    const currency = (rangeHasNumbers ? r!.currency : b!.currency) || 'USD';
    const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
    const symbol = currency === 'USD' ? '$' : currency === 'PKR' ? '₨' : currency === 'EUR' ? '€' : '';
    const prefix = symbol || (currency ? currency + ' ' : '');
    
    return `${prefix}${nf.format(min)} - ${prefix}${nf.format(max)}`;
  };

  // Format location properly
  const formatLocation = () => {
    const city = job?.location?.city?.trim();
    const country = job?.location?.country?.trim();
    const isRemote = job?.location?.remote || (Array.isArray(job?.workplaceTypes) && job.workplaceTypes.includes('Remote'));
    
    const parts: string[] = [];
    if (city) parts.push(city);
    if (country) parts.push(country);
    const joined = parts.join(', ');
    
    return joined || (isRemote ? 'Remote' : 'Location not specified');
  };

  return (
    <div className="mt-2">
      {/* Job Header */}
      {showHeader && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {showApplyButton && (
            <div className="flex justify-end mb-3">
              <Link href={`/jobs/${job._id}/apply`}>
                <Button size="lg" className="px-6" onClick={handleApplyClick}>
                  {applyButtonText}
                </Button>
              </Link>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-base sm:text-lg text-gray-600">{job.department}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{formatLocation()}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.employmentType || 'Not specified'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.experienceLevel || 'Not specified'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          {formatSalary() && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-base font-medium">
                {formatSalary()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Job Content */}
      {/* Job Description */}
      <Card className="shadow-sm mb-4 mt-2">
        <CardHeader className="pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="prose max-w-none prose-gray prose-sm">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skills & Technologies */}
        {(job.skills?.length > 0 || job.toolsTechnologies?.length > 0) && (
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <h3 className="text-base font-semibold text-gray-900">Skills & Technologies</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {job.skills?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">Required Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.toolsTechnologies?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {job.toolsTechnologies.map((tech, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education & Experience */}
        {(job.educationCertifications?.length > 0 || job.experienceRequiredYears) && (
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <h3 className="text-base font-semibold text-gray-900">Requirements</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {job.experienceRequiredYears && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1 text-sm">Experience Required</h4>
                    <p className="text-gray-600 text-sm">{job.experienceRequiredYears} years</p>
                  </div>
                )}
                {job.educationCertifications?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">Education & Certifications</h4>
                    <ul className="space-y-1">
                      {job.educationCertifications.map((edu, index) => (
                        <li key={index} className="text-gray-600 flex items-center text-sm">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Details */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-3">
            <h3 className="text-base font-semibold text-gray-900">Job Details</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Positions Available</span>
                <span className="text-gray-600">{job.positions || 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Max Applications</span>
                <span className="text-gray-600">{job.maxApplications || 'Unlimited'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Current Applications</span>
                <span className="text-gray-600">{job.currentApplications || 0}</span>
              </div>
              {job.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Application Deadline</span>
                  <span className="text-gray-600">{formatDate(job.expiryDate)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hiring Manager */}
        {job.hiringManager && (
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <h3 className="text-base font-semibold text-gray-900">Hiring Manager</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 text-sm">{job.hiringManager.name}</p>
                <p className="text-gray-600 text-sm">{job.hiringManager.email}</p>
                {job.hiringManager.phone && (
                  <p className="text-gray-600 text-sm">{job.hiringManager.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export { JobDetails };
