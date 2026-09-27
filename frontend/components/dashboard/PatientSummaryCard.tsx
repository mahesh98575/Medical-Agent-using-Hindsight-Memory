'use client';

import React from 'react';
import { User, ShieldAlert, Pill, Sparkles, UserPlus, RotateCcw } from 'lucide-react';
import { Patient } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PatientSummaryCardProps {
  patient: Patient;
  onLoadDemoPatient: () => void;
  onAddPatient: () => void;
}

export function PatientSummaryCard({
  patient,
  onLoadDemoPatient,
  onAddPatient,
}: PatientSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header Row: Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Healthcare Memory Assistant
            </h1>
            <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
              v1.0
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Organize patient information, understand changes over time, and retrieve relevant medical memories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadDemoPatient}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
          >
            Load Demo Patient
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onAddPatient}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            + Add Patient
          </Button>
        </div>
      </div>

      {/* Patient Profile Card Body */}
      <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                {patient.synthetic_label}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span>
                  Patient ID: <strong className="font-mono text-slate-700">{patient.id}</strong>
                </span>
                <span>•</span>
                <span>
                  Age: <strong className="text-slate-700">{patient.age}</strong>
                </span>
                {patient.gender && (
                  <>
                    <span>•</span>
                    <span>
                      Gender: <strong className="text-slate-700">{patient.gender}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Important Information Tags */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Key Context:</span>
            <Badge variant="danger" size="sm" className="gap-1 font-semibold">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              Penicillin Allergy (Conflicted)
            </Badge>
            <Badge variant="purple" size="sm" className="gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              {patient.primary_condition || 'Asthma'}
            </Badge>
            <Badge variant="success" size="sm" className="gap-1">
              <Pill className="w-3 h-3 text-emerald-600" />
              Current: Medicine B
            </Badge>
          </div>
        </div>

        {/* Prominent Synthetic Data Watermark Badge */}
        <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 shrink-0">
          <div className="text-left md:text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
              SYNTHETIC DATA
            </span>
            <p className="text-[11px] text-slate-500 max-w-[180px] leading-tight hidden md:block">
              Simulated clinical profile. No real patient data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
