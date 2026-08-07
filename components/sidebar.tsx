'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faUserGraduate,
  faChalkboardTeacher,
  faCalendarCheck,
  faTrophy,
  faBook,
  faChartColumn,
  faChevronLeft,
  faChevronRight,
  faSchool,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: faGaugeHigh },
  { label: 'Students', href: '/students', icon: faUserGraduate },
  { label: 'Teachers', href: '/teachers', icon: faChalkboardTeacher },
  { label: 'Academics', href: '/academics', icon: faBook },
  { label: 'Attendance', href: '/attendance', icon: faCalendarCheck },
  { label: 'Grades & Marks', href: '/grades', icon: faTrophy },
  { label: 'Reports & Export', href: '/reports', icon: faChartColumn },
];

const teacherLinks = [
  { label: 'Dashboard', href: '/teacher', icon: faGaugeHigh },
  { label: 'My Classes', href: '/students', icon: faUserGraduate },
  { label: 'Attendance', href: '/attendance', icon: faCalendarCheck },
  { label: 'Enter Grades', href: '/grades', icon: faTrophy },
  { label: 'Reports', href: '/reports', icon: faChartColumn },
];

const studentLinks = [
  { label: 'My Overview', href: '/student', icon: faGaugeHigh },
  { label: 'Attendance', href: '/attendance', icon: faCalendarCheck },
  { label: 'My Grades', href: '/grades', icon: faTrophy },
  { label: 'Subjects', href: '/academics', icon: faBook },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || 'STUDENT';

  const navItems =
    role === 'ADMIN'
      ? adminLinks
      : role === 'TEACHER'
      ? teacherLinks
      : studentLinks;

  const roleLabel = role === 'ADMIN' ? 'Admin' : role === 'TEACHER' ? 'Teacher' : 'Student';
  const roleIcon = role === 'ADMIN' ? faShieldHalved : role === 'TEACHER' ? faChalkboardTeacher : faUserGraduate;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1c1714]/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 md:translate-x-0',
          'bg-[#faf8f5] dark:bg-[#1a1612]',
          'border-r border-[#e8e2db] dark:border-[#2a2520]',
          collapsed ? 'w-[68px]' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#e8e2db] dark:border-[#2a2520] shrink-0">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f97316] text-white shrink-0 shadow-sm shadow-orange-500/20">
              <FontAwesomeIcon icon={faSchool} className="w-3.5 h-3.5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[#1c1714] dark:text-[#f0ebe4] text-sm leading-none">
                  EduManage
                </span>
                <span className="text-[10px] text-[#f97316] font-medium mt-0.5">
                  {roleLabel} Portal
                </span>
              </div>
            )}
          </Link>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-lg text-[#a09890] hover:text-[#3d3530] dark:hover:text-[#d4cfc9] hover:bg-[#ede8e3] dark:hover:bg-[#2a2520] transition-all shrink-0"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <FontAwesomeIcon
              icon={collapsed ? faChevronRight : faChevronLeft}
              className="w-2.5 h-2.5"
            />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-2.5 mb-2 text-[10px] font-bold tracking-widest text-[#b0a89e] dark:text-[#5a524c] uppercase">
              Menu
            </p>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm transition-all duration-150 group',
                  isActive
                    ? 'bg-[#fff4ec] dark:bg-[#f97316]/10 text-[#f97316]'
                    : 'text-[#7d7168] dark:text-[#8a7f78] hover:bg-[#f0ebe5] dark:hover:bg-[#2a2520] hover:text-[#1c1714] dark:hover:text-[#d4cfc9]'
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Active left strip */}
                {isActive && <span className="sidebar-strip" />}

                {/* Icon */}
                <span className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all duration-150',
                  isActive
                    ? 'bg-[#f97316]/15 text-[#f97316]'
                    : 'text-[#a09890] group-hover:text-[#f97316] group-hover:bg-[#fff4ec] dark:group-hover:bg-[#f97316]/10'
                )}>
                  <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5" />
                </span>

                {!collapsed && (
                  <span className={cn(
                    'truncate text-[13px] font-semibold',
                    isActive ? 'text-[#f97316]' : 'text-[#7d7168] dark:text-[#8a7f78] group-hover:text-[#1c1714] dark:group-hover:text-[#d4cfc9]'
                  )}>
                    {item.label}
                  </span>
                )}

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1c1714] dark:bg-[#2a2520] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#1c1714] dark:bg-[#2a2520] rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 h-px bg-[#e8e2db] dark:bg-[#2a2520]" />

        {/* User info */}
        <div className="p-3 shrink-0">
          <div className={cn(
            'flex items-center gap-2.5 p-2 rounded-xl transition-colors hover:bg-[#f0ebe5] dark:hover:bg-[#2a2520] cursor-pointer',
            collapsed ? 'justify-center' : ''
          )}>
            <div className="w-8 h-8 rounded-xl bg-[#f97316] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-orange-500/20">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-xs font-bold text-[#1c1714] dark:text-[#d4cfc9] truncate">
                  {session?.user?.name || 'User'}
                </span>
                <span className="text-[11px] text-[#b0a89e] dark:text-[#5a524c] truncate">
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
