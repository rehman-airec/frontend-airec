'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { Badge } from '@/components/ui/Badge';
import { Send, MessageSquare, Clock, User, Edit2, X, Check, AlertCircle } from 'lucide-react';
import { useAddApplicationNote, useUpdateApplicationNote } from '@/hooks/useApplications';
import { formatDate } from '@/lib/utils';

interface NotesSectionProps {
  notes: any[];
  applicationId: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, applicationId }) => {
  const [newNote, setNewNote] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const addNoteMutation = useAddApplicationNote();
  const updateNoteMutation = useUpdateApplicationNote();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNoteMutation.mutateAsync({
        id: applicationId,
        note: newNote.trim()
      });
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleStartEdit = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleSaveEdit = async (index: number) => {
    if (!editText.trim()) return;
    try {
      await updateNoteMutation.mutateAsync({
        id: applicationId,
        noteIndex: index,
        note: editText.trim()
      });
      setEditingIndex(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const isNoteEdited = (note: any) => {
    return !!note.editedAt;
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {notes.length}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Note Section */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Add a new note</span>
              </div>
              
              <WysiwygEditor
                value={newNote}
                onChange={setNewNote}
                placeholder="Write your note here... (Press Ctrl+Enter to save)"
                toolbar="minimal"
                minHeight={120}
                maxHeight={200}
                className="mb-4"
                onKeyDown={handleEditorKeyDown}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Press Ctrl+Enter to save quickly
                </p>
                <Button
                  onClick={handleAddNote}
                  loading={addNoteMutation.isPending || false}
                  disabled={!newNote.trim()}
                  className="flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Add Note</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No notes yet</p>
                <p className="text-gray-400 text-sm mt-2">Add your first note above</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Recent Notes ({notes.length})
                </h3>
                {notes.map((note, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                    {editingIndex === index ? (
                      <div className="space-y-3">
                        <WysiwygEditor
                          value={editText}
                          onChange={setEditText}
                          placeholder="Edit your note..."
                          toolbar="minimal"
                          minHeight={120}
                          maxHeight={200}
                        />
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(index)}
                            loading={updateNoteMutation.isPending || false}
                            disabled={!editText.trim()}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 pt-0.5">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isNoteEdited(note) && (
                                <Badge variant="info" size="sm" className="flex items-center gap-1 text-[10px] px-1.5 py-0">
                                  <Edit2 className="h-2.5 w-2.5" />
                                  Edited
                                </Badge>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{formatDate(note.timestamp)}</span>
                                {isNoteEdited(note) && note.editedAt && (
                                  <>
                                    <span>•</span>
                                    <Edit2 className="h-2.5 w-2.5" />
                                    <span>{formatDate(note.editedAt)}</span>
                                  </>
                                )}
                                {isNoteEdited(note) && note.editedBy && typeof note.editedBy === 'object' && (
                                  <>
                                    <span>•</span>
                                    <span>by {note.editedBy.name || 'Unknown'}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(index, note.text)}
                              className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0 flex-shrink-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div 
                            className="text-sm text-gray-700 leading-snug prose prose-sm max-w-none prose-p:my-0 prose-p:leading-snug prose-ul:my-1 prose-ol:my-1"
                            dangerouslySetInnerHTML={{ __html: note.text }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { NotesSection };
