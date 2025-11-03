/**
 * API Proxy Helper
 * 
 * Automatically routes API calls through Next.js proxy routes in development
 * to bypass CORS and network blocking issues.
 */

import { extractSubdomain } from './tenantUtils';

/**
 * Check if we should use proxy (development mode)
 */
export const shouldUseProxy = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Convert backend API route to Next.js proxy route
 * Example: '/jobs/admin/jobs' -> '/api/jobs/admin/jobs'
 */
export const toProxyRoute = (backendRoute: string): string => {
  // Remove leading slash if present
  const cleanRoute = backendRoute.startsWith('/') ? backendRoute.slice(1) : backendRoute;
  return `/api/${cleanRoute}`;
};

/**
 * Make a proxy API call using fetch
 */
export const proxyFetch = async (
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<Response> => {
  const { method = 'GET', body, headers = {} } = options;
  
  // Get subdomain
  const subdomain = typeof window !== 'undefined' 
    ? extractSubdomain(window.location.hostname)
    : null;
  
  // Get auth token
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('token')
    : null;
  
  // Build headers
  const fetchHeaders: Record<string, string> = {
    'x-tenant-subdomain': subdomain || '',
    'Content-Type': 'application/json',
    ...headers,
  };
  
  if (token) {
    fetchHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Handle FormData
  let fetchBody: BodyInit | undefined;
  if (body instanceof FormData) {
    fetchBody = body;
    // Remove Content-Type header for FormData - browser will set it with boundary
    delete fetchHeaders['Content-Type'];
  } else if (body) {
    fetchBody = JSON.stringify(body);
  }
  
  const response = await fetch(endpoint, {
    method,
    headers: fetchHeaders,
    body: fetchBody,
    credentials: 'include',
  });
  
  return response;
};

/**
 * Convert fetch Response to axios-like response format
 */
export const toAxiosResponse = async (fetchResponse: Response, originalConfig?: any) => {
  let data: any;
  const contentType = fetchResponse.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await fetchResponse.json();
  } else {
    data = await fetchResponse.text();
  }
  
  return {
    data,
    status: fetchResponse.status,
    statusText: fetchResponse.statusText,
    headers: Object.fromEntries(fetchResponse.headers.entries()),
    config: originalConfig || {},
  };
};

