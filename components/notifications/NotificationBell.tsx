'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  return (
    <button
      type="button"
      className="relative rounded-full p-2 hover:bg-gray-100"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-gray-700" />
      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] h-4 min-w-[16px] px-1">
        •
      </span>
    </button>
  );
};


