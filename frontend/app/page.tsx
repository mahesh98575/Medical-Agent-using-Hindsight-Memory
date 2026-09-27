'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PatientSummaryCard } from '@/components/dashboard/PatientSummaryCard';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { ActiveConflictCard } from '@/components/dashboard/ActiveConflictCard';
import { MedicationSummarySection } from '@/components/dashboard/MedicationSummarySection';
import { AllergySummarySection } from '@/components/dashboard/AllergySummarySection';
import { RecentTimelineSection } from '@/components/dashboard/RecentTimelineSection';
import { MemoryPreviewSection } from '@/components/dashboard/MemoryPreviewSection';

// Phase 3 Views & Modals
import { EvidenceDrawer } from '@/components/evidence/EvidenceDrawer';
import { MedicationsView } from '@/components/medications/MedicationsView';
import { AllergiesView } from '@/components/allergies/AllergiesView';
import { TimelineView } from '@/components/timeline/TimelineView';
import { ConflictCenterView } from '@/components/conflicts/ConflictCenterView';
import { AiAssistantView } from '@/components/ai/AiAssistantView';
import { PatientProfileView } from '@/components/patient/PatientProfileView';
import { DemoScenarioView } from '@/components/demo/DemoScenarioView';
import { SettingsView } from '@/components/settings/SettingsView';
import { AddPatientModal } from '@/components/patient/AddPatientModal';
import { GlobalSearchBar } from '@/components/search/GlobalSearchBar';

// Services & Types
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
import { chatService } from '@/services/chatService';
import { memoryService } from '@/services/memoryService';
import {
  HealthStatus,
  Patient,
  EvidenceDetail,
  ConflictRecord,
} from '@/types';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [patient, setPatient] = useState<Patient>(DEMO_PATIENT);
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Evidence Drawer & Modal States
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceDetail | null>(null);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Dynamic clinical conflict state
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([...DEMO_CONFLICTS]);

  // Check backend health
  const refreshHealth = useCallback(() => {
    setHealthLoading(true);
    api.getHealth()
      .then((data) => {
        setHealth(data);
        setHealthError(null);
      })
      .catch((err: unknown) => {
        setHealthError(err instanceof Error ? err.message : 'Backend in standby mode');
      })
      .finally(() => {
        setHealthLoading(false);
      });
  }, []);

  useEffect(() => {
    let active = true;
    api.getHealth()
      .then((data) => {
        if (active) {
          setHealth(data);
          setHealthError(null);
          setHealthLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setHealthError(err instanceof Error ? err.message : 'Backend in standby mode');
          setHealthLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K (Global Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReviewEvidence = (evidence: EvidenceDetail) => {
    setSelectedEvidence(evidence);
    setIsEvidenceDrawerOpen(true);
  };

  const handleLoadDemoPatient = async () => {
    setPatient(DEMO_PATIENT);
    setConflicts([...DEMO_CONFLICTS]);
    await memoryService.loadDemo('P001');
    showFeedback('Demo Patient P001 profile and synthetic memory banks reloaded.');
  };

  const handleAddPatientSubmit = (newPatient: Patient) => {
    setPatient(newPatient);
    showFeedback(`Patient "${newPatient.synthetic_label}" registered. Memory bank initialized.`);
  };

  const handleResolveConflict = (conflictId: string, note: string) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId
          ? {
              ...c,
              status: 'clinician_verified' as const,
              action_required: note || 'Clinician verified.',
            }
          : c
      )
    );
    showFeedback('Clinical discrepancy verified and recorded to audit trail.');
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  const handleSelectSearchResult = (section: string) => {
    setCurrentSection(section);
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
      conflictCount={conflicts.filter((c) => c.status === 'unresolved').length}
      onOpenSearch={() => setIsSearchModalOpen(true)}
    >
      <div className="space-y-6">
        {/* Flash Feedback Banner */}
        {feedbackMessage && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-teal-700 hover:text-teal-950 font-bold ml-2 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Dynamic Section Routing */}
        {currentSection === 'dashboard' && (
          <>
            {/* 1. Patient Summary Card with Title, Description, and Action Buttons */}
            <PatientSummaryCard
              patient={patient}
              onLoadDemoPatient={handleLoadDemoPatient}
              onAddPatient={() => setIsAddPatientModalOpen(true)}
            />

            {/* Quick Action Navigation Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-teal-600 text-white flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-teal-100" />
                    <h3 className="font-bold text-sm">Ask Clinical Memory Assistant</h3>
                  </div>
                  <p className="text-xs text-teal-100">
                    Query active vs stopped medications, allergies, or conflict rationales.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSection('ai-assistant')}
                  className="bg-white text-teal-800 hover:bg-teal-50 border-white shrink-0 ml-3"
                >
                  Open Assistant
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm">Run 5-Step Demo Walkthrough</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    See memory retention, contradiction detection, and safety boundaries in action.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSection('demo-scenario')}
                  className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700 shrink-0 ml-3"
                >
                  Start Demo
                </Button>
              </div>
            </div>

            {/* 2. Five Key Metric / Overview Cards */}
            <OverviewCards
              currentMedCount={currentMeds.length}
              stoppedMedCount={stoppedMeds.length}
              allergyCount={DEMO_ALLERGIES.length}
              symptomCount={DEMO_SYMPTOMS.length}
              conflictCount={conflicts.filter((c) => c.status === 'unresolved').length}
              memoryCount={DEMO_MEMORIES.length}
              onNavigate={setCurrentSection}
            />

            {/* 3. Active Clinical Conflict Alert */}
            {conflicts.filter((c) => c.status === 'unresolved').length > 0 && (
              <ActiveConflictCard
                conflict={conflicts.filter((c) => c.status === 'unresolved')[0]}
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
                  onNavigateToMemories={() => setCurrentSection('patient-profile')}
                />
              </div>
            </div>
          </>
        )}

        {/* Section: AI Memory Assistant */}
        {currentSection === 'ai-assistant' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <AiAssistantView
              patient={patient}
              onReviewEvidence={handleReviewEvidence}
              onSendMessage={async (msg) => chatService.sendMessage(patient.id, msg)}
              onRetainMemory={async (text, cat) => {
                await memoryService.retainMemory(patient.id, { text, category: cat });
                return true;
              }}
            />
          </div>
        )}

        {/* Section: Demo Walkthrough */}
        {currentSection === 'demo-scenario' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <DemoScenarioView
              onReviewEvidence={handleReviewEvidence}
              onJumpToAiAssistant={() => setCurrentSection('ai-assistant')}
            />
          </div>
        )}

        {/* Section: Patient Profile / History */}
        {(currentSection === 'patient-profile' || currentSection === 'medical-history' || currentSection === 'memories' || currentSection === 'symptoms') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <PatientProfileView
              patient={patient}
              medications={DEMO_MEDICATIONS}
              allergies={DEMO_ALLERGIES}
              symptoms={DEMO_SYMPTOMS}
              conflicts={conflicts}
              memories={DEMO_MEMORIES}
              onReviewEvidence={handleReviewEvidence}
              initialTab={
                currentSection === 'symptoms'
                  ? 'symptoms'
                  : currentSection === 'memories'
                  ? 'memories'
                  : 'overview'
              }
            />
          </div>
        )}

        {/* Section: Medications Management */}
        {currentSection === 'medications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <MedicationsView
              medications={DEMO_MEDICATIONS}
              onReviewEvidence={handleReviewEvidence}
              onOpenAddMedication={() => showFeedback('Medication recording dialogue opened.')}
            />
          </div>
        )}

        {/* Section: Allergy Records & Safety */}
        {currentSection === 'allergies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <AllergiesView
              allergies={DEMO_ALLERGIES}
              conflicts={conflicts}
              onReviewEvidence={handleReviewEvidence}
              onNavigateToConflictCenter={() => setCurrentSection('conflicts')}
            />
          </div>
        )}

        {/* Section: Conflict Center */}
        {currentSection === 'conflicts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <ConflictCenterView
              conflicts={conflicts}
              onReviewEvidence={handleReviewEvidence}
              onResolveConflict={handleResolveConflict}
            />
          </div>
        )}

        {/* Section: Timeline */}
        {currentSection === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <TimelineView
              events={DEMO_TIMELINE}
              onReviewEvidence={handleReviewEvidence}
            />
          </div>
        )}

        {/* Section: Settings & System */}
        {currentSection === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSection('dashboard')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <SettingsView
              health={health}
              onRefreshHealth={refreshHealth}
            />
          </div>
        )}
      </div>

      {/* Reusable Evidence Citation Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidence={selectedEvidence}
      />

      {/* Synthetic Patient Registration Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onAddPatient={handleAddPatientSubmit}
      />

      {/* Global Quick Search Modal */}
      <GlobalSearchBar
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
        onReviewEvidence={handleReviewEvidence}
      />
    </AppShell>
  );
}
