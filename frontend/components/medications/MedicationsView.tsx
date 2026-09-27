'use client';

import React, { useState } from 'react';
import { Pill, CheckCircle2, History, FileText, Plus, ShieldCheck } from 'lucide-react';
import { Medication, EvidenceDetail } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MedicationsViewProps {
  medications: Medication[];
  onReviewEvidence: (evidence: EvidenceDetail) => void;
  onOpenAddMedication?: () => void;
}

export function MedicationsView({
  medications,
  onReviewEvidence,
  onOpenAddMedication,
}: MedicationsViewProps) {
  const [filter, setFilter] = useState<'all' | 'CURRENT' | 'STOPPED'>('all');

  const filteredMeds = medications.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const currentCount = medications.filter((m) => m.status === 'CURRENT').length;
  const stoppedCount = medications.filter((m) => m.status === 'STOPPED' || m.status === 'HISTORICAL').length;

  const handleEvidenceClick = (med: Medication) => {
    onReviewEvidence({
      memoryId: med.id || `med_${med.name}`,
      title: `${med.name} (${med.status})`,
      category: 'Medication',
      source: med.source,
      originalStatement:
        med.evidence ||
        `Clinical order and dosage record for ${med.name}. Status: ${med.status}.`,
      date: med.last_updated || med.start_date || '2026-02-05',
      interactionId: 'interaction_med_chart_002',
      status: med.status,
      context: `Indication: ${med.indication || 'Not specified'}. Reason: ${
        med.notes || 'Active therapeutic regimen.'
      }`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Medication Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Temporal tracking distinguishes active treatments from discontinued historical therapies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAddMedication && (
            <Button variant="primary" size="sm" onClick={onOpenAddMedication} className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Record Medication</span>
            </Button>
          )}
        </div>
      </div>

      {/* Safety Notice regarding Temporal Persistence */}
      <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 space-y-1">
          <p className="font-semibold">
            Temporal Memory Guarantee
          </p>
          <p className="text-teal-800 leading-relaxed">
            Healthcare Memory Assistant maintains immutable records of stopped medications. Discontinued therapies are never deleted; they are preserved for adverse event tracking, drug interaction analysis, and longitudinal clinical audit.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Medications ({medications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('CURRENT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filter === 'CURRENT'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Current Active ({currentCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('STOPPED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filter === 'STOPPED'
              ? 'bg-slate-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Stopped / Historical ({stoppedCount})
        </button>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => {
          const isCurrent = med.status === 'CURRENT';

          return (
            <div
              key={med.id || med.name}
              className={`rounded-2xl p-5 border transition-all ${
                isCurrent
                  ? 'bg-white border-emerald-200/80 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {med.name}
                    </h3>
                    <StatusBadge status={med.status} />
                  </div>
                  {med.indication && (
                    <p className="text-xs text-slate-500">
                      Indication: <span className="font-medium text-slate-700">{med.indication}</span>
                    </p>
                  )}
                </div>
                <Badge variant={isCurrent ? 'teal' : 'slate'} size="sm">
                  {med.source.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Medication Details */}
              <div className="py-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Start Date:</span>
                    <span className="font-medium text-slate-800">{med.start_date || 'Undocumented'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {isCurrent ? 'Status Date:' : 'Discontinued Date:'}
                    </span>
                    <span className={`font-medium ${isCurrent ? 'text-emerald-700' : 'text-rose-700 font-semibold'}`}>
                      {med.end_date || (isCurrent ? 'Ongoing' : 'Recorded')}
                    </span>
                  </div>
                </div>

                {med.notes && (
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                    isCurrent ? 'bg-emerald-50/50 text-emerald-950 border border-emerald-100' : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    <strong className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">
                      Clinical Notes / Adverse Event Tracking:
                    </strong>
                    {med.notes}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Last verified: {med.last_updated || '2026-02-05'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEvidenceClick(med)}
                  className="flex items-center gap-1.5 text-xs text-teal-700 border-teal-200 hover:bg-teal-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Review Evidence</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
