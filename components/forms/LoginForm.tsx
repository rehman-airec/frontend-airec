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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'candidate']),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'candidate',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const endpoint = data.role === 'admin' 
        ? API_ROUTES.AUTH.ADMIN_LOGIN 
        : API_ROUTES.AUTH.CANDIDATE_LOGIN;

      const response = await api.post(endpoint, {
        email: data.email,
        password: data.password,
      });

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
        toast.success('Login successful');
        
        // Redirect based on role
        if (data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/candidate/jobs/list');
        }
        
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Role"
            options={roleOptions}
            {...register('role')}
            error={errors.role?.message}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </CardContent>
      </Card>
    </div>
  );
};

export { LoginForm };
