import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useGlobalAlert } from '@/providers/AlertProvider';

interface GuestApplicationData {
  jobId: string;
  candidateInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    totalExperience: number;
    linkedinUrl?: string;
  };
  screeningAnswers?: any[];
  source?: string;
}

interface GuestApplicationResponse {
  success: boolean;
  message: string;
  application: {
    id: string;
    guestApplicationId: string;
    jobId: string;
    status: string;
    appliedAt: string;
    trackingToken: string;
  };
}

interface ConvertToUserData {
  trackingToken: string;
  password: string;
}

interface ConvertToUserResponse {
  success: boolean;
  message: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Hook for applying as guest
export const useApplyAsGuest = () => {
  const { showError } = useGlobalAlert();

  return useMutation<GuestApplicationResponse, Error, { data: GuestApplicationData; file: File }>({
    mutationFn: async ({ data, file }) => {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobId', data.jobId);
      
      // Send candidateInfo as JSON string
      formData.append('candidateInfo', JSON.stringify(data.candidateInfo));
      
      formData.append('screeningAnswers', JSON.stringify(data.screeningAnswers || []));
      formData.append('source', data.source || 'company_website');

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await api.post(`/guest/jobs/${data.jobId}/apply/guest`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error: any) {
        console.error('Guest application submission error:', error);
        
        // Extract detailed error messages
        let errorMessage = 'Failed to submit application';
        
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          const errorMessages = error.response.data.errors
            .map((err: any) => `${err.path}: ${err.msg}`)
            .join('\n');
          errorMessage = errorMessages;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        // Show error in alert modal
        showError('Application Failed', errorMessage);
        
        throw error;
      }
    },
  });
};

// Hook for getting guest application by tracking token
export const useGuestApplicationByToken = (trackingToken: string) => {
  return useQuery({
    queryKey: ['guestApplication', trackingToken],
    queryFn: async () => {
      const response = await api.get(`/guest/track/${trackingToken}`);
      return response.data;
    },
    enabled: !!trackingToken,
  });
};

// Hook for getting guest applications by email
export const useGuestApplicationsByEmail = (email: string) => {
  return useQuery({
    queryKey: ['guestApplications', email],
    queryFn: async () => {
      const response = await api.get(`/guest/applications/${email}`);
      return response.data;
    },
    enabled: !!email,
  });
};

// Hook for converting guest to user
export const useConvertGuestToUser = () => {
  return useMutation<ConvertToUserResponse, Error, ConvertToUserData>({
    mutationFn: async (data) => {
      const response = await api.post('/guest/convert-to-user', data);
      return response.data;
    },
  });
};
