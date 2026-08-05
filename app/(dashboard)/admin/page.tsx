'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StatCard } from '@/components/stat-card';
import {
  GraduationCap,
  UserCheck,
  Building2,
  School,
  BookOpen,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { AttendanceChart } from '@/components/charts/attendance-chart';
import { DepartmentChart } from '@/components/charts/department-chart';
import { GradeChart } from '@/components/charts/grade-chart';
import Link from 'next/link';
import { DashboardStats } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> System Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-blue-100/90 max-w-xl">
              Overview of student enrollment, department metrics, attendance, and academic performance.
            </p>
          </div>

          <div className="relative z-10 flex gap-3">
            <Link
              href="/students"
              className="px-4 py-2.5 bg-white text-blue-600 font-bold text-xs rounded-xl shadow-md hover:bg-blue-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              Manage Students
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Students"
            value={isLoading ? '...' : stats?.totalStudents || 0}
            icon={GraduationCap}
            change="+12% vs last term"
            color="blue"
          />
          <StatCard
            title="Total Teachers"
            value={isLoading ? '...' : stats?.totalTeachers || 0}
            icon={UserCheck}
            color="emerald"
          />
          <StatCard
            title="Departments"
            value={isLoading ? '...' : stats?.totalDepartments || 0}
            icon={Building2}
            color="purple"
          />
          <StatCard
            title="Total Classes"
            value={isLoading ? '...' : stats?.totalClasses || 0}
            icon={School}
            color="amber"
          />
          <StatCard
            title="Total Subjects"
            value={isLoading ? '...' : stats?.totalSubjects || 0}
            icon={BookOpen}
            color="indigo"
          />
          <StatCard
            title="Attendance Rate"
            value={isLoading ? '...' : `${stats?.attendancePercentage || 95}%`}
            icon={CalendarCheck}
            changeType="positive"
            change="Target 90%+"
            color="rose"
          />
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Distribution */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Department Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Students and Teachers count by department
                </p>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <DepartmentChart data={stats?.departmentDistribution || []} />
          </div>

          {/* Attendance Breakdown */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Attendance Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status distribution ratio
                </p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <AttendanceChart data={stats?.attendanceByStatus || []} />
          </div>
        </div>

        {/* Secondary Analytics & Recent Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Distribution Chart */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Grade Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Letter grade spread across all subjects
                </p>
              </div>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <GradeChart data={stats?.gradeDistribution || []} />
          </div>

          {/* Recent Students List */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recently Enrolled Students
              </h3>
              <Link href="/students" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentStudents && stats.recentStudents.length > 0 ? (
                stats.recentStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                        {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {s.studentId} • {s.department.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg shadow-2xs">
                      {s.class.className}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">Loading recent students...</div>
              )}
            </div>
          </div>

          {/* Recent System Activity Stream */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Recent System Activity
            </h3>
            <div className="space-y-4">
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {act.description}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {formatDate(act.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">No recent activity logs recorded</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
