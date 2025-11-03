import { create } from 'zustand';

interface UIState {
  // Sidebar states
  sidebarCollapsed: { [key: string]: boolean };
  setSidebarCollapsed: (key: string, collapsed: boolean) => void;
  
  // Modal states
  modals: { [key: string]: boolean };
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  toggleModal: (key: string) => void;
  
  // Tab states
  activeTabs: { [key: string]: string };
  setActiveTab: (key: string, tab: string) => void;
  
  // Form states
  formData: { [key: string]: any };
  setFormData: (key: string, data: any) => void;
  clearFormData: (key: string) => void;
  
  // Generic loading states
  loadingStates: { [key: string]: boolean };
  setLoading: (key: string, loading: boolean) => void;
  
  // Generic error states
  errorStates: { [key: string]: string | null };
  setError: (key: string, error: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: {},
  setSidebarCollapsed: (key, collapsed) =>
    set((state) => ({
      sidebarCollapsed: { ...state.sidebarCollapsed, [key]: collapsed },
    })),
  
  modals: {},
  openModal: (key) =>
    set((state) => ({
      modals: { ...state.modals, [key]: true },
    })),
  closeModal: (key) =>
    set((state) => ({
      modals: { ...state.modals, [key]: false },
    })),
  toggleModal: (key) =>
    set((state) => ({
      modals: { ...state.modals, [key]: !state.modals[key] },
    })),
  
  activeTabs: {},
  setActiveTab: (key, tab) =>
    set((state) => ({
      activeTabs: { ...state.activeTabs, [key]: tab },
    })),
  
  formData: {},
  setFormData: (key, data) =>
    set((state) => ({
      formData: { ...state.formData, [key]: data },
    })),
  clearFormData: (key) =>
    set((state) => {
      const newFormData = { ...state.formData };
      delete newFormData[key];
      return { formData: newFormData };
    }),
  
  loadingStates: {},
  setLoading: (key, loading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: loading },
    })),
  
  errorStates: {},
  setError: (key, error) =>
    set((state) => ({
      errorStates: { ...state.errorStates, [key]: error },
    })),
}));

