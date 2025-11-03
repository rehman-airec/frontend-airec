import { create } from 'zustand';
import { TenantInfo } from '@/hooks/useTenant';

interface TenantManagementState {
  // Tenant list state
  searchInput: string; // What user types
  searchQuery: string; // What's actually used for searching (only updated on button click)
  statusFilter: 'all' | 'active' | 'inactive';
  currentPage: number;
  pageSize: number;
  setSearchInput: (input: string) => void;
  setSearchQuery: (query: string) => void;
  applySearch: () => void; // Applies searchInput to searchQuery
  setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
  
  // Tenant modals state
  editingTenant: TenantInfo | null;
  deletingTenant: TenantInfo | null;
  setEditingTenant: (tenant: TenantInfo | null) => void;
  setDeletingTenant: (tenant: TenantInfo | null) => void;
  
  // Delete confirmation state
  forceDelete: boolean;
  confirmText: string;
  setForceDelete: (force: boolean) => void;
  setConfirmText: (text: string) => void;
  resetDeleteState: () => void;
}

export const useTenantManagementStore = create<TenantManagementState>((set) => ({
  searchInput: '',
  searchQuery: '',
  statusFilter: 'all',
  currentPage: 1,
  pageSize: 10,
  setSearchInput: (input) => set({ searchInput: input }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  applySearch: () => set((state) => ({ searchQuery: state.searchInput, currentPage: 1 })),
  setStatusFilter: (filter) => set({ statusFilter: filter, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  resetFilters: () =>
    set({
      searchInput: '',
      searchQuery: '',
      statusFilter: 'all',
      currentPage: 1,
      pageSize: 10,
    }),
  
  editingTenant: null,
  deletingTenant: null,
  setEditingTenant: (tenant) => set({ editingTenant: tenant }),
  setDeletingTenant: (tenant) => set({ deletingTenant: tenant }),
  
  forceDelete: false,
  confirmText: '',
  setForceDelete: (force) => set({ forceDelete: force }),
  setConfirmText: (text) => set({ confirmText: text }),
  resetDeleteState: () =>
    set({
      forceDelete: false,
      confirmText: '',
    }),
}));

