import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export interface ScreeningQuestion {
  text: string;
  type: 'text' | 'multiple-choice' | 'yes-no' | 'rating';
  required: boolean;
  options?: string[];
  maxLength?: number;
  placeholder?: string;
}

export interface ScreeningTemplate {
  _id: string;
  name: string;
  description?: string;
  questions: ScreeningQuestion[];
  createdBy: string;
  isDefault: boolean;
  usageCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScreeningTemplateFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  includeDefaults?: boolean;
}

// Get all screening templates
export const useScreeningTemplates = (filters: ScreeningTemplateFilters = {}) => {
  return useQuery({
    queryKey: ['screening-templates', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.includeDefaults !== undefined) params.append('includeDefaults', filters.includeDefaults.toString());
      if (filters.tags?.length) filters.tags.forEach(tag => params.append('tags', tag));

      const response = await api.get(`/screening-templates?${params}`);
      return response.data;
    },
  });
};

// Get single template
export const useScreeningTemplate = (id: string) => {
  return useQuery({
    queryKey: ['screening-template', id],
    queryFn: async () => {
      const response = await api.get(`/screening-templates/${id}`);
      return response.data.template;
    },
    enabled: !!id,
  });
};

// Create template
export const useCreateScreeningTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; questions: ScreeningQuestion[]; tags?: string[] }) => {
      const response = await api.post('/screening-templates', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screening-templates'] });
      toast.success('Template saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save template');
    },
  });
};

// Update template
export const useUpdateScreeningTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<ScreeningTemplate, '_id'>> }) => {
      const response = await api.put(`/screening-templates/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screening-templates'] });
      toast.success('Template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update template');
    },
  });
};

// Delete template
export const useDeleteScreeningTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/screening-templates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screening-templates'] });
      toast.success('Template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete template');
    },
  });
};

// Increment usage
export const useIncrementTemplateUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/screening-templates/${id}/increment-usage`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screening-templates'] });
    },
  });
};

