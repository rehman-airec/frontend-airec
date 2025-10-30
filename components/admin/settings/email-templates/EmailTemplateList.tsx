'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Mail } from 'lucide-react';
import { EmailTemplateCard } from './EmailTemplateCard';
import { EmailTemplate } from '@/hooks/useEmailTemplates';

interface EmailTemplateListProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onDelete: (templateId: string) => void;
}

const EmailTemplateList: React.FC<EmailTemplateListProps> = ({
  templates,
  onEdit,
  onDelete
}) => {
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Mail className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No email templates found. Create your first template to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {templates.map((template) => (
        <EmailTemplateCard
          key={template._id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export { EmailTemplateList };

