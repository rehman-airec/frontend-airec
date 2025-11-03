import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
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
      const params: Record<string, string> = {};
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
      if (filters.search) params.search = filters.search;
      if (filters.includeDefaults !== undefined) params.includeDefaults = filters.includeDefaults.toString();
      if (filters.tags?.length) {
        // Handle array params properly
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => queryParams.append(key, value));
        filters.tags.forEach(tag => queryParams.append('tags', tag));
        const response = await api.get(`${API_ROUTES.SCREENING_TEMPLATES.LIST}?${queryParams.toString()}`);
        return response.data;
      }
      const response = await api.get(API_ROUTES.SCREENING_TEMPLATES.LIST, { params });
      return response.data;
    },
  });
};

// Get single template
export const useScreeningTemplate = (id: string) => {
  return useQuery({
    queryKey: ['screening-template', id],
    queryFn: async () => {
      const response = await api.get(API_ROUTES.SCREENING_TEMPLATES.GET_BY_ID(id));
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
      const response = await api.post(API_ROUTES.SCREENING_TEMPLATES.CREATE, data);
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
      const response = await api.put(API_ROUTES.SCREENING_TEMPLATES.UPDATE(id), data);
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
      const response = await api.delete(API_ROUTES.SCREENING_TEMPLATES.DELETE(id));
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
      const response = await api.post(API_ROUTES.SCREENING_TEMPLATES.INCREMENT_USAGE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screening-templates'] });
    },
  });
};

