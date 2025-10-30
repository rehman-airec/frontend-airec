'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit, Trash2, BookOpen, Star } from 'lucide-react';
import { ScreeningTemplate } from '@/hooks/useScreeningTemplates';

interface TemplateCardProps {
  template: ScreeningTemplate;
  onView: (template: ScreeningTemplate) => void;
  onEdit: (template: ScreeningTemplate) => void;
  onDelete: (template: ScreeningTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          {template.isDefault && (
            <Badge variant="success" size="sm">
              <Star className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}
        </div>
        {template.description && (
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        )}
        {template.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" size="sm">{tag}</Badge>
            ))}
          </div>
        )}
        <div className="flex items-center text-xs text-gray-500">
          <span>{template.questions.length} questions</span>
          {template.usageCount > 0 && (
            <span className="ml-4">Used {template.usageCount} times</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onView(template)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Questions
          </Button>
          {!template.isDefault && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(template)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 hover:bg-red-50"
                onClick={() => onDelete(template)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

