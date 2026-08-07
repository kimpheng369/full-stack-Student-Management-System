import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton', className)} style={style} />;
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-[#1e1a17] rounded-xl border-l-[3px] border-[#e8e2db] dark:border-[#2a2520] border border-[#f0ebe5] dark:border-[#2a2520] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ListRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#24201c]">
          <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-5 w-14 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-end gap-2" style={{ height }}>
        {[60, 85, 45, 90, 70, 55, 80].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex gap-2">
        {[70, 55, 80, 65, 90, 40, 75].map((_, i) => (
          <Skeleton key={i} className="flex-1 h-2" />
        ))}
      </div>
    </div>
  );
}

export function ActivitySkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-2 h-2 rounded-full shrink-0 mt-1" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-44" />
            <Skeleton className="h-2 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}
