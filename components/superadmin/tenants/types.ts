/**
 * Tenant Management Types
 * Type definitions for superadmin tenant management
 */

export interface TenantUpdateData {
  name?: string;
  maxUsers?: number;
  isActive?: boolean;
}

export interface TenantDeleteOptions {
  force?: boolean;
}

