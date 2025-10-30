'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { CvViewer } from './CvViewer';

interface CvViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
  candidateName?: string;
}

const CvViewerModal: React.FC<CvViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  candidateName,
}) => {
  const modalTitle = candidateName 
    ? `${candidateName}'s Resume` 
    : fileName || 'Resume';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="xl"
    >
      <div className="max-h-[80vh] overflow-hidden">
        <CvViewer
          fileUrl={fileUrl}
          fileName={fileName}
          showControls={true}
          initialScale={0.8}
        />
      </div>
    </Modal>
  );
};

export { CvViewerModal };
