'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/frontend/components/dashboard-layout';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Filter,
  Users,
} from 'lucide-react';
import { AttendanceStatus } from '@prisma/client';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance state map: { [studentId]: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [sRes, cRes] = await Promise.all([fetch('/api/subjects'), fetch('/api/classes')]);
        if (sRes.ok) {
          const subData = await sRes.json();
          setSubjects(subData);
          if (subData.length > 0) setSelectedSubject(subData[0].id);
        }
        if (cRes.ok) {
          const clsData = await cRes.json();
          setClasses(clsData);
          if (clsData.length > 0) setSelectedClass(clsData[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  // Fetch students & existing attendance for subject, class, date
  useEffect(() => {
    async function fetchAttendanceGrid() {
      if (!selectedSubject || !selectedClass) return;
      setIsLoading(true);
      try {
        const [stuRes, attRes] = await Promise.all([
          fetch(`/api/students?classId=${selectedClass}&limit=100`),
          fetch(`/api/attendance?subjectId=${selectedSubject}&classId=${selectedClass}&date=${selectedDate}`),
        ]);

        let studentList: any[] = [];
        if (stuRes.ok) {
          const data = await stuRes.json();
          studentList = data.students;
          setStudents(studentList);
        }

        const map: Record<string, AttendanceStatus> = {};
        // Default everyone to PRESENT
        studentList.forEach((s) => {
          map[s.id] = AttendanceStatus.PRESENT;
        });

        if (attRes.ok) {
          const existingAtt = await attRes.json();
          existingAtt.forEach((rec: any) => {
            map[rec.studentId] = rec.status;
          });
        }

        setAttendanceMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAttendanceGrid();
  }, [selectedSubject, selectedClass, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSetAll = (status: AttendanceStatus) => {
    const nextMap: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      nextMap[s.id] = status;
    });
    setAttendanceMap(nextMap);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    setIsSaving(true);
    try {
      const records = Object.entries(attendanceMap).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          date: selectedDate,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save attendance');

      toast.success(data.message || 'Attendance records saved successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Metrics summary
  const presentTotal = Object.values(attendanceMap).filter((s) => s === 'PRESENT').length;
  const absentTotal = Object.values(attendanceMap).filter((s) => s === 'ABSENT').length;
  const lateTotal = Object.values(attendanceMap).filter((s) => s === 'LATE').length;
  const excusedTotal = Object.values(attendanceMap).filter((s) => s === 'EXCUSED').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-7 h-7 text-emerald-600" />
              Attendance Management & Sheet
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Record daily lecture attendance, track excuses, and monitor absenteeism.
            </p>
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={isSaving || students.length === 0}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50 self-start sm:self-auto shrink-0"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Sheet...' : 'Save Attendance Sheet'}
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectName} [{s.code}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Class Roster
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Lecture Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Mark All Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              Mark All:
            </span>
            <button
              onClick={() => handleSetAll(AttendanceStatus.PRESENT)}
              className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-lg hover:bg-emerald-200 transition-colors"
            >
              All Present
            </button>
            <button
              onClick={() => handleSetAll(AttendanceStatus.ABSENT)}
              className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-lg hover:bg-rose-200 transition-colors"
            >
              All Absent
            </button>
          </div>
        </div>

        {/* Counter Badges Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Present</span>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200">{presentTotal}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>

          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200/50 dark:border-rose-900/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase">Absent</span>
              <p className="text-2xl font-black text-rose-900 dark:text-rose-200">{absentTotal}</p>
            </div>
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/50 dark:border-amber-900/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">Late</span>
              <p className="text-2xl font-black text-amber-900 dark:text-amber-200">{lateTotal}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">Excused</span>
              <p className="text-2xl font-black text-blue-900 dark:text-blue-200">{excusedTotal}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Student Interactive Grid Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-4">Student ID</th>
                  <th className="py-4 px-6 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      Loading class roster...
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((s) => {
                    const currentStatus = attendanceMap[s.id] || 'PRESENT';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 font-bold text-xs flex items-center justify-center">
                              {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                            </div>
                            <span>
                              {s.firstName} {s.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">
                          {s.studentId}
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.id, AttendanceStatus.PRESENT)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                                currentStatus === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Present
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.id, AttendanceStatus.ABSENT)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                                currentStatus === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Absent
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.id, AttendanceStatus.LATE)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                                currentStatus === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-50'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" /> Late
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.id, AttendanceStatus.EXCUSED)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                                currentStatus === 'EXCUSED'
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-blue-50'
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" /> Excused
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      No students enrolled in selected class
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
