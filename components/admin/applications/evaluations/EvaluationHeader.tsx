'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star, Edit2, Eye, Trash2 } from 'lucide-react';

interface EvaluationHeaderProps {
  evaluation: any;
  onView: (evaluation: any) => void;
  onEdit?: (evaluationId: string) => void;
  onDelete: (evaluation: any) => void;
  getRecommendationLabel: (recommendation: string) => string;
  getRecommendationColor: (recommendation: string) => 'success' | 'warning' | 'danger' | 'info';
  isEvaluationEdited: (evaluation: any) => boolean;
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  evaluation,
  onView,
  onEdit,
  onDelete,
  getRecommendationLabel,
  getRecommendationColor,
  isEvaluationEdited,
}) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-3 mb-1">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-lg font-bold text-gray-900">
              {evaluation.overallRating}
            </span>
            <span className="text-sm text-gray-500">/ 5</span>
          </div>
          <Badge 
            variant={getRecommendationColor(evaluation.recommendation)}
            size="sm"
          >
            {getRecommendationLabel(evaluation.recommendation)}
          </Badge>
          {isEvaluationEdited(evaluation) && (
            <Badge variant="info" size="sm" className="flex items-center gap-1">
              <Edit2 className="h-3 w-3" />
              Edited
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(evaluation)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(evaluation._id)}
            title="Edit Evaluation"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(evaluation)}
          title="Delete Evaluation"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

