'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, Filter } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = true,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div ref={containerRef} className={`relative min-w-48 ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs rounded-xl font-semibold transition-all text-left shadow-xs ${
          isOpen
            ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 text-slate-900 dark:text-white'
            : 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500/60 dark:hover:border-blue-500/60 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white'
        }`}
      >
        <span className={`truncate ${!selectedOption || selectedOption.value === '' ? 'text-slate-400 dark:text-slate-400 font-normal' : 'font-semibold'}`}>
          {selectedOption && selectedOption.value !== '' ? selectedOption.label : placeholder}
        </span>
        <div className="w-5 h-5 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-500 dark:text-blue-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl z-50 animate-scale-in max-h-72 overflow-hidden flex flex-col">
          {searchable && options.length > 5 && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Filter options..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto max-h-56 py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
                          }`}
                        >
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3.5 py-3 text-xs text-center text-slate-400">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
