import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/constants';
import { JobFilters } from '@/types/job.types';

interface JobFilterProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading?: boolean;
  departments?: string[]; // optional compact department tabs within filter card
}

const JobFilter: React.FC<JobFilterProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  isLoading = false,
  departments = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.q || '');

  // Sync searchQuery with filters.q when it changes externally
  useEffect(() => {
    setSearchQuery(filters.q || '');
  }, [filters.q]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.q) {
        handleInputChange('q', searchQuery);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Auto-search when filters change (excluding search query to avoid double triggering)
  useEffect(() => {
    if (filters.q !== undefined || Object.keys(filters).some(key => 
      key !== 'q' && key !== 'page' && key !== 'limit' && filters[key as keyof JobFilters]
    )) {
      onSearch();
    }
  }, [filters, onSearch]);

  const handleInputChange = (field: keyof JobFilters, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value || undefined,
      page: 1, // Reset to first page when filters change
    };
    onFiltersChange(newFilters);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
    setIsExpanded(false);
  };

  // Count active filters (excluding pagination and search query)
  const getActiveFilterCount = () => {
    const excludeFields = ['page', 'limit', 'q'];
    return Object.entries(filters)
      .filter(([key, value]) => 
        !excludeFields.includes(key) && 
        value !== undefined && 
        value !== '' && 
        value !== null &&
        !(Array.isArray(value) && value.length === 0)
      ).length;
  };

  const activeFilterCount = getActiveFilterCount();
  const hasActiveFilters = activeFilterCount > 0;

  const employmentTypeOptions = [
    { value: '', label: 'All Types' },
    ...EMPLOYMENT_TYPES.map(type => ({ value: type, label: type }))
  ];

  const experienceLevelOptions = [
    { value: '', label: 'All Levels' },
    ...EXPERIENCE_LEVELS.map(level => ({ value: level, label: level }))
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Search jobs by title, company, or keywords..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleInputChange('q', searchQuery);
                }
              }}
            />
          </div>
          <Button 
            onClick={() => {
              handleInputChange('q', searchQuery);
            }} 
            loading={isLoading}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Compact Department Pills (inside filters card) */}
        {departments.length > 0 && (
          <div className="-mt-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Browse by Department</h4>
              <span className="text-xs text-gray-500">{departments.length} departments</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {["All", ...departments].map((dept) => {
                const isActive = (dept === 'All' && !filters.department) || filters.department === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => handleInputChange('department', dept === 'All' ? '' : dept)}
                    disabled={isLoading}
                    className={`whitespace-nowrap rounded-md border px-3 py-1 text-xs transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Location"
              placeholder="City, Country"
              value={filters.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
            
            <Input
              label="Department"
              placeholder="Department"
              value={filters.department || ''}
              onChange={(e) => handleInputChange('department', e.target.value)}
            />
            
            <Select
              label="Employment Type"
              options={employmentTypeOptions}
              value={filters.employmentType || ''}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
            />
            
            <Select
              label="Experience Level"
              options={experienceLevelOptions}
              value={filters.experienceLevel || ''}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
            />
            
            <Input
              label="Min Salary"
              type="number"
              placeholder="Min salary"
              value={filters.salaryMin || ''}
              onChange={(e) => handleInputChange('salaryMin', e.target.value)}
            />
            
            <Input
              label="Max Salary"
              type="number"
              placeholder="Max salary"
              value={filters.salaryMax || ''}
              onChange={(e) => handleInputChange('salaryMax', e.target.value)}
            />
            
            <Input
              label="Tags"
              placeholder="Comma-separated tags"
              value={filters.tags?.join(',') || ''}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean).join(','))}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export { JobFilter };
