'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { EmailTemplatesManager } from '@/components/admin/settings/EmailTemplatesManager';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAlert } from '@/hooks/useAlert';
import api from '@/lib/axios';
import Link from 'next/link';
import { 
  User, 
  Lock, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Palette
} from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
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
      
      const res = await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      const msg = (res as any)?.data?.message || 'Password updated successfully';
      showSuccess('Success', msg);
    } catch (error) {
      console.error('Password update error:', error);
      const msg = (error as any)?.response?.data?.message || 'Failed to update password';
      showError('Error', msg);
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
              description="For a better experience, manage your password on a dedicated page"
              icon={<Lock className="h-5 w-5 text-blue-600" />}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Go to the secure password page.</p>
                <a href="/admin/settings/security/change-password" className="text-sm text-indigo-600 hover:underline">Open Change Password →</a>
              </div>
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

      case 'notifications':
        return (
          <SettingsSection
            title="Notification Preferences"
            description="Choose what notifications you'd like to receive"
            icon={<Bell className="h-5 w-5 text-blue-600" />}
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
                  <h4 className="text-sm font-medium text-gray-900">New Applications</h4>
                  <p className="text-sm text-gray-600">Get notified when new applications are submitted</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                  <p className="text-sm text-gray-600">Receive weekly summary reports</p>
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

      case 'system':
        return (
          <div className="space-y-6">
            <SettingsSection
              title="System Configuration"
              description="Manage system-wide settings and preferences"
              icon={<Database className="h-5 w-5 text-blue-600" />}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Auto-Archive (days)
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Job Post Duration (days)
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="45">45 days</option>
                    <option value="60">60 days</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Email Templates"
              description="Customize email templates for automated messages"
              icon={<Mail className="h-5 w-5 text-blue-600" />}
            >
              <EmailTemplatesManager category="event" />
            </SettingsSection>
          </div>
        );

      case 'appearance':
        return (
          <SettingsSection
            title="Appearance Settings"
            description="Customize the look and feel of your admin interface"
            icon={<Palette className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500">
                    <div className="h-8 bg-white border rounded mb-2"></div>
                    <p className="text-xs text-center">Light</p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500">
                    <div className="h-8 bg-gray-800 rounded mb-2"></div>
                    <p className="text-xs text-center">Dark</p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500">
                    <div className="h-8 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                    <p className="text-xs text-center">Auto</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sidebar Position
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div className="pt-4">
                <Button>Save Appearance</Button>
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
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">Manage your account and system preferences</p>
        </div>
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

export default AdminSettingsPage;
