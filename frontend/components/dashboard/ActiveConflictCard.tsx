'use client';

import React from 'react';
import { AlertTriangle, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { ConflictRecord } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActiveConflictCardProps {
  conflict: ConflictRecord;
  onNavigateToConflicts: () => void;
}

export function ActiveConflictCard({
  conflict,
  onNavigateToConflicts,
}: ActiveConflictCardProps) {
  return (
    <Card className="border-rose-300 bg-rose-50/20 shadow-xs">
      <CardHeader className="bg-rose-50/50 border-b border-rose-100/80 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-rose-900 text-sm sm:text-base">
                  Potential Clinical Conflict Detected
                </CardTitle>
                <Badge variant="danger" size="sm" className="font-semibold uppercase tracking-wider text-[10px]">
                  Requires Clinical Verification
                </Badge>
              </div>
              <p className="text-xs text-rose-700/90 mt-0.5">
                The agent identified contradictory statements across patient interactions. Conflicting records are never merged automatically.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToConflicts}
            className="hidden sm:inline-flex text-rose-800 border-rose-300 hover:bg-rose-100/50"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Review Conflict
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Contradictory Records Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Record 1 */}
          <div className="bg-white rounded-lg p-4 border border-rose-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                Record A (Earlier Intake)
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
              <span>Source:</span>
              <strong className="text-slate-700 font-medium">{conflict.record_a_source}</strong>
            </div>
          </div>

          {/* Record 2 */}
          <div className="bg-white rounded-lg p-4 border border-rose-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                Record B (Recent Statement)
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
              <span>Source:</span>
              <strong className="text-slate-700 font-medium">{conflict.record_b_source}</strong>
            </div>
          </div>
        </div>

        {/* Action Required Banner */}
        <div className="rounded-lg bg-rose-100/70 border border-rose-200 px-4 py-2.5 flex items-start gap-2.5 text-xs text-rose-900">
          <UserCheck className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <strong>Clinical Safety Action:</strong> {conflict.action_required}
            <span className="block text-[11px] text-rose-700/80 mt-0.5">
              Rule: The AI will not autonomously discard either record until verified by a licensed clinician.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
