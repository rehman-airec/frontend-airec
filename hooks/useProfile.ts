import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { Candidate } from '@/types/user.types';
import toast from 'react-hot-toast';

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  totalExperience?: number;
  linkedinUrl?: string;
  profile?: {
    bio?: string;
    skills?: string[];
    education?: Array<{
      institution: string;
      degree: string;
      field: string;
      startYear: number;
      endYear?: number;
      isCurrent: boolean;
    }>;
    experience?: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description?: string;
    }>;
  };
}

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Candidate> => {
      const response = await api.get(API_ROUTES.PROFILE.GET);
      return response.data.candidate || response.data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProfileUpdateRequest): Promise<Candidate> => {
      const response = await api.put(API_ROUTES.PROFILE.UPDATE, data);
      return response.data.candidate || response.data.user;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

// Upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File): Promise<{ avatarUrl: string }> => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post(API_ROUTES.PROFILE.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated successfully');
    },
    onError: (error: any) => {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    },
  });
};

// Delete avatar
export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.delete(API_ROUTES.PROFILE.DELETE_AVATAR);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar removed successfully');
    },
    onError: (error: any) => {
      console.error('Avatar delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove avatar');
    },
  });
};

// Get profile statistics (view counts, completion percentage, etc.)
export const useProfileStats = () => {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async (): Promise<{
      profileViews: number;
      applicationsCount: number;
      profileCompletionPercentage: number;
      recentApplications: number;
    }> => {
      const response = await api.get(API_ROUTES.PROFILE.STATS);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
