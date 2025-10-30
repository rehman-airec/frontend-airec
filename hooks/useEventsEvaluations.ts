import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

// Events hooks
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, eventData }: { applicationId: string; eventData: any }) => {
      const formData = new FormData();
      
      // Add basic event data
      formData.append('title', eventData.title);
      formData.append('attendees', JSON.stringify(eventData.attendees));
      formData.append('additionalEmails', JSON.stringify(eventData.additionalEmails || []));
      formData.append('candidateEmails', JSON.stringify(eventData.candidateEmails || []));
      formData.append('date', eventData.date);
      formData.append('startTime', eventData.startTime);
      formData.append('endTime', eventData.endTime);
      formData.append('location', eventData.location || '');
      formData.append('notes', eventData.notes || '');
      formData.append('privacyEnabled', String(eventData.privacyEnabled !== false)); // Default to true
      formData.append('sendEventDetails', String(eventData.sendEventDetails || false));
      if (eventData.emailTemplateId) {
        formData.append('emailTemplateId', eventData.emailTemplateId);
      }
      
      // Add attachments
      if (eventData.attachments && eventData.attachments.length > 0) {
        eventData.attachments.forEach((file: File, index: number) => {
          formData.append('attachments', file);
        });
      }
      
      const response = await api.post(`/applications/${applicationId}/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch events for this application
      queryClient.invalidateQueries({
        queryKey: ['applicationEvents', variables.applicationId]
      });
      // Also invalidate application details to update logs
      queryClient.invalidateQueries({
        queryKey: ['application', variables.applicationId]
      });
    },
  });
};

export const useApplicationEvents = (applicationId: string) => {
  return useQuery({
    queryKey: ['applicationEvents', applicationId],
    queryFn: async () => {
      const response = await api.get(`/applications/${applicationId}/events`);
      return response.data;
    },
    enabled: !!applicationId,
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, eventData }: { eventId: string; eventData: any }) => {
      const formData = new FormData();
      
      // Add basic event data
      Object.keys(eventData).forEach(key => {
        if (key === 'attachments') {
          if (eventData.attachments && eventData.attachments.length > 0) {
            eventData.attachments.forEach((file: File, index: number) => {
              formData.append('attachments', file);
            });
          }
        } else if (key === 'attendees' || key === 'additionalEmails') {
          formData.append(key, JSON.stringify(eventData[key]));
        } else {
          formData.append(key, eventData[key]);
        }
      });
      
      const response = await api.put(`/applications/events/${eventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate events queries
      queryClient.invalidateQueries({
        queryKey: ['applicationEvents']
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.delete(`/applications/events/${eventId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate events queries
      queryClient.invalidateQueries({
        queryKey: ['applicationEvents']
      });
    },
  });
};

// Evaluations hooks
export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, evaluationData }: { applicationId: string; evaluationData: any }) => {
      const response = await api.post(`/applications/${applicationId}/evaluations`, evaluationData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch evaluations for this application
      queryClient.invalidateQueries({
        queryKey: ['applicationEvaluations', variables.applicationId]
      });
      // Also invalidate application details to update logs
      queryClient.invalidateQueries({
        queryKey: ['application', variables.applicationId]
      });
      toast.success(data?.message || 'Evaluation added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create evaluation');
    },
  });
};

export const useApplicationEvaluations = (applicationId: string) => {
  return useQuery({
    queryKey: ['applicationEvaluations', applicationId],
    queryFn: async () => {
      const response = await api.get(`/applications/${applicationId}/evaluations`);
      return response.data;
    },
    enabled: !!applicationId,
  });
};

export const useEvaluationStats = (applicationId: string) => {
  return useQuery({
    queryKey: ['evaluationStats', applicationId],
    queryFn: async () => {
      const response = await api.get(`/applications/${applicationId}/evaluations/stats`);
      return response.data;
    },
    enabled: !!applicationId,
  });
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ evaluationId, evaluationData }: { evaluationId: string; evaluationData: any }) => {
      const response = await api.put(`/applications/evaluations/${evaluationId}`, evaluationData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate evaluations queries
      queryClient.invalidateQueries({
        queryKey: ['applicationEvaluations']
      });
      // Also invalidate application details to update logs
      const applicationId = data?.evaluation?.applicationId || variables.evaluationData?.applicationId;
      if (applicationId) {
        queryClient.invalidateQueries({
          queryKey: ['application', applicationId]
        });
      }
      toast.success('Evaluation updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update evaluation');
    },
  });
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (evaluationId: string) => {
      const response = await api.delete(`/applications/evaluations/${evaluationId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate evaluations queries
      queryClient.invalidateQueries({
        queryKey: ['applicationEvaluations']
      });
    },
  });
};
