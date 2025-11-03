import { create } from 'zustand';
import { JobFilters } from '@/types/job.types';

interface JobState {
  // Job filters
  filters: JobFilters;
  setFilters: (filters: JobFilters | ((prev: JobFilters) => JobFilters)) => void;
  resetFilters: () => void;
  
  // Job creation state
  currentStep: number;
  jobData: Partial<any>;
  jobId: string | null;
  setCurrentStep: (step: number) => void;
  setJobData: (data: Partial<any>) => void;
  setJobId: (id: string | null) => void;
  resetJobCreation: () => void;
  
  // Job list state
  isNavigating: boolean;
  applyingJobId: string | null;
  setIsNavigating: (navigating: boolean) => void;
  setApplyingJobId: (id: string | null) => void;
}

export const useJobStore = create<JobState>((set) => ({
  filters: {
    page: 1,
    limit: 12,
  },
  setFilters: (filters) =>
    set((state) => ({
      filters: typeof filters === 'function' ? filters(state.filters) : filters,
    })),
  resetFilters: () =>
    set({
      filters: {
        page: 1,
        limit: 12,
      },
    }),
  
  currentStep: 1,
  jobData: {
    jobFunctions: [],
    toolsTechnologies: [],
    educationCertifications: [],
    skills: [],
    screeningQuestions: [],
    hiringTeam: [],
    workflow: ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected'],
  },
  jobId: null,
  setCurrentStep: (step) => set({ currentStep: step }),
  setJobData: (data) =>
    set((state) => ({
      jobData: { ...state.jobData, ...data },
    })),
  setJobId: (id) => set({ jobId: id }),
  resetJobCreation: () =>
    set({
      currentStep: 1,
      jobData: {
        jobFunctions: [],
        toolsTechnologies: [],
        educationCertifications: [],
        skills: [],
        screeningQuestions: [],
        hiringTeam: [],
        workflow: ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected'],
      },
      jobId: null,
    }),
  
  isNavigating: false,
  applyingJobId: null,
  setIsNavigating: (navigating) => set({ isNavigating: navigating }),
  setApplyingJobId: (id) => set({ applyingJobId: id }),
}));

