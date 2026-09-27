'use client';

import React from 'react';
import { Brain, Server, Menu, X, User, Search } from 'lucide-react';
import { HealthStatus, Patient } from '@/types';

interface HeaderProps {
  patient: Patient;
  health: HealthStatus | null;
  healthLoading: boolean;
  healthError: string | null;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenSearch?: () => void;
}

export function Header({
  patient,
  health,
  healthLoading,
  healthError,
  mobileMenuOpen,
  onToggleMobileMenu,
  onOpenSearch,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
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
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm font-semibold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  Healthcare Memory Assistant
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded border border-amber-200">
                  Synthetic
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Persistent, Time-Aware Clinical Memory & Decision Support
              </p>
            </div>
          </div>
        </div>

        {/* Right: Search, Active Patient & Backend Health Indicator */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Search records (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Quick Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Active Patient Chip */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-slate-500">Active Patient:</span>
            <span className="font-semibold text-slate-800">{patient.synthetic_label}</span>
            <span className="font-mono text-[11px] text-slate-400">({patient.id})</span>
          </div>

          {/* Backend Status Chip */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline text-slate-600">Backend:</span>
            {healthLoading ? (
              <span className="text-slate-400">Connecting...</span>
            ) : health?.status === 'healthy' ? (
              <span className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            ) : (
              <span
                className="text-amber-700 font-semibold"
                title={healthError || 'Backend in standby mode'}
              >
                Standby
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
