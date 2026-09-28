'use client';

import React from 'react';
import { Pill, Sparkles, UserPlus, ShieldCheck, Plus, Stethoscope } from 'lucide-react';
import { Patient } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PatientSummaryCardProps {
  patient: Patient;
  onLoadDemoPatient: () => void;
  onAddPatient: () => void;
  onOpenAddMedication?: () => void;
  onOpenAddAllergy?: () => void;
  onOpenAddMemory?: () => void;
}

export function PatientSummaryCard({
  patient,
  onAddPatient,
  onOpenAddMedication,
  onOpenAddAllergy,
  onOpenAddMemory,
}: PatientSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header Row: Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Memory Dashboard
            </h1>
            <Badge variant="teal" size="sm" className="font-mono text-[10px]">
              Active Care
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Longitudinal patient profile with non-destructive reconciliation, time-aware memory, and audit trails.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenAddMedication && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddMedication}
              icon={<Pill className="w-3.5 h-3.5 text-emerald-600" />}
              className="text-xs hover:bg-emerald-50/50 hover:border-emerald-200"
            >
              + Medication
            </Button>
          )}
          {onOpenAddAllergy && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddAllergy}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
              className="text-xs hover:bg-amber-50/50 hover:border-amber-200"
            >
              + Allergy
            </Button>
          )}
          {onOpenAddMemory && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddMemory}
              icon={<Plus className="w-3.5 h-3.5 text-teal-600" />}
              className="text-xs hover:bg-teal-50/50 hover:border-teal-200"
            >
              + Clinical Note
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onAddPatient}
            icon={<UserPlus className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            + New Patient
          </Button>
        </div>
      </div>

      {/* Patient Profile Card Body */}
      <div className="bg-gradient-to-r from-slate-50 via-slate-50/80 to-teal-50/30 rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 border border-teal-200/60 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              {patient.synthetic_label.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {patient.synthetic_label}
                </h2>
                <Badge variant="teal" size="sm" className="font-semibold text-[10px]">
                  ID: {patient.id}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
                <span>
                  Age: <strong className="text-slate-800">{patient.age} yrs</strong>
                </span>
                <span>•</span>
                <span>
                  Gender: <strong className="text-slate-800">{patient.gender || 'Female'}</strong>
                </span>
                <span>•</span>
                <span>
                  Blood Group: <strong className="text-slate-800">{patient.blood_type || 'O+'}</strong>
                </span>
                <span>•</span>
                <span>
                  Condition: <strong className="text-teal-800 font-semibold">{patient.primary_condition || 'Active Care'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Important Information Tags */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Active Status:</span>
            <Badge variant="amber" size="sm" className="gap-1.5 font-medium">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              Penicillin Allergy: Verification Pending
            </Badge>
            <Badge variant="purple" size="sm" className="gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-purple-600" />
              {patient.primary_condition || 'Asthma Care'}
            </Badge>
            <Badge variant="success" size="sm" className="gap-1.5 font-medium">
              <Pill className="w-3 h-3 text-emerald-600" />
              Active Therapy Recorded
            </Badge>
          </div>
        </div>

        {/* Clinical Info Panel (Replaces old synthetic watermark) */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200/90 pt-3 md:pt-0 md:pl-6 shrink-0">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1 min-w-[170px]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Attending Care</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Internal Medicine Unit</p>
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Memory Vault Synced
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
