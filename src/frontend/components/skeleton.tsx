'use client';

import React from 'react';
import { Database, RefreshCw, Server, Sparkles } from 'lucide-react';

export function DatabaseLoadingIndicator({ label = 'Fetching database records...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-slate-950/20 dark:from-slate-900/90 dark:to-slate-900/90 border border-blue-500/20 dark:border-slate-800 rounded-2xl backdrop-blur-md animate-pulse">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
          <Database className="w-5 h-5 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Database Query
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Live Syncing
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {label}
          </span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
        <Server className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL Neon DB
      </div>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800/80 animate-pulse rounded-xl ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/90 shadow-xs flex flex-col justify-between animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="w-11 h-11 rounded-2xl" />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs animate-pulse">
      <DatabaseLoadingIndicator label="Loading records from database schema..." />
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <Skeleton className="h-6 w-36 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={`h-4 rounded-md ${
                  c === 0 ? 'w-1/4' : c === cols - 1 ? 'w-16' : 'w-1/6'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="h-56 w-full flex items-end justify-between gap-3 pt-6">
        <Skeleton className="h-1/3 w-full rounded-t-xl" />
        <Skeleton className="h-2/3 w-full rounded-t-xl" />
        <Skeleton className="h-1/2 w-full rounded-t-xl" />
        <Skeleton className="h-3/4 w-full rounded-t-xl" />
        <Skeleton className="h-2/5 w-full rounded-t-xl" />
        <Skeleton className="h-4/5 w-full rounded-t-xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <DatabaseLoadingIndicator label="Initializing database connection & fetching metrics..." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}
