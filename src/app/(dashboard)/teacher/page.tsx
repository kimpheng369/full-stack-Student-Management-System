'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/frontend/components/dashboard-layout';
import { useSession } from 'next-auth/react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/frontend/components/stat-card';
import { DatabaseLoadingIndicator, StatCardSkeleton } from '@/frontend/components/skeleton';

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherDetails() {
      try {
        const res = await fetch('/api/subjects');
        if (res.ok) {
          const allSubjects = await res.json();
          setSubjects(allSubjects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeacherDetails();
  }, [session]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Teacher Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome Back, {session?.user?.name || 'Professor'}!
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              Manage assigned academic subjects, record lecture attendance, enter assignment marks, and evaluate student GPAs.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/attendance"
              className="px-4 py-2.5 bg-white text-emerald-700 font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              <CalendarCheck className="w-4 h-4" />
              Mark Attendance
            </Link>
            <Link
              href="/grades"
              className="px-4 py-2.5 bg-emerald-950/80 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-900 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Award className="w-4 h-4" />
              Enter Marks
            </Link>
          </div>
        </div>

        {/* Database Loading Animation */}
        {isLoading && (
          <DatabaseLoadingIndicator label="Querying assigned courses, student rosters, and grade metrics from database..." />
        )}

        {/* Teacher Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Assigned Courses"
                value={subjects.length || 4}
                icon={BookOpen}
                color="emerald"
                change="Active Term"
              />
              <StatCard
                title="Enrolled Students"
                value={128}
                icon={GraduationCap}
                color="blue"
                change="4 Classes"
              />
              <StatCard
                title="Avg. Attendance"
                value="96.2%"
                icon={CalendarCheck}
                color="indigo"
                changeType="positive"
                change="High Engagement"
              />
              <StatCard
                title="Grades Finalized"
                value="88%"
                icon={Award}
                color="amber"
                change="Midterms Complete"
              />
            </>
          )}
        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Class Attendance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Mark Present, Absent, Late, or Excused status for today&apos;s lectures.
            </p>
            <Link
              href="/attendance"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              Open Attendance Sheet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Grades & Examinations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Input Assignment, Quiz, Midterm, and Final Exam scores with auto-calculated GPAs.
            </p>
            <Link
              href="/grades"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              Open Grade Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Student Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Search students by name or ID, filter by class, and inspect academic history.
            </p>
            <Link
              href="/students"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
            >
              View Student Roster <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Assigned Academic Courses */}
        <div className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Assigned Academic Courses
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : subjects.length > 0 ? (
              subjects.slice(0, 6).map((subj) => (
                <div
                  key={subj.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {subj.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        Dept: {subj.department?.code || 'CS'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {subj.subjectName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Instructor: {subj.teacher?.name || 'Faculty Member'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <Link
                      href={`/attendance?subjectId=${subj.id}`}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Attendance
                    </Link>
                    <Link
                      href={`/grades?subjectId=${subj.id}`}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Enter Marks
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 col-span-3">
                No active assigned courses found
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
