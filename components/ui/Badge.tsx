'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md',
  animated = false 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border transition-all duration-200',
        variants[variant],
        sizes[size],
        animated && 'hover:scale-105 hover:shadow-sm',
        className
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
