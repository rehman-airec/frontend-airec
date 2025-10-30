import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { Job } from '@/types/job.types';
import toast from 'react-hot-toast';

export interface SavedJobsResponse {
  jobs: Job[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface SavedJobsFilters {
  page?: number;
  limit?: number;
}

// Get saved jobs
export const useSavedJobs = (filters: SavedJobsFilters = {}) => {
  return useQuery({
    queryKey: ['saved-jobs', filters],
    queryFn: async (): Promise<SavedJobsResponse> => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`${API_ROUTES.PROFILE.SAVED_JOBS}?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Save a job
export const useSaveJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string): Promise<void> => {
      await api.post(API_ROUTES.PROFILE.SAVE_JOB(jobId));
    },
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-saved', jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] }); // Refresh job lists to update save status
      toast.success('Job saved successfully');
    },
    onError: (error: any) => {
      console.error('Save job error:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    },
  });
};

// Unsave a job
export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string): Promise<void> => {
      await api.delete(API_ROUTES.PROFILE.UNSAVE_JOB(jobId));
    },
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-saved', jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] }); // Refresh job lists to update save status
      toast.success('Job removed from saved jobs');
    },
    onError: (error: any) => {
      console.error('Unsave job error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove job from saved jobs');
    },
  });
};

// Check if job is saved
export const useIsJobSaved = (jobId: string) => {
  return useQuery({
    queryKey: ['job-saved', jobId],
    queryFn: async (): Promise<boolean> => {
      const response = await api.get(API_ROUTES.PROFILE.CHECK_JOB_SAVED(jobId));
      return response.data.isSaved;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!jobId, // Only run if jobId is provided
  });
};

// Toggle save/unsave job
export const useToggleSaveJob = () => {
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();
  
  const toggleSaveJob = (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveJobMutation.mutate(jobId);
    } else {
      saveJobMutation.mutate(jobId);
    }
  };

  return {
    toggleSaveJob,
    isLoading: saveJobMutation.isPending || unsaveJobMutation.isPending,
  };
};
