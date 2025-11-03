'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { Candidate } from '@/hooks/useCandidates';

interface DeleteCandidateModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteCandidateModal: React.FC<DeleteCandidateModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : '';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={isDeleting ? () => {} : onClose}
      size="sm"
      showCloseButton={!isDeleting}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Delete Candidate</h3>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{candidateName}</strong>? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            loading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

