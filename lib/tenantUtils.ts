/**
 * Tenant Utilities
 * 
 * Helper functions for tenant detection and context management
 */

import { getBaseDomain, getBaseDomainWithPort, getProtocol, getBaseUrl } from './env';

/**
 * Extract subdomain from hostname
 * 
 * @param hostname - Window hostname (e.g., 'abc.localhost:3000', 'xyz.mydomain.com')
 * @returns Subdomain string or null
 * 
 * @example
 * extractSubdomain('abc.localhost:3000') // 'abc'
 * extractSubdomain('xyz.mydomain.com') // 'xyz'
 * extractSubdomain('localhost:3000') // null
 * extractSubdomain('mydomain.com') // null
 */
export function extractSubdomain(hostname: string): string | null {
  if (!hostname) return null;
  
  // Remove port if present
  const hostWithoutPort = hostname.split(':')[0];
  
  const parts = hostWithoutPort.split('.');
  
  // Need at least 2 parts for a subdomain
  // Examples:
  // - "chi.localhost" -> ["chi", "localhost"] -> subdomain is "chi"
  // - "chi.mydomain.com" -> ["chi", "mydomain", "com"] -> subdomain is "chi"
  // - "localhost" -> ["localhost"] -> no subdomain
  // - "mydomain.com" -> ["mydomain", "com"] -> no subdomain (this is the base domain)
  
  if (parts.length >= 2 && parts[0] && parts[0] !== 'www') {
    const firstPart = parts[0].toLowerCase();
    const baseDomain = parts.slice(1).join('.');
    
    // If the rest is 'localhost' or matches base domain pattern, first part is subdomain
    if (baseDomain === 'localhost' || parts.length >= 3 || baseDomain !== firstPart) {
      return firstPart;
    }
  }
  
  return null;
}

/**
 * Get current tenant subdomain from window location
 * 
 * @returns Current subdomain or null
 */
export function getCurrentTenantSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  return extractSubdomain(window.location.hostname);
}

/**
 * Check if current request has tenant context
 * 
 * @returns true if subdomain is detected, false otherwise
 */
export function hasTenantContext(): boolean {
  return getCurrentTenantSubdomain() !== null;
}

/**
 * Get tenant URL format
 * 
 * @param subdomain - Tenant subdomain
 * @param path - Optional path to append
 * @returns Full tenant URL
 * 
 * @example
 * getTenantUrl('chi', '/admin') // 'http://chi.localhost:3000/admin' (dev) or 'https://chi.mydomain.com/admin' (prod)
 */
export function getTenantUrl(subdomain: string, path: string = ''): string {
  if (!subdomain) {
    return getBaseUrl() + path;
  }
  
  const protocol = getProtocol();
  const baseDomain = getBaseDomainWithPort();
  
  // Construct tenant URL
  // Development: http://chi.localhost:3000
  // Production: https://chi.mydomain.com
  const hostname = `${subdomain}.${baseDomain}`;
  
  return `${protocol}://${hostname}${path}`;
}

