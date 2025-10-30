import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, Users, Settings, LogOut, Heart } from 'lucide-react';

interface DashboardFooterProps {
  role?: 'admin' | 'candidate';
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ role }) => {
  const { user, logout } = useAuth();

  const getQuickLinks = () => {
    if (role === 'admin' || user?.role === 'admin' || user?.role === 'superadmin') {
      return [
        { href: '/admin/dashboard', label: 'Dashboard', icon: Briefcase },
        { href: '/admin/jobs/list', label: 'Jobs', icon: Briefcase },
        { href: '/admin/applications', label: 'Applications', icon: Users },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ];
    } else {
      return [
        { href: '/candidate/jobs/list', label: 'Find Jobs', icon: Briefcase },
        { href: '/candidate/jobs/saved', label: 'Saved Jobs', icon: Heart },
        { href: '/candidate/applications', label: 'My Applications', icon: Users },
        { href: '/candidate/profile', label: 'Profile', icon: Settings },
      ];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg mr-3">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Recruitment Platform</h3>
              <p className="text-xs text-gray-500">Streamlined hiring process</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center lg:justify-end space-x-6 mb-4 lg:mb-0">
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
            {user && (
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>{user.name || user.firstName || 'User'}</span>
                <span className="mx-1">•</span>
                <span className="capitalize text-blue-600 font-medium">{user.role}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
            <p>© 2024 Recruitment Platform. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
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

export { DashboardFooter };
