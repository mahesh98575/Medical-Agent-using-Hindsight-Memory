'use client';

import React from 'react';
import { History, ArrowRight, CircleDot } from 'lucide-react';
import { TimelineEvent } from '@/services/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RecentTimelineSectionProps {
  events: TimelineEvent[];
  onNavigateToTimeline: () => void;
}

export function RecentTimelineSection({
  events,
  onNavigateToTimeline,
}: RecentTimelineSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <History className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Medical Chronology & Event Evolution</CardTitle>
              <p className="text-xs text-slate-500">
                Visual timeline tracking the historical sequence of clinical observations, prescriptions, and updates.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToTimeline}
            className="text-xs text-teal-700 hover:text-teal-800"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Full Timeline
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((event) => {
            const isConflict = event.category === 'conflict';
            const isStopped = event.status === 'STOPPED';
            const isCurrent = event.status === 'CURRENT';

            const dotColor = isConflict
              ? 'text-rose-500 bg-white ring-4 ring-rose-100'
              : isStopped
              ? 'text-slate-400 bg-white ring-4 ring-slate-100'
              : isCurrent
              ? 'text-emerald-500 bg-white ring-4 ring-emerald-100'
              : 'text-indigo-500 bg-white ring-4 ring-indigo-100';

            return (
              <div key={event.id} className="relative group">
                {/* Timeline Node Pin */}
                <div
                  className={`absolute -left-[29px] top-0.5 rounded-full p-0.5 transition-transform group-hover:scale-110 ${dotColor}`}
                >
                  <CircleDot className="w-3.5 h-3.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {event.formatted_date}
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <h4 className="font-semibold text-slate-900 text-sm">{event.title}</h4>
                    <StatusBadge status={event.status || 'CURRENT'} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {event.description}
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Evidence Link: <span className="text-teal-700">{event.evidence_ref}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
