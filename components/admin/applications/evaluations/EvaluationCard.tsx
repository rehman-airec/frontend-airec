'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Star } from 'lucide-react';
import { EvaluationHeader } from './EvaluationHeader';
import { EvaluationInfoRow } from './EvaluationInfoRow';

interface EvaluationCardProps {
  evaluation: any;
  onView: (evaluation: any) => void;
  onEdit?: (evaluationId: string) => void;
  onDelete: (evaluation: any) => void;
  getRecommendationLabel: (recommendation: string) => string;
  getRecommendationColor: (recommendation: string) => 'success' | 'warning' | 'danger' | 'info';
  isEvaluationEdited: (evaluation: any) => boolean;
  stripHtmlTags: (html: string) => string;
  formatDate: (date: string) => string;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  onView,
  onEdit,
  onDelete,
  getRecommendationLabel,
  getRecommendationColor,
  isEvaluationEdited,
  stripHtmlTags,
  formatDate,
}) => {
  return (
    <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <EvaluationHeader
          evaluation={evaluation}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          getRecommendationLabel={getRecommendationLabel}
          getRecommendationColor={getRecommendationColor}
          isEvaluationEdited={isEvaluationEdited}
        />
        <EvaluationInfoRow
          evaluation={evaluation}
          isEvaluationEdited={isEvaluationEdited}
          stripHtmlTags={stripHtmlTags}
          formatDate={formatDate}
        />
      </CardContent>
    </Card>
  );
};

