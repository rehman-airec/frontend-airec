import axios from 'axios';
import { extractSubdomain } from './tenantUtils';
import { shouldUseProxy, toProxyRoute } from './api-proxy';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// Log API configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[Axios] API Configuration:', {
    baseURL: api.defaults.baseURL,
    currentOrigin: window.location.origin,
    currentHostname: window.location.hostname,
  });
}

// Combined request interceptor: 
// 1. Convert URLs to proxy routes in development (FIRST)
// 2. Add auth token and tenant subdomain header (SECOND)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // STEP 1: In development, convert backend URLs to proxy routes
      if (process.env.NODE_ENV === 'development' && config.url) {
        // Only proxy if URL doesn't already start with /api/ (avoid double-proxying)
        // and doesn't start with http (external URLs)
        if (!config.url.startsWith('/api/') && !config.url.startsWith('http')) {
          const proxyEndpoint = toProxyRoute(config.url);
          // Ensure proxy endpoint starts with /
          const finalUrl = proxyEndpoint.startsWith('/') ? proxyEndpoint : `/${proxyEndpoint}`;
          config.url = finalUrl;
          // Clear baseURL for proxy routes (they're same-origin)
          // Set to undefined to ensure axios doesn't try to prepend anything
          delete (config as any).baseURL;
          if (process.env.NODE_ENV === 'development') {
            console.log('[Axios Proxy] Routing through proxy:', finalUrl);
          }
        }
      }
      
      // STEP 2: Add auth token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // STEP 3: Multi-tenant: Extract subdomain from hostname and add to header
      // This allows backend to detect tenant context in development
      // In production, subdomain is detected from hostname automatically
      const subdomain = extractSubdomain(window.location.hostname);
      if (subdomain) {
        config.headers['x-tenant-subdomain'] = subdomain;
        // Log in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[Axios] Adding tenant subdomain header:', subdomain, 'for URL:', config.url);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors in development
    if (process.env.NODE_ENV === 'development') {
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.code === 'ERR_BLOCKED_BY_CLIENT' || 
                            !error.response ||
                            error.message?.includes('Network Error');
      
      if (isNetworkError) {
        const errorInfo: Record<string, any> = {};
        
        // Basic error properties
        errorInfo.code = error.code || 'UNKNOWN';
        errorInfo.message = error.message || 'Network request failed';
        errorInfo.name = error.name;
        
        // Request config (might be undefined for network errors)
        if (error.config) {
          errorInfo.requestUrl = error.config.url;
          errorInfo.requestMethod = error.config.method;
          errorInfo.baseURL = error.config.baseURL;
          errorInfo.requestHeaders = JSON.stringify(error.config.headers || {});
        } else {
          errorInfo.requestConfig = 'undefined';
        }
        
        // Browser context
        if (typeof window !== 'undefined') {
          errorInfo.currentOrigin = window.location.origin;
          errorInfo.currentHostname = window.location.hostname;
          errorInfo.currentHref = window.location.href;
          errorInfo.apiBaseURL = api.defaults.baseURL;
        }
        
        console.error('[Axios] Network Error Details:', errorInfo);
        
        // Also try to stringify the full error for debugging
        try {
          const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
          console.error('[Axios] Full Error (stringified):', errorString);
        } catch (e) {
          console.error('[Axios] Could not stringify error:', e);
        }
      }
    }
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
