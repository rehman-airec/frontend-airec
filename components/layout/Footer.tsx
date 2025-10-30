import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, Users, TrendingUp, Shield, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mr-3">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Recruitment Platform
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              Empowering organizations to find the right talent and helping candidates discover 
              their dream careers through our innovative recruitment platform.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="h-4 w-4 text-red-500 mr-2" />
              <span>Built with passion for better hiring</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
              Platform Stats
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Jobs</span>
                <span className="text-sm font-medium text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Candidates</span>
                <span className="text-sm font-medium text-gray-900">5,432</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Companies</span>
                <span className="text-sm font-medium text-gray-900">342</span>
              </div>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-100 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 lg:mb-0">
              <p className="text-sm text-gray-600">
                © 2024 Recruitment Platform. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            
            {/* User Status */}
            {user && (
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>Welcome, {user.name || user.firstName || 'User'}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{user.role}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
