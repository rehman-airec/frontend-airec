'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';

interface TenantJobErrorHandlerProps {
  error: any;
  jobId?: string;
  onBack?: () => void;
}

/**
 * TenantJobErrorHandler Component
 * 
 * Handles tenant-related errors when accessing jobs.
 * Shows appropriate messages for 403 Forbidden errors.
 */
export const TenantJobErrorHandler: React.FC<TenantJobErrorHandlerProps> = ({
  error,
  jobId,
  onBack,
}) => {
  const router = useRouter();
  const { tenant } = useTenant();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (error?.response?.status === 403) {
      const message = error.response?.data?.message || 'Access denied';
      if (message.includes('does not belong to your company')) {
        setErrorMessage('This job belongs to a different company and cannot be accessed from your current subdomain.');
      } else {
        setErrorMessage(message);
      }
    } else if (error?.response?.status === 404) {
      setErrorMessage('The job you\'re looking for doesn\'t exist or has been removed.');
    } else {
      setErrorMessage(error?.message || 'An error occurred while loading the job.');
    }
  }, [error]);

  if (!error) return null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(tenant ? '/jobs' : '/');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Unable to Access Job
        </h3>
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>
        {error?.response?.status === 403 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm">
            <p className="font-medium text-yellow-900 mb-2">Why this happened:</p>
            <p className="text-yellow-800">
              Each company's jobs are isolated to their own subdomain. 
              You're currently viewing jobs for <strong>{tenant?.name || 'your company'}</strong>, 
              but this job belongs to a different company.
            </p>
          </div>
        )}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          {tenant && (
            <Button onClick={() => router.push('/jobs')}>
              View Available Jobs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

