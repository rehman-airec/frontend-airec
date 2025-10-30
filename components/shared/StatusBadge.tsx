import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_COLORS, PRIORITY_COLORS } from '@/lib/constants';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'priority';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'status', 
  className 
}) => {
  const colors = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS;
  const colorClass = colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
};

export { StatusBadge };
