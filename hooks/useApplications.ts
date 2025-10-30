import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { 
  Application, 
  ApplicationWithJob, 
  ApplicationWithCandidate, 
  ApplicationApplyRequest, 
  ApplicationStatusUpdateRequest, 
  BulkStatusUpdateRequest, 
  ApplicationFilters,
  ApplicationStats,
  ApplicationAnalytics
} from '@/types/application.types';
import toast from 'react-hot-toast';

// Get candidate applications
export const useCandidateApplications = (filters: ApplicationFilters = {}) => {
  return useQuery({
    queryKey: ['candidate-applications', filters],
    queryFn: async (): Promise<{ applications: ApplicationWithJob[]; pagination: any }> => {
      const response = await api.get(API_ROUTES.APPLICATIONS.CANDIDATE_APPLICATIONS, { params: filters });
      return response.data;
    },
  });
};

// Get job applications (admin)
export const useJobApplications = (jobId: string, filters: ApplicationFilters = {}) => {
  return useQuery({
    queryKey: ['job-applications', jobId, filters],
    queryFn: async (): Promise<{ applications: ApplicationWithCandidate[]; pagination: any }> => {
      const response = await api.get(API_ROUTES.JOBS.APPLICATIONS(jobId), { params: filters });
      return response.data;
    },
    enabled: !!jobId,
  });
};

// Get application by ID (for candidates)
export const useApplication = (id: string, isAdmin: boolean = false) => {
  return useQuery({
    queryKey: ['application', id, isAdmin],
    queryFn: async (): Promise<ApplicationWithJob> => {
      const endpoint = isAdmin 
        ? API_ROUTES.APPLICATIONS.GET_BY_ID(id)
        : API_ROUTES.APPLICATIONS.CANDIDATE_GET_BY_ID(id);
      const response = await api.get(endpoint);
      return response.data.application;
    },
    enabled: !!id,
  });
};

// Apply for job
export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, data, file }: { jobId: string; data: ApplicationApplyRequest; file: File }): Promise<Application> => {
      console.log('Submitting application with data:', { jobId, data, file });
      
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobId', jobId);
      if (data.screeningAnswers) {
        console.log('Screening answers:', data.screeningAnswers);
        formData.append('screeningAnswers', JSON.stringify(data.screeningAnswers));
      }
      if (data.source) {
        formData.append('source', data.source);
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.post(API_ROUTES.APPLICATIONS.APPLY(jobId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Application submitted successfully');
    },
    onError: (error: any) => {
      console.error('Application submission error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });
};

// Update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ApplicationStatusUpdateRequest }): Promise<Application> => {
      const response = await api.put(API_ROUTES.APPLICATIONS.UPDATE_STATUS(id), data);
      return response.data.application;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
      toast.success('Application status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update application status');
    },
  });
};

// Add note to application
export const useAddApplicationNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }): Promise<Application> => {
      const response = await api.post(API_ROUTES.APPLICATIONS.ADD_NOTE(id), { note });
      return response.data.application;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Note added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add note');
    },
  });
};

// Update note in application
export const useUpdateApplicationNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, noteIndex, note }: { id: string; noteIndex: number; note: string }): Promise<Application> => {
      const response = await api.put(API_ROUTES.APPLICATIONS.UPDATE_NOTE(id, noteIndex), { note });
      return response.data.application;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Note updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update note');
    },
  });
};

// Bulk update application statuses
export const useBulkUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkStatusUpdateRequest): Promise<void> => {
      await api.put(API_ROUTES.APPLICATIONS.BULK_UPDATE, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
      toast.success('Applications updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update applications');
    },
  });
};

// Get application stats (admin)
export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async (): Promise<ApplicationStats> => {
      const response = await api.get(API_ROUTES.APPLICATIONS.ADMIN_STATS);
      return response.data.stats;
    },
  });
};

// Get application analytics (admin)
export const useApplicationAnalytics = (filters: { jobId?: string; startDate?: string; endDate?: string } = {}) => {
  return useQuery({
    queryKey: ['application-analytics', filters],
    queryFn: async (): Promise<ApplicationAnalytics> => {
      const response = await api.get(API_ROUTES.APPLICATIONS.ADMIN_ANALYTICS, { params: filters });
      return response.data.analytics;
    },
  });
};
