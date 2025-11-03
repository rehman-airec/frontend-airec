'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTenant } from '@/hooks/useTenant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2, User } from 'lucide-react';
import { getTenantUrl } from '@/lib/tenantUtils';
import { getBaseDomainWithPort } from '@/lib/env';

const createTenantSchema = z.object({
  tenantName: z.string().min(2, 'Tenant name must be at least 2 characters').max(100, 'Tenant name cannot exceed 100 characters'),
  subdomain: z.string()
    .min(2, 'Subdomain must be at least 2 characters')
    .max(63, 'Subdomain cannot exceed 63 characters')
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/, 'Invalid subdomain format (alphanumeric and hyphens only)'),
  maxUsers: z.number().min(1, 'Max users must be at least 1'),
  adminName: z.string().min(2, 'Admin name must be at least 2 characters').max(50, 'Admin name cannot exceed 50 characters'),
  adminEmail: z.string().email('Invalid email address'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateTenantFormData = z.infer<typeof createTenantSchema>;

interface CreateTenantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * CreateTenantForm Component
 * Form for creating a new tenant and tenant admin account
 */
export const CreateTenantForm: React.FC<CreateTenantFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const createTenantMutation = useCreateTenant();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      maxUsers: 10,
      tenantName: '',
      subdomain: '',
      adminName: '',
      adminEmail: '',
      adminPassword: '',
    },
  });

  const subdomain = watch('subdomain');

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      await createTenantMutation.mutateAsync({
        tenant: {
          name: data.tenantName,
          subdomain: data.subdomain.toLowerCase(),
          maxUsers: data.maxUsers,
        },
        admin: {
          name: data.adminName,
          email: data.adminEmail,
          password: data.adminPassword,
        },
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Tenant Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tenant Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
            
            <Input
              label="Company Name *"
              placeholder="Enter company name"
              {...register('tenantName')}
              error={errors.tenantName?.message}
            />

            <div>
              <Input
                label="Subdomain *"
                placeholder="abc"
                {...register('subdomain')}
                error={errors.subdomain?.message}
              />
              {subdomain && (
                <p className="mt-1 text-sm text-gray-500">
                  Tenant URL: <span className="font-mono">{getTenantUrl(subdomain.toLowerCase())}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only alphanumeric characters and hyphens. Must be unique.
              </p>
            </div>

            <Input
              label="Maximum Users *"
              type="number"
              min={1}
              {...register('maxUsers', { valueAsNumber: true })}
              error={errors.maxUsers?.message}
              helperText="Maximum number of users allowed for this tenant"
            />
          </div>

          {/* Admin Account Details */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Tenant Admin Account
            </h3>

            <Input
              label="Admin Name *"
              placeholder="Enter admin full name"
              {...register('adminName')}
              error={errors.adminName?.message}
            />

            <Input
              label="Admin Email *"
              type="email"
              placeholder="admin@company.com"
              {...register('adminEmail')}
              error={errors.adminEmail?.message}
            />

            <Input
              label="Admin Password *"
              type="password"
              placeholder="Create a strong password"
              {...register('adminPassword')}
              error={errors.adminPassword?.message}
              helperText="Minimum 6 characters"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              loading={createTenantMutation.isPending}
            >
              Create Tenant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

