'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { School, ArrowRight, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || 'Invalid credentials');
      } else {
        toast.success('Signed in successfully!');
        // Fetch session to determine role and redirect
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === 'ADMIN') router.push('/admin');
        else if (role === 'TEACHER') router.push('/teacher');
        else router.push('/student');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const setPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-slate-100 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            EduManage System
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Student Management System Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@school.edu"
              className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white/15 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Credentials Preset Selector */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs font-semibold text-slate-300 text-center mb-3">
            One-Click Demo Account Presets:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPreset('admin@school.edu', 'admin123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400 mb-1" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setPreset('teacher1@school.edu', 'teacher123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-400 mb-1" />
              <span>Teacher</span>
            </button>
            <button
              onClick={() => setPreset('student1@school.edu', 'student123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-purple-400 mb-1" />
              <span>Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
