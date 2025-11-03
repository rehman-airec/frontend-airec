import { create } from 'zustand';
import { User } from '@/types/user.types';
import { getUser, setUser, removeUser, logout as logoutUtil, isAuthenticated, setToken as setTokenUtil } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,
  
  initialize: () => {
    if (get().isInitialized) return;
    
    if (isAuthenticated()) {
      const userData = getUser();
      if (userData) {
        set({ user: userData, isLoading: false, isInitialized: true, isAuthenticated: true });
        return;
      }
    }
    set({ isLoading: false, isInitialized: true, isAuthenticated: false });
  },
  
  login: (userData: User, token: string) => {
    // Save both token and user to localStorage
    setTokenUtil(token);
    setUser(userData);
    set({ user: userData, isLoading: false, isAuthenticated: true });
  },
  
  logout: () => {
    removeUser();
    logoutUtil();
    set({ user: null, isAuthenticated: false });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

