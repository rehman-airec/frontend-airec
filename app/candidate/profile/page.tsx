'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, useProfileStats } from '@/hooks/useProfile';
import { useCandidateApplications } from '@/hooks/useApplications';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { ResumeUploadForm } from '@/components/forms/ResumeUploadForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAlert } from '@/hooks/useAlert';
import { ProfileSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { useProfileStore } from '@/stores/profileStore';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye,
  Calendar,
  MapPin,
  Briefcase,
  RefreshCw,
  X,
  Heart
} from 'lucide-react';

const CandidateProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const {
    isEditing,
    showResumeModal,
    resumeUploading,
    setIsEditing,
    setShowResumeModal,
    setResumeUploading,
  } = useProfileStore();
  
  // API Hooks
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: profileStats, isLoading: statsLoading } = useProfileStats();
  const { data: applicationsData, isLoading: applicationsLoading } = useCandidateApplications({ 
    limit: 3, 
    page: 1 
  });
  const updateProfileMutation = useUpdateProfile();

  // Process profile data
  const profileData = profile ? {
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.profile?.experience?.[0]?.company || 'Not specified',
    joinDate: profile.createdAt || '',
    bio: profile.profile?.bio || '',
    experience: profile.totalExperience ? `${profile.totalExperience} years` : 'Not specified',
    skills: profile.profile?.skills || [],
    avatar: profile.profile?.avatar,
  } : null;

  // Recent applications from API
  const applications = (applicationsData && typeof applicationsData === 'object' && 'applications' in applicationsData
    ? (applicationsData as { applications: any[] }).applications 
    : []).map((app: any) => ({
    id: app._id,
    jobTitle: app.job?.title || 'Unknown Position',
    company: app.job?.department || 'Unknown Company', // Use department as company for now
    status: app.status,
    appliedDate: app.createdAt,
    location: app.job?.location ? 
      `${app.job.location.city}, ${app.job.location.country}` : 
      'Not specified'
  })) || [];

  const handleProfileUpdate = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    experience?: string;
    skills?: string[];
  }) => {
    try {
      // Extract experience years from string (e.g., "3-5 years" -> 4)
      const experienceYears = data.experience ? 
        parseInt(data.experience.match(/\d+/)?.[0] || '0') : 
        profile?.totalExperience || 0;

      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        totalExperience: experienceYears,
        profile: {
          bio: data.bio,
          skills: data.skills || [],
        }
      };

      await updateProfileMutation.mutateAsync(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      showError('Error', 'Failed to update profile');
    }
  };

  // Quick Action handlers
  const handleBrowseJobs = () => {
    router.push('/candidate/jobs/list');
  };

  const handleViewApplications = () => {
    router.push('/candidate/applications');
  };

  const handleUpdateResume = () => {
    setShowResumeModal(true);
  };

  const handleViewSavedJobs = () => {
    router.push('/candidate/jobs/saved');
  };

  const handleResumeUpload = async (file: File) => {
    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await api.post(API_ROUTES.FILES.UPLOAD_RESUME, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      showSuccess('Success', 'Resume uploaded successfully');
      setShowResumeModal(false);
      
      // Refresh profile data to show updated resume info
      window.location.reload();
    } catch (error: any) {
      console.error('Resume upload error:', error);
      showError('Error', error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeDownload = () => {
    // TODO: Get actual resume file from applications
    if (applications.length > 0) {
      showSuccess('Info', 'Resume download will be available through your applications');
    } else {
      showSuccess('Info', 'No resume files found. Upload one when applying for jobs');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-gray-100 text-gray-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profile: any) => {
    if (!profile) return 0;
    
    let completed = 0;
    const total = 8;
    
    if (profile.firstName) completed++;
    if (profile.lastName) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.bio) completed++;
    if (profile.experience !== 'Not specified') completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    if (profile.avatar) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Get completion tip based on missing fields
  const getCompletionTip = (profile: any) => {
    if (!profile) return 'Complete your profile';
    
    const missing = [];
    if (!profile.phone) missing.push('phone');
    if (!profile.bio) missing.push('bio');
    if (profile.experience === 'Not specified') missing.push('experience');
    if (!profile.skills || profile.skills.length === 0) missing.push('skills');
    if (!profile.avatar) missing.push('avatar');
    
    if (missing.length === 0) return 'Your profile is complete!';
    if (missing.length === 1) return `Add your ${missing[0]} to complete profile`;
    return `Add ${missing.slice(0, 2).join(' and ')} to improve completion`;
  };

  // Loading state
  if (profileLoading || applicationsLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileSkeleton />
            
            {/* Recent Applications Skeleton */}
            <CardSkeleton />
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <RefreshCw className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Failed to load profile</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              There was an error loading your profile data.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile data
  if (!profileData) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Profile data not available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <ProfileEditForm
          initialData={profileData}
          onSave={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={updateProfileMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your profile information and view your applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard
            user={profileData}
            onEdit={() => setIsEditing(true)}
            showEditButton={true}
          />

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                  <p className="text-sm text-gray-600">Your latest job applications</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewApplications}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{application.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{application.company}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(application.appliedDate)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{application.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No applications yet</p>
                  <p className="text-sm text-gray-500">Start applying to jobs to see them here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resume Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
              <p className="text-sm text-gray-600">Manage your resume</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">resume.pdf</p>
                    <p className="text-xs text-gray-500">Updated 2 days ago</p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResumeDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleUpdateResume}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Resume
              </Button>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Profile Stats</h3>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="pt-2">
                    <div className="bg-gray-200 rounded-full h-2 animate-pulse"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse mt-1"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {profileStats?.profileViews || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {profileStats?.applicationsCount || applications.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-lg font-semibold text-green-600">
                      {profileStats?.profileCompletionPercentage || 
                        calculateProfileCompletion(profileData)}%
                    </span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${profileStats?.profileCompletionPercentage || 
                            calculateProfileCompletion(profileData)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getCompletionTip(profileData)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleBrowseJobs}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleViewSavedJobs}
              >
                <Heart className="h-4 w-4 mr-2" />
                View Saved Jobs
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleViewApplications}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Applications
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleUpdateResume}
              >
                <FileText className="h-4 w-4 mr-2" />
                Update Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resume Upload Modal */}
      <Modal 
        isOpen={showResumeModal} 
        onClose={() => setShowResumeModal(false)}
        title="Update Resume"
      >
        <div className="p-6">
          <ResumeUploadForm 
            onUpload={handleResumeUpload}
            isLoading={resumeUploading}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CandidateProfilePage;
