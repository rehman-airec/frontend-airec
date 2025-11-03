import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';
import { useTenant as useTenantContext } from '@/providers/TenantProvider';

/**
 * Hook to access tenant context
 */
export const useTenant = useTenantContext;

/**
 * Tenant information type
 */
export interface TenantInfo {
  _id: string;
  name: string;
  subdomain: string;
  maxUsers: number;
  currentUsersCount: number;
  isActive: boolean;
  ownerUserId?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Hook for fetching all tenants (Super Admin only)
 */
export const useTenants = (filters?: { page?: number; limit?: number; isActive?: boolean; search?: string }) => {
  return useQuery({
    queryKey: ['tenants', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get(`${API_ROUTES.TENANT.LIST}?${params.toString()}`);
      return response.data;
    },
  });
};

/**
 * Hook for creating a tenant (Super Admin only)
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tenant: {
        name: string;
        subdomain: string;
        maxUsers?: number;
      };
      admin: {
        name: string;
        email: string;
        password: string;
      };
    }) => {
      const response = await api.post(API_ROUTES.TENANT.CREATE, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Tenant created successfully');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create tenant';
      toast.error(message);
    },
  });
};

/**
 * Hook for creating a tenant user (Tenant Admin only)
 */
export const useCreateTenantUser = () => {
  const queryClient = useQueryClient();
  const { tenant, refetch } = useTenant();

  return useMutation({
    mutationFn: async (data: {
      userType: 'admin' | 'candidate';
      userData: {
        name?: string; // for admin
        firstName?: string; // for candidate
        lastName?: string; // for candidate
        email: string;
        password: string;
        phone?: string; // for candidate
        role?: string; // for admin
      };
    }) => {
      const response = await api.post(API_ROUTES.TENANT.CREATE_USER, data);
      return response.data;
    },
    onSuccess: (data) => {
      const userType = data.data?.user ? (data.data.user.firstName ? 'candidate' : 'admin') : 'user';
      toast.success(`${userType === 'admin' ? 'Admin' : 'Candidate'} created successfully`);
      
      // Refetch tenant info to update quota
      if (tenant) {
        refetch();
      }
      
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create user';
      
      // Handle quota exceeded error specifically
      if (error.response?.data?.code === 'QUOTA_EXCEEDED' || message.includes('Quota')) {
        toast.error('Quota reached. Please contact the product owner.', {
          duration: 5000,
        });
      } else {
        toast.error(message);
      }
    },
  });
};

