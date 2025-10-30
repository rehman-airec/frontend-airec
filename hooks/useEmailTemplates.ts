import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';

export interface EmailTemplate {
  _id: string;
  subject: string;
  body: string;
  description?: string;
  category: 'event' | 'interview' | 'general';
  isActive: boolean;
  variables?: string[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  lastModifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Get all email templates
export const useEmailTemplates = (category?: string) => {
  return useQuery({
    queryKey: ['emailTemplates', category],
    queryFn: async (): Promise<{ success: boolean; templates: EmailTemplate[] }> => {
      const params = category ? { category } : {};
      const response = await api.get('/email-templates', { params });
      return response.data;
    },
  });
};

// Get email template by ID
export const useEmailTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ['emailTemplate', templateId],
    queryFn: async (): Promise<{ success: boolean; template: EmailTemplate }> => {
      const response = await api.get(`/email-templates/${templateId}`);
      return response.data;
    },
    enabled: !!templateId,
  });
};

// Create email template
export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
      const response = await api.post('/email-templates', data);
      return response.data.template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create email template');
    },
  });
};

// Update email template
export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, data }: { templateId: string; data: Partial<EmailTemplate> }): Promise<EmailTemplate> => {
      const response = await api.put(`/email-templates/${templateId}`, data);
      return response.data.template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update email template');
    },
  });
};

// Delete email template
export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string): Promise<void> => {
      await api.delete(`/email-templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete email template');
    },
  });
};

