'use client';

import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { useSocket } from '@/providers/SocketProvider';

export const NotificationBell: React.FC = () => {
  const {
    isDropdownOpen,
    unreadCount,
    toggleDropdown,
    setDropdownOpen,
    addNotification,
  } = useNotificationStore();
  
  // Fetch notifications once on mount (no polling needed - Socket.IO handles updates)
  useNotifications();
  
  const { socket } = useSocket();

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (payload: any) => {
      const notification = {
        _id: payload._id || `notification-${Date.now()}`,
        userId: payload.userId || '',
        title: payload.title || 'New Notification',
        message: payload.message || payload.description || '',
        type: payload.type || 'info',
        read: false,
        link: payload.link || payload.url,
        createdAt: payload.createdAt || new Date().toISOString(),
      };
      addNotification(notification);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, addNotification]);

  const displayUnreadCount = unreadCount > 0 ? unreadCount : 0;

  return (
    <div className="relative">
    <button
      type="button"
        onClick={toggleDropdown}
        className="relative rounded-full p-2 hover:bg-gray-100 transition-colors"
      aria-label="Notifications"
    >
        <Bell className={`h-5 w-5 ${isDropdownOpen ? 'text-blue-600' : 'text-gray-700'}`} />
        {displayUnreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold h-5 min-w-[20px] px-1.5">
            {displayUnreadCount > 99 ? '99+' : displayUnreadCount}
      </span>
        )}
    </button>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <NotificationDropdown
          isOpen={isDropdownOpen}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};


