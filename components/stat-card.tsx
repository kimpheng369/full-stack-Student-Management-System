'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'emerald' | 'purple' | 'amber' | 'indigo' | 'rose';
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  color = 'blue',
}: StatCardProps) {
  const colorMap = {
    blue: 'from-blue-500 to-indigo-600 text-white shadow-blue-500/20',
    emerald: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
    purple: 'from-purple-500 to-indigo-600 text-white shadow-purple-500/20',
    amber: 'from-amber-500 to-orange-600 text-white shadow-amber-500/20',
    indigo: 'from-indigo-500 to-blue-600 text-white shadow-indigo-500/20',
    rose: 'from-rose-500 to-pink-600 text-white shadow-rose-500/20',
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${colorMap[color]} flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              changeType === 'positive'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : changeType === 'negative'
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
