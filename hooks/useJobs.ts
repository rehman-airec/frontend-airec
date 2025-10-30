import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { Job, JobCreateRequest, JobUpdateRequest, JobPublishRequest, JobFilters, JobSearchResponse, NormalizedAdminJob } from '@/types/job.types';
import toast from 'react-hot-toast';

// Get all jobs with filters
export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async (): Promise<JobSearchResponse> => {
      const response = await api.get(API_ROUTES.JOBS.LIST, { params: filters });
      return response.data;
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
      const response = await api.get(API_ROUTES.JOBS.ADMIN_JOBS, { params: filters });
      return response.data;
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
