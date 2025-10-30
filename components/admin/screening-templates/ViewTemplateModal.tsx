'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScreeningTemplate } from '@/hooks/useScreeningTemplates';

interface ViewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ScreeningTemplate;
}

export const ViewTemplateModal: React.FC<ViewTemplateModalProps> = ({ isOpen, onClose, template }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={template.name} size="lg">
      <div className="space-y-4">
        {template.description && (
          <p className="text-gray-600 mb-4">{template.description}</p>
        )}
        
        {template.questions.map((question, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">Q{idx + 1}</h4>
                    <Badge variant="info" size="sm">{question.type}</Badge>
                    {question.required && <Badge variant="warning" size="sm">Required</Badge>}
                  </div>
                  <p className="text-gray-700">{question.text}</p>
                  {question.placeholder && (
                    <p className="text-sm text-gray-500 mt-1">Placeholder: {question.placeholder}</p>
                  )}
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Options:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option, optIdx) => (
                          <Badge key={optIdx} variant="secondary">{option}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

