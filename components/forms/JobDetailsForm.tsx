'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { 
  EMPLOYMENT_TYPES, 
  EXPERIENCE_LEVELS, 
  JOB_TYPES,
  WORKPLACE_TYPES,
  SALARY_TYPES,
  SALARY_PERIODS,
  EXPERIENCE_YEARS_OPTIONS
} from '@/lib/constants';
import { X } from 'lucide-react';
import WorkplaceTypeSelector from './WorkplaceTypeSelector';

const jobDetailsSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  jobFunctions: z.array(z.string()).optional(),
  department: z.string().min(1, 'Department is required'),
  description: z.string().min(2000, 'Description must be at least 2000 characters'),
  experienceRequiredYears: z.string().min(1, 'Experience required is required'),
  toolsTechnologies: z.array(z.string()).optional(),
  educationCertifications: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    remote: z.boolean(),
    alternateLocations: z.array(z.object({
      city: z.string(),
      country: z.string().optional(),
    })).optional(),
  }),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Volunteer']),
  workplaceTypes: z.array(z.enum(['Remote', 'On-site', 'Hybrid'])).optional(),
  experienceLevel: z.enum(['Entry', 'Mid', 'Senior', 'Executive']),
  salaryRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string(),
    hideFromCandidates: z.boolean().optional(),
    type: z.enum(['Fixed', 'Variable', 'Commission', 'Hourly']).optional(),
    period: z.enum(['Yearly', 'Monthly', 'Weekly', 'Hourly']).optional(),
  }).optional(),
  salaryBudget: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),
  expiryDate: z.string().optional(),
  leaderboard: z.boolean().optional(),
  positions: z.number().optional(),
  interviewQuestions: z.array(z.string()).optional(),
  hiringManager: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
  assignProjectClient: z.string().optional(),
  interviewers: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    role: z.string().optional(),
  })).optional(),
});

type JobDetailsFormData = z.infer<typeof jobDetailsSchema>;

interface JobDetailsFormProps {
  initialData?: Partial<JobDetailsFormData>;
  onSubmit: (data: JobDetailsFormData) => void;
  onNext: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  initialData,
  onSubmit,
  onNext,
  isLoading = false,
  isEdit = false,
}) => {
  const normalizeToStringArray = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value.filter((v) => typeof v === 'string');
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const [interviewQuestions, setInterviewQuestions] = React.useState<string[]>(
    initialData?.interviewQuestions || []
  );
  const [interviewers, setInterviewers] = React.useState<any[]>(
    initialData?.interviewers || []
  );
  const [jobFunctions, setJobFunctions] = React.useState<string[]>(
    normalizeToStringArray(initialData?.jobFunctions)
  );
  const [toolsTechnologies, setToolsTechnologies] = React.useState<string[]>(
    normalizeToStringArray(initialData?.toolsTechnologies)
  );
  const [educationCertifications, setEducationCertifications] = React.useState<string[]>(
    normalizeToStringArray(initialData?.educationCertifications)
  );
  const [skills, setSkills] = React.useState<string[]>(
    normalizeToStringArray(initialData?.skills)
  );
  const [workplaceTypes, setWorkplaceTypes] = React.useState<('Remote' | 'On-site' | 'Hybrid')[]>(
    initialData?.workplaceTypes || []
  );
  const [workplaceLocations, setWorkplaceLocations] = React.useState(() => {
    // Initialize workplace locations from alternateLocations if editing
    const locations = {
      onSite: undefined as { city?: string; country?: string } | undefined,
      hybrid: undefined as { city?: string; country?: string } | undefined,
      remote: { country: '', cities: [] as Array<{ city: string; country?: string }> }
    };

    if (initialData?.location?.alternateLocations) {
      initialData.location.alternateLocations.forEach(altLoc => {
        // For now, we'll put the first location as the main location
        // and others as alternate locations
        if (!locations.onSite && altLoc.city) {
          locations.onSite = { city: altLoc.city, country: altLoc.country };
        } else if (!locations.hybrid && altLoc.city) {
          locations.hybrid = { city: altLoc.city, country: altLoc.country };
        } else if (altLoc.city) {
          locations.remote.cities.push({ city: altLoc.city, country: altLoc.country });
        }
      });
    }

    return locations;
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JobDetailsFormData>({
    resolver: zodResolver(jobDetailsSchema) as any,
    defaultValues: {
      location: { city: '', country: '', remote: false },
      employmentType: 'Full-time',
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      experienceRequiredYears: '1-2',
      salaryRange: { currency: 'USD', hideFromCandidates: false, type: 'Fixed', period: 'Yearly' },
      salaryBudget: { currency: 'USD' },
      leaderboard: false,
      positions: 1,
      workplaceTypes: [],
      ...initialData,
    },
  });

  const description = watch('description');

  React.useEffect(() => {
    if (initialData && isEdit) {
      const formData = {
        location: { city: '', country: '', remote: false, alternateLocations: [] },
        employmentType: 'Full-time' as const,
        experienceLevel: 'Mid' as const,
        ...initialData,
      };
      reset(formData);
      setInterviewQuestions(initialData.interviewQuestions || []);
      setInterviewers(initialData.interviewers || []);
      setJobFunctions(normalizeToStringArray(initialData.jobFunctions));
      setToolsTechnologies(normalizeToStringArray(initialData.toolsTechnologies));
      setEducationCertifications(normalizeToStringArray(initialData.educationCertifications));
      setSkills(normalizeToStringArray(initialData.skills));
    }
  }, [initialData, isEdit, reset]);

  const handleAddInterviewer = () => {
    setInterviewers([...interviewers, { name: '', email: '', role: '' }]);
  };

  const handleRemoveInterviewer = (index: number) => {
    setInterviewers(interviewers.filter((_, i) => i !== index));
  };

  const handleUpdateInterviewer = (index: number, field: string, value: string) => {
    const updated = [...interviewers];
    updated[index] = { ...updated[index], [field]: value };
    setInterviewers(updated);
  };

  const handleAddInterviewQuestion = () => {
    setInterviewQuestions([...interviewQuestions, '']);
  };

  const handleRemoveInterviewQuestion = (index: number) => {
    setInterviewQuestions(interviewQuestions.filter((_, i) => i !== index));
  };

  const handleUpdateInterviewQuestion = (index: number, value: string) => {
    const updated = [...interviewQuestions];
    updated[index] = value;
    setInterviewQuestions(updated);
  };

  const handleAddJobFunction = () => {
    setJobFunctions([...jobFunctions, '']);
  };

  const handleRemoveJobFunction = (index: number) => {
    setJobFunctions(jobFunctions.filter((_, i) => i !== index));
  };

  const handleUpdateJobFunction = (index: number, value: string) => {
    const updated = [...jobFunctions];
    updated[index] = value;
    setJobFunctions(updated);
  };

  // Helper functions for array fields
  const handleAddToArray = (array: string[], setArray: (arr: string[]) => void) => {
    setArray([...array, '']);
  };

  const handleRemoveFromArray = (array: string[], setArray: (arr: string[]) => void, index: number) => {
    const updated = array.filter((_, i) => i !== index);
    setArray(updated);
  };

  const handleUpdateArrayItem = (array: string[], setArray: (arr: string[]) => void, index: number, value: string) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
  };

  const handleFormSubmit = (data: JobDetailsFormData) => {
    // Build location data with alternateLocations
    const alternateLocations: Array<{ city: string; country?: string }> = [];

    // Add alternate locations based on workplace types
    if (workplaceTypes.includes('On-site') && workplaceLocations.onSite) {
      alternateLocations.push({
        city: workplaceLocations.onSite.city || '',
        country: workplaceLocations.onSite.country || ''
      });
    }
    
    if (workplaceTypes.includes('Hybrid') && workplaceLocations.hybrid) {
      alternateLocations.push({
        city: workplaceLocations.hybrid.city || '',
        country: workplaceLocations.hybrid.country || ''
      });
    }
    
    if (workplaceTypes.includes('Remote') && workplaceLocations.remote?.cities) {
      workplaceLocations.remote.cities.forEach(cityData => {
        if (cityData.city) {
          alternateLocations.push({
            city: cityData.city,
            country: cityData.country || workplaceLocations.remote?.country || ''
          });
        }
      });
    }

    const locationData = {
      city: data.location.city || '',
      country: data.location.country || '',
      // Mark as remote ONLY when the Remote checkbox is selected
      remote: workplaceTypes.includes('Remote'),
      alternateLocations
    };

    const submitData: any = {
      ...data,
      toolsTechnologies,
      educationCertifications,
      skills,
      jobFunctions,
      interviewQuestions,
      interviewers,
      workplaceTypes,
      location: locationData
    };
    
    onSubmit(submitData);
    onNext();
  };

  const employmentTypeOptions = EMPLOYMENT_TYPES.map(type => ({
    value: type,
    label: type,
  }));

  const jobTypeOptions = JOB_TYPES.map(type => ({
    value: type,
    label: type,
  }));

  const workplaceTypeOptions = WORKPLACE_TYPES.map(type => ({
    value: type,
    label: type,
  }));

  const experienceLevelOptions = EXPERIENCE_LEVELS.map(level => ({
    value: level,
    label: level,
  }));

  const experienceYearsOptions = EXPERIENCE_YEARS_OPTIONS.map(years => ({
    value: years,
    label: years === '0-1' ? '0-1 Years' : `${years} Years`
  }));

  const salaryTypeOptions = SALARY_TYPES.map(type => ({
    value: type,
    label: type,
  }));

  const salaryPeriodOptions = SALARY_PERIODS.map(period => ({
    value: period,
    label: period,
  }));

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Basic Questions</h2>
        <p className="text-gray-600">Basic information about the position</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Job Title */}
          <div>
            <Input
              label="Job Title *"
              placeholder="e.g. Senior Software Engineer"
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          {/* Job Functions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Functions
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddJobFunction}
              >
                Add Job Function
              </Button>
            </div>
            <div className="space-y-2">
              {jobFunctions.map((jobFunction, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={jobFunction}
                    onChange={(e) => handleUpdateJobFunction(index, e.target.value)}
                    placeholder="Enter job function..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveJobFunction(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Department & Experience Required */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Department"
              placeholder="e.g. Engineering"
              {...register('department')}
              error={errors.department?.message}
            />
            <Select
              label="Experience Required In Years *"
              options={experienceYearsOptions}
              {...register('experienceRequiredYears')}
              error={errors.experienceRequiredYears?.message}
            />
          </div>

          {/* Tools and Technologies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tools and Technologies (Add Multiple) *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddToArray(toolsTechnologies, setToolsTechnologies)}
              >
                Add Technology
              </Button>
            </div>
            <div className="space-y-2">
              {toolsTechnologies.map((tech, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={tech}
                    onChange={(e) => handleUpdateArrayItem(toolsTechnologies, setToolsTechnologies, index, e.target.value)}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromArray(toolsTechnologies, setToolsTechnologies, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {toolsTechnologies.length === 0 && (
                <p className="text-sm text-gray-500 italic">No technologies added yet</p>
              )}
            </div>
          </div>

          {/* Education and Certifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Education and Certifications (Add Multiple) *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddToArray(educationCertifications, setEducationCertifications)}
              >
                Add Education/Certification
              </Button>
            </div>
            <div className="space-y-2">
              {educationCertifications.map((education, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={education}
                    onChange={(e) => handleUpdateArrayItem(educationCertifications, setEducationCertifications, index, e.target.value)}
                    placeholder="e.g. Bachelor's in Computer Science, AWS Certified"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromArray(educationCertifications, setEducationCertifications, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {educationCertifications.length === 0 && (
                <p className="text-sm text-gray-500 italic">No education/certifications added yet</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Skills (Add Multiple) *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddToArray(skills, setSkills)}
              >
                Add Skill
              </Button>
            </div>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={skill}
                    onChange={(e) => handleUpdateArrayItem(skills, setSkills, index, e.target.value)}
                    placeholder="e.g. Communication, Leadership, Problem-solving"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromArray(skills, setSkills, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <WysiwygEditor
              value={description || ''}
              onChange={(value) => setValue('description', value)}
              label="Job Description"
              placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
              toolbar="full"
              minHeight={200}
              maxHeight={500}
              error={errors.description?.message}
              helperText={`Minimum 2000 characters required. Current: ${description?.length || 0}`}
            />
          </div>

          {/* Workplace Types with Location Requirements */}
          <WorkplaceTypeSelector
            selectedTypes={workplaceTypes}
            onChange={setWorkplaceTypes}
            locations={workplaceLocations}
            onLocationChange={(type, location) => {
              if (type === 'On-site') {
                setWorkplaceLocations(prev => ({ ...prev, onSite: location }));
                setValue('location.city', location.city || '');
                setValue('location.country', location.country || '');
              } else if (type === 'Hybrid') {
                setWorkplaceLocations(prev => ({ ...prev, hybrid: location }));
              } else if (type === 'Remote') {
                setWorkplaceLocations(prev => ({ ...prev, remote: location }));
              }
            }}
          />



          {/* Employment Type & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Employment Type"
              options={employmentTypeOptions}
              {...register('employmentType')}
              error={errors.employmentType?.message}
            />
            <Select
              label="Job Type"
              options={jobTypeOptions}
              {...register('jobType')}
              error={errors.jobType?.message}
            />
          </div>

          {/* Experience Level */}
          <div>
            <Select
              label="Experience Level"
              options={experienceLevelOptions}
              {...register('experienceLevel')}
              error={errors.experienceLevel?.message}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <Input
              label="Expiry Date"
              type="date"
              {...register('expiryDate')}
              error={errors.expiryDate?.message}
            />
          </div>

          {/* Salary Budget */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Salary Budget Min"
                type="number"
                placeholder="e.g. 80000"
                {...register('salaryBudget.min', { valueAsNumber: true })}
                error={errors.salaryBudget?.min?.message}
              />
              <Input
                label="Salary Budget Max"
                type="number"
                placeholder="e.g. 120000"
                {...register('salaryBudget.max', { valueAsNumber: true })}
                error={errors.salaryBudget?.max?.message}
              />
              <Input
                label="Currency Code"
                placeholder="USD"
                {...register('salaryBudget.currency')}
                error={errors.salaryBudget?.currency?.message}
              />
            </div>

            {/* Hide Salary Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('salaryRange.hideFromCandidates')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Hide salary from candidates</span>
              </label>
            </div>

            {/* Salary Type & Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Salary Type"
                options={salaryTypeOptions}
                {...register('salaryRange.type')}
                error={errors.salaryRange?.type?.message}
              />
              <Select
                label="Salary Period"
                options={salaryPeriodOptions}
                {...register('salaryRange.period')}
                error={errors.salaryRange?.period?.message}
              />
            </div>
          </div>

          {/* Leaderboard & Positions */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    {...register('leaderboard')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Leaderboard</span>
                </label>
              </div>
              <div>
                <Input
                  label="Positions"
                  type="number"
                  placeholder="1"
                  {...register('positions', { valueAsNumber: true })}
                  error={errors.positions?.message}
                />
              </div>
            </div>
          </div>

          {/* Hiring Manager & Assign Project/Client */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Team</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Hiring Manager Name"
                placeholder="e.g. John Doe"
                {...register('hiringManager.name')}
                error={errors.hiringManager?.name?.message}
              />
              <Input
                label="Hiring Manager Email"
                type="email"
                placeholder="john@example.com"
                {...register('hiringManager.email')}
                error={errors.hiringManager?.email?.message}
              />
              <Input
                label="Hiring Manager Phone"
                placeholder="+1234567890"
                {...register('hiringManager.phone')}
                error={errors.hiringManager?.phone?.message}
              />
            </div>

            <div>
              <Input
                label="Assign Project/Client"
                placeholder="e.g. Project Alpha"
                {...register('assignProjectClient')}
                error={errors.assignProjectClient?.message}
              />
            </div>
          </div>

          {/* Interviewers */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Interviewers</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInterviewer}
              >
                Add Interviewer
              </Button>
            </div>
            <div className="space-y-2">
              {interviewers.map((interviewer, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Input
                    value={interviewer.name}
                    onChange={(e) => handleUpdateInterviewer(index, 'name', e.target.value)}
                    placeholder="Name"
                  />
                  <Input
                    value={interviewer.email}
                    onChange={(e) => handleUpdateInterviewer(index, 'email', e.target.value)}
                    placeholder="Email"
                    type="email"
                  />
                  <Input
                    value={interviewer.role}
                    onChange={(e) => handleUpdateInterviewer(index, 'role', e.target.value)}
                    placeholder="Role"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInterviewer(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Questions */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Interview Questions</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInterviewQuestion}
              >
                Add Question
              </Button>
            </div>
            <div className="space-y-2">
              {interviewQuestions.length === 0 && (
                <p className="text-sm text-gray-500">No interview questions added yet</p>
              )}
              {interviewQuestions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <WysiwygEditor
                        value={question}
                        onChange={(value) => handleUpdateInterviewQuestion(index, value)}
                        placeholder="Enter interview question..."
                        toolbar="minimal"
                        minHeight={80}
                        maxHeight={150}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInterviewQuestion(index)}
                      className="self-start mt-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="submit" loading={isLoading}>
              Continue to Screening
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { JobDetailsForm };
