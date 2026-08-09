'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Moon,
  Sun,
  Bell,
  LogOut,
  User,
  KeyRound,
  Menu,
  X,
  GraduationCap,
  UserCheck,
  BookOpen,
  Building2,
  Command,
} from 'lucide-react';
import { useTheme } from '@/frontend/components/theme-provider';
import { SearchResult } from '@/types';
import { ChangePasswordModal } from '@/frontend/components/change-password-modal';

interface NavbarProps {
  setMobileOpen: (val: boolean) => void;
}

export function Navbar({ setMobileOpen }: NavbarProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced live global search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchResults(true);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listeners
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (href: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSelectedIndex(-1);
    router.push(href);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        e.preventDefault();
        handleSelectResult(searchResults[selectedIndex].href);
      }
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      inputRef.current?.blur();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'teacher':
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case 'subject':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Building2 className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        {/* Mobile Menu Toggle & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-500 rounded-lg md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Global Search Bar */}
          <div ref={searchContainerRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Global Search (Students, Teachers, Subjects)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onKeyDown={handleInputKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                className="w-full py-2 pl-10 pr-16 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
              />
              <div className="absolute right-3 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndex(-1);
                    }}
                    className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/70 dark:bg-slate-700/80 rounded-md border border-slate-300/50 dark:border-slate-600">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                )}
              </div>
            </div>

            {/* Live Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 mt-2 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-96 overflow-y-auto z-50 animate-scale-in">
                {isSearching ? (
                  <div className="p-4 text-xs text-center text-slate-500 animate-pulse">Searching directory...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((res, index) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleSelectResult(res.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-all ${
                        selectedIndex === index
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 translate-x-1'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getResultIcon(res.type)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {res.title}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {res.subtitle}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-xs text-center text-slate-500">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-90 duration-150"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400 rotate-0 transition-transform duration-300" /> : <Moon className="w-5 h-5 transition-transform duration-300" />}
          </button>

          {/* Notifications Dummy Popover */}
          <div className="relative">
            <button
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-90 duration-150 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* User Profile Dropdown */}
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {session?.user?.name || 'User Account'}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  {(session?.user as any)?.role || 'USER'}
                </span>
              </div>
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    const role = (session?.user as any)?.role;
                    if (role === 'STUDENT') router.push('/student');
                    else if (role === 'TEACHER') router.push('/teacher');
                    else router.push('/admin');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Dashboard Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowPasswordModal(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  Change Password
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
