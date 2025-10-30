'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { JOB_BOARDS } from '@/lib/constants';
import { formatDate, formatSalaryRange } from '@/lib/utils';

const publishSummarySchema = z.object({
  applicationDeadline: z.string().optional(),
  maxApplications: z.number().min(1, 'Must be at least 1'),
  tags: z.array(z.string()).optional(),
  publishedOn: z.array(z.string()).optional(),
});

type PublishSummaryFormData = z.infer<typeof publishSummarySchema>;

interface JobSummary {
  title: string;
  department: string;
  location: {
    city: string;
    country: string;
    remote: boolean;
  };
  employmentType: string;
  experienceLevel: string;
  salaryRange?: {
    min?: number;
    max?: number;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  screeningQuestions: any[];
  hiringTeam: any[];
  workflow: string[];
}

interface PublishSummaryFormProps {
  jobSummary: JobSummary;
  initialData?: Partial<PublishSummaryFormData>;
  onSubmit: (data: PublishSummaryFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const PublishSummaryForm: React.FC<PublishSummaryFormProps> = ({
  jobSummary,
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);
  const [publishedOn, setPublishedOn] = React.useState<string[]>(initialData?.publishedOn || []);
  const [newTag, setNewTag] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublishSummaryFormData>({
    resolver: zodResolver(publishSummarySchema),
    defaultValues: {
      maxApplications: 1000,
      ...initialData,
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleJobBoard = (board: string) => {
    if (publishedOn.includes(board)) {
      setPublishedOn(publishedOn.filter(b => b !== board));
    } else {
      setPublishedOn([...publishedOn, board]);
    }
  };

  const handleFormSubmit = (data: PublishSummaryFormData) => {
    onSubmit({
      ...data,
      tags,
      publishedOn,
    });
  };

  return (
    <div className="space-y-6">
      {/* Job Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Job Summary</h2>
          <p className="text-gray-600">Review your job posting before publishing</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{jobSummary.title}</h3>
              <p className="text-gray-600">{jobSummary.department}</p>
              <p className="text-sm text-gray-500">
                {jobSummary.location.city}, {jobSummary.location.country}
                {jobSummary.location.remote && ' (Remote)'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Employment Type:</span>
                <span className="ml-2 text-gray-600">{jobSummary.employmentType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Experience Level:</span>
                <span className="ml-2 text-gray-600">{jobSummary.experienceLevel}</span>
              </div>
              {jobSummary.salaryRange && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Salary:</span>
                  <span className="ml-2 text-gray-600">
                    {formatSalaryRange(
                      jobSummary.salaryRange.min,
                      jobSummary.salaryRange.max,
                      jobSummary.salaryRange.currency
                    )}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 line-clamp-3">{jobSummary.description}</p>
            </div>

            {jobSummary.responsibilities.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Responsibilities</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {jobSummary.responsibilities.slice(0, 3).map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                  {jobSummary.responsibilities.length > 3 && (
                    <li className="text-gray-500">+{jobSummary.responsibilities.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            {jobSummary.skills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {jobSummary.skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {jobSummary.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{jobSummary.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publish Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Publish Settings</h2>
          <p className="text-gray-600">Configure how and where to publish this job</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Application Deadline */}
            <Input
              label="Application Deadline"
              type="datetime-local"
              {...register('applicationDeadline')}
              error={errors.applicationDeadline?.message}
              helperText="Leave empty for no deadline"
            />

            {/* Max Applications */}
            <Input
              label="Maximum Applications"
              type="number"
              min="1"
              {...register('maxApplications', { valueAsNumber: true })}
              error={errors.maxApplications?.message}
              helperText="Maximum number of applications to accept"
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Job Boards */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish on Job Boards
              </label>
              <div className="grid grid-cols-2 gap-2">
                {JOB_BOARDS.map((board) => (
                  <label key={board} className="flex items-center space-x-2">
                    <Checkbox
                      checked={publishedOn.includes(board)}
                      onChange={() => toggleJobBoard(board)}
                    />
                    <span className="text-sm text-gray-700">{board}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={isLoading}>
                Publish Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { PublishSummaryForm };
