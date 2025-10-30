'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { useCreateScreeningTemplate } from '@/hooks/useScreeningTemplates';
import { ScreeningTemplate } from '@/hooks/useScreeningTemplates';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: ScreeningTemplate | null;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  
  const createTemplate = useCreateScreeningTemplate();

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description || '');
      setQuestions(template.questions || []);
    } else {
      setName('');
      setDescription('');
      setQuestions([]);
    }
    setError('');
  }, [template, isOpen]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      text: '',
      type: 'text',
      required: true,
      options: [],
      maxLength: undefined,
      placeholder: ''
    }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Template name is required');
      return;
    }
    
    if (!questions || questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    // Validate all questions have text
    const invalidQuestions = questions.filter(q => !q.text || !q.text.trim());
    if (invalidQuestions.length > 0) {
      setError('Please enter text for all questions');
      return;
    }
    
    try {
      await createTemplate.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        questions,
        tags: []
      });
      onClose();
    } catch (error) {
      console.error('Failed to create template:', error);
      setError('Failed to create template. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={template ? 'Edit Template' : 'Create Template'} size="lg">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <Input
          label="Template Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="e.g., Standard Hiring Questions"
        />
        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of when to use this template"
        />
        
        {/* Add Question Button */}
        <div className="flex justify-end">
          <Button 
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            className="flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Question</span>
          </Button>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            {questions.map((question, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Question {idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* Question Text */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <WysiwygEditor
                    value={question.text}
                    onChange={(value) => handleQuestionChange(idx, 'text', value)}
                    placeholder="Enter your question here..."
                    minHeight={80}
                    maxHeight={120}
                    toolbar="minimal"
                  />
                </div>

                {/* Question Type */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionChange(idx, 'type', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Text Response</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="yes-no">Yes/No</option>
                      <option value="rating">Rating Scale</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4 pt-7">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => handleQuestionChange(idx, 'required', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>
                  </div>
                </div>

                {/* Placeholder */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placeholder (optional)
                  </label>
                  <input
                    type="text"
                    value={question.placeholder || ''}
                    onChange={(e) => handleQuestionChange(idx, 'placeholder', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Please enter..."
                  />
                </div>

                {/* Multiple Choice Options */}
                {question.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options *
                    </label>
                    <div className="space-y-2">
                      {question.options?.map((option: string, optIdx: number) => (
                        <div key={optIdx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(question.options || [])];
                              newOptions[optIdx] = e.target.value;
                              handleQuestionChange(idx, 'options', newOptions);
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${optIdx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = question.options?.filter((_: string, i: number) => i !== optIdx) || [];
                              handleQuestionChange(idx, 'options', newOptions);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = [...(question.options || []), ''];
                          handleQuestionChange(idx, 'options', newOptions);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {questions.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Click "Add Question" above to create your first question.
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createTemplate.isPending}
          >
            {createTemplate.isPending ? 'Creating...' : (template ? 'Update' : 'Create')} Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

