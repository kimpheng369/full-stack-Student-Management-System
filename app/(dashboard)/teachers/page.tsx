'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  UserCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Mail,
  Phone,
  Building2,
} from 'lucide-react';
import { TeacherModal } from '@/components/modals/teacher-modal';
import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { toast } from 'sonner';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<any>(null);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/teachers');
      if (res.ok) {
        setTeachers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    try {
      const res = await fetch(`/api/teachers/${deletingTeacher.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete teacher');
      }
      toast.success('Teacher record deleted successfully');
      setDeletingTeacher(null);
      fetchTeachers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.teacherId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-emerald-600" />
              Teacher Directory & Faculty
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage faculty staff, assign department roles, and track course assignments.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Teacher
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search teacher by name, email, or teacher ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 p-12 text-center text-slate-400">Loading faculty list...</div>
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((t) => (
              <div
                key={t.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-lg flex items-center justify-center">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {t.name}
                        </h3>
                        <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {t.teacherId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTeacher(t);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTeacher(t)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Dept: {t.department?.name}</span>
                    </div>
                  </div>

                  {/* Assigned Subjects Badges */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Assigned Subjects ({t.subjects?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects && t.subjects.length > 0 ? (
                        t.subjects.map((subj: any) => (
                          <span
                            key={subj.id}
                            className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                          >
                            {subj.code}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">No subjects assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-12 text-center text-slate-400">No teachers found</div>
          )}
        </div>
      </div>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTeachers}
        teacher={editingTeacher}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTeacher)}
        onClose={() => setDeletingTeacher(null)}
        onConfirm={handleDelete}
        title="Delete Teacher Record"
        description={`Are you sure you want to delete ${deletingTeacher?.name} (${deletingTeacher?.teacherId})?`}
      />
    </DashboardLayout>
  );
}
