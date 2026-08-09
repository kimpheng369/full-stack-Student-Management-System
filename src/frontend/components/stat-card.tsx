'use client';

import React, { useRef, useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'emerald' | 'purple' | 'amber' | 'indigo' | 'rose';
}

function useAnimatedCounter(targetValue: string | number, duration = 800) {
  const [displayValue, setDisplayValue] = useState<string | number>(targetValue);

  useEffect(() => {
    const numericStr = typeof targetValue === 'number' ? targetValue.toString() : targetValue.replace(/[^0-9.]/g, '');
    const numericVal = parseFloat(numericStr);

    if (isNaN(numericVal)) {
      setDisplayValue(targetValue);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const prefix = typeof targetValue === 'string' ? targetValue.match(/^[^\d]*/)?.[0] || '' : '';
    const suffix = typeof targetValue === 'string' ? targetValue.match(/[^\d.]*$/)?.[0] || '' : '';
    const hasDecimal = numericStr.includes('.');

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = numericVal * easedProgress;

      const formatted = hasDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration]);

  return displayValue;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  color = 'blue',
}: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);

  const animatedValue = useAnimatedCounter(value);

  const colorMap = {
    blue: 'from-blue-500 to-indigo-600 text-white shadow-blue-500/20',
    emerald: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
    purple: 'from-purple-500 to-indigo-600 text-white shadow-purple-500/20',
    amber: 'from-amber-500 to-orange-600 text-white shadow-amber-500/20',
    indigo: 'from-indigo-500 to-blue-600 text-white shadow-indigo-500/20',
    rose: 'from-rose-500 to-pink-600 text-white shadow-rose-500/20',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spotlight CSS variables
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    setSpotlightOpacity(1);

    // Subtle 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 20;
    const tiltY = (centerX - x) / 20;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setSpotlightOpacity(0);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        ['--spotlight-opacity' as any]: spotlightOpacity,
      }}
      className="spotlight-card p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer animate-fade-in"
    >
      <div className="flex items-center justify-between z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${colorMap[color]} flex items-center justify-center shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between z-10">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {animatedValue}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-transform group-hover:scale-105 ${
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
