'use client';

import React, { useState } from 'react';
import {
  User,
  HeartPulse,
  Pill,
  ShieldAlert,
  Activity,
  BrainCircuit,
  AlertTriangle,
  FileText,
  Clock,
} from 'lucide-react';
import {
  Patient,
  Medication,
  Allergy,
  Symptom,
  ConflictRecord,
  MemoryItem,
  EvidenceDetail,
} from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type ProfileTab = 'overview' | 'medications' | 'allergies' | 'symptoms' | 'memories' | 'conflicts';

interface PatientProfileViewProps {
  patient: Patient;
  medications: Medication[];
  allergies: Allergy[];
  symptoms: Symptom[];
  conflicts: ConflictRecord[];
  memories: MemoryItem[];
  onReviewEvidence: (evidence: EvidenceDetail) => void;
}

export function PatientProfileView({
  patient,
  medications,
  allergies,
  symptoms,
  conflicts,
  memories,
  onReviewEvidence,
}: PatientProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const currentMeds = medications.filter((m) => m.status === 'CURRENT');
  const stoppedMeds = medications.filter((m) => m.status === 'STOPPED' || m.status === 'HISTORICAL');

  return (
    <div className="space-y-6">
      {/* Patient Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {patient.synthetic_label.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {patient.synthetic_label}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                SYNTHETIC PATIENT DATA
              </span>
              <span className="font-mono text-xs text-slate-400">ID: {patient.id}</span>
            </div>
            <p className="text-xs text-slate-500">
              {patient.age} years old • {patient.gender || 'Female'} • Blood Type: {patient.blood_type || 'O+'}
            </p>
            <p className="text-xs font-medium text-slate-700">
              Primary Diagnosis: <span className="text-teal-700">{patient.primary_condition || 'Essential Hypertension'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[90px]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Meds</div>
            <div className="text-base font-bold text-emerald-700">{currentMeds.length}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[90px]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Stopped Meds</div>
            <div className="text-base font-bold text-slate-600">{stoppedMeds.length}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[90px]">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Discrepancies</div>
            <div className="text-base font-bold text-rose-600">{conflicts.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {([
          { id: 'overview' as const, label: 'Clinical Overview', icon: User },
          { id: 'medications' as const, label: `Medications (${medications.length})`, icon: Pill },
          { id: 'allergies' as const, label: `Allergies (${allergies.length})`, icon: ShieldAlert },
          { id: 'symptoms' as const, label: `Symptoms (${symptoms.length})`, icon: Activity },
          { id: 'memories' as const, label: `Memory Vault (${memories.length})`, icon: BrainCircuit },
          { id: 'conflicts' as const, label: `Discrepancies (${conflicts.length})`, icon: AlertTriangle },
        ] as const).map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clinical Profile Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <span>Diagnostic Background</span>
            </h2>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Patient P001 is a 45-year-old female with established <strong>Essential Hypertension</strong>. Initially treated with <strong>Medicine A</strong>, but discontinued due to reported tachycardia and palpitations. Successfully transitioned to <strong>Medicine B</strong> with normalized blood pressure.
              </p>
              <p>
                A high-priority documentation discrepancy exists between a historical 2024 chart review (noting a <strong>Penicillin</strong> anaphylaxis reaction) and a 2026 intake report (patient denying drug allergies). Prescribing caution is flagged.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-700">Audit Status</div>
              <div className="text-slate-500 text-[11px]">
                Dual-layer persistent memory backed by Hindsight episodic store and relational clinical models.
              </div>
            </div>
          </div>

          {/* Quick Status Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Temporal Status Matrix</span>
            </h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="font-medium text-emerald-900">Medicine B (Active Therapy)</span>
                <StatusBadge status="CURRENT" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                <span className="font-medium text-slate-800">Medicine A (Palpitations)</span>
                <StatusBadge status="STOPPED" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="font-medium text-rose-900">Penicillin Allergy (Intake Dispute)</span>
                <StatusBadge status="CONFLICTED" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((m) => (
              <div
                key={m.name}
                className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-slate-600">{m.notes}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Source: {m.source}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onReviewEvidence({
                        memoryId: m.id || m.name,
                        title: m.name,
                        category: 'Medication',
                        source: m.source,
                        originalStatement: m.evidence || m.notes || '',
                        date: m.last_updated || '2026-02-05',
                        interactionId: 'interaction_med_001',
                        status: m.status,
                      })
                    }
                    className="text-xs text-teal-700"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Review Citation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'allergies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allergies.map((a) => (
            <div
              key={a.allergen}
              className={`p-5 rounded-2xl border text-xs space-y-3 ${
                a.has_conflict ? 'bg-rose-50/50 border-rose-300' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{a.allergen}</h3>
                <Badge variant={a.has_conflict ? 'rose' : 'teal'} size="sm">
                  {a.has_conflict ? 'CONFLICT DETECTED' : 'CONFIRMED'}
                </Badge>
              </div>
              <p className="text-slate-700">Reaction: {a.reaction || 'None'}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Severity: {a.severity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onReviewEvidence({
                      memoryId: a.id || a.allergen,
                      title: `Allergy: ${a.allergen}`,
                      category: 'Allergy',
                      source: a.source,
                      originalStatement: a.evidence || a.notes || '',
                      date: a.reported_date || '2024-05-10',
                      interactionId: 'interaction_allergy_001',
                      status: a.has_conflict ? 'CONFLICTED' : 'CURRENT',
                    })
                  }
                  className="text-xs text-teal-700"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Review Citation
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {symptoms.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{s.description}</h3>
                <Badge variant={s.status === 'resolved' ? 'slate' : 'rose'} size="sm">
                  {s.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-slate-600">{s.notes}</p>
              <div className="text-[11px] text-slate-400 pt-1">
                Reported: {s.reported_date || '2026-02-04'}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'memories' && (
        <div className="space-y-3">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 hover:border-teal-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <StatusBadge status={mem.temporal_status} />
                <Badge variant="teal" size="sm">{mem.category}</Badge>
              </div>
              <p className="text-slate-800 font-medium">{mem.text}</p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>Source: {mem.source}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onReviewEvidence({
                      memoryId: mem.id,
                      title: mem.text,
                      category: mem.category,
                      source: mem.source,
                      originalStatement: mem.original_statement || mem.text,
                      date: mem.mentioned_at || '2026-02-05',
                      interactionId: mem.document_id || 'hindsight_001',
                      status: mem.temporal_status,
                    })
                  }
                  className="text-teal-700 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Review Citation
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'conflicts' && (
        <div className="space-y-4">
          {conflicts.map((conf) => (
            <div key={conf.id} className="bg-rose-50/50 p-5 rounded-2xl border border-rose-300 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-rose-950">{conf.conflict_type}</h3>
                <Badge variant="rose" size="sm">UNRESOLVED</Badge>
              </div>
              <p className="text-rose-900">{conf.description}</p>
              <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-rose-200">
                <div>
                  <strong className="block text-[11px] text-slate-500">Record A</strong>
                  <p className="text-slate-800">{conf.record_a_summary}</p>
                </div>
                <div>
                  <strong className="block text-[11px] text-slate-500">Record B</strong>
                  <p className="text-slate-800">{conf.record_b_summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
