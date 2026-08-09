'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface GradeChartProps {
  data: Array<{
    grade: string;
    count: number;
  }>;
}

export function GradeChart({ data }: GradeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No grade distribution data available
      </div>
    );
  }

  const gradeColors: Record<string, string> = {
    'A': '#10b981',
    'A-': '#34d399',
    'B+': '#3b82f6',
    'B': '#60a5fa',
    'B-': '#93c5fd',
    'C+': '#f59e0b',
    'C': '#fbbf24',
    'D': '#f97316',
    'F': '#ef4444',
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
          <XAxis
            dataKey="grade"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)', rx: 8 }}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`grade-cell-${index}`}
                fill={gradeColors[entry.grade] || '#6366f1'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
