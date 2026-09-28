'use client';

import React, { useState } from 'react';
import { History, Calendar, FileText, Clock, GitCompare, Pill, ShieldAlert, Activity, CheckCircle } from 'lucide-react';
import { TimelineEvent, EvidenceDetail, MemoryStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TimelineViewProps {
  events: TimelineEvent[];
  onReviewEvidence: (evidence: EvidenceDetail) => void;
}

export function TimelineView({ events, onReviewEvidence }: TimelineViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'medication', label: 'Medications', icon: Pill },
    { id: 'allergy', label: 'Allergies', icon: ShieldAlert },
    { id: 'conflict', label: 'Reconciliation', icon: GitCompare },
    { id: 'symptom', label: 'Symptoms', icon: Activity },
    { id: 'recommendation', label: 'Recommendations', icon: CheckCircle },
  ];

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'all') return true;
    return ev.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleReviewEventEvidence = (ev: TimelineEvent) => {
    onReviewEvidence({
      memoryId: ev.id,
      title: ev.title,
      category: ev.category,
      source: ev.source || 'SYSTEM_RECORD',
      originalStatement:
        ev.description ||
        `Clinical event logged at ${ev.timestamp || ev.date}. Category: ${ev.category}.`,
      date: ev.timestamp || ev.date || '2026-02-05',
      interactionId: ev.evidence_id || ev.evidence_ref || 'timeline_ref_001',
      status: (ev.category === 'conflict' ? 'CONFLICTED' : 'HISTORICAL') as MemoryStatus,
      context: `Timeline Event: ${ev.title}. Documented under category: ${ev.category}.`,
    });
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'conflict':
        return 'amber';
      case 'medication':
        return 'teal';
      case 'allergy':
        return 'amber';
      case 'symptom':
        return 'indigo';
      case 'recommendation':
        return 'emerald';
      default:
        return 'slate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Comprehensive Medical Timeline
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological audit of patient encounters, medication adjustments, and active conflict detections
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing {filteredEvents.length} events</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filteredEvents.map((ev) => {
          const isConflict = ev.category.toLowerCase() === 'conflict';

          return (
            <div key={ev.id} className="relative group">
              {/* Timeline Bullet Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                  isConflict
                    ? 'border-indigo-400 text-indigo-700 shadow-2xs'
                    : 'border-teal-500 text-teal-600'
                }`}
              >
                {isConflict ? (
                  <GitCompare className="w-3 h-3 text-indigo-700" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-teal-600" />
                )}
              </div>

              {/* Event Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isConflict
                    ? 'bg-indigo-50/20 border-indigo-200/90'
                    : 'bg-white border-slate-200 group-hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Badge variant={getCategoryBadgeVariant(ev.category)} size="sm">
                      {ev.category.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-bold text-slate-800">
                      {ev.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{ev.timestamp || ev.formatted_date || ev.date}</span>
                  </div>
                </div>

                <div className="py-3 text-xs text-slate-700 leading-relaxed">
                  {ev.description}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Source: <strong className="text-slate-600">{ev.source ? ev.source.replace(/_/g, ' ') : 'Clinical Encounter'}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewEventEvidence(ev)}
                    className="text-xs text-teal-700 border-teal-200 hover:bg-teal-50"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Review Evidence
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
