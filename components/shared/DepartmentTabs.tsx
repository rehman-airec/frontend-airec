'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { JobFilters } from '@/types/job.types';

interface DepartmentTabsProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  departments: string[];
  isLoading?: boolean;
}

const DepartmentTabs: React.FC<DepartmentTabsProps> = ({
  filters,
  onFiltersChange,
  departments,
  isLoading = false
}) => {
  const handleDepartmentChange = (department: string) => {
    const newFilters = {
      ...filters,
      department: department === 'All' ? undefined : department,
      page: 1, // Reset to first page when department changes
    };
    onFiltersChange(newFilters);
  };

  // Add "All" option to departments
  const allDepartments = ['All', ...departments];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Browse by Department</h3>
        <span className="text-sm text-gray-500">
          {departments.length} departments
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allDepartments.map((department) => {
          const isActive = filters.department === department || 
                          (department === 'All' && !filters.department);
          
          return (
            <Button
              key={department}
              variant={isActive ? "primary" : "outline"}
              size="sm"
              onClick={() => handleDepartmentChange(department)}
              disabled={isLoading}
              className={`transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {department}
            </Button>
          );
        })}
      </div>
      
      {filters.department && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing jobs in: <span className="font-medium text-blue-600">{filters.department}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDepartmentChange('All')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DepartmentTabs };
