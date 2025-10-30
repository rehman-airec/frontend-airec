import React from 'react';
import { MapPin, Building2, Clock, DollarSign, Users, Heart, Bookmark } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatSalaryRange, formatDate } from '@/lib/utils';
import { Job } from '@/types/job.types';
import { useIsJobSaved, useToggleSaveJob } from '@/hooks/useSavedJobs';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  showActions?: boolean;
  showSaveButton?: boolean;
  isSaved?: boolean; // For backward compatibility, but will use hooks if not provided
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onSave,
  onView,
  showActions = true,
  showSaveButton = true,
  isSaved: propIsSaved,
}) => {
  // Use hooks to get saved state and toggle functionality
  const { data: isJobSaved, isLoading: isCheckingIfSaved } = useIsJobSaved(job._id);
  const { toggleSaveJob, isLoading: isToggling } = useToggleSaveJob();
  
  // Use prop value if provided (for backward compatibility), otherwise use hook data
  const isSaved = propIsSaved !== undefined ? propIsSaved : (isJobSaved || false);
  const isSaveLoading = isToggling || isCheckingIfSaved;

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job._id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If onSave prop is provided, use it (backward compatibility)
    if (onSave) {
      onSave(job._id);
    } else {
      // Otherwise use the new hook-based approach
      toggleSaveJob(job._id, isSaved);
    }
  };

  const handleView = () => {
    onView?.(job._id);
  };

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-md relative"
      onClick={handleView}
    >
      {/* Save Button - Top Right Corner */}
      {showSaveButton && (
        <button
          onClick={handleSave}
          disabled={isSaveLoading}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={isSaved ? 'Remove from saved jobs' : 'Save job'}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isSaved 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 hover:text-red-500'
            } ${isSaveLoading ? 'opacity-50' : ''}`}
          />
        </button>
      )}

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2 pr-8"> {/* Add padding to avoid overlap with save button */}
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {job.location.city}, {job.location.country}
                  {job.location.remote && ' (Remote)'}
                </span>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{job.employmentType}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{job.experienceLevel}</span>
            </div>
          </div>

          {/* Salary */}
          {job.salaryRange && (
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {formatSalaryRange(
                  job.salaryRange.min,
                  job.salaryRange.max,
                  job.salaryRange.currency
                )}
              </span>
            </div>
          )}

          {/* Skills */}
          {job.skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description Preview */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {job.description}
          </p>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {job.currentApplications} applications
            </span>
            <span>
              Posted {formatDate(job.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex space-x-2 p-6 pt-0">
          {/* Optional secondary save button for alternative layouts */}
          {!showSaveButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaveLoading}
              className="flex items-center space-x-2"
            >
              <Heart
                className={`h-4 w-4 ${
                  isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            className={showSaveButton ? 'w-full' : 'flex-1'}
          >
            Apply Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export { JobCard };
