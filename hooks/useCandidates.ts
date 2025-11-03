import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';

export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  totalExperience?: number;
  linkedinUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CandidateListResponse {
  success: boolean;
  data: Candidate[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface CandidateFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

/**
 * Get all candidates for admin
 */
export const useCandidates = (filters: CandidateFilters = {}) => {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: async (): Promise<CandidateListResponse> => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);

      const response = await api.get(`${API_ROUTES.CANDIDATES.LIST}?${params.toString()}`);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once on failure
  });
};

/**
 * Get candidate by ID
 */
export const useCandidate = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: async (): Promise<{ success: boolean; data: Candidate }> => {
      if (!id) {
        throw new Error('Candidate ID is required');
      }
      const response = await api.get(API_ROUTES.CANDIDATES.GET_BY_ID(id));
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Update candidate
 */
export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, files }: { id: string; data: Partial<Candidate>; files?: { resume?: File; coverLetter?: File } }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (files?.resume) formData.append('resume', files.resume);
      if (files?.coverLetter) formData.append('coverLetter', files.coverLetter);

      const response = await api.put(API_ROUTES.CANDIDATES.UPDATE(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
      toast.success('Candidate updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update candidate');
    },
  });
};

/**
 * Delete candidate
 */
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(API_ROUTES.CANDIDATES.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete candidate');
    },
  });
};

