'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileClock,
  Pill,
  ShieldAlert,
  Activity,
  History,
  AlertTriangle,
  BrainCircuit,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  conflictCount: number;
}

export function Sidebar({
  currentSection,
  onSelectSection,
  conflictCount,
}: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'ai-assistant',
      label: 'AI Memory Assistant',
      icon: BrainCircuit,
      badge: 'Live',
      badgeColor: 'bg-teal-600 text-white',
    },
    {
      id: 'demo-scenario',
      label: 'Demo Walkthrough',
      icon: History,
      badge: '5 Steps',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'patient-profile',
      label: 'Patient Profile',
      icon: FileClock,
      badge: null,
    },
    {
      id: 'medications',
      label: 'Medications',
      icon: Pill,
      badge: '2',
    },
    {
      id: 'allergies',
      label: 'Allergies',
      icon: ShieldAlert,
      badge: null,
    },
    {
      id: 'conflicts',
      label: 'Conflict Center',
      icon: AlertTriangle,
      badge: conflictCount > 0 ? `${conflictCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'timeline',
      label: 'Medical Timeline',
      icon: History,
      badge: null,
    },
    {
      id: 'settings',
      label: 'System & Safety',
      icon: HelpCircle,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-1 flex-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Clinical Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-bold text-[10px] ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety & Persistence Footer Info */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
        <div className="flex items-start gap-2 text-slate-500 text-xs">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-tight text-[11px]">
            <strong className="text-slate-700">Safety Notice:</strong> Informational decision-support only. Not an autonomous clinical diagnostic tool.
          </p>
        </div>
      </div>
    </aside>
  );
}
