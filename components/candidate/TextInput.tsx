'use client';

import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, name, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} className={`mt-1 block w-full border rounded px-3 py-2 ${props.className || ''}`} />
    </div>
  );
};


