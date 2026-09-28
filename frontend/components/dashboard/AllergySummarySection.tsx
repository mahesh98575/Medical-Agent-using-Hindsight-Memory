'use client';

import React from 'react';
import { Shield, FileText, Calendar, ArrowRight, Plus } from 'lucide-react';
import { Allergy } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AllergySummarySectionProps {
  allergies: Allergy[];
  onNavigateToAllergies: () => void;
  onOpenAddAllergy?: () => void;
}

export function AllergySummarySection({
  allergies,
  onNavigateToAllergies,
  onOpenAddAllergy,
}: AllergySummarySectionProps) {
  return (
    <Card className="border-slate-200/90 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Documented Allergies</CardTitle>
              <p className="text-xs text-slate-500">
                Patient safety contraindications and adverse reactions profile
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenAddAllergy && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddAllergy}
                className="text-xs text-amber-800 border-amber-200 hover:bg-amber-50"
                icon={<Plus className="w-3.5 h-3.5 text-amber-600" />}
              >
                + Add Allergy
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToAllergies}
              className="text-xs text-teal-700 hover:text-teal-900"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3">
        {allergies.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No known drug allergies recorded for this patient.
          </div>
        ) : (
          allergies.map((allergy) => (
            <div
              key={allergy.id || allergy.allergen}
              className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {allergy.allergen}
                  </span>
                  <Badge variant="amber" size="sm" className="font-semibold text-[10px]">
                    {allergy.severity} Risk
                  </Badge>
                  {allergy.has_conflict && (
                    <Badge variant="neutral" size="sm" className="font-medium text-[10px]">
                      Reconciliation Pending
                    </Badge>
                  )}
                </div>
                <SourceBadge source={allergy.source} />
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                {allergy.reaction && (
                  <div>
                    <span className="text-slate-400">Adverse Reaction: </span>
                    <strong className="text-slate-800 font-medium">{allergy.reaction}</strong>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                  {allergy.reported_date && (
                    <div className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Documented: {allergy.reported_date}</span>
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
          ))
        )}
      </CardContent>
    </Card>
  );
}
