'use client';

import React, { useState } from 'react';
import { useEvaluationTemplates } from '@/hooks/useEvaluationTemplates';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { EvaluationTemplate } from '@/hooks/useEvaluationTemplates';

interface EvaluationTemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateSelect: (templateId: string | null) => void;
  label?: string;
}

const categoryLabels: Record<string, string> = {
  technical: 'Technical',
  hr: 'HR',
  behavioral: 'Behavioral',
  coding: 'Coding',
  design: 'Design',
  managerial: 'Managerial',
  general: 'General',
};

const EvaluationTemplateSelector: React.FC<EvaluationTemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateSelect,
  label = 'Interviewer Evaluation Template',
}) => {
  const { data, isLoading } = useEvaluationTemplates({ isActive: true });
  const [showPreview, setShowPreview] = useState(false);

  const templates = data?.templates || [];
  const selectedTemplate = templates.find(t => t._id === selectedTemplateId);

  const templateOptions = [
    { value: '', label: 'No template selected' },
    ...templates.map(template => ({
      value: template._id,
      label: `${template.name}${template.category ? ` (${categoryLabels[template.category] || template.category})` : ''}`
    }))
  ];

  const handleTemplateChange = (value: string) => {
    onTemplateSelect(value || null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Select
          label={label}
          placeholder={isLoading ? "Loading templates..." : "Select an evaluation template"}
          value={selectedTemplateId || ''}
          onChange={(e) => handleTemplateChange(e.target.value)}
          options={templateOptions}
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-1">
          Choose a template that interviewers will use to evaluate candidates for this job
        </p>
      </div>

      {selectedTemplate && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTemplate.name}
                </h3>
                {selectedTemplate.category && (
                  <Badge variant="secondary" size="sm">
                    {categoryLabels[selectedTemplate.category] || selectedTemplate.category}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show Preview
                  </>
                )}
              </Button>
            </div>
            {selectedTemplate.description && (
              <p className="text-sm text-gray-600 mt-2">{selectedTemplate.description}</p>
            )}
          </CardHeader>

          {showPreview && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Evaluation Criteria */}
                {selectedTemplate.criteria && selectedTemplate.criteria.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Evaluation Criteria ({selectedTemplate.criteria.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTemplate.criteria.map((criterion, index) => (
                        <div
                          key={index}
                          className="flex items-start p-2 bg-gray-50 rounded-lg"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {criterion.name}
                            </p>
                            {criterion.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {criterion.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {criterion.ratingScale && (
                                <Badge variant="info" size="sm">
                                  {criterion.ratingScale}
                                </Badge>
                              )}
                              {criterion.required && (
                                <span className="text-xs text-gray-500">Required</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating Scale */}
                {selectedTemplate.overallRatingScale && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Overall Rating Scale</h4>
                    <Badge variant="info" size="sm">
                      {selectedTemplate.overallRatingScale}
                    </Badge>
                  </div>
                )}

                {/* Recommendation Options */}
                {selectedTemplate.recommendationOptions && selectedTemplate.recommendationOptions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendation Options</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.recommendationOptions.map((option, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Fields */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Included Fields</h4>
                  <div className="space-y-1">
                    {selectedTemplate.includeStrengths && (
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                        Strengths
                      </div>
                    )}
                    {selectedTemplate.includeAreasOfInterest && (
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                        Areas of Interest
                      </div>
                    )}
                    {selectedTemplate.includeAdditionalNotes && (
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                        Additional Notes
                      </div>
                    )}
                  </div>
                </div>

                {/* Usage Stats */}
                {selectedTemplate.usageCount !== undefined && selectedTemplate.usageCount > 0 && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Used {selectedTemplate.usageCount} time{selectedTemplate.usageCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export { EvaluationTemplateSelector };

