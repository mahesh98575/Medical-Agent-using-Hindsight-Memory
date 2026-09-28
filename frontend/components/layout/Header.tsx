'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Brain, Server, Menu, X, Search, ChevronDown, UserPlus, Check } from 'lucide-react';
import { HealthStatus, Patient } from '@/types';

interface HeaderProps {
  patient: Patient;
  patients?: Patient[];
  onSelectPatient?: (patient: Patient) => void;
  onOpenAddPatient?: () => void;
  health: HealthStatus | null;
  healthLoading: boolean;
  healthError: string | null;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenSearch?: () => void;
}

export function Header({
  patient,
  patients = [],
  onSelectPatient,
  onOpenAddPatient,
  healthLoading,
  mobileMenuOpen,
  onToggleMobileMenu,
  onOpenSearch,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-sm font-semibold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  Healthcare Memory Assistant
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 rounded-md border border-teal-200/80">
                  Clinical Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Time-Aware Clinical Memory & Decision Support Architecture
              </p>
            </div>
          </div>
        </div>

        {/* Right: Search, Patient Selector & Engine Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Button */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Search records (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Quick Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Interactive Active Patient Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-colors shadow-2xs"
              title="Switch or view patients"
            >
              <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">
                {patient.synthetic_label.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] block text-slate-400 font-medium leading-none">
                  Patient
                </span>
                <span className="font-semibold text-slate-800 leading-none">
                  {patient.synthetic_label}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Patient Record
                  </span>
                  {onOpenAddPatient && (
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAddPatient();
                      }}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {patients.length > 0 ? (
                    patients.map((p) => {
                      const isSelected = p.id === patient.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            if (onSelectPatient) onSelectPatient(p);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-teal-50/70 text-teal-950 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <div className="truncate font-medium">{p.synthetic_label}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {p.age}y • {p.gender || 'Unknown'} • {p.primary_condition || 'Consult'}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3.5 py-2 text-xs text-slate-400">No other patients found</div>
                  )}
                </div>

                {onOpenAddPatient && (
                  <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAddPatient();
                      }}
                      className="w-full text-center py-1.5 px-2 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Register New Patient</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Engine Status Chip */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50/60 border border-emerald-200/80 shadow-2xs">
            <Server className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline text-emerald-900 font-medium">Memory Engine:</span>
            <span className="text-emerald-700 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {healthLoading ? 'Syncing...' : 'Operational'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
