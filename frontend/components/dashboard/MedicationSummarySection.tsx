'use client';

import React from 'react';
import { Pill, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Medication } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MedicationSummarySectionProps {
  medications: Medication[];
  onNavigateToMedications: () => void;
}

export function MedicationSummarySection({
  medications,
  onNavigateToMedications,
}: MedicationSummarySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Medication Regimen & Evolution</CardTitle>
              <p className="text-xs text-slate-500">
                Time-aware tracking of active medications and discontinued historical treatments.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToMedications}
            className="text-xs text-teal-700 hover:text-teal-800"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3">
        {medications.map((med) => {
          const isCurrent = med.status === 'CURRENT';
          return (
            <div
              key={med.name}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-emerald-50/20 border-emerald-200/90 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200/80 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {med.name}
                  </span>
                  <StatusBadge status={med.status} />
                </div>
                <SourceBadge source={med.source} />
              </div>

              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600">
                {med.indication && (
                  <div>
                    <span className="text-slate-400">Indication: </span>
                    <strong className="text-slate-700 font-medium">{med.indication}</strong>
                  </div>
                )}

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Started: {med.start_date}</span>
                  {med.end_date && <span className="text-rose-600">→ Stopped: {med.end_date}</span>}
                </div>

                {med.evidence && (
                  <div className="sm:col-span-2 lg:col-span-1 flex items-start gap-1.5 text-[11px] text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="truncate" title={med.evidence}>
                      {med.evidence}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
