'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { EmailTemplate } from '@/hooks/useEmailTemplates';

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (templateId: string) => void;
}

const EmailTemplateCard: React.FC<EmailTemplateCardProps> = ({
  template,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-base font-medium text-gray-900">{template.subject}</h4>
              {template.isActive ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>
            {template.description && (
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            )}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Category: {template.category}</span>
              <span>Status: {template.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(template._id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { EmailTemplateCard };

