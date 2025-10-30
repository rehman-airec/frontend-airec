import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  FileText,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  FileQuestion,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'candidate';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminNavItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Jobs',
      href: '/admin/jobs/list',
      icon: Briefcase,
    },
    {
      name: 'Candidates',
      href: '/admin/candidates',
      icon: Users,
    },
    {
      name: 'All Applications',
      href: '/admin/applications',
      icon: Users,
    },
    {
      name: 'Question Templates',
      href: '/admin/screening-templates',
      icon: FileQuestion,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const candidateNavItems = [
    {
      name: 'Find Jobs',
      href: '/candidate/jobs/list',
      icon: Search,
    },
    {
      name: 'Saved Jobs',
      href: '/candidate/jobs/saved',
      icon: Heart,
    },
    {
      name: 'My Applications',
      href: '/candidate/applications',
      icon: FileText,
    },
    {
      name: 'Profile',
      href: '/candidate/profile',
      icon: User,
    },
  ];

  const navItems = role === 'admin' ? adminNavItems : candidateNavItems;

  return (
    <div className={cn(
      "bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Header */}
      <div className="p-6">
        {!isCollapsed ? (
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {role} Portal
          </h2>
        ) : (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm uppercase">
              {role.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg text-sm font-medium transition-colors group relative',
                    isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-3 py-2',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export { Sidebar };
