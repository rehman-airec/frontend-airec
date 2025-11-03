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
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTenantUrl, extractSubdomain } from '@/lib/tenantUtils';
import { useAuthFormsStore } from '@/stores/authFormsStore';

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
  const { loginLoading, setLoginLoading } = useAuthFormsStore();

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
    setLoginLoading(true);
    try {
      // In development, use Next.js API proxy to bypass CORS issues
      const useProxy = process.env.NODE_ENV === 'development';
      const backendEndpoint = data.role === 'admin' 
        ? API_ROUTES.AUTH.ADMIN_LOGIN 
        : API_ROUTES.AUTH.CANDIDATE_LOGIN;
      const endpoint = useProxy 
        ? (data.role === 'admin' ? '/api/auth/admin/login' : '/api/auth/candidate/login')
        : backendEndpoint;
      
      const requestData = {
        email: data.email,
        password: data.password,
      };
      
      let response;
      // For proxy routes, use fetch directly to avoid baseURL prepending
      if (useProxy && endpoint.startsWith('/api/')) {
        const subdomain = typeof window !== 'undefined' 
          ? extractSubdomain(window.location.hostname)
          : null;
        
        const fetchResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'x-tenant-subdomain': subdomain || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include',
        });
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText || 'Login failed' };
          }
          throw { response: { data: errorData, status: fetchResponse.status } };
        }
        
        response = { data: await fetchResponse.json() };
      } else {
        // Use axios for backend routes
        response = await api.post(backendEndpoint, requestData);
      }

      if (response.data.success) {
        const token = response.data.accessToken || response.data.token;
        const userData = response.data.admin || response.data.candidate || response.data.user;
        
        // Get actual role from backend (prioritize backend role over form selection)
        const actualRole = userData.role || data.role;
        
        // Map backend user structure to frontend user structure
        // Handle tenantId - it might be an object (populated) or just an ID string
        const tenantId = userData.tenantId?._id || userData.tenantId;
        
        const user = {
          _id: userData.id || userData._id,
          email: userData.email,
          role: actualRole, // Use actual role from backend
          name: userData.name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: userData.isActive ?? true,
          tenantId: tenantId,
          createdAt: userData.createdAt ?? new Date().toISOString(),
          updatedAt: userData.updatedAt ?? new Date().toISOString()
        };
        
        // Save token and user - login() handles both now
        login(user, token);
        
        toast.success('Login successful');
        
        // Small delay to ensure localStorage is persisted before redirect
        // This is important for cross-subdomain redirects
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on actual role from backend
        if (actualRole === 'superadmin') {
          // Superadmin should always stay on main domain (no subdomain)
          router.push('/superadmin');
        } else if (actualRole === 'admin' || actualRole === 'recruiter') {
          // Admin/recruiter users should be redirected to their tenant subdomain
          // Check if user has a tenantId (tenant admin/recruiter)
          // tenantId might be an object (populated) or just an ID
          const hasTenantId = userData.tenantId && (userData.tenantId._id || userData.tenantId);
          
          // Check if user is already on a tenant subdomain
          const currentSubdomain = typeof window !== 'undefined' 
            ? extractSubdomain(window.location.hostname)
            : null;
          
          if (hasTenantId || user.tenantId) {
            // This is a tenant admin/recruiter - need to get their tenant subdomain
            // The backend should include tenant info in the response
            const tenantSubdomain = userData.tenant?.subdomain || userData.subdomain;
            
            if (tenantSubdomain) {
              // If already on the correct tenant subdomain, just navigate
              if (currentSubdomain === tenantSubdomain) {
                console.log('Already on correct tenant subdomain, navigating to dashboard');
                router.push('/admin/dashboard');
              } else {
                // Need to redirect to different tenant subdomain
                const tenantAdminUrl = getTenantUrl(tenantSubdomain, '/admin/dashboard');
                console.log('Redirecting admin/recruiter to tenant subdomain:', tenantAdminUrl, 'Subdomain:', tenantSubdomain);
                // Use window.location for full redirect (cross-subdomain)
                window.location.href = tenantAdminUrl;
              }
              return;
            } else {
              console.warn('Admin/recruiter has tenantId but no subdomain in response:', userData);
            }
          }
          
          // If already on a tenant subdomain or no tenant info, navigate to dashboard
          // (user is already on the right subdomain or will go to main domain)
          router.push('/admin/dashboard');
        } else if (actualRole === 'candidate') {
          // Candidates redirect to candidate routes
          if (user.tenantId) {
            const tenantSubdomain = userData.tenant?.subdomain || userData.subdomain;
            if (tenantSubdomain) {
              const tenantCandidateUrl = getTenantUrl(tenantSubdomain, '/candidate/jobs/list');
              window.location.href = tenantCandidateUrl;
              return;
            }
          }
          router.push('/candidate/jobs/list');
        } else if (actualRole === 'employee') {
          // Employees redirect to employee routes
          if (user.tenantId) {
            const tenantSubdomain = userData.tenant?.subdomain || userData.subdomain;
            if (tenantSubdomain) {
              const tenantEmployeeUrl = getTenantUrl(tenantSubdomain, '/employee/jobs/list');
              window.location.href = tenantEmployeeUrl;
              return;
            }
          }
          router.push('/employee/jobs/list');
        } else {
          // Fallback to old behavior for backward compatibility
          if (data.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/candidate/jobs/list');
          }
        }
        
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
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
            loading={loginLoading}
          >
            Sign In
          </Button>
        </form>
        <div className="mt-3 text-right">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </div>

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
