'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/frontend/components/sidebar';
import { Navbar } from '@/frontend/components/navbar';
import { cn } from '@/frontend/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          collapsed ? 'md:pl-20' : 'md:pl-64'
        )}
      >
        <Navbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
