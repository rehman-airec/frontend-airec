'use client';

import React from 'react';
import type { TemplateVariable } from './types';

interface EmailTemplateVariablesProps {
  variables: TemplateVariable[];
  onVariableClick: (value: string) => void;
}

const EmailTemplateVariables: React.FC<EmailTemplateVariablesProps> = ({
  variables,
  onVariableClick
}) => {
  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
      <p className="text-xs font-medium text-gray-700 mb-2">Available Variables:</p>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable.value}
            type="button"
            onClick={() => onVariableClick(variable.value)}
            className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            {variable.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { EmailTemplateVariables };

