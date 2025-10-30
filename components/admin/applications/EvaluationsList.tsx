'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Star } from 'lucide-react';
import { useApplicationEvaluations, useDeleteEvaluation } from '@/hooks/useEventsEvaluations';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  EvaluationCard,
  EvaluationViewModal,
  EvaluationDeleteModal,
  getRecommendationLabel,
  getRecommendationColor,
  isEvaluationEdited,
  stripHtmlTags,
} from './evaluations';

interface EvaluationsListProps {
  applicationId: string;
  onEditEvaluation?: (evaluationId: string) => void;
}

const EvaluationsList: React.FC<EvaluationsListProps> = ({ 
  applicationId,
  onEditEvaluation
}) => {
  const { data: evaluationsData, isLoading } = useApplicationEvaluations(applicationId);
  const evaluations = evaluationsData?.evaluations || [];
  const [viewingEvaluation, setViewingEvaluation] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingEvaluation, setDeletingEvaluation] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteEvaluationMutation = useDeleteEvaluation();

  const handleView = (evaluation: any) => {
    setViewingEvaluation(evaluation);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (evaluation: any) => {
    setDeletingEvaluation(evaluation);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvaluation) return;

    try {
      await deleteEvaluationMutation.mutateAsync(deletingEvaluation._id);
      toast.success('Evaluation deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingEvaluation(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete evaluation');
      setIsDeleteModalOpen(false);
      setDeletingEvaluation(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">Loading evaluations...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {evaluations.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No evaluations yet</p>
            <p className="text-gray-400 text-sm mt-2">Add your first evaluation above</p>
          </div>
        ) : (
          evaluations.map((evaluation: any) => (
            <EvaluationCard
              key={evaluation._id}
              evaluation={evaluation}
              onView={handleView}
              onEdit={onEditEvaluation}
              onDelete={handleDeleteClick}
              getRecommendationLabel={getRecommendationLabel}
              getRecommendationColor={getRecommendationColor}
              isEvaluationEdited={isEvaluationEdited}
              stripHtmlTags={stripHtmlTags}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      <EvaluationViewModal
        isOpen={isViewModalOpen}
        evaluation={viewingEvaluation}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingEvaluation(null);
        }}
        getRecommendationLabel={getRecommendationLabel}
        getRecommendationColor={getRecommendationColor}
        isEvaluationEdited={isEvaluationEdited}
      />

      <EvaluationDeleteModal
        isOpen={isDeleteModalOpen}
        evaluation={deletingEvaluation}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEvaluation(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export { EvaluationsList };
