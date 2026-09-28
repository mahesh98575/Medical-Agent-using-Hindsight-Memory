'use client';

import React from 'react';
import { GitCompare, Clock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ConflictRecord } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActiveConflictCardProps {
  conflict: ConflictRecord;
  onNavigateToConflicts: () => void;
  onResolve?: (conflictId: string) => void;
}

export function ActiveConflictCard({
  conflict,
  onNavigateToConflicts,
  onResolve,
}: ActiveConflictCardProps) {
  return (
    <Card className="border-indigo-200/80 bg-gradient-to-r from-indigo-50/30 via-white to-slate-50/50 shadow-xs">
      <CardHeader className="bg-indigo-50/40 border-b border-indigo-100/60 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-slate-900 text-sm sm:text-base">
                  Clinical Statement Reconciliation
                </CardTitle>
                <Badge variant="amber" size="sm" className="font-semibold uppercase tracking-wider text-[10px]">
                  Requires Verification
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Two differing statements noted in clinical history. Both records preserved under non-destructive safety architecture.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onResolve && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve(conflict.id)}
                className="text-xs text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Verify & Reconcile
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToConflicts}
              className="text-xs text-indigo-900 border-indigo-200 hover:bg-indigo-50"
              icon={<ArrowRight className="w-3.5 h-3.5 text-indigo-600" />}
            >
              Audit Details
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Contradictory Records Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Record 1 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Documented Chart Record
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {conflict.record_a_date || 'Mar 12, 2026'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 leading-snug">
              {conflict.record_a_summary}
            </p>
            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>Origin:</span>
              <strong className="text-slate-700 font-medium">{conflict.record_a_source}</strong>
            </div>
          </div>

          {/* Record 2 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Subsequent Intake Statement
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {conflict.record_b_date || 'Sep 20, 2026'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 leading-snug">
              {conflict.record_b_summary}
            </p>
            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>Origin:</span>
              <strong className="text-slate-700 font-medium">{conflict.record_b_source}</strong>
            </div>
          </div>
        </div>

        {/* Action Required Banner */}
        <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <strong>Clinical Safety Protocol:</strong> {conflict.action_required}
            <span className="block text-[11px] text-amber-800/90 mt-0.5">
              Rule: System does not auto-delete conflicting facts without licensed physician confirmation.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
