import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useNotificationStore, Notification } from '@/stores/notificationStore';
import { extractSubdomain } from '@/lib/tenantUtils';

// API Routes for notifications
const NOTIFICATION_ROUTES = {
  LIST: '/notifications',
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  UNREAD_COUNT: '/notifications/unread-count',
  DELETE: (id: string) => `/notifications/${id}`,
};

/**
 * Hook to fetch all notifications
 * Since we use Socket.IO for real-time updates, we don't need aggressive polling
 */
export const useNotifications = () => {
  const { setNotifications, setLoading } = useNotificationStore();
  
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      setLoading(true);
      try {
        // In development, use Next.js API proxy to bypass CORS issues
        const useProxy = process.env.NODE_ENV === 'development';
        const endpoint = useProxy ? '/api/notifications' : NOTIFICATION_ROUTES.LIST;
        
        let response;
        if (useProxy && endpoint.startsWith('/api/')) {
          // Use fetch for proxy routes
          const subdomain = typeof window !== 'undefined' 
            ? extractSubdomain(window.location.hostname)
            : null;
          
          const token = typeof window !== 'undefined' 
            ? localStorage.getItem('token')
            : null;
          
          const headers: Record<string, string> = {
            'x-tenant-subdomain': subdomain || '',
            'Content-Type': 'application/json',
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const fetchResponse = await fetch(endpoint, {
            method: 'GET',
            headers,
            credentials: 'include',
          });
          
          if (fetchResponse.status === 404) {
            return [];
          }
          
          if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            throw { response: { status: fetchResponse.status, data: { message: errorText } } };
          }
          
          response = { data: await fetchResponse.json() };
        } else {
          // Use axios for backend routes
          response = await api.get(NOTIFICATION_ROUTES.LIST);
        }
        
        if (response.data.success) {
          const notifications = response.data.data || response.data.notifications || [];
          setNotifications(notifications);
          return notifications;
        }
        return [];
      } catch (error: any) {
        // If endpoint doesn't exist, return empty array
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // Consider stale after 5 minutes
    refetchInterval: false, // Disable automatic polling - rely on Socket.IO
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Only refetch on initial mount
    refetchOnReconnect: true, // Refetch when reconnecting (e.g., after network loss)
  });
};

/**
 * Hook to fetch unread count
 * Note: Unread count is calculated from notifications in the store, so we don't need a separate API call
 * This is kept for backward compatibility, but should rely on the notifications query
 */
export const useUnreadNotificationCount = () => {
  const { notifications } = useNotificationStore();
  
  // Calculate unread count from notifications in store (no API call needed)
  // This avoids duplicate API calls since we already fetch notifications
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;
  
  return {
    data: unreadCount,
    isLoading: false,
    refetch: () => {}, // No-op since we calculate from store
  };
};

/**
 * Hook to mark notification as read
 */
export const useMarkNotificationAsRead = () => {
  const { markAsRead } = useNotificationStore();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await api.put(NOTIFICATION_ROUTES.MARK_AS_READ(notificationId));
        return response.data;
      } catch (error: any) {
        // If endpoint doesn't exist, just update local state
        if (error.response?.status === 404) {
          markAsRead(notificationId);
          return { success: true };
        }
        throw error;
      }
    },
    onSuccess: (_, notificationId) => {
      markAsRead(notificationId);
      // Don't invalidate queries - we update the store directly
      // This avoids unnecessary refetches since Socket.IO handles real-time updates
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const { markAllAsRead } = useNotificationStore();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await api.put(NOTIFICATION_ROUTES.MARK_ALL_READ);
        return response.data;
      } catch (error: any) {
        // If endpoint doesn't exist, just update local state
        if (error.response?.status === 404) {
          markAllAsRead();
          return { success: true };
        }
        throw error;
      }
    },
    onSuccess: () => {
      markAllAsRead();
      // Don't invalidate queries - we update the store directly
      // This avoids unnecessary refetches since Socket.IO handles real-time updates
    },
  });
};

/**
 * Hook to delete notification
 */
export const useDeleteNotification = () => {
  const { removeNotification } = useNotificationStore();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await api.delete(NOTIFICATION_ROUTES.DELETE(notificationId));
        return response.data;
      } catch (error: any) {
        // If endpoint doesn't exist, just update local state
        if (error.response?.status === 404) {
          removeNotification(notificationId);
          return { success: true };
        }
        throw error;
      }
    },
    onSuccess: (_, notificationId) => {
      removeNotification(notificationId);
      // Don't invalidate queries - we update the store directly
      // This avoids unnecessary refetches since Socket.IO handles real-time updates
    },
  });
};

