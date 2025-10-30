'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Mail } from 'lucide-react';

interface EmailTemplate {
  _id: string;
  subject: string;
  body: string;
  description?: string;
  isActive: boolean;
}

interface EmailSettingsCardProps {
  sendEventDetails: boolean;
  onSendEventDetailsChange: (enabled: boolean) => void;
  emailTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  emailTemplates: EmailTemplate[];
  selectedTemplate?: EmailTemplate | null;
}

export const EmailSettingsCard: React.FC<EmailSettingsCardProps> = ({
  sendEventDetails,
  onSendEventDetailsChange,
  emailTemplateId,
  onTemplateSelect,
  emailTemplates,
  selectedTemplate,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-purple-600" />
          Email Settings
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
          <Checkbox
            checked={sendEventDetails}
            onChange={(e) => onSendEventDetailsChange(e.target.checked)}
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 cursor-pointer">
              Send Event Details to Candidate
            </label>
            <p className="text-xs text-gray-500 mt-1">
              When enabled, an email will be sent to candidates using the selected template
            </p>
          </div>
        </div>

        {sendEventDetails && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject / Template *
              </label>
              <Select
                value={emailTemplateId || ''}
                onChange={(e) => onTemplateSelect(e.target.value)}
                options={[
                  { value: '', label: 'Select a template...' },
                  ...emailTemplates
                    .filter(t => t.isActive)
                    .map(t => ({ value: t._id, label: t.subject }))
                ]}
                required={sendEventDetails}
              />
              {selectedTemplate?.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTemplate.description}
                </p>
              )}
            </div>

            {selectedTemplate && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-gray-700 mb-1">Template Preview:</p>
                <div 
                  className="text-xs text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedTemplate.body.substring(0, 200) + '...' 
                  }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

