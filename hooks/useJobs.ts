import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { Job, JobCreateRequest, JobUpdateRequest, JobPublishRequest, JobFilters, JobSearchResponse, NormalizedAdminJob } from '@/types/job.types';
import toast from 'react-hot-toast';
import { extractSubdomain } from '@/lib/tenantUtils';

// Get all jobs with filters
export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async (): Promise<JobSearchResponse> => {
      // In development, use Next.js API proxy to bypass CORS issues
      const useProxy = process.env.NODE_ENV === 'development';
      const endpoint = useProxy ? '/api/jobs' : API_ROUTES.JOBS.LIST;
      
      // For proxy routes, use fetch directly to avoid baseURL prepending
      if (useProxy && endpoint.startsWith('/api/')) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
        const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const subdomain = typeof window !== 'undefined' 
          ? extractSubdomain(window.location.hostname)
          : null;
        
        const fetchResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'x-tenant-subdomain': subdomain || '',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw new Error(`Proxy request failed: ${fetchResponse.status} - ${errorText}`);
        }
        
        return await fetchResponse.json();
      } else {
        // Use axios for backend routes
        const response = await api.get(API_ROUTES.JOBS.LIST, { params: filters });
        return response.data;
      }
    },
  });
};

// Get job by ID
export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async (): Promise<Job> => {
      const response = await api.get(API_ROUTES.JOBS.GET_BY_ID(id));
      return response.data.job;
    },
    enabled: !!id,
  });
};

// Get admin jobs
export const useAdminJobs = (filters: { page?: number; limit?: number; status?: string } = {}) => {
  return useQuery({
    queryKey: ['admin-jobs', filters],
    queryFn: async (): Promise<{ success: boolean; jobs: NormalizedAdminJob[]; pagination: { current: number; pages: number; total: number } }> => {
      // In development, use Next.js API proxy to bypass CORS issues
      const useProxy = process.env.NODE_ENV === 'development';
      const endpoint = useProxy ? '/api/jobs/admin/jobs' : API_ROUTES.JOBS.ADMIN_JOBS;
      
      // For proxy routes, use fetch directly to avoid baseURL prepending
      if (useProxy && endpoint.startsWith('/api/')) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
        const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
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
        const response = await api.get(API_ROUTES.JOBS.ADMIN_JOBS, { params: filters });
        return response.data;
      }
    },
  });
};

// Get admin job titles only (lightweight for filtering)
export const useAdminJobTitles = () => {
  return useQuery({
    queryKey: ['admin-job-titles'],
    queryFn: async (): Promise<{ success: boolean; jobs: Array<{ _id: string; title: string }> }> => {
      const response = await api.get(API_ROUTES.JOBS.ADMIN_JOB_TITLES);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

// Create job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JobCreateRequest): Promise<Job> => {
      const response = await api.post(API_ROUTES.JOBS.CREATE, data);
      return response.data.job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create job');
    },
  });
};

// Update job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobUpdateRequest }): Promise<Job> => {
      const response = await api.put(API_ROUTES.JOBS.UPDATE(id), data);
      return response.data.job;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update job');
    },
  });
};

// Update job step
export const useUpdateJobStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, step, data }: { id: string; step: string; data: any }): Promise<Job> => {
      const response = await api.put(API_ROUTES.JOBS.UPDATE_STEP(id, step), data);
      return response.data.job;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update job step');
    },
  });
};

// Publish job
export const usePublishJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobPublishRequest }): Promise<Job> => {
      const response = await api.post(API_ROUTES.JOBS.PUBLISH(id), data);
      return response.data.job;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job published successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish job');
    },
  });
};

// Close job
export const useCloseJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Job> => {
      const response = await api.post(API_ROUTES.JOBS.CLOSE(id));
      return response.data.job;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job closed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to close job');
    },
  });
};

// Delete job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(API_ROUTES.JOBS.DELETE(id));
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });
};

// Archive job
export const useArchiveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Job> => {
      const response = await api.post(API_ROUTES.JOBS.ARCHIVE(id));
      return response.data.job;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive job');
    },
  });
};
