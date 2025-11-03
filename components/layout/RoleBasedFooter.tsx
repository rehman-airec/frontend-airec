'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import { Briefcase, Users, Settings, LogOut, Heart, Shield, HelpCircle } from 'lucide-react';

interface RoleBasedFooterProps {
  className?: string;
}

/**
 * Role-Based Footer Component
 * 
 * Displays different footer content based on user role:
 * - Super Admin: Platform management links
 * - Admin: Company-specific links and tenant info
 * - Candidate: Job search and profile links
 */
export const RoleBasedFooter: React.FC<RoleBasedFooterProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { tenant } = useTenant();

  // Get quick links based on role
  const getQuickLinks = () => {
    if (!isAuthenticated || !user) {
      return [
        { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
        { href: '/home', label: 'About Us', icon: HelpCircle },
      ];
    }

    switch (user.role) {
      case 'superadmin':
        return [
          { href: '/superadmin', label: 'Dashboard', icon: Briefcase },
          { href: '/superadmin/tenants', label: 'Manage Tenants', icon: Users },
          { href: '/superadmin/settings', label: 'Settings', icon: Settings },
        ];
      
      case 'admin':
      case 'recruiter':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: Briefcase },
          { href: '/admin/jobs/list', label: 'Jobs', icon: Briefcase },
          { href: '/admin/applications', label: 'Applications', icon: Users },
          { href: '/admin/settings', label: 'Settings', icon: Settings },
        ];
      
      case 'candidate':
      case 'employee':
        return [
          { href: '/candidate/jobs/list', label: 'Find Jobs', icon: Briefcase },
          { href: '/candidate/jobs/saved', label: 'Saved Jobs', icon: Heart },
          { href: '/candidate/applications', label: 'Applications', icon: Briefcase },
          { href: '/candidate/profile', label: 'Profile', icon: Users },
        ];
      
      default:
        return [];
    }
  };

  // Get footer branding text
  const getBrandingText = (): string => {
    if (!isAuthenticated || !user) {
      return '© 2024 Recruitment Platform. All rights reserved.';
    }

    switch (user.role) {
      case 'superadmin':
        return '© 2024 AIREC Recruitment Platform. All rights reserved.';
      
      case 'admin':
      case 'recruiter':
        if (tenant?.name) {
          return `© 2024 ${tenant.name}. Powered by AIREC Recruitment Platform.`;
        }
        return '© 2024 Recruitment Platform. All rights reserved.';
      
      case 'candidate':
      case 'employee':
        return '© 2024 Recruitment Platform. All rights reserved.';
      
      default:
        return '© 2024 Recruitment Platform. All rights reserved.';
    }
  };

  // Get user display info
  const getUserInfo = () => {
    if (!user) return null;

    if (user.role === 'admin' || user.role === 'recruiter' || user.role === 'superadmin') {
      return {
        name: user.name || 'Admin',
        role: user.role,
        company: tenant?.name || null,
      };
    } else {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      return {
        name: fullName || 'User',
        role: user.role,
        company: null,
      };
    }
  };

  const quickLinks = getQuickLinks();
  const brandingText = getBrandingText();
  const userInfo = getUserInfo();

  return (
    <footer className={`bg-white border-t border-gray-200 shadow-sm ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg mr-3">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {user?.role === 'superadmin' 
                  ? 'AIREC Recruitment Platform'
                  : tenant?.name || 'Recruitment Platform'
                }
              </h3>
              <p className="text-xs text-gray-500">
                {user?.role === 'superadmin' 
                  ? 'Platform Management'
                  : user?.role === 'admin' || user?.role === 'recruiter'
                    ? 'Streamlined hiring process'
                    : 'Find your dream career'
                }
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center lg:justify-end space-x-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {userInfo && (
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <div className="text-right">
                  <div className="font-medium">{userInfo.name}</div>
                  {userInfo.company && (
                    <div className="text-xs text-gray-400">{userInfo.company}</div>
                  )}
                </div>
                <span className="mx-2">•</span>
                <span className="capitalize text-blue-600 font-medium">
                  {userInfo.role}
                </span>
              </div>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-6 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-2 sm:space-y-0">
            <p>{brandingText}</p>
            <div className="flex space-x-4">
              <Link href="/help" className="hover:text-blue-600 transition-colors">
                Help
              </Link>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

