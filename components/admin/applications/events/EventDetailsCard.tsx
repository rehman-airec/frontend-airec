'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Calendar } from 'lucide-react';

interface EventDetailsCardProps {
  title: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  onFieldChange: (field: string, value: any) => void;
}

export const EventDetailsCard: React.FC<EventDetailsCardProps> = ({
  title,
  location,
  date,
  startTime,
  endTime,
  onFieldChange,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Event Details
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <Input
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => onFieldChange('location', e.target.value)}
            placeholder="Enter location"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => onFieldChange('date', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => onFieldChange('startTime', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time *
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => onFieldChange('endTime', e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

