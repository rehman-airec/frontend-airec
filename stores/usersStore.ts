import { create } from 'zustand';

interface UsersState {
  // Users list state
  currentPage: number;
  pageSize: number;
  deletingId: string | null;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setDeletingId: (id: string | null) => void;
  resetFilters: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  currentPage: 1,
  pageSize: 10,
  deletingId: null,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  setDeletingId: (id) => set({ deletingId: id }),
  resetFilters: () =>
    set({
      currentPage: 1,
      pageSize: 10,
      deletingId: null,
    }),
}));

