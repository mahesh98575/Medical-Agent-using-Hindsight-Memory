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

// Views & Modals
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
import { AddMedicationModal } from '@/components/medications/AddMedicationModal';
import { AddAllergyModal } from '@/components/allergies/AddAllergyModal';
import { AddMemoryModal } from '@/components/memories/AddMemoryModal';
import { GlobalSearchBar } from '@/components/search/GlobalSearchBar';
import { Toast } from '@/components/ui/Toast';

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
import { patientService } from '@/services/patientService';
import { medicationService } from '@/services/medicationService';
import { allergyService } from '@/services/allergyService';
import { memoryService } from '@/services/memoryService';
import { chatService } from '@/services/chatService';
import {
  HealthStatus,
  Patient,
  Medication,
  Allergy,
  Symptom,
  ConflictRecord,
  MemoryItem,
  TimelineEvent,
  EvidenceDetail,
} from '@/types';
import { ArrowLeft, Brain, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  // Registered Patients State
  const [patients, setPatients] = useState<Patient[]>([DEMO_PATIENT]);
  const [patient, setPatient] = useState<Patient>(DEMO_PATIENT);
  const [currentSection, setCurrentSection] = useState<string>('dashboard');

  // Dynamic Clinical Data State (Per Patient)
  const [medications, setMedications] = useState<Medication[]>([...DEMO_MEDICATIONS]);
  const [allergies, setAllergies] = useState<Allergy[]>([...DEMO_ALLERGIES]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([...DEMO_SYMPTOMS]);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([...DEMO_CONFLICTS]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([...DEMO_TIMELINE]);
  const [memories, setMemories] = useState<MemoryItem[]>([...DEMO_MEMORIES]);

  // System & Health State
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceDetail | null>(null);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
  const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);
  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Load patients and initial data
  useEffect(() => {
    patientService.getPatients().then((list) => {
      if (list && list.length > 0) {
        setPatients(list);
        setPatient(list[0]);
      }
    });
  }, []);

  // Sync patient-specific clinical data when active patient changes
  useEffect(() => {
    medicationService.getMedications(patient.id).then((meds) => {
      setMedications(meds);
    });
    allergyService.getAllergies(patient.id).then((algs) => {
      setAllergies(algs);
    });
    memoryService.getMemories(patient.id).then((mems) => {
      setMemories(mems);
    });
  }, [patient.id]);

  // Check backend health
  const refreshHealth = useCallback(() => {
    setHealthLoading(true);
    api.getHealth()
      .then((data) => {
        setHealth(data);
        setHealthError(null);
      })
      .catch((err: unknown) => {
        setHealthError(err instanceof Error ? err.message : null);
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
          setHealthError(err instanceof Error ? err.message : null);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleReviewEvidence = (evidence: EvidenceDetail) => {
    setSelectedEvidence(evidence);
    setIsEvidenceDrawerOpen(true);
  };

  const handleLoadDemoPatient = async () => {
    await memoryService.loadDemo('P001');
    const demo = { ...DEMO_PATIENT };
    setPatient(demo);
    setMedications([...DEMO_MEDICATIONS]);
    setAllergies([...DEMO_ALLERGIES]);
    setSymptoms([...DEMO_SYMPTOMS]);
    setConflicts([...DEMO_CONFLICTS]);
    setTimeline([...DEMO_TIMELINE]);
    setMemories([...DEMO_MEMORIES]);
    showToast(`Patient "${demo.synthetic_label}" baseline clinical record reloaded.`);
  };

  // Add Patient
  const handleAddPatientSubmit = async (newPatient: Patient) => {
    const saved = await patientService.createPatient(newPatient);
    setPatients((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
    setPatient(saved);
    setMedications([]);
    setAllergies([]);
    setSymptoms([]);
    setConflicts([]);
    setMemories([]);
    setTimeline([
      {
        id: `tl_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        formatted_date: 'Today',
        title: 'Patient Intake Completed',
        description: `Patient profile registered for ${saved.synthetic_label}. Memory bank initialized.`,
        category: 'recommendation',
        status: 'CURRENT',
      },
    ]);
    showToast(`Patient "${saved.synthetic_label}" successfully registered. Medical vault initialized.`);
  };

  // Switch Active Patient
  const handleSelectPatient = (selected: Patient) => {
    setPatient(selected);
    showToast(`Switched active patient to ${selected.synthetic_label}.`);
  };

  // Add Medication
  const handleAddMedicationSubmit = async (medData: Omit<Medication, 'id'>) => {
    const newMed = await medicationService.addMedication(patient.id, medData);
    setMedications((prev) => [newMed, ...prev]);

    // Append to timeline
    const newTimelineEvent: TimelineEvent = {
      id: `tl_${Date.now()}`,
      date: newMed.start_date || new Date().toISOString().split('T')[0],
      formatted_date: 'Today',
      title: `${newMed.name} Recorded`,
      description: `${newMed.status === 'CURRENT' ? 'Active therapy' : 'Discontinued'}: ${newMed.indication || 'Prescription recorded'}.`,
      category: 'medication',
      status: newMed.status,
    };
    setTimeline((prev) => [newTimelineEvent, ...prev]);

    showToast(`✓ Medication "${newMed.name}" recorded to ${patient.synthetic_label}'s regimen.`);
  };

  // Add Allergy
  const handleAddAllergySubmit = async (allergyData: Omit<Allergy, 'id'>) => {
    const newAllergy = await allergyService.addAllergy(patient.id, allergyData);
    setAllergies((prev) => [newAllergy, ...prev]);

    // Append to timeline
    const newTimelineEvent: TimelineEvent = {
      id: `tl_${Date.now()}`,
      date: newAllergy.reported_date || new Date().toISOString().split('T')[0],
      formatted_date: 'Today',
      title: `Allergy Recorded: ${newAllergy.allergen}`,
      description: `Risk Level: ${newAllergy.severity}. Reaction: ${newAllergy.reaction || 'Adverse response'}.`,
      category: 'allergy',
      status: 'CURRENT',
    };
    setTimeline((prev) => [newTimelineEvent, ...prev]);

    showToast(`✓ Allergy "${newAllergy.allergen}" recorded to patient safety profile.`);
  };

  // Add Memory / Clinical Note
  const handleAddMemorySubmit = async (memoryData: {
    text: string;
    category: MemoryItem['category'];
    status: MemoryItem['temporal_status'];
  }) => {
    const newMemory = await memoryService.retainMemory(patient.id, {
      text: memoryData.text,
      category: memoryData.category,
      source: 'DOCTOR_RECOMMENDATION',
    });
    newMemory.temporal_status = memoryData.status;
    setMemories((prev) => [newMemory, ...prev]);

    // Append to timeline
    const newTimelineEvent: TimelineEvent = {
      id: `tl_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      formatted_date: 'Today',
      title: `Clinical Memory Indexed`,
      description: newMemory.text,
      category: newMemory.category,
      status: newMemory.temporal_status,
    };
    setTimeline((prev) => [newTimelineEvent, ...prev]);

    showToast(`✓ Clinical observation saved and indexed into longitudinal memory.`);
  };

  // Resolve Conflict
  const handleResolveConflict = (conflictId: string, note?: string) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId
          ? {
              ...c,
              status: 'clinician_verified' as const,
              action_required: note || 'Attending clinician verified and reconciled.',
            }
          : c
      )
    );
    showToast('Clinical discrepancy verified and reconciled in audit trail.');
  };

  const handleSelectSearchResult = (section: string) => {
    setCurrentSection(section);
  };

  const currentMeds = medications.filter((m) => m.status === 'CURRENT');
  const stoppedMeds = medications.filter(
    (m) => m.status === 'STOPPED' || m.status === 'HISTORICAL'
  );
  const unresolvedConflicts = conflicts.filter((c) => c.status === 'unresolved');

  return (
    <AppShell
      patient={patient}
      patients={patients}
      onSelectPatient={handleSelectPatient}
      onOpenAddPatient={() => setIsAddPatientModalOpen(true)}
      health={health}
      healthLoading={healthLoading}
      healthError={healthError}
      currentSection={currentSection}
      onSelectSection={setCurrentSection}
      conflictCount={unresolvedConflicts.length}
      medicationCount={medications.length}
      onOpenSearch={() => setIsSearchModalOpen(true)}
    >
      <div className="space-y-6">
        {/* Floating Toast Notification */}
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

        {/* Dynamic Section Routing */}
        {currentSection === 'dashboard' && (
          <>
            {/* 1. Patient Summary Card with Quick Action Buttons */}
            <PatientSummaryCard
              patient={patient}
              onLoadDemoPatient={handleLoadDemoPatient}
              onAddPatient={() => setIsAddPatientModalOpen(true)}
              onOpenAddMedication={() => setIsAddMedicationModalOpen(true)}
              onOpenAddAllergy={() => setIsAddAllergyModalOpen(true)}
              onOpenAddMemory={() => setIsAddMemoryModalOpen(true)}
            />

            {/* Quick Action Navigation Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-teal-200" />
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

              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm">Run 5-Step Clinical Walkthrough</h3>
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
              allergyCount={allergies.length}
              symptomCount={symptoms.length}
              conflictCount={unresolvedConflicts.length}
              memoryCount={memories.length}
              onNavigate={setCurrentSection}
            />

            {/* 3. Clinical Reconciliation Notice (Replaces Alarming Conflict Card) */}
            {unresolvedConflicts.length > 0 && (
              <ActiveConflictCard
                conflict={unresolvedConflicts[0]}
                onNavigateToConflicts={() => setCurrentSection('conflicts')}
                onResolve={(id) => handleResolveConflict(id)}
              />
            )}

            {/* 4. Two-Column Clinical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Medications & Allergies */}
              <div className="space-y-6">
                <MedicationSummarySection
                  medications={medications}
                  onNavigateToMedications={() => setCurrentSection('medications')}
                  onOpenAddMedication={() => setIsAddMedicationModalOpen(true)}
                />
                <AllergySummarySection
                  allergies={allergies}
                  onNavigateToAllergies={() => setCurrentSection('allergies')}
                  onOpenAddAllergy={() => setIsAddAllergyModalOpen(true)}
                />
              </div>

              {/* Right Column: Timeline & Long-Term Memories */}
              <div className="space-y-6">
                <RecentTimelineSection
                  events={timeline}
                  onNavigateToTimeline={() => setCurrentSection('timeline')}
                />
                <MemoryPreviewSection
                  memories={memories}
                  onNavigateToMemories={() => setCurrentSection('patient-profile')}
                  onOpenAddMemory={() => setIsAddMemoryModalOpen(true)}
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
                await handleAddMemorySubmit({
                  text,
                  category: cat as MemoryItem['category'],
                  status: 'CURRENT',
                });
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
        {(currentSection === 'patient-profile' ||
          currentSection === 'medical-history' ||
          currentSection === 'memories' ||
          currentSection === 'symptoms') && (
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddMedicationModalOpen(true)}
                  className="text-xs"
                >
                  + Add Medication
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddAllergyModalOpen(true)}
                  className="text-xs"
                >
                  + Add Allergy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddMemoryModalOpen(true)}
                  className="text-xs"
                >
                  + Record Memory
                </Button>
              </div>
            </div>
            <PatientProfileView
              patient={patient}
              medications={medications}
              allergies={allergies}
              symptoms={symptoms}
              conflicts={conflicts}
              memories={memories}
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
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddMedicationModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Record Medication
              </Button>
            </div>
            <MedicationsView
              medications={medications}
              onReviewEvidence={handleReviewEvidence}
              onOpenAddMedication={() => setIsAddMedicationModalOpen(true)}
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
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddAllergyModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Record Allergy
              </Button>
            </div>
            <AllergiesView
              allergies={allergies}
              conflicts={conflicts}
              onReviewEvidence={handleReviewEvidence}
              onNavigateToConflictCenter={() => setCurrentSection('conflicts')}
              onOpenAddAllergy={() => setIsAddAllergyModalOpen(true)}
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
              events={timeline}
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

      {/* Patient Registration Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onAddPatient={handleAddPatientSubmit}
      />

      {/* Record Medication Modal */}
      <AddMedicationModal
        isOpen={isAddMedicationModalOpen}
        onClose={() => setIsAddMedicationModalOpen(false)}
        onAddMedication={handleAddMedicationSubmit}
        patientName={patient.synthetic_label}
      />

      {/* Record Allergy Modal */}
      <AddAllergyModal
        isOpen={isAddAllergyModalOpen}
        onClose={() => setIsAddAllergyModalOpen(false)}
        onAddAllergy={handleAddAllergySubmit}
        patientName={patient.synthetic_label}
      />

      {/* Record Clinical Memory Modal */}
      <AddMemoryModal
        isOpen={isAddMemoryModalOpen}
        onClose={() => setIsAddMemoryModalOpen(false)}
        onAddMemory={handleAddMemorySubmit}
        patientName={patient.synthetic_label}
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
