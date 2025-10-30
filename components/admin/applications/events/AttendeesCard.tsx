'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Users, Shield, Mail, Plus, X } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

interface Attendee {
  userId: string;
  userType: 'Admin' | 'Candidate';
  email: string;
  name: string;
  role?: string;
}

interface AvailableAttendees {
  admins: Attendee[];
  candidates: Attendee[];
}

interface AttendeesCardProps {
  availableAttendees: AvailableAttendees;
  loadingAttendees: boolean;
  selectedAttendeeIds: string[];
  onAttendeeToggle: (attendee: Attendee) => void;
  privacyEnabled: boolean;
  onPrivacyChange: (enabled: boolean) => void;
  additionalEmails: string[];
  newEmail: string;
  onNewEmailChange: (email: string) => void;
  onAddEmail: () => void;
  onRemoveEmail: (email: string) => void;
  candidateEmails: string[];
  newCandidateEmail: string;
  onNewCandidateEmailChange: (email: string) => void;
  onAddCandidateEmail: () => void;
  onRemoveCandidateEmail: (email: string) => void;
}

export const AttendeesCard: React.FC<AttendeesCardProps> = ({
  availableAttendees,
  loadingAttendees,
  selectedAttendeeIds,
  onAttendeeToggle,
  privacyEnabled,
  onPrivacyChange,
  additionalEmails,
  newEmail,
  onNewEmailChange,
  onAddEmail,
  onRemoveEmail,
  candidateEmails,
  newCandidateEmail,
  onNewCandidateEmailChange,
  onAddCandidateEmail,
  onRemoveCandidateEmail,
}) => {
  const allAvailableAttendees = [
    ...availableAttendees.admins.map(a => ({ ...a, category: 'Admin' })),
    ...availableAttendees.candidates.map(c => ({ ...c, category: 'Candidate' }))
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-600" />
          Attendees
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Attendees
          </label>
          {loadingAttendees ? (
            <div className="flex items-center justify-center py-4">
              <Loader className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Loading attendees...</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableAttendees.admins.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Admins</h4>
                  <div className="space-y-2">
                    {availableAttendees.admins.map(admin => (
                      <label key={admin.userId} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <Checkbox
                          checked={selectedAttendeeIds.includes(admin.userId)}
                          onChange={() => onAttendeeToggle(admin)}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{admin.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({admin.email})</span>
                          {admin.role && (
                            <span className="ml-2 text-xs text-gray-400 capitalize">{admin.role}</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {availableAttendees.candidates.length > 0 && (
                <div className={availableAttendees.admins.length > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Candidates</h4>
                  <div className="space-y-2">
                    {availableAttendees.candidates.map(candidate => (
                      <label key={candidate.userId} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <Checkbox
                          checked={selectedAttendeeIds.includes(candidate.userId)}
                          onChange={() => onAttendeeToggle(candidate)}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({candidate.email})</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {allAvailableAttendees.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No available attendees</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
          <Checkbox
            checked={privacyEnabled}
            onChange={(e) => onPrivacyChange(e.target.checked)}
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 cursor-pointer flex items-center">
              <Shield className="h-4 w-4 mr-2 text-gray-500" />
              Enable Privacy Mode
            </label>
            <p className="text-xs text-gray-500 mt-1">
              When enabled, attendees cannot see the full attendee list. Each attendee will only see themselves.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Additional Email
          </label>
          <div className="flex space-x-2">
            <Input
              value={newEmail}
              onChange={(e) => onNewEmailChange(e.target.value)}
              placeholder="Enter email address"
              type="email"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddEmail}
              disabled={!newEmail.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {additionalEmails.length > 0 && (
            <div className="mt-2 space-y-1">
              {additionalEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm text-gray-700">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveEmail(email)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="h-4 w-4 mr-2 text-orange-600" />
            Candidate Emails
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Add multiple candidate emails manually (separate from attendee selection)
          </p>
          <div className="flex space-x-2">
            <Input
              value={newCandidateEmail}
              onChange={(e) => onNewCandidateEmailChange(e.target.value)}
              placeholder="Enter candidate email"
              type="email"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddCandidateEmail();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddCandidateEmail}
              disabled={!newCandidateEmail.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {candidateEmails.length > 0 && (
            <div className="mt-2 space-y-1">
              {candidateEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded border border-orange-200">
                  <span className="text-sm text-gray-700">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCandidateEmail(email)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

