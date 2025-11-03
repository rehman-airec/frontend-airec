'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/Button';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface RoleBasedHeaderProps {
  className?: string;
}

/**
 * Role-Based Header Component
 * 
 * Displays different headers based on user role:
 * - Super Admin: "AIREC Recruitment Platform"
 * - Admin: Company/Tenant Name
 * - Candidate: "Find Your Dream Job"
 */
export const RoleBasedHeader: React.FC<RoleBasedHeaderProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { tenant } = useTenant();

  // Get header title based on role
  const getHeaderTitle = (): string => {
    if (!isAuthenticated || !user) {
      return 'Recruitment Platform';
    }

    switch (user.role) {
      case 'superadmin':
        return 'AIREC Recruitment Platform';
      
      case 'admin':
      case 'recruiter':
        // Show tenant/company name for admin users
        if (tenant?.name) {
          return tenant.name;
        }
        return 'Admin Dashboard';
      
      case 'candidate':
      case 'employee':
        return 'Find Your Dream Job';
      
      default:
        return 'Recruitment Platform';
    }
  };

  // Get navigation links based on role
  const getNavigationLinks = () => {
    if (!isAuthenticated || !user) {
      return [
        { href: '/jobs', label: 'Find Jobs' },
        { href: '/home', label: 'About' },
      ];
    }

    switch (user.role) {
      case 'superadmin':
        return [
          { href: '/superadmin', label: 'Dashboard' },
          { href: '/superadmin/tenants', label: 'Tenants' },
          { href: '/superadmin/settings', label: 'Settings' },
        ];
      
      case 'admin':
      case 'recruiter':
        return [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/jobs/list', label: 'Jobs' },
          { href: '/admin/applications', label: 'Applications' },
          { href: '/admin/candidates', label: 'Candidates' },
        ];
      
      case 'candidate':
        return [
          { href: '/candidate/jobs/list', label: 'Find Jobs' },
          { href: '/candidate/jobs/saved', label: 'Saved Jobs' },
          { href: '/candidate/applications', label: 'My Applications' },
          { href: '/candidate/profile', label: 'Profile' },
        ];
      
      case 'employee':
        return [
          { href: '/employee/jobs/list', label: 'Find Jobs' },
          { href: '/employee/jobs/saved', label: 'Saved Jobs' },
          { href: '/employee/applications', label: 'My Applications' },
          { href: '/employee/profile', label: 'Profile' },
        ];
      
      default:
        return [];
    }
  };

  // Get user display name
  const getUserDisplayName = (): string => {
    if (!user) return 'User';

    if (user.role === 'admin' || user.role === 'recruiter' || user.role === 'superadmin') {
      return user.name || 'Admin';
    } else {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      return fullName || 'User';
    }
  };

  const headerTitle = getHeaderTitle();
  const navLinks = getNavigationLinks();
  const displayName = getUserDisplayName();

  return (
    <nav className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link 
              href={isAuthenticated 
                ? (user?.role === 'superadmin' ? '/superadmin' 
                   : user?.role === 'admin' || user?.role === 'recruiter' ? '/admin/dashboard'
                   : user?.role === 'employee' ? '/employee/jobs/list'
                   : '/candidate/jobs/list')
                : '/'
              } 
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {headerTitle}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <NotificationBell />

                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || 'User'}
                    </p>
                  </div>
                </div>
                
                {/* Settings Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (user?.role === 'superadmin') {
                      window.location.href = '/superadmin/settings';
                    } else if (user?.role === 'admin' || user?.role === 'recruiter') {
                      window.location.href = '/admin/settings';
                    } else {
                      window.location.href = '/candidate/settings';
                    }
                  }}
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

