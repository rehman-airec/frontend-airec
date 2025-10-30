'use client';

import React from 'react';
import { CandidateInfo } from './CandidateInfo';
import { ResumeViewer } from './ResumeViewer';
import { Questionnaire } from './Questionnaire';

interface ApplicationOverviewProps {
  application: any;
  onStatusChange?: (status: string) => void;
  pendingStatus?: string | null;
}

const ApplicationOverview: React.FC<ApplicationOverviewProps> = ({ 
  application, 
  onStatusChange,
  pendingStatus
}) => {
  return (
    <div className="p-6 space-y-8">
      {/* Candidate Info Section */}
      <div className="scroll-mt-24" id="candidate-info">
        <CandidateInfo 
          candidate={application.candidate} 
          job={application.job}
          status={application.status}
          onStatusChange={onStatusChange}
          pendingStatus={pendingStatus}
          isGuestApplication={application.isGuestApplication}
        />
      </div>

      {/* Resume Section */}
      <div className="scroll-mt-24" id="resume">
        <ResumeViewer 
          resumePath={application.resumePath}
          resumeFilename={application.resumeFilename}
        />
      </div>

      {/* Questionnaire Section */}
      <div className="scroll-mt-24" id="questionnaire">
        <Questionnaire 
          questions={application.screeningAnswers}
          jobQuestions={application.job.screeningQuestions}
        />
      </div>
    </div>
  );
};

export { ApplicationOverview };
