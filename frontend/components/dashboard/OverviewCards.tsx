'use client';

import React from 'react';
import { Pill, Shield, Activity, GitCompare, BrainCircuit, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface OverviewCardsProps {
  currentMedCount: number;
  stoppedMedCount: number;
  allergyCount: number;
  symptomCount: number;
  conflictCount: number;
  memoryCount: number;
  onNavigate: (section: string) => void;
}

export function OverviewCards({
  currentMedCount,
  stoppedMedCount,
  allergyCount,
  symptomCount,
  conflictCount,
  memoryCount,
  onNavigate,
}: OverviewCardsProps) {
  const cards = [
    {
      id: 'medications',
      title: 'Current Medications',
      value: `${currentMedCount} Active`,
      subtext: `${stoppedMedCount} Discontinued / Historical`,
      icon: Pill,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'text-emerald-700 bg-emerald-50',
    },
    {
      id: 'allergies',
      title: 'Documented Allergies',
      value: `${allergyCount} Documented`,
      subtext: 'High-priority safety profile',
      icon: Shield,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'text-amber-800 bg-amber-50',
    },
    {
      id: 'symptoms',
      title: 'Tracked Symptoms',
      value: `${symptomCount} Tracked`,
      subtext: 'Longitudinal progression',
      icon: Activity,
      iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeColor: 'text-sky-700 bg-sky-50',
    },
    {
      id: 'conflicts',
      title: 'Discrepancy Reviews',
      value: `${conflictCount} Requiring Review`,
      subtext: 'Non-destructive reconciliation',
      icon: GitCompare,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeColor: 'text-indigo-800 bg-indigo-50 font-semibold',
    },
    {
      id: 'memories',
      title: 'Episodic Memories',
      value: `${memoryCount} Retained Facts`,
      subtext: 'Time-aware memory bank',
      icon: BrainCircuit,
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeColor: 'text-teal-700 bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className="cursor-pointer transition-all hover:border-teal-300 hover:shadow-md group border-slate-200/90 bg-white"
            onClick={() => onNavigate(card.id)}
          >
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5 tracking-tight">{card.value}</p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">{card.subtext}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
