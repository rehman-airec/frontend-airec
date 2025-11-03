import { create } from 'zustand';

interface ApplicationState {
  // Applications list state
  selectedJobId: string;
  currentPage: number;
  pageSize: number;
  statusFilter: string;
  setSelectedJobId: (jobId: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setStatusFilter: (filter: string) => void;
  resetFilters: () => void;
  
  // Application details state
  activeTab: string;
  pendingStatus: string | null;
  setActiveTab: (tab: string) => void;
  setPendingStatus: (status: string | null) => void;
  
  // Resume viewer state
  showCvViewer: boolean;
  setShowCvViewer: (show: boolean) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  selectedJobId: 'all',
  currentPage: 1,
  pageSize: 10,
  statusFilter: '',
  setSelectedJobId: (jobId) => set({ selectedJobId: jobId, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  setStatusFilter: (filter) => set({ statusFilter: filter, currentPage: 1 }),
  resetFilters: () =>
    set({
      selectedJobId: 'all',
      currentPage: 1,
      pageSize: 10,
      statusFilter: '',
    }),
  
  activeTab: 'overview',
  pendingStatus: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPendingStatus: (status) => set({ pendingStatus: status }),
  
  showCvViewer: false,
  setShowCvViewer: (show) => set({ showCvViewer: show }),
}));

