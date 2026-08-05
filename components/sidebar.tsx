'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  CalendarCheck,
  Award,
  BookOpen,
  Building2,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  School,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || 'STUDENT';

  const adminLinks = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Students', href: '/students', icon: GraduationCap },
    { label: 'Teachers', href: '/teachers', icon: UserCheck },
    { label: 'Academics', href: '/academics', icon: BookOpen },
    { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
    { label: 'Grades & Marks', href: '/grades', icon: Award },
    { label: 'Reports & Export', href: '/reports', icon: FileSpreadsheet },
  ];

  const teacherLinks = [
    { label: 'Teacher Dashboard', href: '/teacher', icon: LayoutDashboard },
    { label: 'My Classes & Students', href: '/students', icon: GraduationCap },
    { label: 'Mark Attendance', href: '/attendance', icon: CalendarCheck },
    { label: 'Enter Grades', href: '/grades', icon: Award },
    { label: 'Reports', href: '/reports', icon: FileSpreadsheet },
  ];

  const studentLinks = [
    { label: 'My Profile & Overview', href: '/student', icon: LayoutDashboard },
    { label: 'My Attendance', href: '/attendance', icon: CalendarCheck },
    { label: 'My Grades', href: '/grades', icon: Award },
    { label: 'My Subjects', href: '/academics', icon: BookOpen },
  ];

  const navItems =
    role === 'ADMIN'
      ? adminLinks
      : role === 'TEACHER'
      ? teacherLinks
      : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm md:translate-x-0',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 shrink-0">
              <School className="w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                  EduManage
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {role} Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-5 h-5 shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
                {!collapsed && <span>{item.label}</span>}

                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Quick Info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : '')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {session?.user?.name || 'User'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {session?.user?.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
