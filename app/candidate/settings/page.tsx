'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAlert } from '@/hooks/useAlert';
import { 
  User, 
  Lock, 
  Bell, 
  Shield,
  Eye,
  Mail
} from 'lucide-react';

const CandidateSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  // Account Settings Form
  const accountFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      value: user?.firstName || '',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text' as const,
      value: user?.lastName || '',
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      value: user?.email || '',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text' as const,
      value: user?.phone || '',
      placeholder: '(555) 123-4567',
    },
  ];

  // Security Settings Form
  const securityFields = [
    {
      name: 'currentPassword',
      label: 'Current Password',
      type: 'password' as const,
      value: '',
      required: true,
    },
    {
      name: 'newPassword',
      label: 'New Password',
      type: 'password' as const,
      value: '',
      required: true,
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password' as const,
      value: '',
      required: true,
    },
  ];

  const handleAccountUpdate = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      // TODO: Implement API call to update account info
      console.log('Updating account:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showSuccess('Success', 'Account information updated successfully');
    } catch (error) {
      console.error('Account update error:', error);
      showError('Error', 'Failed to update account information');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      if (data.newPassword !== data.confirmPassword) {
        showError('Error', 'Passwords do not match');
        return;
      }
      
      // TODO: Implement API call to update password
      console.log('Updating password');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showSuccess('Success', 'Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      showError('Error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <SettingsSection
            title="Account Information"
            description="Manage your personal information and contact details"
            icon={<User className="h-5 w-5 text-blue-600" />}
          >
            <SettingsForm
              fields={accountFields}
              onSubmit={handleAccountUpdate}
              isLoading={loading}
              submitLabel="Update Account"
            />
          </SettingsSection>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <SettingsSection
              title="Change Password"
              description="Update your password to keep your account secure"
              icon={<Lock className="h-5 w-5 text-blue-600" />}
            >
              <SettingsForm
                fields={securityFields}
                onSubmit={handlePasswordUpdate}
                isLoading={loading}
                submitLabel="Update Password"
              />
            </SettingsSection>

            <SettingsSection
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              icon={<Shield className="h-5 w-5 text-blue-600" />}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Two-factor authentication is not enabled for your account.
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </SettingsSection>
          </div>
        );

      case 'privacy':
        return (
          <SettingsSection
            title="Privacy Settings"
            description="Control your profile visibility and data sharing preferences"
            icon={<Eye className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                  <p className="text-sm text-gray-600">Make your profile visible to recruiters</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                  <p className="text-sm text-gray-600">Allow recruiters to see your contact details</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Application Status</h4>
                  <p className="text-sm text-gray-600">Share application status with other platforms</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Data Analytics</h4>
                  <p className="text-sm text-gray-600">Help improve our service by sharing usage data</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="pt-4">
                <Button>Save Privacy Settings</Button>
              </div>
            </div>
          </SettingsSection>
        );

      case 'notifications':
        return (
          <SettingsSection
            title="Notification Preferences"
            description="Choose what notifications you'd like to receive"
            icon={<Mail className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Application Updates</h4>
                  <p className="text-sm text-gray-600">Get notified about your application status</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Job Recommendations</h4>
                  <p className="text-sm text-gray-600">Receive personalized job recommendations</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
                  <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CandidateSettingsPage;
