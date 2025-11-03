'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTenantUser, useTenant } from '@/hooks/useTenant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TenantQuotaDisplay } from './TenantQuotaDisplay';

const createUserSchema = z.object({
  userType: z.enum(['admin', 'candidate']),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['recruiter', 'superadmin']).optional(),
}).refine((data) => {
  if (data.userType === 'admin') {
    return !!data.name;
  }
  return !!(data.firstName && data.lastName);
}, {
  message: 'Required fields are missing',
  path: ['userType'],
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateTenantUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * CreateTenantUserForm Component
 * Form for creating a new user (admin or candidate) within a tenant
 */
export const CreateTenantUserForm: React.FC<CreateTenantUserFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { tenant, isLoading: tenantLoading } = useTenant();
  const createUserMutation = useCreateTenantUser();

  const [userType, setUserType] = useState<'admin' | 'candidate'>('admin');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userType: 'admin',
    },
  });

  const watchedUserType = watch('userType');

  React.useEffect(() => {
    setUserType(watchedUserType || 'admin');
  }, [watchedUserType, setValue]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const userData: any = {
        email: data.email,
        password: data.password,
      };

      if (data.userType === 'admin') {
        userData.name = data.name;
        userData.role = data.role || 'recruiter';
      } else {
        userData.firstName = data.firstName;
        userData.lastName = data.lastName;
        userData.phone = data.phone;
      }

      await createUserMutation.mutateAsync({
        userType: data.userType,
        userData,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  if (tenantLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!tenant) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            Tenant context required. Please access this page from a tenant subdomain.
          </p>
        </CardContent>
      </Card>
    );
  }

  const remainingUsers = tenant.maxUsers - tenant.currentUsersCount;

  return (
    <>
      {/* Quota Display */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <TenantQuotaDisplay
            currentUsersCount={tenant.currentUsersCount}
            maxUsers={tenant.maxUsers}
            showDetails={true}
          />
          {remainingUsers === 0 && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              Quota reached. Please contact the product owner to increase your limit.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Create User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label="User Type *"
              options={[
                { value: 'admin', label: 'Admin/Recruiter' },
                { value: 'candidate', label: 'Candidate' },
              ]}
              {...register('userType')}
              error={errors.userType?.message}
            />

            {userType === 'admin' ? (
              <>
                <Input
                  label="Name *"
                  placeholder="Enter full name"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Select
                  label="Role *"
                  options={[
                    { value: 'recruiter', label: 'Recruiter' },
                  ]}
                  {...register('role')}
                  error={errors.role?.message}
                  defaultValue="recruiter"
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    placeholder="Enter first name"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name *"
                    placeholder="Enter last name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                  />
                </div>
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1234567890"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </>
            )}

            <Input
              label="Email *"
              type="email"
              placeholder="user@company.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Password *"
              type="password"
              placeholder="Create a password"
              {...register('password')}
              error={errors.password?.message}
              helperText="Minimum 6 characters"
            />

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
                loading={createUserMutation.isPending}
                disabled={remainingUsers === 0}
              >
                Create User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

