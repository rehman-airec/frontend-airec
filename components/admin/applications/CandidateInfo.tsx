'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mail, Phone, MapPin, Briefcase, Calendar, User, UserCircle } from 'lucide-react';

interface CandidateInfoProps {
  candidate: any;
  job: any;
  status: string;
  onStatusChange?: (status: string) => void;
  isGuestApplication?: boolean;
}

const CandidateInfo: React.FC<CandidateInfoProps> = ({ 
  candidate, 
  job,
  status,
  onStatusChange,
  isGuestApplication = false
}) => {
  const orderedStatuses = [
    'New',
    'Selected',
    'In Review',
    'Interview',
    'Offer',
    'Hired',
    'Rejected',
    'Decision Pending',
    'Saved for Future',
    'Out of Budget',
    'Shortlisted',
  ];

  const isSelected = (value: string) => status === value;

  if (!candidate) {
    return (
      <div className="p-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Candidate information not available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {candidate?.firstName || 'Unknown'} {candidate?.lastName || ''}
                  </h2>
                  {isGuestApplication && (
                    <div className="flex items-center mt-1 space-x-2">
                      <UserCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">Guest Applicant</span>
                    </div>
                  )}
                </div>
                <Badge variant="info" size="lg">{status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <InfoRow icon={<Mail className="h-5 w-5" />} label="Email" value={candidate?.email || 'Not provided'} />
              <InfoRow icon={<Phone className="h-5 w-5" />} label="Phone" value={candidate?.phone || 'Not provided'} />
              {candidate?.linkedinUrl && (
                <InfoRow 
                  icon={<User className="h-5 w-5" />} 
                  label="LinkedIn" 
                  value={candidate.linkedinUrl} 
                  isLink 
                />
              )}
              <InfoRow 
                icon={<Briefcase className="h-5 w-5" />} 
                label="Experience" 
                value={`${candidate?.totalExperience || 0} years`} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="">
          {/* Status Update */}
          <Card className="shadow-sm">
            <CardHeader className="">
              <h2 className="text-lg font-semibold text-gray-900">Candidate Status</h2>
            </CardHeader>
            <CardContent>
              {/* All statuses in vertical scrollable list - shows first 5, then scroll */}
              <div 
                className="flex flex-col rounded-md border border-gray-200 overflow-hidden max-h-[280px] overflow-y-auto" 
                role="list"
              >
                {orderedStatuses.map((value, index) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onStatusChange?.(value)}
                    className={
                      `flex items-center w-full px-4 py-3 text-left transition-colors ` +
                      (isSelected(value)
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-white text-gray-700 hover:bg-gray-50') +
                      (index !== orderedStatuses.length - 1 ? ' border-b border-gray-200' : '')
                    }
                    aria-pressed={isSelected(value)}
                    aria-label={`Set status to ${value}`}
                  >
                    <span className="font-medium truncate" title={value}>{value}</span>
                    {isSelected(value) && (
                      <span className="ml-auto inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, isLink }: any) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 text-gray-400 mr-3">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-600">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value}
        </a>
      ) : (
        <p className="text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

export { CandidateInfo };
