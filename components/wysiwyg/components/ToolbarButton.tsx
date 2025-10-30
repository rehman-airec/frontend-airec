import React from 'react';
import { cn } from '@/lib/utils';
import { ToolbarButtonProps } from '../types';

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  isActive, 
  disabled, 
  children, 
  title 
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'p-2 rounded hover:bg-gray-200 transition-colors',
      isActive && 'bg-blue-100 text-blue-600',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    {children}
  </button>
);
