'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { EmailTemplateVariables } from './EmailTemplateVariables';
import type { EmailTemplateFormData, TemplateVariable } from './types';

interface EmailTemplateFormProps {
  formData: EmailTemplateFormData;
  onChange: (data: EmailTemplateFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
  availableVariables: TemplateVariable[];
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
  availableVariables
}) => {
  const handleChange = (field: keyof EmailTemplateFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const handleVariableClick = (value: string) => {
    handleChange('body', formData.body + value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <Input
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Email subject"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Input
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Template description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Body *
        </label>
        <WysiwygEditor
          value={formData.body}
          onChange={(value) => handleChange('body', value)}
          placeholder="Email body content"
        />
        <EmailTemplateVariables
          variables={availableVariables}
          onVariableClick={handleVariableClick}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="text-sm text-gray-700">Active</label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={isLoading}>
          {isEditing ? 'Update' : 'Create'} Template
        </Button>
      </div>
    </div>
  );
};

export { EmailTemplateForm };

