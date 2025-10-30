'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EvaluationViewModalProps {
  isOpen: boolean;
  evaluation: any;
  onClose: () => void;
  getRecommendationLabel: (recommendation: string) => string;
  getRecommendationColor: (recommendation: string) => 'success' | 'warning' | 'danger' | 'info';
  isEvaluationEdited: (evaluation: any) => boolean;
}

export const EvaluationViewModal: React.FC<EvaluationViewModalProps> = ({
  isOpen,
  evaluation,
  onClose,
  getRecommendationLabel,
  getRecommendationColor,
  isEvaluationEdited,
}) => {
  if (!isOpen || !evaluation) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Evaluation - {evaluation.overallRating}/5
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={getRecommendationColor(evaluation.recommendation)}
                    size="sm"
                  >
                    {getRecommendationLabel(evaluation.recommendation)}
                  </Badge>
                  {isEvaluationEdited(evaluation) && (
                    <Badge variant="info" size="sm">Edited</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="space-y-4">
            {evaluation.strengths && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Strengths</h4>
                <div 
                  className="text-gray-800 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: evaluation.strengths }}
                />
              </div>
            )}
            {evaluation.areasOfInterest && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Areas of Interest</h4>
                <div 
                  className="text-gray-800 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: evaluation.areasOfInterest }}
                />
              </div>
            )}
            {evaluation.additionalNotes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Notes</h4>
                <div 
                  className="text-gray-800 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: evaluation.additionalNotes }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-200">
              {evaluation.interviewType && (
                <div>
                  <span className="font-medium text-gray-700">Interview Type:</span>{' '}
                  <span className="text-gray-900 capitalize">{evaluation.interviewType}</span>
                </div>
              )}
              {evaluation.duration && (
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>{' '}
                  <span className="text-gray-900">{evaluation.duration} minutes</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Created:</span>{' '}
                <span className="text-gray-900">{formatDate(evaluation.createdAt)}</span>
              </div>
              {isEvaluationEdited(evaluation) && evaluation.editedAt && (
                <div>
                  <span className="font-medium text-gray-700">Edited:</span>{' '}
                  <span className="text-gray-900">{formatDate(evaluation.editedAt)}</span>
                </div>
              )}
              {evaluation.evaluatorId && typeof evaluation.evaluatorId === 'object' && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Evaluator:</span>{' '}
                  <span className="text-gray-900">
                    {evaluation.evaluatorId.name || evaluation.evaluatorId.email || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

