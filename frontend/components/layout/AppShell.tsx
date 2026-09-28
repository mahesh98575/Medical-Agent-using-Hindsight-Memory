'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { HealthStatus, Patient } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
  patient: Patient;
  patients?: Patient[];
  onSelectPatient?: (patient: Patient) => void;
  onOpenAddPatient?: () => void;
  health: HealthStatus | null;
  healthLoading: boolean;
  healthError: string | null;
  currentSection: string;
  onSelectSection: (section: string) => void;
  conflictCount: number;
  medicationCount?: number;
  onOpenSearch?: () => void;
}

export function AppShell({
  children,
  patient,
  patients = [],
  onSelectPatient,
  onOpenAddPatient,
  health,
  healthLoading,
  healthError,
  currentSection,
  onSelectSection,
  conflictCount,
  medicationCount = 0,
  onOpenSearch,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectSection = (section: string) => {
    onSelectSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      {/* Global Header */}
      <Header
        patient={patient}
        patients={patients}
        onSelectPatient={onSelectPatient}
        onOpenAddPatient={onOpenAddPatient}
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
            medicationCount={medicationCount}
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
                medicationCount={medicationCount}
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
