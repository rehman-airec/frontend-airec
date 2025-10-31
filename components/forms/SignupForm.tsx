'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { setToken } from '@/lib/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'candidate']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'candidate') {
    return !!(data.firstName && data.firstName.length >= 2 && data.lastName && data.lastName.length >= 2);
  }
  if (data.role === 'admin') {
    return !!(data.name && data.name.length >= 2);
  }
  return true;
}, {
  message: "Required fields are missing for this role",
  path: ['name'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'candidate',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    setIsLoading(true);
    try {
      const endpoint = data.role === 'admin' 
        ? API_ROUTES.AUTH.ADMIN_SIGNUP 
        : API_ROUTES.AUTH.CANDIDATE_SIGNUP;

      const payload = data.role === 'admin' 
        ? {
            email: data.email,
            password: data.password,
            name: data.name,
          }
        : {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          };

      console.log('Making API call to:', endpoint, payload);
      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        const token = response.data.accessToken || response.data.token;
        const userData = response.data.admin || response.data.candidate || response.data.user;
        
        // Map backend user structure to frontend user structure
        const user = {
          _id: userData.id || userData._id,
          email: userData.email,
          role: data.role, // Use the role from the form
          name: userData.name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: userData.isActive ?? true,
          createdAt: userData.createdAt ?? new Date().toISOString(),
          updatedAt: userData.updatedAt ?? new Date().toISOString()
        };
        
        setToken(token);
        login(user, token);
        toast.success('Account created successfully');
        
        // Redirect based on role
        if (data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/candidate/jobs/list');
        }
        
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'candidate', label: 'Candidate' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Go back to home link */}
      <div className="mb-4 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Go back to home page
        </Link>
      </div>
      
      <Card className="w-full">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log('Form validation errors:', errors);
          toast.error('Please fill in all required fields');
        })} className="space-y-4">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              <strong>Validation errors:</strong> Please fix the errors below before submitting.
              <ul className="mt-1 list-disc list-inside">
                {Object.entries(errors).map(([field, err]: [string, any]) => (
                  <li key={field}>{field}: {err?.message || 'Invalid'}</li>
                ))}
              </ul>
            </div>
          )}
          <Select
            label="Role"
            options={roleOptions}
            {...register('role', { required: 'Please select a role' })}
            error={errors.role?.message}
          />
          
          {selectedRole === 'admin' ? (
            <Input
              label="Full Name *"
              placeholder="Enter your full name"
              {...register('name', { required: 'Full name is required' })}
              error={errors.name?.message}
              required
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            error={errors.email?.message}
          />
          
          {selectedRole === 'candidate' && (
            <Input
              label="Phone"
              type="tel"
              placeholder="Enter your phone number"
              {...register('phone')}
              error={errors.phone?.message}
            />
          )}
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            onClick={(e) => {
              console.log('Button clicked');
              const form = e.currentTarget.closest('form');
              console.log('Form validity:', form?.checkValidity());
              console.log('Form errors state:', errors);
              console.log('Current form values:', watch());
            }}
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </CardContent>
      </Card>
    </div>
  );
};

export { SignupForm };
