'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user.types';
import { isAuthenticated, getUser, setUser, removeUser, logout } from '@/lib/auth';
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
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getUser();
        if (userData) {
          setUserState(userData);
        }
      }
      setIsLoading(false);
      setIsInitialized(true);
    };

    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized]);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setUserState(userData);
    setIsLoading(false);
  };

  const handleLogout = () => {
    removeUser();
    setUserState(null);
    logout();
    router.push('/auth/login');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
