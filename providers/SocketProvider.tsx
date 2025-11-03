'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/auth';
import toast from 'react-hot-toast';
import { useNotificationStore } from '@/stores/notificationStore';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { addNotification } = useNotificationStore();

  const token = getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || ''; // base server URL

  useEffect(() => {
    if (!token || !baseUrl) {
      setSocket(null);
      return;
    }
    
    const s = io(baseUrl, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });
    
    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected');
    });

    s.on('notification', (payload: any) => {
      const title = payload?.title || 'Notification';
      const message = payload?.message || payload?.description || '';
      const type = payload?.type || 'info';
      
      // Add to notification store
      const notification = {
        _id: payload._id || `notification-${Date.now()}`,
        userId: payload.userId || '',
        title,
        message,
        type: type as 'info' | 'success' | 'warning' | 'error',
        read: false,
        link: payload.link || payload.url,
        createdAt: payload.createdAt || new Date().toISOString(),
      };
      addNotification(notification);
      
      // Show toast notification
      if (type === 'success') {
      toast.success(`${title}${message ? ` — ${message}` : ''}`);
      } else if (type === 'error') {
        toast.error(`${title}${message ? ` — ${message}` : ''}`);
      } else if (type === 'warning') {
        toast(`${title}${message ? ` — ${message}` : ''}`, { icon: '⚠️' });
      } else {
        toast(`${title}${message ? ` — ${message}` : ''}`);
      }
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    s.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token, baseUrl, addNotification]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};


