'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResumeUploadForm } from '@/components/forms/ResumeUploadForm';
import { ParsedCVData } from '@/hooks/useCVParsing';
import { Sparkles, User, FileText } from 'lucide-react';

interface CandidateInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalExperience: number;
  linkedinUrl: string;
}

interface GuestApplicationFormProps {
  onSubmit: (candidateInfo: CandidateInfo, resumeFile: File) => void;
  onBack?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CandidateInfo>;
  showGuestNote?: boolean;
  isAuthenticated?: boolean;
}

const GuestApplicationForm: React.FC<GuestApplicationFormProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
  initialData,
  showGuestNote = true,
  isAuthenticated = false
}) => {
  const [formData, setFormData] = useState<CandidateInfo>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    totalExperience: initialData?.totalExperience || 0,
    linkedinUrl: initialData?.linkedinUrl || ''
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateInfo, string>>>({});
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Handle auto-fill from CV parsing
  const handleAutoFill = (parsedData: ParsedCVData) => {
    console.log('handleAutoFill called with data:', parsedData);
    setFormData(prev => ({
      ...prev,
      firstName: parsedData.firstName || prev.firstName,
      lastName: parsedData.lastName || prev.lastName,
      email: parsedData.email || prev.email,
      phone: parsedData.phone || prev.phone,
      totalExperience: parsedData.totalExperience ?? prev.totalExperience,
      linkedinUrl: parsedData.linkedinUrl || prev.linkedinUrl,
    }));
    setIsAutoFilled(true);
    
    // Clear errors for auto-filled fields
    setErrors(prev => ({
      ...prev,
      firstName: parsedData.firstName ? undefined : prev.firstName,
      lastName: parsedData.lastName ? undefined : prev.lastName,
      email: parsedData.email ? undefined : prev.email,
      phone: parsedData.phone ? undefined : prev.phone,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CandidateInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.totalExperience < 0) {
      newErrors.totalExperience = 'Experience cannot be negative';
    }

  if (formData.linkedinUrl && formData.linkedinUrl.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(formData.linkedinUrl)) {
    newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && resumeFile) {
      onSubmit(formData, resumeFile);
    }
  };

  const handleInputChange = (field: keyof CandidateInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear auto-fill indicator when user manually edits
    if (isAutoFilled) {
      setIsAutoFilled(false);
    }
  };

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };

  const experienceOptions = Array.from({ length: 51 }, (_, i) => ({
    value: String(i),
    label: i === 0 ? 'No experience' : `${i} year${i === 1 ? '' : 's'}`
  }));

  return (
    <div className="space-y-6">
      {/* Resume Upload Section */}
      <ResumeUploadForm
        onUpload={handleResumeUpload}
        onAutoFill={handleAutoFill}
        isLoading={isLoading}
        uploadedFile={resumeFile}
        showAutoFill={true}
      />

      {/* Personal Information Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
              <p className="text-gray-600">
                {isAuthenticated 
                  ? 'Review your information and upload your resume to continue.'
                  : 'Please provide your contact information to complete the application.'
                }
              </p>
            </div>
            {isAutoFilled && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Sparkles className="h-4 w-4" />
                <span>Auto-filled from resume</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  error={errors.firstName}
                  disabled={isLoading}
                  className={isAutoFilled && formData.firstName ? 'border-green-300 bg-green-50' : ''}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  error={errors.lastName}
                  disabled={isLoading}
                  className={isAutoFilled && formData.lastName ? 'border-green-300 bg-green-50' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  error={errors.email}
                  disabled={isLoading}
                  className={isAutoFilled && formData.email ? 'border-green-300 bg-green-50' : ''}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  error={errors.phone}
                  disabled={isLoading}
                  className={isAutoFilled && formData.phone ? 'border-green-300 bg-green-50' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalExperience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <Select
                  id="totalExperience"
                  value={isNaN(formData.totalExperience) ? '' : String(formData.totalExperience)}
                  onChange={(e) => handleInputChange('totalExperience', parseInt(e.target.value) || 0)}
                  options={experienceOptions}
                  placeholder="Select your experience level"
                  error={errors.totalExperience}
                  disabled={isLoading}
                  className={isAutoFilled && formData.totalExperience ? 'border-green-300 bg-green-50' : ''}
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile (Optional)
                </label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={errors.linkedinUrl}
                  disabled={isLoading}
                  className={isAutoFilled && formData.linkedinUrl ? 'border-green-300 bg-green-50' : ''}
                />
              </div>
            </div>

            {/* Cover Letter Upload (Optional) */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Cover letter upload coming soon
                </p>
              </div>
            </div>

            {/* Only show guest note if enabled */}
            {showGuestNote && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                        You're applying as a guest. After submitting your application, you'll receive a tracking link via email. 
                        You can also create an account later for full access to your applications and job recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {onBack && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Back to Job Details
                </Button>
              )}
              <Button 
                type="submit" 
                loading={isLoading}
                disabled={isLoading || !resumeFile}
                className={onBack ? '' : 'ml-auto'}
              >
                Continue to Screening
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { GuestApplicationForm };