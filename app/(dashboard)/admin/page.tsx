'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StatCard } from '@/components/stat-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faChalkboardTeacher,
  faBuilding,
  faSchool,
  faBook,
  faCalendarCheck,
  faArrowRight,
  faChartLine,
  faListCheck,
  faMedal,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { AttendanceChart } from '@/components/charts/attendance-chart';
import { DepartmentChart } from '@/components/charts/department-chart';
import { GradeChart } from '@/components/charts/grade-chart';
import { ChartSkeleton, ListRowSkeleton, ActivitySkeleton } from '@/components/skeleton';
import Link from 'next/link';
import { DashboardStats } from '@/types';
import { formatDate } from '@/lib/utils';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDayDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

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

        {/* ── Page header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#b0a89e] dark:text-[#6a6260] mb-1">{getDayDate()}</p>
            <h1 className="text-2xl font-bold text-[#1c1714] dark:text-[#e8e2da] leading-none">
              {getGreeting()} 👋
            </h1>
            <p className="text-sm text-[#7d7168] dark:text-[#8a7f78] mt-1.5">
              Here's what's happening in your school today.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/students"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-xs font-semibold rounded-xl shadow-sm shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.99]"
            >
              Manage Students
              <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ── 6 stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Students"
            value={isLoading ? '—' : stats?.totalStudents ?? 0}
            icon={faUserGraduate}
            change="+12%"
            changeType="positive"
            color="orange"
            isLoading={isLoading}
          />
          <StatCard
            title="Teachers"
            value={isLoading ? '—' : stats?.totalTeachers ?? 0}
            icon={faChalkboardTeacher}
            color="sage"
            isLoading={isLoading}
          />
          <StatCard
            title="Departments"
            value={isLoading ? '—' : stats?.totalDepartments ?? 0}
            icon={faBuilding}
            color="violet"
            isLoading={isLoading}
          />
          <StatCard
            title="Classes"
            value={isLoading ? '—' : stats?.totalClasses ?? 0}
            icon={faSchool}
            color="amber"
            isLoading={isLoading}
          />
          <StatCard
            title="Subjects"
            value={isLoading ? '—' : stats?.totalSubjects ?? 0}
            icon={faBook}
            color="sky"
            isLoading={isLoading}
          />
          <StatCard
            title="Attendance"
            value={isLoading ? '—' : `${stats?.attendancePercentage ?? 95}%`}
            icon={faCalendarCheck}
            change="≥ 90% target"
            changeType="positive"
            color="rose"
            isLoading={isLoading}
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Department Distribution — wide */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e1a17] rounded-xl border border-[#f0ebe5] dark:border-[#2a2520] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#1c1714] dark:text-[#e8e2da]">Department Distribution</h3>
                <p className="text-xs text-[#a09890] mt-0.5">Students & teachers by department</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#fff4ec] dark:bg-[#f97316]/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="w-3.5 h-3.5 text-[#f97316]" />
              </div>
            </div>
            {isLoading
              ? <ChartSkeleton height={220} />
              : <DepartmentChart data={stats?.departmentDistribution || []} />
            }
          </div>

          {/* Attendance Breakdown — narrow */}
          <div className="bg-white dark:bg-[#1e1a17] rounded-xl border border-[#f0ebe5] dark:border-[#2a2520] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#1c1714] dark:text-[#e8e2da]">Attendance</h3>
                <p className="text-xs text-[#a09890] mt-0.5">Status distribution</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] dark:bg-[#22c55e]/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarCheck} className="w-3.5 h-3.5 text-[#22c55e]" />
              </div>
            </div>
            {isLoading
              ? <ChartSkeleton height={220} />
              : <AttendanceChart data={stats?.attendanceByStatus || []} />
            }
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Grade Distribution */}
          <div className="bg-white dark:bg-[#1e1a17] rounded-xl border border-[#f0ebe5] dark:border-[#2a2520] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#1c1714] dark:text-[#e8e2da]">Grade Distribution</h3>
                <p className="text-xs text-[#a09890] mt-0.5">Letter grades across subjects</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#f3f0ff] dark:bg-[#818cf8]/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faMedal} className="w-3.5 h-3.5 text-[#818cf8]" />
              </div>
            </div>
            {isLoading
              ? <ChartSkeleton height={200} />
              : <GradeChart data={stats?.gradeDistribution || []} />
            }
          </div>

          {/* Recently Enrolled */}
          <div className="bg-white dark:bg-[#1e1a17] rounded-xl border border-[#f0ebe5] dark:border-[#2a2520] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#1c1714] dark:text-[#e8e2da]">Recently Enrolled</h3>
                <p className="text-xs text-[#a09890] mt-0.5">Latest student registrations</p>
              </div>
              <Link
                href="/students"
                className="text-xs font-semibold text-[#f97316] hover:underline flex items-center gap-1"
              >
                View all
                <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" />
              </Link>
            </div>

            {isLoading ? (
              <ListRowSkeleton rows={5} />
            ) : (
              <div className="space-y-2">
                {stats?.recentStudents && stats.recentStudents.length > 0 ? (
                  stats.recentStudents.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#24201c] hover:bg-[#f5f0ea] dark:hover:bg-[#2a2520] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#fff4ec] dark:bg-[#f97316]/10 text-[#f97316] font-bold text-xs flex items-center justify-center shrink-0">
                          {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-[#1c1714] dark:text-[#d4cfc9]">
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="text-[10px] text-[#a09890]">
                            {s.studentId} · {s.department.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#7d7168] dark:text-[#8a7f78] px-2 py-0.5 bg-[#f5f0ea] dark:bg-[#2a2520] rounded-lg">
                        {s.class.className}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-[#a09890]">No students enrolled yet</div>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#1e1a17] rounded-xl border border-[#f0ebe5] dark:border-[#2a2520] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#1c1714] dark:text-[#e8e2da]">Recent Activity</h3>
                <p className="text-xs text-[#a09890] mt-0.5">Latest system events</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#eff8ff] dark:bg-[#38bdf8]/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faListCheck} className="w-3.5 h-3.5 text-[#38bdf8]" />
              </div>
            </div>

            {isLoading ? (
              <ActivitySkeleton rows={3} />
            ) : (
              <div className="space-y-4">
                {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((act, i) => (
                    <div key={act.id} className="flex gap-3">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#f97316] mt-1 shrink-0" />
                        {i < (stats.recentActivities?.length ?? 0) - 1 && (
                          <div className="w-px flex-1 bg-[#f0ebe5] dark:bg-[#2a2520] mt-1" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 pb-3">
                        <span className="text-xs font-semibold text-[#1c1714] dark:text-[#d4cfc9] truncate">
                          {act.title}
                        </span>
                        <span className="text-[11px] text-[#a09890] leading-tight mt-0.5">
                          {act.description}
                        </span>
                        <span className="text-[10px] text-[#c4bdb5] mt-1">
                          {formatDate(act.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-[#a09890]">
                    No recent activity logs
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
