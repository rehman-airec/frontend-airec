import { create } from 'zustand';

interface AuthFormsState {
  // Login form
  loginLoading: boolean;
  setLoginLoading: (loading: boolean) => void;
  
  // Signup form
  signupLoading: boolean;
  setSignupLoading: (loading: boolean) => void;
  
  // Forgot password form
  email: string;
  submitting: boolean;
  message: string | null;
  error: string | null;
  setEmail: (email: string) => void;
  setSubmitting: (submitting: boolean) => void;
  setMessage: (message: string | null) => void;
  setError: (error: string | null) => void;
  resetForgotPassword: () => void;
  
  // Reset password form
  token: string;
  newPassword: string;
  confirmPassword: string;
  resetToken: (token: string) => void;
  setResetNewPassword: (password: string) => void;
  setResetConfirmPassword: (password: string) => void;
  resetResetPassword: () => void;
}

export const useAuthFormsStore = create<AuthFormsState>((set) => ({
  loginLoading: false,
  setLoginLoading: (loading) => set({ loginLoading: loading }),
  
  signupLoading: false,
  setSignupLoading: (loading) => set({ signupLoading: loading }),
  
  email: '',
  submitting: false,
  message: null,
  error: null,
  setEmail: (email) => set({ email }),
  setSubmitting: (submitting) => set({ submitting }),
  setMessage: (message) => set({ message }),
  setError: (error) => set({ error }),
  resetForgotPassword: () =>
    set({
      email: '',
      submitting: false,
      message: null,
      error: null,
    }),
  
  token: '',
  newPassword: '',
  confirmPassword: '',
  resetToken: (token) => set({ token }),
  setResetNewPassword: (password) => set({ newPassword: password }),
  setResetConfirmPassword: (password) => set({ confirmPassword: password }),
  resetResetPassword: () =>
    set({
      token: '',
      newPassword: '',
      confirmPassword: '',
      submitting: false,
      message: null,
      error: null,
    }),
}));

