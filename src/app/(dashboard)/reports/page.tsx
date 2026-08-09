'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/frontend/components/dashboard-layout';
import { FileSpreadsheet, Download, FileText, Filter, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CustomSelect } from '@/frontend/components/custom-select';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'students' | 'attendance' | 'grades'>('students');
  const [departments, setDepartments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [dRes, cRes, sRes] = await Promise.all([
          fetch('/api/departments'),
          fetch('/api/classes'),
          fetch('/api/subjects'),
        ]);
        if (dRes.ok) setDepartments(await dRes.json());
        if (cRes.ok) setClasses(await cRes.json());
        if (sRes.ok) setSubjects(await sRes.json());
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      if (reportType === 'students') {
        const query = new URLSearchParams({
          departmentId: selectedDept,
          classId: selectedClass,
          limit: '100',
        });
        const res = await fetch(`/api/students?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setReportData(data.students);
        }
      } else if (reportType === 'attendance') {
        const query = new URLSearchParams({
          subjectId: selectedSubject,
          classId: selectedClass,
        });
        const res = await fetch(`/api/attendance?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } else if (reportType === 'grades') {
        const query = new URLSearchParams({
          subjectId: selectedSubject,
          classId: selectedClass,
        });
        const res = await fetch(`/api/grades?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      }
    } catch (err: any) {
      toast.error('Failed to generate report data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [reportType, selectedDept, selectedClass, selectedSubject]);

  // PDF Export using jsPDF & autoTable
  const exportPDF = () => {
    if (reportData.length === 0) {
      toast.error('No report data available to export');
      return;
    }

    const doc = new jsPDF();
    const title = `${reportType.toUpperCase()} REPORT - EDU-MANAGE`;
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);

    if (reportType === 'students') {
      const tableHeaders = [['Student ID', 'Full Name', 'Email', 'Department', 'Class', 'Gender', 'Phone']];
      const tableRows = reportData.map((s) => [
        s.studentId,
        `${s.firstName} ${s.lastName}`,
        s.email,
        s.department?.name || '',
        s.class?.className || '',
        s.gender,
        s.phone,
      ]);
      autoTable(doc, { head: tableHeaders, body: tableRows, startY: 32 });
    } else if (reportType === 'attendance') {
      const tableHeaders = [['Date', 'Student Name', 'Student ID', 'Subject', 'Status']];
      const tableRows = reportData.map((a) => [
        new Date(a.date).toLocaleDateString(),
        `${a.student?.firstName} ${a.student?.lastName}`,
        a.student?.studentId || '',
        a.subject?.subjectName || '',
        a.status,
      ]);
      autoTable(doc, { head: tableHeaders, body: tableRows, startY: 32 });
    } else if (reportType === 'grades') {
      const tableHeaders = [['Student Name', 'Subject', 'Assignment', 'Quiz', 'Midterm', 'Final', 'Total', 'Grade', 'GPA']];
      const tableRows = reportData.map((g) => [
        `${g.student?.firstName} ${g.student?.lastName}`,
        g.subject?.subjectName || '',
        g.assignment,
        g.quiz,
        g.midterm,
        g.finalExam,
        `${g.total}%`,
        g.letterGrade,
        g.gpa,
      ]);
      autoTable(doc, { head: tableHeaders, body: tableRows, startY: 32 });
    }

    doc.save(`${reportType}_report_${Date.now()}.pdf`);
    toast.success('PDF report exported successfully!');
  };

  // Excel Export using XLSX
  const exportExcel = () => {
    if (reportData.length === 0) {
      toast.error('No report data available to export');
      return;
    }

    let excelRows: any[] = [];

    if (reportType === 'students') {
      excelRows = reportData.map((s) => ({
        'Student ID': s.studentId,
        'First Name': s.firstName,
        'Last Name': s.lastName,
        'Email': s.email,
        'Department': s.department?.name,
        'Class': s.class?.className,
        'Gender': s.gender,
        'Phone': s.phone,
        'Address': s.address,
      }));
    } else if (reportType === 'attendance') {
      excelRows = reportData.map((a) => ({
        'Date': new Date(a.date).toLocaleDateString(),
        'Student Name': `${a.student?.firstName} ${a.student?.lastName}`,
        'Student ID': a.student?.studentId,
        'Subject': a.subject?.subjectName,
        'Status': a.status,
      }));
    } else if (reportType === 'grades') {
      excelRows = reportData.map((g) => ({
        'Student Name': `${g.student?.firstName} ${g.student?.lastName}`,
        'Subject': g.subject?.subjectName,
        'Assignment Score': g.assignment,
        'Quiz Score': g.quiz,
        'Midterm Score': g.midterm,
        'Final Exam Score': g.finalExam,
        'Total %': g.total,
        'Letter Grade': g.letterGrade,
        'GPA': g.gpa,
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${reportType} Report`);
    XLSX.writeFile(workbook, `${reportType}_report_${Date.now()}.xlsx`);
    toast.success('Excel report exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-7 h-7 text-indigo-600" />
              Reports & Academic Analytics Export
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate custom PDF and Excel spreadsheets for Student Roster, Attendance, and Grades.
            </p>
          </div>

          <div className="flex gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={exportPDF}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={exportExcel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Report Selector Tabs & Filter Bar */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <button
              onClick={() => setReportType('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'students'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Student Roster Report
            </button>
            <button
              onClick={() => setReportType('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'attendance'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Attendance Summary Report
            </button>
            <button
              onClick={() => setReportType('grades')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'grades'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Academic Grade Matrix Report
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Filter By:</span>
            </div>

            {reportType === 'students' && (
              <>
                <CustomSelect
                  value={selectedDept}
                  onChange={(val) => setSelectedDept(val)}
                  options={[
                    { value: '', label: 'All Departments' },
                    ...departments.map((d) => ({ value: d.id, label: d.name })),
                  ]}
                  className="min-w-44"
                />

                <CustomSelect
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  options={[
                    { value: '', label: 'All Classes' },
                    ...classes.map((c) => ({ value: c.id, label: c.className })),
                  ]}
                  className="min-w-40"
                />
              </>
            )}

            {(reportType === 'attendance' || reportType === 'grades') && (
              <>
                <CustomSelect
                  value={selectedSubject}
                  onChange={(val) => setSelectedSubject(val)}
                  options={[
                    { value: '', label: 'All Subjects' },
                    ...subjects.map((s) => ({
                      value: s.id,
                      label: `${s.subjectName} [${s.code}]`,
                    })),
                  ]}
                  className="min-w-60"
                />

                <CustomSelect
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  options={[
                    { value: '', label: 'All Classes' },
                    ...classes.map((c) => ({ value: c.id, label: c.className })),
                  ]}
                  className="min-w-40"
                />
              </>
            )}
          </div>
        </div>

        {/* Generated Report Table Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Report Data Preview ({reportData.length} records)
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Ready for Export
            </span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              {reportType === 'students' && (
                <>
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-3 px-6">Student ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-6">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reportData.map((s) => (
                      <tr key={s.id}>
                        <td className="py-3 px-6 font-mono font-bold text-blue-600">{s.studentId}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{s.firstName} {s.lastName}</td>
                        <td className="py-3 px-4 text-slate-600">{s.department?.name}</td>
                        <td className="py-3 px-4 text-slate-600">{s.class?.className}</td>
                        <td className="py-3 px-4 text-slate-600">{s.gender}</td>
                        <td className="py-3 px-6 text-slate-500">{s.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {reportType === 'attendance' && (
                <>
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reportData.map((a) => (
                      <tr key={a.id}>
                        <td className="py-3 px-6 font-medium">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{a.student?.firstName} {a.student?.lastName}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{a.student?.studentId}</td>
                        <td className="py-3 px-4 text-slate-600">{a.subject?.subjectName}</td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {reportType === 'grades' && (
                <>
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-3 px-6">Student Name</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-3 text-center">Assignment</th>
                      <th className="py-3 px-3 text-center">Quiz</th>
                      <th className="py-3 px-3 text-center">Midterm</th>
                      <th className="py-3 px-3 text-center">Final</th>
                      <th className="py-3 px-3 text-center">Total</th>
                      <th className="py-3 px-3 text-center">Grade</th>
                      <th className="py-3 px-6 text-center">GPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reportData.map((g) => (
                      <tr key={g.id}>
                        <td className="py-3 px-6 font-bold text-slate-900 dark:text-white">{g.student?.firstName} {g.student?.lastName}</td>
                        <td className="py-3 px-4 text-slate-600">{g.subject?.subjectName}</td>
                        <td className="py-3 px-3 text-center">{g.assignment}</td>
                        <td className="py-3 px-3 text-center">{g.quiz}</td>
                        <td className="py-3 px-3 text-center">{g.midterm}</td>
                        <td className="py-3 px-3 text-center">{g.finalExam}</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-600">{g.total}%</td>
                        <td className="py-3 px-3 text-center font-bold">{g.letterGrade}</td>
                        <td className="py-3 px-6 text-center font-bold text-emerald-600">{g.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
