'use client';

import React, { useState } from 'react';
import { useScreeningTemplates } from '@/hooks/useScreeningTemplates';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Search, Star, BookOpen } from 'lucide-react';
import { ScreeningTemplate } from '@/hooks/useScreeningTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (questions: any[]) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ScreeningTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ScreeningTemplate | null>(null);
  
  const { data: templatesData, isLoading, refetch } = useScreeningTemplates({ 
    search: searchQuery,
    includeDefaults: true
  });

  const templates = templatesData?.templates || [];

  // Refetch templates when modal opens
  React.useEffect(() => {
    if (showModal) {
      refetch();
    }
  }, [showModal, refetch]);

  const handleSelectTemplate = (template: ScreeningTemplate) => {
    console.log('Template selected:', template.name);
    setSelectedTemplate(template);
  };

  const handleConfirmSelect = () => {
    console.log('Confirming selection:', selectedTemplate);
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.questions);
      setShowModal(false);
      setSelectedTemplate(null);
      setSearchQuery('');
    } else {
      console.error('No template selected!');
    }
  };

  const handleViewTemplate = (template: ScreeningTemplate) => {
    console.log('Viewing template for preview:', template.name);
    // Open preview modal without changing the selected template
    setPreviewTemplate(template);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2"
      >
        <BookOpen className="h-4 w-4" />
        <span>Select from Templates</span>
      </Button>

      {/* Template Selection Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedTemplate(null);
          setSearchQuery('');
        }} 
        title="Select Screening Question Template" 
        size="xl"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No templates found</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto space-y-3">
              {templates.map((template: ScreeningTemplate) => (
                <Card 
                  key={template._id} 
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?._id === template._id 
                      ? 'border-2 border-blue-500 bg-blue-50 shadow-md' 
                      : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          {selectedTemplate?._id === template._id && (
                            <Badge variant="info" size="sm">Selected</Badge>
                          )}
                        </div>
                        {template.isDefault && (
                          <Badge variant="success" size="sm" className="mt-1">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="info" size="sm">
                          {template.questions.length} questions
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTemplate(template);
                          }}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowModal(false);
                setSelectedTemplate(null);
                setSearchQuery('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelect}
              disabled={!selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {selectedTemplate 
                ? `Add ${selectedTemplate.questions.length} Question${selectedTemplate.questions.length > 1 ? 's' : ''} to Form` 
                : 'Select a Template First'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={previewTemplate !== null}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </>
  );
};

// Template Preview Modal Component
const TemplatePreviewModal: React.FC<{
  template: ScreeningTemplate;
  isOpen: boolean;
  onClose: () => void;
}> = ({ template, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={template.name} size="lg">
      <div className="space-y-4">
        {template.description && (
          <p className="text-gray-600 mb-4">{template.description}</p>
        )}
        
        <div className="space-y-3">
          {template.questions.map((question, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
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
      </div>
    </Modal>
  );
};

export { TemplateSelector };

