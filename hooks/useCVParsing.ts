import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';

// Types for CV parsing
export interface ParsedCVData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  totalExperience: number;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number | null;
    endYear: number | null;
    isCurrent: boolean;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  summary: string;
  languages: string[];
  certifications: string[];
}

export interface CVParsingResponse {
  success: boolean;
  message: string;
  data: ParsedCVData;
  filename: string;
}

export interface CVValidationResponse {
  success: boolean;
  message: string;
  filename: string;
  size: number;
}

/**
 * Hook for CV parsing functionality
 */
export const useCVParsing = () => {
  // Parse CV mutation
  const parseCVMutation = useMutation({
    mutationFn: async (file: File): Promise<CVParsingResponse> => {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post(API_ROUTES.CV_PARSING.PARSE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success('CV parsed successfully! Fields have been auto-filled.');
    },
    onError: (error: any) => {
      console.error('CV Parsing Error:', error);
      toast.error(error.response?.data?.message || 'Failed to parse CV');
    },
  });

  // Validate CV mutation
  const validateCVMutation = useMutation({
    mutationFn: async (file: File): Promise<CVValidationResponse> => {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post(API_ROUTES.CV_PARSING.VALIDATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onError: (error: any) => {
      console.error('CV Validation Error:', error);
      toast.error(error.response?.data?.message || 'Invalid CV file');
    },
  });

  return {
    parseCV: parseCVMutation.mutate,
    parseCVAsync: parseCVMutation.mutateAsync,
    validateCV: validateCVMutation.mutate,
    isParsing: parseCVMutation.isPending,
    isValidating: validateCVMutation.isPending,
    parsingError: parseCVMutation.error,
    validationError: validateCVMutation.error,
    parsedData: parseCVMutation.data?.data,
  };
};

/**
 * Hook for CV parsing with auto-fill functionality
 */
export const useCVParsingWithAutoFill = (onAutoFill: (data: ParsedCVData) => void) => {
  const cvParsing = useCVParsing();

  const parseCVWithAutoFill = async (file: File) => {
    try {
      console.log('Starting CV parsing for auto-fill...');
      const result = await cvParsing.parseCVAsync(file);
      console.log('CV parsing result:', result);
      if (result?.data) {
        console.log('Calling onAutoFill with data:', result.data);
        onAutoFill(result.data);
      } else {
        console.warn('No data in parsing result');
      }
    } catch (error) {
      console.error('Auto-fill failed:', error);
    }
  };

  return {
    ...cvParsing,
    parseCVWithAutoFill,
  };
};
