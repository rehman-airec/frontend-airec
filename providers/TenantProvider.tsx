'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { useAuth } from '@/hooks/useAuth';
import { extractSubdomain } from '@/lib/tenantUtils';
import { useTenantStore } from '@/stores/tenantStore';

/**
 * Tenant Context Type
 */
interface TenantInfo {
  _id: string;
  name: string;
  subdomain: string;
  maxUsers: number;
  currentUsersCount: number;
  isActive: boolean;
}

interface TenantContextType {
  tenant: TenantInfo | null;
  isLoading: boolean;
  isTenantContext: boolean;
  subdomain: string | null;
  error: any;
  refetch: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

/**
 * Tenant Provider
 * 
 * Manages tenant context for multi-tenant functionality.
 * Detects tenant from subdomain and fetches tenant information.
 */
export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { subdomain, setSubdomain, tenant, setTenant, setLoading } = useTenantStore();

  // Extract subdomain on mount and when hostname changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const detectedSubdomain = extractSubdomain(hostname);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[TenantProvider] Subdomain detection:', {
          hostname,
          detectedSubdomain,
          fullUrl: window.location.href
        });
      }
      
      setSubdomain(detectedSubdomain);
    }
  }, [setSubdomain]);

  // Fetch tenant info if subdomain exists
  // Use public endpoint for unauthenticated users, authenticated endpoint for admins
  const { data: tenantData, isLoading, error: tenantError, refetch } = useQuery({
    queryKey: ['tenant', subdomain, isAuthenticated, user?.role],
    queryFn: async () => {
      if (!subdomain) {
        console.log('[TenantProvider] No subdomain detected, skipping tenant fetch');
        return null;
      }

      // Use public endpoint if not authenticated or not admin
      // Use authenticated endpoint if user is authenticated admin
      // In development, use Next.js API proxy to bypass CORS issues
      const useProxy = process.env.NODE_ENV === 'development';
      const endpoint = (isAuthenticated && user?.role === 'admin') 
        ? API_ROUTES.TENANT.INFO 
        : (useProxy ? '/api/tenant/public-info' : API_ROUTES.TENANT.PUBLIC_INFO);
      
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[TenantProvider] Fetching tenant info:', {
            subdomain,
            endpoint,
            isAuthenticated,
            userRole: user?.role,
            useProxy,
            fullUrl: useProxy ? endpoint : `${api.defaults.baseURL}${endpoint}`
          });
        }
        
        // For Next.js API proxy routes (starting with /api/), use fetch directly
        // For backend routes, use axios
        let response;
        if (useProxy && endpoint.startsWith('/api/')) {
          // Use fetch for Next.js API routes to avoid baseURL prepending
          const fetchResponse = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'x-tenant-subdomain': subdomain || '',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          // Handle 404 for fetch - return null (expected for tenant not found)
          if (fetchResponse.status === 404) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[TenantProvider] Tenant not found (404) for subdomain:', subdomain);
            }
            return null;
          }
          
          if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            throw new Error(`Proxy request failed: ${fetchResponse.status} - ${errorText}`);
          }
          
          response = { data: await fetchResponse.json() };
        } else {
          // Use axios for backend routes
          response = await api.get(endpoint);
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[TenantProvider] Tenant fetch successful:', response.data);
        }
        
        if (response.data.success) {
          return response.data.data;
        }
        return null;
      } catch (error: any) {
        // If tenant not found (404), return null - this is expected
        if (error.response?.status === 404) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[TenantProvider] Tenant not found (404) for subdomain:', subdomain);
          }
          return null;
        }
        
        // For network errors, log and re-throw so React Query can track the error
        const isNetworkError = error.code === 'ERR_NETWORK' || 
                              error.code === 'ERR_BLOCKED_BY_CLIENT' || 
                              !error.response ||
                              error.message?.includes('Network Error');
        
        // Log detailed info in development
        if (process.env.NODE_ENV === 'development') {
          console.error('[TenantProvider] Error fetching tenant info:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
            origin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
            subdomain: subdomain,
            endpoint: endpoint,
            responseData: error.response?.data,
            requestHeaders: error.config?.headers,
            isNetworkError: isNetworkError,
            fullError: error
          });
        }
        
        // Re-throw network errors so React Query tracks them properly
        // Other errors (non-404) should also be thrown
        throw error;
      }
    },
    enabled: !!subdomain, // Enable for any subdomain, authenticated or not
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Sync tenant data to store
  useEffect(() => {
    setTenant(tenantData || null);
    setLoading(isLoading);
  }, [tenantData, isLoading, setTenant, setLoading]);

  const value: TenantContextType = {
    tenant: tenant || null,
    isLoading: isLoading,
    isTenantContext: !!subdomain && !!tenant,
    subdomain: subdomain,
    error: tenantError || null,
    refetch: () => {
      if (subdomain) {
        console.log('[TenantProvider] Manual refetch triggered for subdomain:', subdomain);
        refetch();
      }
    },
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

