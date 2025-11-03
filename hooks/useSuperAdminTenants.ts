import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';
import { TenantInfo } from './useTenant';

/**
 * Hook for updating a tenant (Super Admin only)
 */
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tenantId, 
      data 
    }: { 
      tenantId: string; 
      data: { name?: string; maxUsers?: number; isActive?: boolean } 
    }) => {
      const response = await api.put(API_ROUTES.TENANT.UPDATE(tenantId), data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Tenant updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update tenant';
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting a tenant (Super Admin only)
 * @param force - If true, performs hard delete (removes all data permanently)
 */
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tenantId, 
      force = false 
    }: { 
      tenantId: string; 
      force?: boolean 
    }) => {
      const url = force 
        ? `${API_ROUTES.TENANT.DELETE(tenantId)}?force=true`
        : API_ROUTES.TENANT.DELETE(tenantId);
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const message = variables.force 
        ? 'Tenant and all related data deleted permanently'
        : 'Tenant deactivated successfully';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete tenant';
      toast.error(message);
    },
  });
};

