'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BookOpen, Building2, School, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'departments' | 'classes' | 'subjects'>('departments');
  const [departments, setDepartments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Creation forms state
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  const [showClassForm, setShowClassForm] = useState(false);
  const [classNameStr, setClassNameStr] = useState('');
  const [classYear, setClassYear] = useState('2026');
  const [classDeptId, setClassDeptId] = useState('');

  const [showSubjForm, setShowSubjForm] = useState(false);
  const [subjName, setSubjName] = useState('');
  const [subjCode, setSubjCode] = useState('');
  const [subjTeacherId, setSubjTeacherId] = useState('');
  const [subjDeptId, setSubjDeptId] = useState('');

  const loadData = async () => {
    try {
      const [dRes, cRes, sRes, tRes] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/classes'),
        fetch('/api/subjects'),
        fetch('/api/teachers'),
      ]);
      if (dRes.ok) setDepartments(await dRes.json());
      if (cRes.ok) setClasses(await cRes.json());
      if (sRes.ok) setSubjects(await sRes.json());
      if (tRes.ok) setTeachers(await tRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: deptName, code: deptCode }),
      });
      if (!res.ok) throw new Error('Failed to create department');
      toast.success('Department created!');
      setDeptName('');
      setDeptCode('');
      setShowDeptForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: classNameStr, year: classYear, departmentId: classDeptId }),
      });
      if (!res.ok) throw new Error('Failed to create class');
      toast.success('Class created!');
      setClassNameStr('');
      setShowClassForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subjName,
          code: subjCode,
          teacherId: subjTeacherId,
          departmentId: subjDeptId,
        }),
      });
      if (!res.ok) throw new Error('Failed to create subject');
      toast.success('Subject created!');
      setSubjName('');
      setSubjCode('');
      setShowSubjForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-purple-600" />
            Academic Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure Departments, Classes, and Subjects for academic terms.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2.5 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'departments'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2.5 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'classes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <School className="w-4 h-4" /> Classes ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2.5 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'subjects'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Subjects ({subjects.length})
          </button>
        </div>

        {/* Tab 1: Departments */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeptForm(!showDeptForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </div>

            {showDeptForm && (
              <form onSubmit={handleCreateDepartment} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">Department Name</label>
                  <input
                    required
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="Software Engineering"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold mb-1">Code</label>
                  <input
                    required
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    placeholder="SE"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                  Save
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departments.map((d) => (
                <div key={d.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-md">
                    {d.code}
                  </span>
                  <h3 className="text-base font-bold mt-2 text-slate-900 dark:text-white">{d.name}</h3>
                  <div className="mt-3 text-xs text-slate-500 flex gap-4">
                    <span>Students: {d._count?.students || 0}</span>
                    <span>Teachers: {d._count?.teachers || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Classes */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowClassForm(!showClassForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Class
              </button>
            </div>

            {showClassForm && (
              <form onSubmit={handleCreateClass} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">Class Name</label>
                  <input
                    required
                    value={classNameStr}
                    onChange={(e) => setClassNameStr(e.target.value)}
                    placeholder="CS-101 (Freshman)"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div className="w-48">
                  <label className="block text-xs font-bold mb-1">Department</label>
                  <select
                    required
                    value={classDeptId}
                    onChange={(e) => setClassDeptId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                  Save
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((c) => (
                <div key={c.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.className}</h3>
                  <p className="text-xs text-slate-500 mt-1">Dept: {c.department?.name} • Year {c.year}</p>
                  <div className="mt-3 text-xs font-semibold text-blue-600">
                    Enrolled Students: {c._count?.students || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Subjects */}
        {activeTab === 'subjects' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowSubjForm(!showSubjForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            </div>

            {showSubjForm && (
              <form onSubmit={handleCreateSubject} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold mb-1">Subject Name</label>
                  <input
                    required
                    value={subjName}
                    onChange={(e) => setSubjName(e.target.value)}
                    placeholder="Machine Learning"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Code</label>
                  <input
                    required
                    value={subjCode}
                    onChange={(e) => setSubjCode(e.target.value)}
                    placeholder="CS405"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Department</label>
                  <select
                    required
                    value={subjDeptId}
                    onChange={(e) => setSubjDeptId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Assigned Teacher</label>
                  <select
                    required
                    value={subjTeacherId}
                    onChange={(e) => setSubjTeacherId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                    Save Subject
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map((s) => (
                <div key={s.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-md">
                    {s.code}
                  </span>
                  <h3 className="text-base font-bold mt-2 text-slate-900 dark:text-white">{s.subjectName}</h3>
                  <p className="text-xs text-slate-500 mt-1">Instructor: {s.teacher?.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Dept: {s.department?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
