import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';

export interface EvaluationCriteria {
  name: string;
  description?: string;
  weight?: number;
  ratingScale?: '1-5' | '1-10' | 'poor-excellent' | 'custom';
  required?: boolean;
}

export interface EvaluationTemplate {
  _id: string;
  name: string;
  description?: string;
  category?: 'technical' | 'hr' | 'behavioral' | 'coding' | 'design' | 'managerial' | 'general';
  criteria: EvaluationCriteria[];
  overallRatingScale?: '1-5' | '1-10' | 'poor-excellent';
  recommendationOptions?: string[];
  includeStrengths?: boolean;
  includeAreasOfInterest?: boolean;
  includeAdditionalNotes?: boolean;
  defaultInterviewType?: 'phone' | 'video' | 'in_person' | 'technical' | 'hr' | 'final';
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  usageCount?: number;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EvaluationTemplateResponse {
  success: boolean;
  templates: EvaluationTemplate[];
}

export interface EvaluationTemplateSingleResponse {
  success: boolean;
  template: EvaluationTemplate;
}

// Get all evaluation templates
export const useEvaluationTemplates = (filters?: {
  category?: string;
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery<EvaluationTemplateResponse>({
    queryKey: ['evaluation-templates', filters],
    queryFn: async () => {
      const response = await api.get(API_ROUTES.EVALUATION_TEMPLATES.LIST, {
        params: filters
      });
      return response.data;
    },
  });
};

// Get evaluation template by ID
export const useEvaluationTemplate = (id: string) => {
  return useQuery<EvaluationTemplateSingleResponse>({
    queryKey: ['evaluation-template', id],
    queryFn: async () => {
      const response = await api.get(API_ROUTES.EVALUATION_TEMPLATES.GET_BY_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Create evaluation template
export const useCreateEvaluationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData: Partial<EvaluationTemplate>) => {
      const response = await api.post(API_ROUTES.EVALUATION_TEMPLATES.CREATE, templateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-templates'] });
      toast.success('Evaluation template created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create template');
    },
  });
};

// Update evaluation template
export const useUpdateEvaluationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EvaluationTemplate> }) => {
      const response = await api.put(API_ROUTES.EVALUATION_TEMPLATES.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-templates'] });
      toast.success('Evaluation template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update template');
    },
  });
};

// Delete evaluation template
export const useDeleteEvaluationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(API_ROUTES.EVALUATION_TEMPLATES.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-templates'] });
      toast.success('Evaluation template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete template');
    },
  });
};

