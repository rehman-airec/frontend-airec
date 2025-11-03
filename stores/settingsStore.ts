import { create } from 'zustand';

interface SettingsState {
  activeTab: string;
  loading: boolean;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Change password form state
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submitting: boolean;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setSubmitting: (submitting: boolean) => void;
  setShowCurrent: (show: boolean) => void;
  setShowNew: (show: boolean) => void;
  setShowConfirm: (show: boolean) => void;
  resetPasswordForm: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeTab: 'account',
  loading: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ loading }),
  
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  submitting: false,
  showCurrent: false,
  showNew: false,
  showConfirm: false,
  setCurrentPassword: (password) => set({ currentPassword: password }),
  setNewPassword: (password) => set({ newPassword: password }),
  setConfirmPassword: (password) => set({ confirmPassword: password }),
  setSubmitting: (submitting) => set({ submitting }),
  setShowCurrent: (show) => set({ showCurrent: show }),
  setShowNew: (show) => set({ showNew: show }),
  setShowConfirm: (show) => set({ showConfirm: show }),
  resetPasswordForm: () =>
    set({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      submitting: false,
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    }),
}));

