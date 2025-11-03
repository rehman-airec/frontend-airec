'use client';

import React from 'react';
import { ApplicationOverview } from './ApplicationOverview';
import { NotesSection } from './NotesSection';
import { LogsSection } from './LogsSection';
import { CreateEventTab, AddEvaluationTab } from './EventEvaluationTabs';
import { Tabs } from '@/components/ui/Tabs';
import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import { useCreateEvent, useCreateEvaluation } from '@/hooks/useEventsEvaluations';
import { useApplicationStore } from '@/stores/applicationStore';

interface ApplicationDetailsProps {
  application: any;
  onStatusChange?: (status: string) => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ 
  application, 
  onStatusChange 
}) => {
  const {
    activeTab,
    pendingStatus,
    setActiveTab,
    setPendingStatus,
  } = useApplicationStore();
  const updateStatusMutation = useUpdateApplicationStatus();
  const createEventMutation = useCreateEvent();
  const createEvaluationMutation = useCreateEvaluation();

  const handleStatusChange = async (status: string) => {
    try {
      setPendingStatus(status);
      await updateStatusMutation.mutateAsync({
        id: application._id,
        data: { status }
      });
      onStatusChange?.(status);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setPendingStatus(null);
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      await createEventMutation.mutateAsync({
        applicationId: application._id,
        eventData
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  };

  const handleAddEvaluation = async (evaluationData: any) => {
    try {
      await createEvaluationMutation.mutateAsync({
        applicationId: application._id,
        evaluationData
      });
    } catch (error) {
      console.error('Failed to add evaluation:', error);
      throw error;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'logs', label: 'Logs' },
    { id: 'create_event', label: 'Create Event' },
    { id: 'add_evaluation', label: 'Add Evaluation' },
  ];

  return (
    <div className="bg-white">
      
      <div className="p-6 border border-gray-200 rounded-lg">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
          <div className="mt-6">
            {activeTab === 'overview' && (
              <ApplicationOverview 
                application={application}
                onStatusChange={handleStatusChange}
                pendingStatus={pendingStatus}
              />
            )}
            
            {activeTab === 'notes' && (
              <NotesSection 
                notes={application.notes || []}
                applicationId={application._id}
              />
            )}
            
            {activeTab === 'logs' && (
              <LogsSection 
                logs={application.logs || []}
              />
            )}

            {activeTab === 'create_event' && (
              <CreateEventTab 
                applicationId={application._id}
                onCreateEvent={handleCreateEvent}
              />
            )}

            {activeTab === 'add_evaluation' && (
              <AddEvaluationTab 
                applicationId={application._id}
                onAddEvaluation={handleAddEvaluation}
              />
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export { ApplicationDetails };
