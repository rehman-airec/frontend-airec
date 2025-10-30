'use client';

import React from 'react';
import { useAdminJobTitles } from '@/hooks/useJobs';

interface PositionSelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
}

export const PositionSelect: React.FC<PositionSelectProps> = ({ label = 'Position Title', value, onChange }) => {
  const { data, isLoading } = useAdminJobTitles();
  const jobs = data?.jobs || [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        className="mt-1 block w-full border rounded px-3 py-2 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{isLoading ? 'Loading positions…' : 'Select a position'}</option>
        {jobs.map((j) => (
          <option key={j._id} value={j.title}>{j.title}</option>
        ))}
      </select>
    </div>
  );
};


