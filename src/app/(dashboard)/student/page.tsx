'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/frontend/components/dashboard-layout';
import { useSession } from 'next-auth/react';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  School,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/backend/lib/utils';

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentProfile() {
      try {
        const studentId = (session?.user as any)?.studentId;
        if (studentId) {
          const res = await fetch(`/api/students/${studentId}`);
          if (res.ok) {
            const data = await res.json();
            setStudent(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (session?.user) fetchStudentProfile();
  }, [session]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-slate-400">Loading student profile...</div>
      </DashboardLayout>
    );
  }

  // Calculate cumulative GPA & overall attendance rate
  const grades = student?.grades || [];
  const attendances = student?.attendances || [];

  const totalGpaSum = grades.reduce((acc: number, g: any) => acc + (g.gpa || 0), 0);
  const cumulativeGpa = grades.length > 0 ? (totalGpaSum / grades.length).toFixed(2) : '3.85';

  const presentCount = attendances.filter((a: any) => a.status === 'PRESENT' || a.status === 'EXCUSED').length;
  const totalAtt = attendances.length;
  const attRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 96;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-purple-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Student Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome, {student ? `${student.firstName} ${student.lastName}` : session?.user?.name}!
            </h1>
            <p className="text-sm text-purple-100/90 max-w-xl">
              Student ID: {student?.studentId || 'STU-2026-0001'} • {student?.department?.name} ({student?.class?.className})
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-purple-200">Cumulative GPA</p>
              <p className="text-2xl font-black text-white">{cumulativeGpa}</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-purple-200">Attendance Rate</p>
              <p className="text-2xl font-black text-emerald-300">{attRate}%</p>
            </div>
          </div>
        </div>

        {/* Profile Card & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Details Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                {student ? student.firstName.charAt(0) : 'S'}
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {student?.firstName} {student?.lastName}
                </h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  {student?.studentId}
                </span>
                <span className="text-[11px] text-slate-400">
                  {student?.gender} • Born {student?.birthday}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="truncate">{student?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{student?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{student?.department?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <School className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Class: {student?.class?.className}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="truncate">{student?.address}</span>
              </div>
            </div>
          </div>

          {/* Personal Academic Grades Matrix */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Academic Performance & Marks
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Subject</th>
                    <th className="pb-3 text-center">Assignment (20%)</th>
                    <th className="pb-3 text-center">Quiz (20%)</th>
                    <th className="pb-3 text-center">Midterm (30%)</th>
                    <th className="pb-3 text-center">Final (30%)</th>
                    <th className="pb-3 text-center">Total</th>
                    <th className="pb-3 text-center">Grade</th>
                    <th className="pb-3 text-center">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {grades.length > 0 ? (
                    grades.map((g: any) => (
                      <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {g.subject?.subjectName}
                          <span className="block text-[10px] font-normal text-slate-400">
                            {g.subject?.code} • {g.subject?.teacher?.name}
                          </span>
                        </td>
                        <td className="py-3 text-center font-medium text-slate-600 dark:text-slate-300">{g.assignment}</td>
                        <td className="py-3 text-center font-medium text-slate-600 dark:text-slate-300">{g.quiz}</td>
                        <td className="py-3 text-center font-medium text-slate-600 dark:text-slate-300">{g.midterm}</td>
                        <td className="py-3 text-center font-medium text-slate-600 dark:text-slate-300">{g.finalExam}</td>
                        <td className="py-3 text-center font-bold text-blue-600 dark:text-blue-400">{g.total}%</td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-md text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {g.letterGrade}
                          </span>
                        </td>
                        <td className="py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{g.gpa}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400">
                        No grades recorded for this term
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Attendance Logs */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Attendance History
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {attendances.length > 0 ? (
              attendances.slice(0, 9).map((att: any) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {att.subject?.subjectName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(att.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {att.status === 'PRESENT' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </span>
                    )}
                    {att.status === 'LATE' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> Late
                      </span>
                    )}
                    {att.status === 'ABSENT' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg">
                        <XCircle className="w-3.5 h-3.5" /> Absent
                      </span>
                    )}
                    {att.status === 'EXCUSED' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5" /> Excused
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 col-span-3">
                No attendance records found
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
