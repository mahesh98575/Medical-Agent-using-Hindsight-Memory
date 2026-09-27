'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PatientSummaryCard } from '@/components/dashboard/PatientSummaryCard';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { ActiveConflictCard } from '@/components/dashboard/ActiveConflictCard';
import { MedicationSummarySection } from '@/components/dashboard/MedicationSummarySection';
import { AllergySummarySection } from '@/components/dashboard/AllergySummarySection';
import { RecentTimelineSection } from '@/components/dashboard/RecentTimelineSection';
import { MemoryPreviewSection } from '@/components/dashboard/MemoryPreviewSection';
import {
  DEMO_PATIENT,
  DEMO_MEDICATIONS,
  DEMO_ALLERGIES,
  DEMO_SYMPTOMS,
  DEMO_CONFLICTS,
  DEMO_TIMELINE,
  DEMO_MEMORIES,
} from '@/services/mockData';
import { api } from '@/services/api';
import { HealthStatus, Patient } from '@/types';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [patient, setPatient] = useState<Patient>(DEMO_PATIENT);
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Poll or check backend health
  useEffect(() => {
    let isMounted = true;
    async function checkBackend() {
      try {
        const data = await api.getHealth();
        if (isMounted) {
          setHealth(data);
          setHealthError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof Error) {
            setHealthError(err.message);
          } else {
            setHealthError('Backend server standby');
          }
        }
      } finally {
        if (isMounted) setHealthLoading(false);
      }
    }
    checkBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadDemoPatient = () => {
    setPatient(DEMO_PATIENT);
    showFeedback('Demo Patient 001 profile and synthetic memory banks reloaded.');
  };

  const handleAddPatient = () => {
    showFeedback('Patient onboarding workflow will be enabled in Phase 3.');
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // Section placeholder view for navigation items that will be built in subsequent phases
  const renderSectionPlaceholder = (sectionId: string) => {
    const titles: Record<string, string> = {
      'medical-history': 'Medical History',
      medications: 'Medication Management',
      allergies: 'Allergy Records & Safety',
      symptoms: 'Symptom Tracking',
      timeline: 'Comprehensive Medical Timeline',
      conflicts: 'Conflict Verification Center',
      memories: 'Hindsight Memory Explorer',
    };

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{titles[sectionId] || sectionId}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Dedicated detail view scheduled for subsequent development phase.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSection('dashboard')}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            {titles[sectionId]} View Under Construction
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Phase 2 establishes the core Healthcare Memory Assistant Dashboard. Full interactive views for this module will be implemented in subsequent phases.
          </p>
        </div>
      </div>
    );
  };

  const currentMeds = DEMO_MEDICATIONS.filter((m) => m.status === 'CURRENT');
  const stoppedMeds = DEMO_MEDICATIONS.filter(
    (m) => m.status === 'STOPPED' || m.status === 'HISTORICAL'
  );

  return (
    <AppShell
      patient={patient}
      health={health}
      healthLoading={healthLoading}
      healthError={healthError}
      currentSection={currentSection}
      onSelectSection={setCurrentSection}
      conflictCount={DEMO_CONFLICTS.length}
    >
      <div className="space-y-6">
        {/* Flash Feedback Banner */}
        {feedbackMessage && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-medium flex items-center justify-between animate-fade-in">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-teal-600 hover:text-teal-900 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Dynamic Section Routing */}
        {currentSection === 'dashboard' ? (
          <>
            {/* 1. Patient Summary Card with Title, Description, and Action Buttons */}
            <PatientSummaryCard
              patient={patient}
              onLoadDemoPatient={handleLoadDemoPatient}
              onAddPatient={handleAddPatient}
            />

            {/* 2. Five Key Metric / Overview Cards */}
            <OverviewCards
              currentMedCount={currentMeds.length}
              stoppedMedCount={stoppedMeds.length}
              allergyCount={DEMO_ALLERGIES.length}
              symptomCount={DEMO_SYMPTOMS.length}
              conflictCount={DEMO_CONFLICTS.length}
              memoryCount={DEMO_MEMORIES.length}
              onNavigate={setCurrentSection}
            />

            {/* 3. Active Clinical Conflict Alert */}
            {DEMO_CONFLICTS.length > 0 && (
              <ActiveConflictCard
                conflict={DEMO_CONFLICTS[0]}
                onNavigateToConflicts={() => setCurrentSection('conflicts')}
              />
            )}

            {/* 4. Two-Column Clinical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Medications & Allergies */}
              <div className="space-y-6">
                <MedicationSummarySection
                  medications={DEMO_MEDICATIONS}
                  onNavigateToMedications={() => setCurrentSection('medications')}
                />
                <AllergySummarySection
                  allergies={DEMO_ALLERGIES}
                  onNavigateToAllergies={() => setCurrentSection('allergies')}
                />
              </div>

              {/* Right Column: Timeline & Hindsight Memories */}
              <div className="space-y-6">
                <RecentTimelineSection
                  events={DEMO_TIMELINE}
                  onNavigateToTimeline={() => setCurrentSection('timeline')}
                />
                <MemoryPreviewSection
                  memories={DEMO_MEMORIES}
                  onNavigateToMemories={() => setCurrentSection('memories')}
                />
              </div>
            </div>
          </>
        ) : (
          renderSectionPlaceholder(currentSection)
        )}
      </div>
    </AppShell>
  );
}
