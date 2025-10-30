'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { HelpCircle, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { ScreeningQuestion } from '@/types/job.types';

const screeningAnswersSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string().min(1, 'Answer is required'),
  })),
});

type ScreeningAnswersFormData = z.infer<typeof screeningAnswersSchema>;

interface ScreeningAnswersFormProps {
  questions: ScreeningQuestion[];
  onSubmit: (data: ScreeningAnswersFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const ScreeningAnswersForm: React.FC<ScreeningAnswersFormProps> = ({
  questions,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScreeningAnswersFormData>({
    resolver: zodResolver(screeningAnswersSchema),
    defaultValues: {
      answers: questions.map(q => ({
        questionId: q.questionId,
        answer: '',
      })),
    },
  });

  const watchedAnswers = watch('answers');

  const handleFormSubmit = (data: ScreeningAnswersFormData) => {
    onSubmit(data);
  };

  const handleAnswerChange = (index: number, value: string) => {
    if (value.trim()) {
      setAnsweredQuestions(prev => new Set([...prev, index]));
    } else {
      setAnsweredQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
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

  const renderQuestion = (question: ScreeningQuestion, index: number) => {
    const isAnswered = answeredQuestions.has(index);
    const hasError = errors.answers?.[index]?.answer;

    return (
      <Card key={question.questionId} className={`border-l-4 ${
        isAnswered ? 'border-l-green-500 bg-green-50' : 
        hasError ? 'border-l-red-500 bg-red-50' : 
        'border-l-blue-500'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isAnswered ? 'bg-green-100 text-green-600' : 
                hasError ? 'bg-red-100 text-red-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{getQuestionIcon(question.type)}</span>
                <h3 className="text-lg font-medium text-gray-900">
                  {question.text}
                </h3>
                {question.required && (
                  <span className="text-red-500 text-sm">*</span>
                )}
              </div>
              
              {(question.type === 'text' || question.type === 'short-text' || question.type === 'long-text') && (
                <div className="space-y-2">
                  {question.type === 'short-text' ? (
                    <textarea
                      {...register(`answers.${index}.answer`)}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder={question.placeholder || "Your answer..."}
                      maxLength={question.maxLength || 500}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <WysiwygEditor
                      value={watchedAnswers[index]?.answer || ''}
                      onChange={(value) => {
                        setValue(`answers.${index}.answer`, value);
                        handleAnswerChange(index, value);
                      }}
                      placeholder={question.placeholder || "Your answer..."}
                      toolbar={question.type === 'long-text' ? "full" : "minimal"}
                      minHeight={question.type === 'long-text' ? 200 : 120}
                      maxLength={question.maxLength}
                      error={hasError ? errors.answers?.[index]?.answer?.message : undefined}
                    />
                  )}
                  {question.maxLength && (
                    <p className="text-xs text-gray-500">
                      {question.type === 'short-text' ? 
                        `${(watchedAnswers[index]?.answer || '').length}/${question.maxLength} characters` :
                        `Maximum ${question.maxLength} characters`
                      }
                    </p>
                  )}
                </div>
              )}

              {question.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {question.options?.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        value={option}
                        {...register(`answers.${index}.answer`)}
                        className="text-blue-600 focus:ring-blue-500"
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                      />
                      <span className="text-sm text-gray-700 flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'yes-no' && (
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="Yes"
                      {...register(`answers.${index}.answer`)}
                      className="text-green-600 focus:ring-green-500"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                    <span className="text-sm font-medium text-green-700">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value="No"
                      {...register(`answers.${index}.answer`)}
                      className="text-red-600 focus:ring-red-500"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                    <span className="text-sm font-medium text-red-700">No</span>
                  </label>
                </div>
              )}

              {question.type === 'rating' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate from 1 to 10</span>
                    <span className="text-sm text-gray-500">1 (Poor) - 10 (Excellent)</span>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          value={rating.toString()}
                          {...register(`answers.${index}.answer`)}
                          className="sr-only"
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                          watchedAnswers[index]?.answer === rating.toString()
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}>
                          <Star className="h-5 w-5" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {hasError && (
                <div className="flex items-center space-x-2 mt-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.answers?.[index]?.answer?.message}</span>
                </div>
              )}

              {isAnswered && !hasError && (
                <div className="flex items-center space-x-2 mt-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Answered</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const progressPercentage = (answeredQuestions.size / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Screening Questions</h2>
              <p className="text-gray-600 mt-1">
                Please answer the following questions to complete your application
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {answeredQuestions.size} of {questions.length} answered
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {questions.map((question, index) => renderQuestion(question, index))}

        {/* Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={onBack}>
                Back to Resume Upload
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {answeredQuestions.size === questions.length ? (
                    <span className="text-green-600 font-medium">All questions answered ✓</span>
                  ) : (
                    <span>{questions.length - answeredQuestions.size} questions remaining</span>
                  )}
                </div>
                <Button 
                  type="submit" 
                  loading={isLoading}
                  disabled={answeredQuestions.size !== questions.length}
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export { ScreeningAnswersForm };