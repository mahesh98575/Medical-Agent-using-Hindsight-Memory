'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, FileText, Calendar, ArrowRight } from 'lucide-react';
import { Allergy } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AllergySummarySectionProps {
  allergies: Allergy[];
  onNavigateToAllergies: () => void;
}

export function AllergySummarySection({
  allergies,
  onNavigateToAllergies,
}: AllergySummarySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Documented Allergies</CardTitle>
              <p className="text-xs text-slate-500">
                High-priority patient safety records and contraindication warnings.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToAllergies}
            className="text-xs text-teal-700 hover:text-teal-800"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Details
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3">
        {allergies.map((allergy) => (
          <div
            key={allergy.allergen}
            className={`p-4 rounded-xl border ${
              allergy.has_conflict
                ? 'bg-rose-50/20 border-rose-300'
                : 'bg-amber-50/20 border-amber-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {allergy.allergen}
                </span>
                <Badge variant="danger" size="sm" className="font-bold uppercase tracking-wider">
                  HIGH PRIORITY
                </Badge>
                {allergy.has_conflict && (
                  <Badge variant="warning" size="sm" className="gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Conflict Flagged
                  </Badge>
                )}
              </div>
              <SourceBadge source={allergy.source} />
            </div>

            <div className="mt-2.5 space-y-2 text-xs text-slate-600">
              {allergy.reaction && (
                <div>
                  <span className="text-slate-400">Adverse Reaction: </span>
                  <strong className="text-slate-800 font-medium">{allergy.reaction}</strong>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                {allergy.reported_date && (
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reported: {allergy.reported_date}</span>
                  </div>
                )}
                {allergy.evidence && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span className="truncate max-w-md">{allergy.evidence}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
