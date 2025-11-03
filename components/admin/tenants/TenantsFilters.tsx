'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchBar } from '@/components/shared/SearchBar';

interface TenantsFiltersProps {
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'inactive';
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  isLoading?: boolean;
}

/**
 * TenantsFilters Component
 * Handles search and filter controls for tenants list
 */
export const TenantsFilters: React.FC<TenantsFiltersProps> = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  onSearch,
  onClearSearch,
  onStatusFilterChange,
  isLoading = false,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search tenants by name or subdomain..."
              value={searchQuery}
              onChange={onSearchChange}
              onSearch={onSearch}
              onClear={onClearSearch}
              loading={isLoading}
            />
          </div>
          
          {/* Status Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onStatusFilterChange('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onStatusFilterChange('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

