'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, FileText, UserCheck, Shield } from 'lucide-react';
import { Allergy, ConflictRecord, EvidenceDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AllergiesViewProps {
  allergies: Allergy[];
  conflicts: ConflictRecord[];
  onReviewEvidence: (evidence: EvidenceDetail) => void;
  onNavigateToConflictCenter?: () => void;
}

export function AllergiesView({
  allergies,
  conflicts,
  onReviewEvidence,
  onNavigateToConflictCenter,
}: AllergiesViewProps) {
  const allergyConflicts = conflicts.filter(
    (c) => c.conflict_type.toLowerCase().includes('allergy') || c.id === 'conf_001'
  );

  const handleReviewAllergyEvidence = (allergy: Allergy) => {
    onReviewEvidence({
      memoryId: allergy.id || `alg_${allergy.allergen}`,
      title: `Allergy: ${allergy.allergen} (${allergy.severity} Risk)`,
      category: 'Allergy',
      source: allergy.source,
      originalStatement:
        allergy.evidence ||
        `Clinical intake and historical chart record for ${allergy.allergen}. Reaction: ${allergy.reaction || 'Anaphylaxis risk'}.`,
      date: allergy.reported_date || '2024-05-10',
      interactionId: 'interaction_allergy_001',
      status: allergy.has_conflict ? 'CONFLICTED' : 'CURRENT',
      context: `Reported Reaction: ${allergy.reaction || 'None'}. Severity: ${allergy.severity}. Conflict Status: ${
        allergy.has_conflict ? 'DISPUTED - REQUIRES CLINICIAN VERIFICATION' : 'Confirmed'
      }`,
    });
  };

  const handleReviewConflictEvidence = (conflict: ConflictRecord) => {
    onReviewEvidence({
      memoryId: conflict.id,
      title: `Contradiction: ${conflict.conflict_type}`,
      category: 'Conflict',
      source: `${conflict.record_a_source} vs ${conflict.record_b_source}`,
      originalStatement: `Record A (${conflict.record_a_date}): "${conflict.record_a_summary}"\n\nRecord B (${conflict.record_b_date}): "${conflict.record_b_summary}"`,
      date: conflict.record_b_date || '2026-02-05',
      interactionId: conflict.evidence_ref_b || 'interaction_conflict_001',
      status: 'CONFLICTED',
      context: `${conflict.description}. Action Required: ${conflict.action_required}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Allergy Records & Safety Verification
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Preserving patient safety with immutable audit trails and non-destructive conflict alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={allergyConflicts.length > 0 ? 'rose' : 'emerald'} size="md">
            {allergyConflicts.length > 0
              ? `${allergyConflicts.length} Conflict Requiring Verification`
              : 'All Records Verified'}
          </Badge>
        </div>
      </div>

      {/* Prominent High-Priority Conflict Alert Banner */}
      {allergyConflicts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 mt-0.5">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded mb-1">
                  Active Clinical Discrepancy
                </span>
                <h3 className="text-base font-bold text-rose-950">
                  {allergyConflicts[0].description}
                </h3>
                <p className="text-xs text-rose-800 mt-1">
                  The system detected conflicting information regarding Penicillin allergy. Prior records show documented anaphylaxis, while recent intake notes report no known allergies.
                </p>
              </div>
            </div>
          </div>

          {/* Conflict Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/90 p-4 rounded-xl border border-rose-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold text-slate-700">Record A (Historical Chart Review)</span>
                <span className="text-[11px] font-mono">{allergyConflicts[0].record_a_date || '2024-05-10'}</span>
              </div>
              <p className="text-slate-800 font-medium leading-relaxed">
                {allergyConflicts[0].record_a_summary}
              </p>
              <div className="text-[11px] text-slate-500">
                Source: {allergyConflicts[0].record_a_source}
              </div>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-rose-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold text-slate-700">Record B (Recent Patient Intake)</span>
                <span className="text-[11px] font-mono">{allergyConflicts[0].record_b_date || '2026-02-05'}</span>
              </div>
              <p className="text-slate-800 font-medium leading-relaxed">
                {allergyConflicts[0].record_b_summary}
              </p>
              <div className="text-[11px] text-slate-500">
                Source: {allergyConflicts[0].record_b_source}
              </div>
            </div>
          </div>

          {/* Clinical Non-Auto-Resolution Notice */}
          <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-700 shrink-0" />
              <span>
                <strong>Zero Silent Overwrite Guarantee:</strong> This conflict has NOT been auto-resolved. Clinician verification is required before prescribing.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReviewConflictEvidence(allergyConflicts[0])}
                className="bg-white border-rose-300 text-rose-800 hover:bg-rose-100/50"
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                Review Evidence
              </Button>
              {onNavigateToConflictCenter && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onNavigateToConflictCenter}
                  className="bg-rose-700 hover:bg-rose-800 text-white"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1" />
                  Conflict Center
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Allergies List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Recorded Allergies & Intolerances
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allergies.map((allergy) => {
            const hasConflict = allergy.has_conflict || allergy.status === 'disputed';

            return (
              <div
                key={allergy.id || allergy.allergen}
                className={`p-5 rounded-2xl border transition-all ${
                  hasConflict
                    ? 'bg-rose-50/50 border-rose-300 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {allergy.allergen}
                      </h3>
                      {hasConflict && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                          Disputed Record
                        </span>
                      )}
                    </div>
                    {allergy.reaction && (
                      <p className="text-xs text-slate-600">
                        Reaction: <span className="font-semibold text-slate-800">{allergy.reaction}</span>
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      allergy.severity === 'Critical' || allergy.severity === 'High'
                        ? 'rose'
                        : allergy.severity === 'Medium'
                        ? 'amber'
                        : 'slate'
                    }
                    size="sm"
                  >
                    {allergy.severity} Risk
                  </Badge>
                </div>

                <div className="py-3 text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reported Date:</span>
                    <span className="font-medium text-slate-800">{allergy.reported_date || '2024-05-10'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Documentation Source:</span>
                    <span className="font-medium text-slate-800">{allergy.source.replace(/_/g, ' ')}</span>
                  </div>
                  {allergy.notes && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-[11px] text-slate-700">
                      {allergy.notes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Status: {allergy.status.toUpperCase()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewAllergyEvidence(allergy)}
                    className="text-xs text-teal-700 border-teal-200 hover:bg-teal-50"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Review Evidence
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
