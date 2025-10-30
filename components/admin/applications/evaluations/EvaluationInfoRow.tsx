'use client';

import React from 'react';
import { Star, FileText, Clock, User } from 'lucide-react';

interface EvaluationInfoRowProps {
  evaluation: any;
  isEvaluationEdited: (evaluation: any) => boolean;
  stripHtmlTags: (html: string) => string;
  formatDate: (date: string) => string;
}

export const EvaluationInfoRow: React.FC<EvaluationInfoRowProps> = ({
  evaluation,
  isEvaluationEdited,
  stripHtmlTags,
  formatDate,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3 mt-3">
      {evaluation.strengths && (
        <div className="flex items-start gap-1.5">
          <Star className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-500" />
          <div className="min-w-0">
            <span className="font-medium text-gray-700">Strengths: </span>
            <span className="text-gray-600 truncate max-w-[200px]">
              {stripHtmlTags(evaluation.strengths)}
            </span>
          </div>
        </div>
      )}

      {evaluation.areasOfInterest && (
        <div className="flex items-start gap-1.5">
          <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-500" />
          <div className="min-w-0">
            <span className="font-medium text-gray-700">Areas of Interest: </span>
            <span className="text-gray-600 truncate max-w-[200px]">
              {stripHtmlTags(evaluation.areasOfInterest)}
            </span>
          </div>
        </div>
      )}

      {evaluation.additionalNotes && (
        <div className="flex items-start gap-1.5">
          <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-500" />
          <div className="min-w-0">
            <span className="font-medium text-gray-700">Notes: </span>
            <span className="text-gray-600 truncate max-w-[200px]">
              {stripHtmlTags(evaluation.additionalNotes)}
            </span>
          </div>
        </div>
      )}

      {evaluation.interviewType && (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 flex-shrink-0 text-gray-500" />
          <span className="font-medium text-gray-700">Type: </span>
          <span className="text-gray-600 capitalize">{evaluation.interviewType}</span>
          {evaluation.duration && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{evaluation.duration} min</span>
            </>
          )}
        </div>
      )}

      {evaluation.evaluatorId && typeof evaluation.evaluatorId === 'object' && (
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 flex-shrink-0 text-gray-500" />
          <span className="font-medium text-gray-700">Evaluator: </span>
          <span className="text-gray-600 truncate max-w-[150px]">
            {evaluation.evaluatorId.name || evaluation.evaluatorId.email || 'Unknown'}
          </span>
        </div>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <Clock className="h-3 w-3 flex-shrink-0 text-gray-400" />
        <span className="text-gray-500">
          Created {formatDate(evaluation.createdAt)}
          {isEvaluationEdited(evaluation) && evaluation.editedAt && (
            <> • Edited {formatDate(evaluation.editedAt)}</>
          )}
        </span>
      </div>
    </div>
  );
};

