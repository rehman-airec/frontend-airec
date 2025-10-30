'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { Clock } from 'lucide-react';

interface NotesCardProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export const NotesCard: React.FC<NotesCardProps> = ({
  notes,
  onNotesChange,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          Notes
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-3">
          These notes are visible only to the selected attendees.
        </p>
        <WysiwygEditor
          value={notes}
          onChange={onNotesChange}
          placeholder="Add notes for the event..."
          minHeight={150}
          maxHeight={250}
        />
      </CardContent>
    </Card>
  );
};

