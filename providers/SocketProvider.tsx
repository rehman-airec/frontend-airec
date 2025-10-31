'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/auth';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);

  const token = getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || ''; // base server URL

  useEffect(() => {
    if (!token || !baseUrl) return;
    const s = io(baseUrl, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = s;

    s.on('connect', () => {
      // Optionally toast connected
    });

    s.on('notification', (payload: any) => {
      const title = payload?.title || 'Notification';
      const message = payload?.message || '';
      toast.success(`${title}${message ? ` — ${message}` : ''}`);
    });

    s.on('disconnect', () => {
      // Optionally handle reconnect UI
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [token, baseUrl]);

  const value = useMemo(() => ({ socket: socketRef.current }), []);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};


