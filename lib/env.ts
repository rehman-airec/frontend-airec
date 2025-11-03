/**
 * Environment Configuration
 * 
 * Provides environment-aware configuration for domains, URLs, and subdomains
 */

/**
 * Get the base domain for the current environment
 * @returns Base domain (e.g., 'localhost' for dev, 'mydomain.com' for prod)
 */
export function getBaseDomain(): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost';
  }
  
  // Client-side: extract from current hostname
  const hostname = window.location.hostname;
  
  // If it's localhost, return 'localhost'
  if (hostname === 'localhost' || hostname.startsWith('localhost')) {
    return 'localhost';
  }
  
  // For production, extract base domain (e.g., 'mydomain.com' from 'chi.mydomain.com')
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    // Return everything except the first part (subdomain)
    return parts.slice(1).join('.');
  }
  
  // Fallback: return hostname as-is
  return hostname;
}

/**
 * Get the base domain with port for local development
 * @returns Base domain with port (e.g., 'localhost:3000' for dev)
 */
export function getBaseDomainWithPort(): string {
  const domain = getBaseDomain();
  
  if (typeof window === 'undefined') {
    // Server-side
    const port = process.env.NEXT_PUBLIC_PORT || '3000';
    return domain === 'localhost' ? `${domain}:${port}` : domain;
  }
  
  // Client-side: include port if it's localhost
  if (domain === 'localhost' && window.location.port) {
    return `${domain}:${window.location.port}`;
  }
  
  return domain;
}

/**
 * Get the protocol for the current environment
 * @returns 'http' for development, 'https' for production
 */
export function getProtocol(): string {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? 'https' : 'http';
  }
  
  return window.location.protocol.replace(':', '');
}

/**
 * Get the base URL (protocol + domain)
 * @returns Full base URL (e.g., 'http://localhost:3000' or 'https://mydomain.com')
 */
export function getBaseUrl(): string {
  const protocol = getProtocol();
  const domain = getBaseDomainWithPort();
  
  return `${protocol}://${domain}`;
}

/**
 * Check if running in development environment
 */
export function isDevelopment(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development';
  }
  
  return window.location.hostname === 'localhost' || 
         window.location.hostname.includes('localhost');
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
  return !isDevelopment();
}

