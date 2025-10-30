'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Edit, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ProfileCardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    joinDate?: string;
    avatar?: string;
    bio?: string;
    experience?: string;
    skills?: string[];
  };
  onEdit?: () => void;
  showEditButton?: boolean;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onEdit,
  showEditButton = true,
  className = '',
}) => {
  const { firstName, lastName, email, phone, location, joinDate, avatar, bio, experience, skills } = user;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${firstName} ${lastName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-semibold text-blue-600">
                    {firstName[0]}{lastName[0]}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {firstName} {lastName}
              </h2>
              <div className="flex items-center text-gray-600 mt-1">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{email}</span>
              </div>
            </div>
          </div>
          
          {showEditButton && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{phone}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          
          {joinDate && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">Joined {formatDate(joinDate)}</span>
            </div>
          )}
          
          {experience && (
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{experience}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">About</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { ProfileCard };
