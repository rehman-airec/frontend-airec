'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, Clock, Users, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { formatDate, formatSalaryRange } from '@/lib/utils';
import { Job } from '@/types/job.types';

interface PublicJobCardProps {
  job: Job;
  showApplyButton?: boolean;
}

const PublicJobCard: React.FC<PublicJobCardProps> = ({ 
  job, 
  showApplyButton = true 
}) => {
  // Clean HTML tags from description for preview
  const cleanDescription = job.description.replace(/<[^>]*>/g, '').trim();
  const descriptionPreview = cleanDescription.length > 150 
    ? cleanDescription.substring(0, 150) + '...' 
    : cleanDescription;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              <Link 
                href={`/jobs/${job._id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {job.title}
              </Link>
            </h3>
            
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700 font-medium text-sm">{job.department}</span>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="truncate">
                {job.location.city}, {job.location.country}
                {job.location.remote && ' (Remote)'}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="h-3 w-3 text-gray-400" />
              <span>{job.experienceLevel}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          {/* Salary Information */}
          {job.salaryBudget && job.salaryBudget.min && job.salaryBudget.max ? (
            <div className="flex items-center space-x-1 text-xs">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="text-green-700 font-medium">
                {formatSalaryRange(
                  job.salaryBudget.min,
                  job.salaryBudget.max,
                  job.salaryBudget.currency
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-xs">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="text-gray-500">Salary not specified</span>
            </div>
          )}
          
          {/* Description Preview */}
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {descriptionPreview}
          </p>
          
          {/* Skills Preview */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          {showApplyButton && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Briefcase className="h-3 w-3" />
                <span>{job.currentApplications || 0} applications</span>
              </div>
              
              <div className="flex space-x-2">
                <Link href={`/jobs/${job._id}`}>
                  <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                    View
                  </Button>
                </Link>
                <Link href={`/jobs/${job._id}/apply`}>
                  <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1">
                    Apply
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { PublicJobCard };
