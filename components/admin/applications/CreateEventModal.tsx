'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { useEmailTemplates, useEmailTemplate } from '@/hooks/useEmailTemplates';
import {
  EventDetailsCard,
  AttendeesCard,
  EmailSettingsCard,
  AttachmentsCard,
  NotesCard,
  calculateEndTime,
  validateEmail,
} from './events';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: any) => void;
  applicationId: string;
  existingEvent?: any;
}

interface Attendee {
  userId: string;
  userType: 'Admin' | 'Candidate';
  email: string;
  name: string;
  role?: string;
}

interface EventData {
  title: string;
  attendees: Attendee[];
  additionalEmails: string[];
  candidateEmails: string[];
  date: string;
  startTime: string;
  endTime: string;
  attachments: File[];
  location: string;
  notes: string;
  privacyEnabled: boolean;
  sendEventDetails: boolean;
  emailTemplateId?: string;
}

interface AvailableAttendees {
  admins: Attendee[];
  candidates: Attendee[];
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
  applicationId,
  existingEvent
}) => {
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    attendees: [],
    additionalEmails: [],
    candidateEmails: [],
    date: '',
    startTime: '',
    endTime: '',
    attachments: [],
    location: '',
    notes: '',
    privacyEnabled: true,
    sendEventDetails: false
  });

  const [newEmail, setNewEmail] = useState('');
  const [newCandidateEmail, setNewCandidateEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableAttendees, setAvailableAttendees] = useState<AvailableAttendees>({ admins: [], candidates: [] });
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: emailTemplatesData } = useEmailTemplates('event');
  const emailTemplates = emailTemplatesData?.templates || [];
  const selectedTemplateData = useEmailTemplate(eventData.emailTemplateId || '');

  useEffect(() => {
    if (existingEvent && isOpen) {
      const date = existingEvent.date ? new Date(existingEvent.date).toISOString().split('T')[0] : '';
      setEventData({
        title: existingEvent.title || '',
        attendees: existingEvent.attendees || [],
        additionalEmails: existingEvent.additionalEmails || [],
        candidateEmails: existingEvent.candidateEmails || [],
        date: date,
        startTime: existingEvent.startTime || '',
        endTime: existingEvent.endTime || '',
        attachments: [],
        location: existingEvent.location || '',
        notes: existingEvent.notes || '',
        privacyEnabled: existingEvent.privacyEnabled !== undefined ? existingEvent.privacyEnabled : true,
        sendEventDetails: existingEvent.sendEventDetails !== undefined ? existingEvent.sendEventDetails : false,
        emailTemplateId: existingEvent.emailTemplateId || undefined
      });
      if (existingEvent.attendees && existingEvent.attendees.length > 0) {
        setSelectedAttendeeIds(existingEvent.attendees.map((a: any) => a.userId));
      }
    } else if (!existingEvent && isOpen) {
      setEventData({
        title: '',
        attendees: [],
        additionalEmails: [],
        candidateEmails: [],
        date: '',
        startTime: '',
        endTime: '',
        attachments: [],
        location: '',
        notes: '',
        privacyEnabled: true,
        sendEventDetails: false
      });
      setSelectedAttendeeIds([]);
      setNewEmail('');
      setNewCandidateEmail('');
    }
  }, [existingEvent, isOpen]);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchAvailableAttendees();
    }
  }, [isOpen, applicationId]);

  const fetchAvailableAttendees = async () => {
    setLoadingAttendees(true);
    try {
      const response = await api.get(API_ROUTES.EVENTS.GET_AVAILABLE_ATTENDEES(applicationId));
      if (response.data.success) {
        setAvailableAttendees(response.data.availableAttendees);
      }
    } catch (error) {
      console.error('Failed to fetch available attendees:', error);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const allAvailableAttendees = [
    ...availableAttendees.admins.map(a => ({ ...a, category: 'Admin' })),
    ...availableAttendees.candidates.map(c => ({ ...c, category: 'Candidate' }))
  ];

  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'startTime' && value) {
        updated.endTime = calculateEndTime(value);
      }
      return updated;
    });
  };

  const handleAddCandidateEmail = () => {
    if (newCandidateEmail.trim() && validateEmail(newCandidateEmail.trim()) && !eventData.candidateEmails.includes(newCandidateEmail.trim())) {
      setEventData(prev => ({
        ...prev,
        candidateEmails: [...prev.candidateEmails, newCandidateEmail.trim()]
      }));
      setNewCandidateEmail('');
    }
  };

  const handleRemoveCandidateEmail = (emailToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      candidateEmails: prev.candidateEmails.filter(email => email !== emailToRemove)
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setEventData(prev => ({
      ...prev,
      emailTemplateId: templateId || undefined
    }));
  };

  const handleAddEmail = () => {
    if (newEmail.trim() && !eventData.additionalEmails.includes(newEmail.trim())) {
      setEventData(prev => ({
        ...prev,
        additionalEmails: [...prev.additionalEmails, newEmail.trim()]
      }));
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      additionalEmails: prev.additionalEmails.filter(email => email !== emailToRemove)
    }));
  };

  const handleAttendeeToggle = (attendee: Attendee) => {
    setSelectedAttendeeIds(prev => {
      const isSelected = prev.includes(attendee.userId);
      const newIds = isSelected 
        ? prev.filter(id => id !== attendee.userId)
        : [...prev, attendee.userId];
      
      const selectedAttendees = allAvailableAttendees
        .filter(a => newIds.includes(a.userId))
        .map(a => ({
          userId: a.userId,
          userType: a.userType,
          email: a.email,
          name: a.name,
          role: a.role
        }));
      
      setEventData(prev => ({
        ...prev,
        attendees: selectedAttendees
      }));
      
      return newIds;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEventData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      setEventData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setEventData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!eventData.title.trim() || !eventData.date || !eventData.startTime || !eventData.endTime) {
      return;
    }

    setIsLoading(true);
    try {
      await onCreateEvent({
        ...eventData,
        applicationId
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
      setEventData({
        title: '',
        attendees: [],
        additionalEmails: [],
        candidateEmails: [],
        date: '',
        startTime: '',
        endTime: '',
        attachments: [],
        location: '',
        notes: '',
        privacyEnabled: true,
        sendEventDetails: false
      });
      setSelectedAttendeeIds([]);
      setNewEmail('');
      setNewCandidateEmail('');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='2xl'>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{existingEvent ? 'Edit Event' : 'Create Event'}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EventDetailsCard
              title={eventData.title}
              location={eventData.location}
              date={eventData.date}
              startTime={eventData.startTime}
              endTime={eventData.endTime}
              onFieldChange={(field, value) => handleInputChange(field as keyof EventData, value)}
            />

            <AttendeesCard
              availableAttendees={availableAttendees}
              loadingAttendees={loadingAttendees}
              selectedAttendeeIds={selectedAttendeeIds}
              onAttendeeToggle={handleAttendeeToggle}
              privacyEnabled={eventData.privacyEnabled}
              onPrivacyChange={(enabled) => handleInputChange('privacyEnabled', enabled)}
              additionalEmails={eventData.additionalEmails}
              newEmail={newEmail}
              onNewEmailChange={setNewEmail}
              onAddEmail={handleAddEmail}
              onRemoveEmail={handleRemoveEmail}
              candidateEmails={eventData.candidateEmails}
              newCandidateEmail={newCandidateEmail}
              onNewCandidateEmailChange={setNewCandidateEmail}
              onAddCandidateEmail={handleAddCandidateEmail}
              onRemoveCandidateEmail={handleRemoveCandidateEmail}
            />

            <EmailSettingsCard
              sendEventDetails={eventData.sendEventDetails}
              onSendEventDetailsChange={(enabled) => handleInputChange('sendEventDetails', enabled)}
              emailTemplateId={eventData.emailTemplateId || ''}
              onTemplateSelect={handleTemplateSelect}
              emailTemplates={emailTemplates}
              selectedTemplate={selectedTemplateData.data?.template || null}
            />
          </div>

          <div className="space-y-6">
            <AttachmentsCard
              attachments={eventData.attachments}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileUpload}
              onRemoveAttachment={handleRemoveAttachment}
            />

            <NotesCard
              notes={eventData.notes}
              onNotesChange={(value) => handleInputChange('notes', value)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!eventData.title.trim() || !eventData.date || !eventData.startTime || !eventData.endTime}
          >
            {existingEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { CreateEventModal };
