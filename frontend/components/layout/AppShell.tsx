'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { HealthStatus, Patient } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
  patient: Patient;
  health: HealthStatus | null;
  healthLoading: boolean;
  healthError: string | null;
  currentSection: string;
  onSelectSection: (section: string) => void;
  conflictCount: number;
  onOpenSearch?: () => void;
}

export function AppShell({
  children,
  patient,
  health,
  healthLoading,
  healthError,
  currentSection,
  onSelectSection,
  conflictCount,
  onOpenSearch,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectSection = (section: string) => {
    onSelectSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Banner: Synthetic Data Disclaimer */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>
          SYNTHETIC DEMO ENVIRONMENT — All patient records, medications, and clinical histories are simulated for clinical decision-support demonstrations.
        </span>
      </div>

      {/* Global Header */}
      <Header
        patient={patient}
        health={health}
        healthLoading={healthLoading}
        healthError={healthError}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onOpenSearch={onOpenSearch}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentSection={currentSection}
            onSelectSection={handleSelectSection}
            conflictCount={conflictCount}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-64 max-w-[80%] h-full bg-white shadow-xl z-50 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                currentSection={currentSection}
                onSelectSection={handleSelectSection}
                conflictCount={conflictCount}
              />
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
