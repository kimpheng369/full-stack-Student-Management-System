'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faMoon,
  faSun,
  faBell,
  faRightFromBracket,
  faUser,
  faKey,
  faBars,
  faXmark,
  faUserGraduate,
  faChalkboardTeacher,
  faBook,
  faBuilding,
  faChevronDown,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/components/theme-provider';
import { SearchResult } from '@/types';
import { ChangePasswordModal } from '@/components/change-password-modal';

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

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Debounced global search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
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
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside
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
    router.push(href);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'student': return <FontAwesomeIcon icon={faUserGraduate} className="w-3.5 h-3.5 text-[#f97316]" />;
      case 'teacher': return <FontAwesomeIcon icon={faChalkboardTeacher} className="w-3.5 h-3.5 text-[#22c55e]" />;
      case 'subject': return <FontAwesomeIcon icon={faBook} className="w-3.5 h-3.5 text-[#818cf8]" />;
      default:        return <FontAwesomeIcon icon={faBuilding} className="w-3.5 h-3.5 text-[#f59e0b]" />;
    }
  };

  const isDark = theme === 'dark';
  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-white dark:bg-[#1a1612] backdrop-blur-xl border-b border-[#e8e2db] dark:border-[#2a2520] transition-colors">
        {/* Left: Mobile toggle + search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-[#a09890] rounded-lg md:hidden hover:bg-[#f0ebe5] dark:hover:bg-[#2a2520] transition-colors"
          >
            <FontAwesomeIcon icon={faBars} className="w-4.5 h-4.5" />
          </button>

          {/* Search */}
          <div ref={searchContainerRef} className="relative w-full">
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 w-3.5 h-3.5 text-[#b0a89e] pointer-events-none"
              />
              <input
                id="nav-search"
                type="text"
                placeholder="Search students, teachers…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                className="w-full py-2 pl-9 pr-8 text-sm bg-[#f5f1ed] dark:bg-[#24201c] border border-transparent focus:border-[#f97316]/40 rounded-xl text-[#1c1714] dark:text-[#d4cfc9] placeholder-[#b0a89e] focus:outline-none focus:ring-2 focus:ring-[#f97316]/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#b0a89e] hover:text-[#7d7168] transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 mt-2 py-1.5 bg-white dark:bg-[#24201c] rounded-xl shadow-xl border border-[#e8e2db] dark:border-[#2a2520] max-h-80 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="px-4 py-4 flex items-center gap-3 text-[#a09890]">
                    <div className="w-3.5 h-3.5 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Searching…</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleSelectResult(res.href)}
                      className="flex items-center gap-3 w-full px-3.5 py-2.5 hover:bg-[#faf7f4] dark:hover:bg-[#2a2520] text-left transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-[#f5f1ed] dark:bg-[#1c1814] shrink-0">
                        {getResultIcon(res.type)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#1c1714] dark:text-[#d4cfc9] truncate">{res.title}</span>
                        <span className="text-xs text-[#a09890] truncate">{res.subtitle}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-5 text-center text-xs text-[#a09890]">
                    No results for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl text-[#a09890] hover:text-[#3d3530] dark:hover:text-[#d4cfc9] hover:bg-[#f0ebe5] dark:hover:bg-[#2a2520] transition-all"
            title="Toggle theme"
          >
            {isDark
              ? <FontAwesomeIcon icon={faSun} className="w-4 h-4 text-[#f97316]" />
              : <FontAwesomeIcon icon={faMoon} className="w-4 h-4" />
            }
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-xl text-[#a09890] hover:text-[#3d3530] dark:hover:text-[#d4cfc9] hover:bg-[#f0ebe5] dark:hover:bg-[#2a2520] transition-all"
            title="Notifications"
          >
            <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          </button>

          <div className="h-5 w-px bg-[#e8e2db] dark:bg-[#2a2520] mx-1" />

          {/* Profile dropdown */}
          <div ref={profileMenuRef} className="relative">
            <button
              id="profile-menu-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#f0ebe5] dark:hover:bg-[#2a2520] transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-[#f97316] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                {userInitial}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-[#1c1714] dark:text-[#d4cfc9] leading-tight">
                  {session?.user?.name || 'User'}
                </span>
                <span className="text-[10px] text-[#f97316] font-medium">
                  {(session?.user as any)?.role || 'USER'}
                </span>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`hidden lg:block w-2.5 h-2.5 text-[#b0a89e] transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 py-1.5 bg-white dark:bg-[#24201c] rounded-xl shadow-xl border border-[#e8e2db] dark:border-[#2a2520] z-50">
                {/* Header */}
                <div className="px-3.5 py-3 border-b border-[#f0ebe5] dark:border-[#2a2520]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f97316] text-white font-bold text-sm flex items-center justify-center shadow-sm shadow-orange-500/20 shrink-0">
                      {userInitial}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs font-bold text-[#1c1714] dark:text-[#d4cfc9] truncate">{session?.user?.name}</p>
                      <p className="text-[11px] text-[#a09890] truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      const role = (session?.user as any)?.role;
                      if (role === 'STUDENT') router.push('/student');
                      else if (role === 'TEACHER') router.push('/teacher');
                      else router.push('/admin');
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-semibold text-[#3d3530] dark:text-[#c4bdb5] hover:bg-[#faf7f4] dark:hover:bg-[#2a2520] transition-colors"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#fff4ec] dark:bg-[#f97316]/10 text-[#f97316]">
                      <FontAwesomeIcon icon={faCircleUser} className="w-3 h-3" />
                    </span>
                    My Dashboard
                  </button>

                  <button
                    onClick={() => { setShowProfileMenu(false); setShowPasswordModal(true); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-semibold text-[#3d3530] dark:text-[#c4bdb5] hover:bg-[#faf7f4] dark:hover:bg-[#2a2520] transition-colors"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#f3f0ff] dark:bg-[#818cf8]/10 text-[#818cf8]">
                      <FontAwesomeIcon icon={faKey} className="w-3 h-3" />
                    </span>
                    Change Password
                  </button>
                </div>

                <div className="my-1 mx-3 border-t border-[#f0ebe5] dark:border-[#2a2520]" />

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-500">
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-3 h-3" />
                  </span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
