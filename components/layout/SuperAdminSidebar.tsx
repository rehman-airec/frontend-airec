'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import {
  LayoutDashboard,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/**
 * SuperAdminSidebar Component
 * Navigation sidebar specific to Super Admin role
 */
export const SuperAdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const isCollapsed = sidebarCollapsed['superadmin-sidebar'] || false;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/superadmin',
      icon: LayoutDashboard,
    },
    {
      name: 'Tenants',
      href: '/superadmin/tenants',
      icon: Building2,
    },
    {
      name: 'Settings',
      href: '/superadmin/settings',
      icon: Settings,
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
          onClick={() => setSidebarCollapsed('superadmin-sidebar', !isCollapsed)}
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
          // More precise matching: exact match OR pathname starts with href followed by / (but not if href is parent of another nav item)
          // Special handling: /superadmin should only match exactly, not when on /superadmin/tenants or /superadmin/settings
          let isActive = false;
          if (item.href === '/superadmin') {
            // Only match exact path for dashboard
            isActive = pathname === '/superadmin' || pathname === '/superadmin/';
          } else {
            // For other items, match exact or if pathname starts with href + /
            isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          }

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

