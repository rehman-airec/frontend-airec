'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import {
  LayoutDashboard,
  Briefcase,
  Heart,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/**
 * EmployeeSidebar Component
 * Navigation sidebar specific to Employee/Candidate role
 */
export const EmployeeSidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const isCollapsed = sidebarCollapsed['employee-sidebar'] || false;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/employee',
      icon: LayoutDashboard,
    },
    {
      name: 'Find Jobs',
      href: '/employee/jobs/list',
      icon: Briefcase,
    },
    {
      name: 'Saved Jobs',
      href: '/employee/jobs/saved',
      icon: Heart,
    },
    {
      name: 'My Applications',
      href: '/employee/applications',
      icon: FileText,
    },
    {
      name: 'Profile',
      href: '/employee/profile',
      icon: User,
    },
  ];

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200 flex justify-end">
        <button
          onClick={() => setSidebarCollapsed('employee-sidebar', !isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/employee' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100',
                isCollapsed && 'justify-center'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-blue-600')} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

