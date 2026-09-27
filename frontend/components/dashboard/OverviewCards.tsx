'use client';

import React from 'react';
import { Pill, ShieldAlert, Activity, AlertTriangle, BrainCircuit, ArrowUpRight } from 'lucide-react';
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
      subtext: `${stoppedMedCount} Historical / Stopped`,
      icon: Pill,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'text-emerald-700 bg-emerald-50',
    },
    {
      id: 'allergies',
      title: 'Known Allergies',
      value: `${allergyCount} Documented`,
      subtext: '1 High Severity (Disputed)',
      icon: ShieldAlert,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeColor: 'text-amber-800 bg-amber-50',
    },
    {
      id: 'symptoms',
      title: 'Recent Symptoms',
      value: `${symptomCount} Tracked`,
      subtext: '1 Resolved, 1 Temporary',
      icon: Activity,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      badgeColor: 'text-sky-700 bg-sky-50',
    },
    {
      id: 'conflicts',
      title: 'Active Conflicts',
      value: `${conflictCount} Requiring Review`,
      subtext: 'Allergy Record Contradiction',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeColor: 'text-rose-700 bg-rose-50 font-bold',
      isAlert: conflictCount > 0,
    },
    {
      id: 'memories',
      title: 'Relevant Memories',
      value: `${memoryCount} Retained Facts`,
      subtext: 'Hindsight Episodic Memory',
      icon: BrainCircuit,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
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
            className={`cursor-pointer transition-all hover:border-teal-300 hover:shadow-md group ${
              card.isAlert ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10' : ''
            }`}
            onClick={() => onNavigate(card.id)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
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
