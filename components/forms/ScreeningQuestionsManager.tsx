'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { Plus, Trash2, GripVertical, HelpCircle, AlertCircle } from 'lucide-react';
import { ScreeningQuestion, ScreeningQuestionFormData } from '@/types/job.types';
import { TemplateSelector } from './TemplateSelector';

const screeningQuestionsSchema = z.object({
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['text', 'short-text', 'long-text', 'multiple-choice', 'yes-no', 'rating']),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    maxLength: z.number().optional(),
    placeholder: z.string().optional(),
    correctAnswer: z.string().optional(),
  })).default([]),
});

type ScreeningQuestionsZodData = z.infer<typeof screeningQuestionsSchema>;

interface ScreeningQuestionsManagerProps {
  initialQuestions?: ScreeningQuestion[];
  onSubmit: (data: { questions: ScreeningQuestionFormData[] }) => void;
  onBack: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const ScreeningQuestionsManager: React.FC<ScreeningQuestionsManagerProps> = ({
  initialQuestions = [],
  onSubmit,
  onBack,
  isLoading = false,
  isEdit = false,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const questionsContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScreeningQuestionsZodData>({
    resolver: zodResolver(screeningQuestionsSchema) as any,
    defaultValues: {
      questions: initialQuestions.length > 0 ? initialQuestions.map(q => ({
        text: q.text,
        type: q.type,
        required: q.required,
        options: q.options || [],
        maxLength: q.maxLength,
        placeholder: q.placeholder,
        correctAnswer: q.correctAnswer,
      })) : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');
  

  const questionTypes = [
    { value: 'text', label: 'Text Response', tooltip: 'General text input field' },
    { value: 'short-text', label: 'Short Answer', tooltip: 'Brief text response (1-2 sentences)' },
    { value: 'long-text', label: 'Long Answer', tooltip: 'Detailed text response (paragraph or more)' },
    { value: 'multiple-choice', label: 'Multiple Choice', tooltip: 'Select one option from a list' },
    { value: 'yes-no', label: 'Yes/No', tooltip: 'Simple yes or no response' },
    { value: 'rating', label: 'Rating Scale', tooltip: 'Rate on a numerical scale' },
  ];

  const addQuestion = () => {
    append({
      text: '',
      type: 'text',
      required: true,
      options: [],
      maxLength: undefined,
      placeholder: '',
      correctAnswer: '',
    });
  };

  const removeQuestion = (index: number) => {
    remove(index);
    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(null);
    }
  };

  const handleFormSubmit = (data: ScreeningQuestionsZodData) => {
    // Ensure we always have a questions array, even if empty
    // Remove questionId from each question since backend will generate it
    // Strip HTML tags from question text for validation and storage
    const stripHtml = (html: string) => {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };
    
    const submitData = {
      questions: (data.questions || []).map(q => ({
        text: stripHtml(q.text).trim(),
        type: q.type,
        required: q.required,
        options: q.options,
        maxLength: q.maxLength,
        placeholder: q.placeholder,
        correctAnswer: q.correctAnswer,
      }))
    };
    
    onSubmit(submitData);
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'short-text': return '📝';
      case 'long-text': return '📄';
      case 'multiple-choice': return '🔘';
      case 'yes-no': return '✅';
      case 'rating': return '⭐';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6" ref={questionsContainerRef}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Screening Questions</h2>
              <p className="text-gray-600 mt-1">
                Create questions to pre-screen candidates and gather important information
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <TemplateSelector 
              onSelectTemplate={(questions) => {
                console.log('Adding questions from template:', questions);
                const currentFieldsCount = fields.length;
                
                // Add questions from template
                questions.forEach((q, idx) => {
                  append({
                    text: q.text,
                    type: q.type,
                    required: q.required,
                    options: q.options || [],
                    maxLength: q.maxLength,
                    placeholder: q.placeholder,
                    correctAnswer: q.correctAnswer,
                  });
                });
                
                // Auto-expand the first added question
                setActiveQuestionIndex(currentFieldsCount);
                
                // Scroll to the newly added questions after a brief delay
                setTimeout(() => {
                  questionsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
                
                console.log('Questions added. Total fields:', fields.length + questions.length);
                toast.success(`Added ${questions.length} question${questions.length > 1 ? 's' : ''} from template`);
              }}
            />
            <Button
              type="button"
              onClick={addQuestion}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Validation Errors Summary */}
          {Array.isArray(errors.questions) && errors.questions.some(Boolean) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-sm font-medium text-red-800">Please fix the form errors before continuing</h3>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
            {fields.map((field, index) => {
              const hasErrors = errors.questions?.[index];
              return (
              <Card key={field.id} className={`border-l-4 ${hasErrors ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className="text-2xl">
                        {getQuestionIcon(watchedQuestions[index]?.type || 'text')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveQuestionIndex(
                          activeQuestionIndex === index ? null : index
                        )}
                      >
                        {activeQuestionIndex === index ? 'Collapse' : 'Edit'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {activeQuestionIndex === index && (
                    <div className="space-y-4">
                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text *
                        </label>
                        <WysiwygEditor
                          value={watch(`questions.${index}.text`) || ''}
                          onChange={(value) => setValue(`questions.${index}.text`, value, { shouldValidate: true, shouldDirty: true })}
                          placeholder="Enter your question here..."
                          minHeight={80}
                          maxHeight={120}
                          toolbar="minimal"
                        />
                        {errors.questions?.[index]?.text && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.questions[index]?.text?.message}
                          </p>
                        )}
                      </div>

                      {/* Question Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type *
                          </label>
                          <div className="relative">
                            <select
                              {...register(`questions.${index}.type`)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-10"
                            >
                              {questionTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            {/* Tooltip for selected question type */}
                            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                              <div className="group relative">
                                <div className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-help">
                                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </div>
                                <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 shadow-lg">
                                  <div className="font-medium mb-1">
                                    {questionTypes.find(t => t.value === watchedQuestions[index]?.type)?.label || 'Question Type'}
                                  </div>
                                  <div className="text-gray-300">
                                    {questionTypes.find(t => t.value === watchedQuestions[index]?.type)?.tooltip || 'Select a question type'}
                                  </div>
                                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {errors.questions?.[index]?.type && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.questions[index]?.type?.message}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              {...register(`questions.${index}.required`)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Required</span>
                          </label>
                        </div>
                      </div>

                      {/* Multiple Choice Options */}
                      {watchedQuestions[index]?.type === 'multiple-choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer Options *
                          </label>
                          <div className="space-y-2">
                            {watchedQuestions[index]?.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(watchedQuestions[index]?.options || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    setValue(`questions.${index}.options`, newOptions);
                                    // No auto-clear for correct answer
                                  }}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newOptions = watchedQuestions[index]?.options?.filter((_, i) => i !== optionIndex) || [];
                                    setValue(`questions.${index}.options`, newOptions);
                                    // No auto-clear for correct answer
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newOptions = [...(watchedQuestions[index]?.options || []), ''];
                                setValue(`questions.${index}.options`, newOptions);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                          {/* No inline options validation error */}
                          
                          {/* Correct Answer Selection for Multiple Choice */}
                          {watchedQuestions[index]?.options && watchedQuestions[index]?.options.length > 0 && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correct Answer (Optional)
                              </label>
                              <div className="relative">
                                <select
                                  {...register(`questions.${index}.correctAnswer`)}
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-10"
                                >
                                  <option value="">Select correct answer...</option>
                                  {watchedQuestions[index]?.options?.filter(opt => opt.trim()).map((option, optionIndex) => (
                                    <option key={optionIndex} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Mark the correct answer to enable candidate filtering based on responses
                              </p>
                              {/* No inline correctAnswer validation error */}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Text Response Settings */}
                      {watchedQuestions[index]?.type === 'text' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Length (characters)
                            </label>
                            <Input
                              type="number"
                              {...register(`questions.${index}.maxLength`, { 
                                valueAsNumber: true 
                              })}
                              placeholder="500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Placeholder Text
                            </label>
                            <Input
                              {...register(`questions.${index}.placeholder`)}
                              placeholder="Enter your answer here..."
                            />
                          </div>
                        </div>
                      )}

                      {/* Rating Scale Settings */}
                      {watchedQuestions[index]?.type === 'rating' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating Scale (1-10)
                          </label>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">1 (Poor)</span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <div key={num} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                  {num}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">10 (Excellent)</span>
                          </div>
                        </div>
                      )}

                      {/* Correct Answer Selection for Yes/No Questions */}
                      {watchedQuestions[index]?.type === 'yes-no' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answer (Optional)
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="Yes"
                                {...register(`questions.${index}.correctAnswer`)}
                                className="text-green-600 focus:ring-green-500"
                              />
                              <span className="text-sm font-medium text-green-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="No"
                                {...register(`questions.${index}.correctAnswer`)}
                                className="text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm font-medium text-red-700">No</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value=""
                                {...register(`questions.${index}.correctAnswer`)}
                                className="text-gray-600 focus:ring-gray-500"
                              />
                              <span className="text-sm font-medium text-gray-700">No correct answer</span>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Mark the correct answer to enable candidate filtering based on responses
                          </p>
                          {/* No inline correctAnswer validation error */}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question Preview */}
                  {activeQuestionIndex !== index && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {watchedQuestions[index]?.text || 'Untitled Question'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="capitalize">{watchedQuestions[index]?.type}</span>
                            {watchedQuestions[index]?.required && (
                              <span className="text-red-600">Required</span>
                            )}
                            {watchedQuestions[index]?.type === 'multiple-choice' && (
                              <span>{watchedQuestions[index]?.options?.length || 0} options</span>
                            )}
                            {watchedQuestions[index]?.correctAnswer && (
                              <span className="text-green-600 font-medium">✓ Correct answer set</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              );
            })}

            {fields.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Screening Questions</h3>
                <p className="text-gray-600 mb-4">
                  You can add screening questions to pre-qualify candidates, or continue without any questions.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button type="button" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleFormSubmit({ questions: [] })}>
                    Continue Without Questions
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button 
                type="submit" 
                loading={isLoading}
              >
                Continue to Workflow
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { ScreeningQuestionsManager };
