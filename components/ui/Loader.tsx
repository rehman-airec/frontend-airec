import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton, PageSkeleton } from './Skeleton';

// Deprecated: Use Skeleton components instead
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('animate-spin rounded-full border-gray-300 border-t-blue-600', sizeClasses[size])}></div>
    </div>
  );
};

// Use PageSkeleton instead
const PageLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
        {message && (
          <div className="text-gray-600 text-lg font-medium">
            {message}
          </div>
        )}
        {!message && (
          <div className="text-gray-600 text-lg font-medium">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

// Use Skeleton component instead
const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
};

export { Loader, PageLoader, Spinner, PageSkeleton };
