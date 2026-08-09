'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  School,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('ADMIN');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSelectPreset = (role: 'ADMIN' | 'TEACHER' | 'STUDENT') => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@school.edu');
      setPassword('admin123');
    } else if (role === 'TEACHER') {
      setEmail('teacher1@school.edu');
      setPassword('teacher123');
    } else {
      setEmail('student1@school.edu');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0b0f19] text-slate-100 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Animated Ambient Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 relative z-10 my-auto">
        {/* Left Side: Brand & Feature Showcase (Visible on Large Screens) */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 pr-12 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-blue-400" /> Enterprise Campus Portal
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
                <School className="w-7 h-7" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                EduManage <span className="text-blue-500">Pro</span>
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Streamlined Academic Management for Modern Institutions
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Empower your campus with real-time student registration, automated GPA grade calculations, lecture attendance tracking, and instant executive analytics.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Real-time Analytics
              </div>
              <p className="text-[11px] text-slate-400">Live student GPAs and class attendance metrics.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <BookOpen className="w-4 h-4" /> Course Management
              </div>
              <p className="text-[11px] text-slate-400">Assign subjects, faculty rosters, and schedules.</p>
            </div>
          </div>

          {/* Institutional Trust Quote */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-[#0b0f19]">
                JD
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border-2 border-[#0b0f19]">
                AS
              </div>
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center border-2 border-[#0b0f19]">
                KP
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Trusted by 100+ Campuses</p>
              <p className="text-[11px] text-slate-400">Over 50,000+ active student records processed.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Luxury Glass Login Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-blue-500/5 relative">
            {/* Header Mobile Brand */}
            <div className="flex flex-col items-center text-center mb-6 lg:mb-8">
              <div className="lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-3">
                <School className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Sign In to Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Role Demo Preset Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Demo Role Selector
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('ADMIN')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'ADMIN'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('TEACHER')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'TEACHER'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Teacher
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('STUDENT')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'STUDENT'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" /> Student
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@school.edu"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Contact system administrator to reset password.'); }} className="text-blue-400 font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500">
                Protected by Student Management System Security Standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
