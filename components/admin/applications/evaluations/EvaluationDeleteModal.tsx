'use client';

import React from 'react';
import { AlertModal } from '@/components/ui/AlertModal';

interface EvaluationDeleteModalProps {
  isOpen: boolean;
  evaluation: any;
  onClose: () => void;
  onConfirm: () => void;
}

export const EvaluationDeleteModal: React.FC<EvaluationDeleteModalProps> = ({
  isOpen,
  evaluation,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      type="warning"
      title="Delete Evaluation"
      message={`Are you sure you want to delete this evaluation (Rating: ${evaluation?.overallRating}/5)? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      showCancel={true}
      onConfirm={onConfirm}
    />
  );
};

