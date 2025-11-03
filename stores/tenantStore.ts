import { create } from 'zustand';

interface TenantInfo {
  _id: string;
  name: string;
  subdomain: string;
  maxUsers: number;
  currentUsersCount: number;
  isActive: boolean;
}

interface TenantState {
  tenant: TenantInfo | null;
  subdomain: string | null;
  isLoading: boolean;
  setTenant: (tenant: TenantInfo | null) => void;
  setSubdomain: (subdomain: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  subdomain: null,
  isLoading: false,
  
  setTenant: (tenant) => set({ tenant }),
  setSubdomain: (subdomain) => set({ subdomain }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearTenant: () => set({ tenant: null, subdomain: null }),
}));

