'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, FileText, UserCheck, ShieldCheck, GitCompare } from 'lucide-react';
import { ConflictRecord, EvidenceDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ConflictCenterViewProps {
  conflicts: ConflictRecord[];
  onReviewEvidence: (evidence: EvidenceDetail) => void;
  onResolveConflict?: (conflictId: string, resolutionNote: string) => void;
}

export function ConflictCenterView({
  conflicts,
  onReviewEvidence,
  onResolveConflict,
}: ConflictCenterViewProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [resolvedConflicts, setResolvedConflicts] = useState<ConflictRecord[]>([]);

  const unresolved = conflicts.filter((c) => c.status === 'unresolved' && !resolvedConflicts.some((r) => r.id === c.id));
  const resolved = Array.from(
    new Map(
      [...conflicts.filter((c) => c.status === 'clinician_verified'), ...resolvedConflicts].map((item) => [item.id, item])
    ).values()
  );

  const handleReviewEvidence = (conflict: ConflictRecord) => {
    onReviewEvidence({
      memoryId: conflict.id,
      title: `Discrepancy: ${conflict.conflict_type}`,
      category: 'Conflict Audit',
      source: `${conflict.record_a_source} vs ${conflict.record_b_source}`,
      originalStatement: `RECORD A [${conflict.record_a_date || 'Chart'}]: "${conflict.record_a_summary}"\n\nRECORD B [${conflict.record_b_date || 'Intake'}]: "${conflict.record_b_summary}"`,
      date: conflict.record_b_date || '2026-02-05',
      interactionId: conflict.evidence_ref_b || 'conflict_audit_001',
      status: 'CONFLICTED',
      context: `Action Mandate: ${conflict.action_required}. Non-destructive retention guarantees both records remain visible until clinician confirmation.`,
    });
  };

  const handleConfirmResolution = (conflict: ConflictRecord) => {
    const updated: ConflictRecord = {
      ...conflict,
      status: 'clinician_verified',
      action_required: resolutionNote || 'Verified by attending clinician: Penicillin allergy upheld as precautionary measure.',
    };
    setResolvedConflicts((prev) => [...prev, updated]);
    if (onResolveConflict) {
      onResolveConflict(conflict.id, resolutionNote);
    }
    setResolvingId(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <GitCompare className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Clinical Conflict Verification Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero-silent-overwrite safety architecture. Contradictory health records require human clinician confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={unresolved.length > 0 ? 'amber' : 'emerald'} size="md">
            {unresolved.length} Active Discrepancies
          </Badge>
        </div>
      </div>

      {/* Safety Policy Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">
            Safety Boundary & Non-Destructive Memory Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In clinical medicine, conflicting statements (e.g., historical anaphylaxis documentation vs. a hurried patient saying &ldquo;no known allergies&rdquo; at intake) can lead to severe adverse reactions if an AI assistant automatically picks the most recent entry.
        </p>
        <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Never auto-resolves contradictions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Dual-provenance evidence tracking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Mandatory clinician sign-off</span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-indigo-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Active Conflicts ({unresolved.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resolved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'resolved'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Clinician Verified ({resolved.length})
        </button>
      </div>

      {/* Conflicts List */}
      {activeTab === 'active' ? (
        unresolved.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No Active Unresolved Conflicts
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All clinical records for this patient have been verified or reconciled by attending healthcare staff.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {unresolved.map((conflict) => (
              <div
                key={conflict.id}
                className="bg-white rounded-2xl border-2 border-rose-300 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-rose-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                        HIGH SEVERITY
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {conflict.conflict_type}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      {conflict.description}
                    </p>
                  </div>
                  <Badge variant="rose" size="sm">
                    ACTION REQUIRED
                  </Badge>
                </div>

                {/* Side-by-side records comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Record A */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-700">Record A (Historical Record)</span>
                      <span className="font-mono text-[11px]">{conflict.record_a_date || '2024-05-10'}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-150 text-slate-800 font-medium">
                      &ldquo;{conflict.record_a_summary}&rdquo;
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Source: <span className="text-slate-700 font-semibold">{conflict.record_a_source}</span>
                    </div>
                  </div>

                  {/* Record B */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-700">Record B (Recent Statement)</span>
                      <span className="font-mono text-[11px]">{conflict.record_b_date || '2026-02-05'}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-150 text-slate-800 font-medium">
                      &ldquo;{conflict.record_b_summary}&rdquo;
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Source: <span className="text-slate-700 font-semibold">{conflict.record_b_source}</span>
                    </div>
                  </div>
                </div>

                {/* Clinician Action Box */}
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-900">
                      Recommended Action: {conflict.action_required}
                    </span>
                  </div>

                  {resolvingId === conflict.id ? (
                    <div className="space-y-3 pt-2 border-t border-rose-200">
                      <label className="block text-xs font-semibold text-slate-700">
                        Clinician Confirmation Note:
                      </label>
                      <textarea
                        rows={2}
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="e.g. Attending reviewed prior reaction notes. Penicillin allergy confirmed and retained on active safety chart."
                        className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setResolvingId(null)}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleConfirmResolution(conflict)}>
                          Submit Verification Sign-off
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rose-200">
                      <span className="text-[11px] text-rose-800 italic">
                        Prescribing safety blocked until clinician confirmation
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewEvidence(conflict)}
                          className="text-xs text-teal-700 border-teal-200 hover:bg-teal-50"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Review Evidence
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setResolvingId(conflict.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1" />
                          Verify & Clarify
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Resolved / Verified tab */
        <div className="space-y-3">
          {resolved.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-emerald-200 p-5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">{res.conflict_type}</span>
                </div>
                <Badge variant="emerald" size="sm">
                  CLINICIAN VERIFIED
                </Badge>
              </div>
              <p className="text-slate-700">
                <strong>Resolution Note:</strong> {res.action_required}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
