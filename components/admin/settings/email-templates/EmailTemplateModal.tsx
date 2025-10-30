'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { EmailTemplateForm } from './EmailTemplateForm';
import type { EmailTemplateFormData, TemplateVariable } from './types';

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EmailTemplateFormData;
  onChange: (data: EmailTemplateFormData) => void;
  onSubmit: () => void;
  isEditing: boolean;
  isLoading: boolean;
  availableVariables: TemplateVariable[];
}

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  isEditing,
  isLoading,
  availableVariables
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEditing ? 'Edit Email Template' : 'Create Email Template'}
        </h2>
        <EmailTemplateForm
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEditing={isEditing}
          isLoading={isLoading}
          availableVariables={availableVariables}
        />
      </div>
    </Modal>
  );
};

export { EmailTemplateModal };

