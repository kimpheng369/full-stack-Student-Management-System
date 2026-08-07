'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowTrendUp, faArrowTrendDown, faMinus } from '@fortawesome/free-solid-svg-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'amber' | 'sage' | 'violet' | 'sky' | 'rose' | 'orange';
  isLoading?: boolean;
}

const colorMap = {
  amber: {
    strip: 'stat-strip-amber',
    iconBg: 'bg-[#fff7e6] dark:bg-[#f59e0b]/10',
    iconColor: 'text-[#f59e0b]',
    valueMark: 'bg-[#fff7e6] dark:bg-[#f59e0b]/10 text-[#f59e0b]',
  },
  sage: {
    strip: 'stat-strip-sage',
    iconBg: 'bg-[#ecfdf5] dark:bg-[#22c55e]/10',
    iconColor: 'text-[#22c55e]',
    valueMark: 'bg-[#ecfdf5] dark:bg-[#22c55e]/10 text-[#22c55e]',
  },
  violet: {
    strip: 'stat-strip-violet',
    iconBg: 'bg-[#f3f0ff] dark:bg-[#818cf8]/10',
    iconColor: 'text-[#818cf8]',
    valueMark: 'bg-[#f3f0ff] dark:bg-[#818cf8]/10 text-[#818cf8]',
  },
  sky: {
    strip: 'stat-strip-sky',
    iconBg: 'bg-[#eff8ff] dark:bg-[#38bdf8]/10',
    iconColor: 'text-[#38bdf8]',
    valueMark: 'bg-[#eff8ff] dark:bg-[#38bdf8]/10 text-[#38bdf8]',
  },
  rose: {
    strip: 'stat-strip-rose',
    iconBg: 'bg-[#fff1f2] dark:bg-[#f43f5e]/10',
    iconColor: 'text-[#f43f5e]',
    valueMark: 'bg-[#fff1f2] dark:bg-[#f43f5e]/10 text-[#f43f5e]',
  },
  orange: {
    strip: 'stat-strip-orange',
    iconBg: 'bg-[#fff4ec] dark:bg-[#f97316]/10',
    iconColor: 'text-[#f97316]',
    valueMark: 'bg-[#fff4ec] dark:bg-[#f97316]/10 text-[#f97316]',
  },
};

export function StatCard({
  title,
  value,
  icon,
  change,
  changeType = 'positive',
  color = 'orange',
  isLoading = false,
}: StatCardProps) {
  const c = colorMap[color];

  if (isLoading) {
    return (
      <div className="relative p-5 bg-white dark:bg-[#1e1a17] rounded-xl border-l-[3px] border-[#e8e2db] dark:border-[#2a2520] border border-[#f0ebe5] dark:border-[#2a2520] flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-9 w-9 rounded-xl" />
        </div>
        <div className="flex items-end justify-between">
          <div className="skeleton h-8 w-14" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  const changeIcon = changeType === 'positive' ? faArrowTrendUp : changeType === 'negative' ? faArrowTrendDown : faMinus;
  const changeBg = changeType === 'positive'
    ? 'text-[#22c55e] bg-[#f0fdf4] dark:bg-[#22c55e]/10'
    : changeType === 'negative'
    ? 'text-[#f43f5e] bg-[#fff1f2] dark:bg-[#f43f5e]/10'
    : 'text-[#a09890] bg-[#f5f1ed] dark:bg-[#2a2520]';

  return (
    <div className={`relative p-5 bg-white dark:bg-[#1e1a17] rounded-xl ${c.strip} border border-[#f0ebe5] dark:border-[#2a2520] flex flex-col justify-between card-lift cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-semibold text-[#a09890] dark:text-[#6a6260] uppercase tracking-wider leading-tight pr-2">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
          <FontAwesomeIcon icon={icon} className={`w-4 h-4 ${c.iconColor}`} />
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-[#1c1714] dark:text-[#e8e2da] tracking-tight animate-count-up">
          {value}
        </span>
        {change && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${changeBg}`}>
            <FontAwesomeIcon icon={changeIcon} className="w-2.5 h-2.5" />
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
