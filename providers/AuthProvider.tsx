'use client';

import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';
import { User } from '@/types/user.types';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout: logoutStore,
    initialize,
  } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logoutStore();
    router.push('/auth/login');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout: handleLogout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
