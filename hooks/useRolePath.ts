import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to get the correct base path based on user role
 * Returns '/employee' for employees and '/candidate' for candidates
 */
export const useRolePath = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // If pathname starts with /employee, use employee paths
  // Otherwise use candidate paths
  const isEmployeeRoute = pathname?.startsWith('/employee');
  
  if (isEmployeeRoute || user?.role === 'employee') {
    return {
      base: '/employee',
      jobs: {
        list: '/employee/jobs/list',
        saved: '/employee/jobs/saved',
        apply: (jobId: string) => `/employee/jobs/apply/${jobId}`,
        view: (jobId: string) => `/employee/jobs/${jobId}`,
      },
      applications: {
        list: '/employee/applications',
        detail: (id: string) => `/employee/applications/${id}`,
      },
      profile: '/employee/profile',
      settings: '/employee/settings',
    };
  }

  return {
    base: '/candidate',
    jobs: {
      list: '/candidate/jobs/list',
      saved: '/candidate/jobs/saved',
      apply: (jobId: string) => `/candidate/jobs/apply/${jobId}`,
      view: (jobId: string) => `/candidate/jobs/${jobId}`,
    },
    applications: {
      list: '/candidate/applications',
      detail: (id: string) => `/candidate/applications/${id}`,
    },
    profile: '/candidate/profile',
    settings: '/candidate/settings',
  };
};

