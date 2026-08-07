'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faArrowRight,
  faShieldHalved,
  faChalkboardTeacher,
  faUserGraduate,
  faEnvelope,
  faLock,
  faSpinner,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex bg-[#faf8f5]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#1c1714] p-12 relative overflow-hidden">
        {/* Subtle warm texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #e8d5b0 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />
        {/* Warm glow accent */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f97316] opacity-[0.07] rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FontAwesomeIcon icon={faSchool} className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">EduManage</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your school,<br />
            <span className="text-[#f97316]">beautifully</span><br />
            organized.
          </h2>
          <p className="text-[#7d7168] text-sm leading-relaxed max-w-xs">
            A single place to manage students, teachers, attendance, grades, and reports — all in one thoughtful system.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-3">
          {[
            { label: 'Student & Teacher Management', color: 'bg-[#f97316]/15 text-[#f97316]' },
            { label: 'Attendance Tracking', color: 'bg-[#22c55e]/15 text-[#22c55e]' },
            { label: 'Grades & Academic Reports', color: 'bg-[#818cf8]/15 text-[#818cf8]' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${f.color}`}>
                {f.label}
              </span>
            </div>
          ))}
          <p className="text-[#4a4340] text-[11px] mt-6">EduManage © {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#f97316] flex items-center justify-center">
              <FontAwesomeIcon icon={faSchool} className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[#1c1714] text-base">EduManage</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1c1714] mb-1.5">Welcome back</h1>
            <p className="text-sm text-[#7d7168]">Sign in to your portal to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3d3530]">
                Email address
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b0a89e] pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full px-4 py-2.5 pl-10 text-sm bg-white border border-[#e4ddd5] rounded-xl text-[#1c1714] placeholder-[#c4bdb5] focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3d3530]">
                Password
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b0a89e] pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pl-10 pr-10 text-sm bg-white border border-[#e4ddd5] rounded-xl text-[#1c1714] placeholder-[#c4bdb5] focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b0a89e] hover:text-[#7d7168] transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#f97316]/20 mt-2 hover:shadow-[#f97316]/30 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Continue to portal
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo presets */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#e4ddd5]" />
              <span className="text-[11px] text-[#b0a89e] font-medium">Demo accounts</span>
              <div className="flex-1 h-px bg-[#e4ddd5]" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Admin', icon: faShieldHalved, email: 'admin@school.edu', pass: 'admin123', dot: 'bg-[#f97316]' },
                { label: 'Teacher', icon: faChalkboardTeacher, email: 'teacher1@school.edu', pass: 'teacher123', dot: 'bg-[#22c55e]' },
                { label: 'Student', icon: faUserGraduate, email: 'student1@school.edu', pass: 'student123', dot: 'bg-[#818cf8]' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPreset(preset.email, preset.pass)}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 bg-white border border-[#e4ddd5] rounded-xl hover:border-[#f97316]/50 hover:bg-[#fff9f5] transition-all group text-center"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${preset.dot}`} />
                  <FontAwesomeIcon icon={preset.icon} className="w-4 h-4 text-[#b0a89e] group-hover:text-[#f97316] transition-colors" />
                  <span className="text-[11px] font-semibold text-[#7d7168] group-hover:text-[#3d3530] transition-colors">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
