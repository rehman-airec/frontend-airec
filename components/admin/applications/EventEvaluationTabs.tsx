'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateEventModal } from './CreateEventModal';
import { AddEvaluationModal } from './AddEvaluationModal';
import { EvaluationsList } from './EvaluationsList';
import { EventsList } from './EventsList';
import { useApplicationEvaluations, useApplicationEvents } from '@/hooks/useEventsEvaluations';
import { useUpdateEvaluation } from '@/hooks/useEventsEvaluations';
import { Calendar, Star, Plus } from 'lucide-react';

interface CreateEventTabProps {
  applicationId: string;
  onCreateEvent: (eventData: any) => void;
}

const CreateEventTab: React.FC<CreateEventTabProps> = ({ applicationId, onCreateEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: eventsData, isLoading } = useApplicationEvents(applicationId);
  const events = eventsData?.events || [];

  const handleCreateEvent = async (eventData: any) => {
    await onCreateEvent(eventData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Events</h2>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EventsList applicationId={applicationId} />
        </CardContent>
      </Card>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        applicationId={applicationId}
      />
    </div>
  );
};

interface AddEvaluationTabProps {
  applicationId: string;
  onAddEvaluation: (evaluationData: any) => void;
}

const AddEvaluationTab: React.FC<AddEvaluationTabProps> = ({ applicationId, onAddEvaluation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(null);
  const { data: evaluationsData } = useApplicationEvaluations(applicationId);
  const updateEvaluationMutation = useUpdateEvaluation();
  
  const evaluations = evaluationsData?.evaluations || [];
  const editingEvaluation = editingEvaluationId 
    ? evaluations.find((e: any) => e._id === editingEvaluationId)
    : null;

  const handleEditEvaluation = (evaluationId: string) => {
    setEditingEvaluationId(evaluationId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvaluationId(null);
  };

  const handleSaveEvaluation = async (evaluationData: any) => {
    if (editingEvaluationId) {
      // Update existing evaluation
      await updateEvaluationMutation.mutateAsync({
        evaluationId: editingEvaluationId,
        evaluationData
      });
    } else {
      // Create new evaluation
      await onAddEvaluation(evaluationData);
    }
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Evaluations</h2>
            </div>
            <Button onClick={() => {
              setEditingEvaluationId(null);
              setIsModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Evaluation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EvaluationsList 
            applicationId={applicationId}
            onEditEvaluation={handleEditEvaluation}
          />
        </CardContent>
      </Card>

      <AddEvaluationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddEvaluation={handleSaveEvaluation}
        applicationId={applicationId}
        evaluation={editingEvaluation || undefined}
      />
    </div>
  );
};

export { CreateEventTab, AddEvaluationTab }; 
