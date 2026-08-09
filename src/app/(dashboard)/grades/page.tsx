'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/frontend/components/dashboard-layout';
import { Award, Save, Calculator, CheckCircle2, AlertOctagon } from 'lucide-react';
import { calculateGrade } from '@/backend/lib/utils';
import { CustomSelect } from '@/frontend/components/custom-select';
import { TableSkeleton } from '@/frontend/components/skeleton';
import { toast } from 'sonner';

export default function GradesPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Grade inputs state: { [studentId]: { assignment: 85, quiz: 90, midterm: 80, finalExam: 88 } }
  const [gradeInputs, setGradeInputs] = useState<
    Record<string, { assignment: number; quiz: number; midterm: number; finalExam: number }>
  >({});

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

  useEffect(() => {
    async function fetchGradeMatrix() {
      if (!selectedSubject || !selectedClass) return;
      setIsLoading(true);
      try {
        const [stuRes, gradeRes] = await Promise.all([
          fetch(`/api/students?classId=${selectedClass}&limit=100`),
          fetch(`/api/grades?subjectId=${selectedSubject}&classId=${selectedClass}`),
        ]);

        let studentList: any[] = [];
        if (stuRes.ok) {
          const data = await stuRes.json();
          studentList = data.students;
          setStudents(studentList);
        }

        const map: Record<
          string,
          { assignment: number; quiz: number; midterm: number; finalExam: number }
        > = {};

        studentList.forEach((s) => {
          map[s.id] = { assignment: 80, quiz: 80, midterm: 80, finalExam: 80 };
        });

        if (gradeRes.ok) {
          const existingGrades = await gradeRes.json();
          existingGrades.forEach((g: any) => {
            map[g.studentId] = {
              assignment: g.assignment,
              quiz: g.quiz,
              midterm: g.midterm,
              finalExam: g.finalExam,
            };
          });
        }

        setGradeInputs(map);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGradeMatrix();
  }, [selectedSubject, selectedClass]);

  const handleScoreChange = (
    studentId: string,
    field: 'assignment' | 'quiz' | 'midterm' | 'finalExam',
    val: number
  ) => {
    const clamped = Math.max(0, Math.min(100, val || 0));
    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: clamped,
      },
    }));
  };

  const handleSaveGrades = async () => {
    if (!selectedSubject) return;
    setIsSaving(true);
    try {
      const promises = Object.entries(gradeInputs).map(([studentId, scores]) =>
        fetch('/api/grades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            subjectId: selectedSubject,
            ...scores,
          }),
        })
      );

      await Promise.all(promises);
      toast.success('Grade records updated and GPAs recalculated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save grades');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Award className="w-7 h-7 text-blue-600" />
              Grade Matrix & Marks Entry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Input examination components (Assignments 20%, Quizzes 20%, Midterms 30%, Finals 30%) with real-time GPA calculations.
            </p>
          </div>

          <button
            onClick={handleSaveGrades}
            disabled={isSaving || students.length === 0}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50 self-start sm:self-auto shrink-0"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Marks...' : 'Save All Grades'}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Subject Course
            </label>
            <CustomSelect
              value={selectedSubject}
              onChange={(val) => setSelectedSubject(val)}
              options={subjects.map((s) => ({
                value: s.id,
                label: `${s.subjectName} [${s.code}]`,
                sublabel: `Code: ${s.code}`,
              }))}
              className="min-w-64"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Class
            </label>
            <CustomSelect
              value={selectedClass}
              onChange={(val) => setSelectedClass(val)}
              options={classes.map((c) => ({
                value: c.id,
                label: c.className,
              }))}
              className="min-w-48"
            />
          </div>
        </div>

        {/* Grade Matrix Table */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={9} />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-3 text-center">Assignment (20%)</th>
                    <th className="py-4 px-3 text-center">Quiz (20%)</th>
                    <th className="py-4 px-3 text-center">Midterm (30%)</th>
                    <th className="py-4 px-3 text-center">Final (30%)</th>
                    <th className="py-4 px-3 text-center">Total Score</th>
                    <th className="py-4 px-3 text-center">Letter Grade</th>
                    <th className="py-4 px-3 text-center">GPA</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.length > 0 ? (
                  students.map((s) => {
                    const scores = gradeInputs[s.id] || { assignment: 0, quiz: 0, midterm: 0, finalExam: 0 };
                    const { total, letterGrade, gpa, isPass } = calculateGrade(
                      scores.assignment,
                      scores.quiz,
                      scores.midterm,
                      scores.finalExam
                    );

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                          <span className="block font-bold text-slate-900 dark:text-white">
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="block text-[10px] font-mono font-normal text-slate-400">
                            {s.studentId}
                          </span>
                        </td>

                        {/* Inputs */}
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={scores.assignment}
                            onChange={(e) =>
                              handleScoreChange(s.id, 'assignment', parseFloat(e.target.value))
                            }
                            className="w-16 py-1 px-2 text-center text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={scores.quiz}
                            onChange={(e) =>
                              handleScoreChange(s.id, 'quiz', parseFloat(e.target.value))
                            }
                            className="w-16 py-1 px-2 text-center text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={scores.midterm}
                            onChange={(e) =>
                              handleScoreChange(s.id, 'midterm', parseFloat(e.target.value))
                            }
                            className="w-16 py-1 px-2 text-center text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={scores.finalExam}
                            onChange={(e) =>
                              handleScoreChange(s.id, 'finalExam', parseFloat(e.target.value))
                            }
                            className="w-16 py-1 px-2 text-center text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        {/* Real-time Computed Values */}
                        <td className="py-3.5 px-3 text-center font-extrabold text-blue-600 dark:text-blue-400">
                          {total}%
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {letterGrade}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-200">
                          {gpa}
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          {isPass ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300">
                              <AlertOctagon className="w-3 h-3" /> FAIL
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No students enrolled in selected class
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
