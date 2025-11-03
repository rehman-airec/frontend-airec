'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Loader';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'recruiter' | 'candidate' | 'employee' | 'superadmin')[];
  redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo || '/auth/login');
        return;
      }
      
      if (user) {
        // Normalize roles: 'recruiter' should be treated as 'admin'
        const userRole = user.role === 'recruiter' ? 'admin' : user.role;
        const isAllowed = allowedRoles.some(role => {
          const normalizedRole = role === 'admin' ? ['admin', 'recruiter'] : [role];
          return normalizedRole.includes(userRole) || normalizedRole.includes(user.role);
        });
        
        if (!isAllowed) {
          // Redirect to appropriate dashboard based on user role
          if (user.role === 'superadmin') {
            // Superadmin should go to superadmin routes (main domain only)
            router.push('/superadmin');
          } else if (user.role === 'admin' || user.role === 'recruiter') {
            // Regular admins should go to admin routes
            router.push('/admin/dashboard');
          } else if (user.role === 'candidate') {
            // Candidates go to candidate routes
            router.push('/candidate/jobs/list');
          } else if (user.role === 'employee') {
            // Employees go to employee routes
            router.push('/employee/jobs/list');
          } else {
            router.push(redirectTo || '/auth/login');
          }
          return;
        }
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, router, pathname, redirectTo]);

  if (isLoading) {
    return <PageLoader message="Loading..." />;
  }

  if (!isAuthenticated || !user) {
    // Show loader while redirecting to login
    return <PageLoader message="Redirecting to login..." />;
  }

  // Normalize roles: 'recruiter' should be treated as 'admin'
  const userRole = user.role === 'recruiter' ? 'admin' : user.role;
  const isAllowed = allowedRoles.some(role => {
    if (role === 'admin') {
      // If allowed role is 'admin', also allow 'recruiter'
      return userRole === 'admin' || user.role === 'recruiter';
    }
    return userRole === role || user.role === role;
  });
  
  if (!isAllowed) {
    // Show loader while redirecting
    return <PageLoader message="Redirecting..." />;
  }

  return <>{children}</>;
};
