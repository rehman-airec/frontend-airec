'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Calendar, MapPin, Users, FileText, Edit2, Eye, Trash2, Mail } from 'lucide-react';
import { useApplicationEvents, useUpdateEvent, useDeleteEvent } from '@/hooks/useEventsEvaluations';
import { formatDate } from '@/lib/utils';
import { CreateEventModal } from './CreateEventModal';
import toast from 'react-hot-toast';
import { AlertModal } from '@/components/ui/AlertModal';

interface EventsListProps {
  applicationId: string;
}

const EventsList: React.FC<EventsListProps> = ({ applicationId }) => {
  const { data: eventsData, isLoading } = useApplicationEvents(applicationId);
  const events = eventsData?.events || [];
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [viewingEvent, setViewingEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleView = (event: any) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (event: any) => {
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;

    try {
      await deleteEventMutation.mutateAsync(deletingEvent._id);
      toast.success('Event deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingEvent(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
      setIsDeleteModalOpen(false);
      setDeletingEvent(null);
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!editingEvent) return;
    
    try {
      await updateEventMutation.mutateAsync({
        eventId: editingEvent._id,
        eventData
      });
      toast.success('Event updated successfully');
      setIsEditModalOpen(false);
      setEditingEvent(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">Loading events...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">No events created yet</p>
        <p className="text-gray-400 text-sm mt-2">Click "Create Event" to schedule interviews or meetings</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {events.map((event: any) => (
          <Card key={event._id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <div className="flex items-center flex-wrap gap-3 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <Badge 
                      variant={event.status === 'scheduled' ? 'info' : 'success'}
                      size="sm"
                    >
                      {event.status || 'scheduled'}
                    </Badge>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(event)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(event)}
                    title="Edit Event"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(event)}
                    title="Delete Event"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Compact Horizontal Info Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3 mt-3">
                {/* Attendees */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium text-gray-700">Attendees ({event.attendees.length}):</span>
                    <span className="text-gray-600">
                      {event.attendees.slice(0, 2).map((a: any) => a.name || a.email).join(', ')}
                      {event.attendees.length > 2 && ` +${event.attendees.length - 2}`}
                    </span>
                  </div>
                )}

                {/* Additional Emails */}
                {event.additionalEmails?.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium text-gray-700">Additional emails:</span>
                    <span className="text-gray-600 truncate max-w-[200px]">{event.additionalEmails.join(', ')}</span>
                  </div>
                )}

                {/* Candidate Emails */}
                {event.candidateEmails?.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium text-gray-700">Candidate emails:</span>
                    <span className="text-gray-600 truncate max-w-[200px]">{event.candidateEmails.join(', ')}</span>
                  </div>
                )}

                {/* Attachments */}
                {event.attachments && event.attachments.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium text-gray-700">Attachments ({event.attachments.length}):</span>
                    <span className="text-gray-600 truncate max-w-[150px]">
                      {event.attachments[0]?.originalName || event.attachments[0]?.filename}
                      {event.attachments.length > 1 && ` +${event.attachments.length - 1}`}
                    </span>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <Clock className="h-3 w-3 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-500">Created {formatDate(event.createdAt)}</span>
                </div>
              </div>

              {/* Notes - Truncated */}
              {event.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-1.5">
                    <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-500" />
                    <div className="text-xs text-gray-700">
                      <span className="font-medium text-gray-700">Notes: </span>
                      <span 
                        className="line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: event.notes.replace(/<[^>]*>/g, ' ').substring(0, 150) + (event.notes.replace(/<[^>]*>/g, ' ').length > 150 ? '...' : '') }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <CreateEventModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingEvent(null);
          }}
          onCreateEvent={handleUpdateEvent}
          applicationId={applicationId}
          existingEvent={editingEvent}
        />
      )}

      {/* View Modal */}
      {viewingEvent && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center ${isViewModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsViewModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{viewingEvent.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsViewModalOpen(false)}>
                  ×
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>{' '}
                    <span className="text-gray-900">{new Date(viewingEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>{' '}
                    <span className="text-gray-900">{viewingEvent.startTime} - {viewingEvent.endTime}</span>
                  </div>
                  {viewingEvent.location && (
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>{' '}
                      <span className="text-gray-900">{viewingEvent.location}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>{' '}
                    <Badge variant={viewingEvent.status === 'scheduled' ? 'info' : 'success'} size="sm">
                      {viewingEvent.status || 'scheduled'}
                    </Badge>
                  </div>
                </div>

                {viewingEvent.attendees && viewingEvent.attendees.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Attendees ({viewingEvent.attendees.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingEvent.attendees.map((attendee: any, index: number) => (
                        <Badge key={index} variant="default" size="sm">
                          {attendee.name || attendee.email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(viewingEvent.additionalEmails?.length > 0 || viewingEvent.candidateEmails?.length > 0) && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Email Recipients</h4>
                    <div className="space-y-1 text-sm">
                      {viewingEvent.additionalEmails?.length > 0 && (
                        <div>
                          <span className="font-medium">Additional: </span>
                          <span>{viewingEvent.additionalEmails.join(', ')}</span>
                        </div>
                      )}
                      {viewingEvent.candidateEmails?.length > 0 && (
                        <div>
                          <span className="font-medium">Candidates: </span>
                          <span>{viewingEvent.candidateEmails.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {viewingEvent.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                    <div 
                      className="text-gray-800 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: viewingEvent.notes }}
                    />
                  </div>
                )}

                {viewingEvent.attachments && viewingEvent.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments ({viewingEvent.attachments.length})</h4>
                    <div className="space-y-1">
                      {viewingEvent.attachments.map((attachment: any, index: number) => (
                        <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                          {attachment.originalName || attachment.filename}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEvent(null);
        }}
        type="warning"
        title="Delete Event"
        message={`Are you sure you want to delete the event "${deletingEvent?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export { EventsList };

