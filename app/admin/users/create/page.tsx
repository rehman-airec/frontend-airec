'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEmployee, useEmployeeQuota } from '@/hooks/useEmployees';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { TenantContextGuard } from '@/components/jobs';

// Validation schema
const createEmployeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(30, 'First name cannot exceed 30 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(30, 'Last name cannot exceed 30 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

/**
 * Create Employee Page
 * 
 * Form to create a new employee for the current tenant.
 * Only accessible by tenant admins.
 */
const CreateEmployeePage: React.FC = () => {
  const router = useRouter();
  const { tenant } = useTenant();
  const { data: quotaData } = useEmployeeQuota();
  const createEmployeeMutation = useCreateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const quota = quotaData?.data || { canAdd: true, current: 0, max: 0, remaining: 0 };

  const onSubmit = async (data: CreateEmployeeFormData) => {
    if (!quota.canAdd) {
      return;
    }

    try {
      await createEmployeeMutation.mutateAsync(data);
      router.push('/admin/users');
    } catch (error) {
      // Error handled by mutation's onError
    }
  };

  return (
    <TenantContextGuard>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserPlus className="h-8 w-8 mr-3 text-blue-600" />
              Create New Employee
            </h1>
            <p className="text-gray-600 mt-2">
              Add a new employee to {tenant?.name || 'your company'}
            </p>
          </div>

          {/* Quota Warning */}
          {!quota.canAdd && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-medium text-red-900">
                      Employee Limit Reached
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      You have reached your employee limit ({quota.max}). Please contact the product owner to upgrade.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    disabled={!quota.canAdd || isSubmitting}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    disabled={!quota.canAdd || isSubmitting}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={!quota.canAdd || isSubmitting}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-gray-500">(Optional)</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    disabled={!quota.canAdd || isSubmitting}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                    disabled={!quota.canAdd || isSubmitting}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum 6 characters
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!quota.canAdd || isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Employee'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quota Info */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">
                <strong>Employee Quota:</strong> {quota.current} of {quota.max} employees
                {quota.canAdd && <span className="text-green-600 ml-2">({quota.remaining} slots available)</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TenantContextGuard>
  );
};

export default CreateEmployeePage;

