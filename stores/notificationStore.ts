import { create } from 'zustand';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
  readAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isDropdownOpen: boolean;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  setLoading: (loading: boolean) => void;
  setDropdownOpen: (open: boolean) => void;
  toggleDropdown: () => void;
  
  // Computed
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isDropdownOpen: false,
  
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    set({ notifications, unreadCount });
  },
  
  addNotification: (notification) => {
    set((state) => {
      // Don't add duplicates
      if (state.notifications.some(n => n._id === notification._id)) {
        return state;
      }
      const notifications = [notification, ...state.notifications];
      const unreadCount = notifications.filter(n => !n.read).length;
      return { notifications, unreadCount };
    });
  },
  
  markAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n._id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      return { notifications, unreadCount };
    });
  },
  
  markAllAsRead: () => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        !n.read ? { ...n, read: true, readAt: new Date().toISOString() } : n
      );
      return { notifications, unreadCount: 0 };
    });
  },
  
  removeNotification: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.filter(n => n._id !== notificationId);
      const unreadCount = notifications.filter(n => !n.read).length;
      return { notifications, unreadCount };
    });
  },
  
  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setDropdownOpen: (open) => set({ isDropdownOpen: open }),
  toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  
  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },
}));

