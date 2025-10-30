'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { useEmailTemplates, useCreateEmailTemplate, useUpdateEmailTemplate, useDeleteEmailTemplate, EmailTemplate } from '@/hooks/useEmailTemplates';
import { useAlert } from '@/hooks/useAlert';
import { EmailTemplateList } from './email-templates/EmailTemplateList';
import { EmailTemplateModal } from './email-templates/EmailTemplateModal';
import type { TemplateVariable, EmailTemplateFormData } from './email-templates/types';

interface EmailTemplatesManagerProps {
  category?: 'event' | 'interview' | 'general';
}

const EmailTemplatesManager: React.FC<EmailTemplatesManagerProps> = ({ category = 'event' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    subject: '',
    body: '',
    description: '',
    category: category,
    isActive: true
  });
  
  const { data: templatesData, isLoading } = useEmailTemplates(category);
  const templates = templatesData?.templates || [];
  const createMutation = useCreateEmailTemplate();
  const updateMutation = useUpdateEmailTemplate();
  const deleteMutation = useDeleteEmailTemplate();
  const { showSuccess, showError } = useAlert();

  const availableVariables: TemplateVariable[] = [
    { label: 'Event Title', value: '{{eventTitle}}' },
    { label: 'Job Title', value: '{{jobTitle}}' },
    { label: 'Date', value: '{{date}}' },
    { label: 'Start Time', value: '{{startTime}}' },
    { label: 'End Time', value: '{{endTime}}' },
    { label: 'Location', value: '{{location}}' },
    { label: 'Notes', value: '{{notes}}' },
    { label: 'Meeting Link', value: '{{meetingLink}}' }
  ];

  const handleOpenModal = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        subject: template.subject,
        body: template.body,
        description: template.description || '',
        category: template.category,
        isActive: template.isActive
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        subject: '',
        body: '',
        description: '',
        category: category,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    setFormData({
      subject: '',
      body: '',
      description: '',
      category: category,
      isActive: true
    });
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.body) {
      showError('Error', 'Subject and body are required');
      return;
    }

    try {
      if (editingTemplate) {
        await updateMutation.mutateAsync({
          templateId: editingTemplate._id,
          data: formData as Partial<EmailTemplate>
        });
        showSuccess('Success', 'Email template updated successfully');
      } else {
        await createMutation.mutateAsync(formData as Partial<EmailTemplate>);
        showSuccess('Success', 'Email template created successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to save email template');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this email template?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(templateId);
      showSuccess('Success', 'Email template deleted successfully');
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to delete email template');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Event Email Templates</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage email templates used for event invitations
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <EmailTemplateList
        templates={templates}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <EmailTemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={!!editingTemplate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        availableVariables={availableVariables}
      />
    </div>
  );
};

export { EmailTemplatesManager };
