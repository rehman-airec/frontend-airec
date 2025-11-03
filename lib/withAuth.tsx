'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Loader';

/**
 * Role-based route protection HOC
 * 
 * Usage:
 * ```tsx
 * export default withAuth(['superadmin'])(SuperAdminDashboard);
 * ```
 * 
 * @param allowedRoles - Array of roles allowed to access the route
 * @param redirectTo - Optional custom redirect path (defaults to /auth/login)
 */
export default function withAuth<T extends Record<string, any> = {}>(
  allowedRoles: string[],
  redirectTo: string = '/auth/login'
) {
  return (Component: React.ComponentType<T>) => {
    const AuthenticatedComponent = (props: T & React.PropsWithChildren) => {
      const { user, isAuthenticated, isLoading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!isLoading) {
          // If not authenticated, redirect to login
          if (!isAuthenticated || !user) {
            router.push(redirectTo);
            return;
          }

          // If user role doesn't match allowed roles, redirect to appropriate dashboard
          if (!allowedRoles.includes(user.role)) {
            // Redirect based on user's actual role
            if (user.role === 'superadmin') {
              // Superadmin should always go to superadmin routes (main domain only)
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
              router.push(redirectTo);
            }
            return;
          }
        }
      }, [user, isAuthenticated, isLoading, router]);

      // Show loader while checking authentication
      if (isLoading) {
        return <PageLoader message="Checking authentication..." />;
      }

      // Don't render if not authenticated or wrong role
      if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
        return null;
      }

      return <Component {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
    return AuthenticatedComponent;
  };
}

/**
 * Server-side route protection (for Next.js pages with getServerSideProps)
 * 
 * Note: This is a client-side implementation. For true SSR protection,
 * you would need getServerSideProps with cookie/token verification.
 * 
 * Usage:
 * ```tsx
 * export const getServerSideProps = withAuthSSR(['superadmin']);
 * ```
 */
export function withAuthSSR(allowedRoles: string[]) {
  return async (context: any) => {
    // In a real implementation, you would:
    // 1. Get token from cookies/headers
    // 2. Verify JWT token
    // 3. Check user role from decoded token
    // 4. Return redirect if unauthorized

    // For now, this is a placeholder
    // You would need to implement actual SSR auth checking
    return {
      props: {},
    };
  };
}

