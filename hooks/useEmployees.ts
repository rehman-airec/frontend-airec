import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';
import { extractSubdomain } from '@/lib/tenantUtils';

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'employee';
  tenantId: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeQuota {
  canAdd: boolean;
  current: number;
  max: number;
  remaining: number;
}

export interface EmployeeListResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * Get all employees for the current tenant
 */
export const useEmployees = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['employees', page, limit],
    queryFn: async (): Promise<EmployeeListResponse> => {
      // In development, use Next.js API proxy to bypass CORS issues
      const useProxy = process.env.NODE_ENV === 'development';
      const endpoint = useProxy ? '/api/tenant/users' : API_ROUTES.EMPLOYEES.LIST;
      
      // For proxy routes, use fetch directly to avoid baseURL prepending
      if (useProxy && endpoint.startsWith('/api/')) {
        const queryParams = new URLSearchParams();
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
        const url = `${endpoint}?${queryParams.toString()}`;
        
        const subdomain = typeof window !== 'undefined' 
          ? extractSubdomain(window.location.hostname)
          : null;
        
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('token')
          : null;
        
        const headers: Record<string, string> = {
          'x-tenant-subdomain': subdomain || '',
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const fetchResponse = await fetch(url, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw { response: { status: fetchResponse.status, data: { message: errorText } } };
        }
        
        return await fetchResponse.json();
      } else {
        // Use axios for backend routes
        const response = await api.get(API_ROUTES.EMPLOYEES.LIST, {
          params: { page, limit },
        });
        return response.data;
      }
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once on failure
  });
};

/**
 * Get employee by ID
 */
export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async (): Promise<{ success: boolean; data: Employee }> => {
      const response = await api.get(API_ROUTES.EMPLOYEES.GET_BY_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get employee quota information
 */
export const useEmployeeQuota = () => {
  return useQuery({
    queryKey: ['employee-quota'],
    queryFn: async (): Promise<{ success: boolean; data: EmployeeQuota }> => {
      // In development, use Next.js API proxy to bypass CORS issues
      const useProxy = process.env.NODE_ENV === 'development';
      const endpoint = useProxy ? '/api/tenant/users/stats/quota' : API_ROUTES.EMPLOYEES.QUOTA;
      
      // For proxy routes, use fetch directly to avoid baseURL prepending
      if (useProxy && endpoint.startsWith('/api/')) {
        const subdomain = typeof window !== 'undefined' 
          ? extractSubdomain(window.location.hostname)
          : null;
        
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('token')
          : null;
        
        const headers: Record<string, string> = {
          'x-tenant-subdomain': subdomain || '',
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const fetchResponse = await fetch(endpoint, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw { response: { status: fetchResponse.status, data: { message: errorText } } };
        }
        
        return await fetchResponse.json();
      } else {
        // Use axios for backend routes
        const response = await api.get(API_ROUTES.EMPLOYEES.QUOTA);
        return response.data;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (quota doesn't change often)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once on failure
  });
};

/**
 * Create a new employee
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmployeeRequest): Promise<{ success: boolean; data: Employee; message: string }> => {
      const response = await api.post(API_ROUTES.EMPLOYEES.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-quota'] });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create employee';
      if (error.response?.status === 403 && message.includes('limit reached')) {
        toast.error('Employee limit reached. Contact product owner to upgrade.');
      } else {
        toast.error(message);
      }
    },
  });
};

/**
 * Delete an employee
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean; message: string }> => {
      const response = await api.delete(API_ROUTES.EMPLOYEES.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-quota'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    },
  });
};

