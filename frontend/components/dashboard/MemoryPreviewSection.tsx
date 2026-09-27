'use client';

import React from 'react';
import { BrainCircuit, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { MemoryItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, Badge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MemoryPreviewSectionProps {
  memories: MemoryItem[];
  onNavigateToMemories: () => void;
}

export function MemoryPreviewSection({
  memories,
  onNavigateToMemories,
}: MemoryPreviewSectionProps) {
  return (
    <Card className="border-teal-200/80 bg-teal-50/10">
      <CardHeader className="bg-teal-50/30 border-b border-teal-100/60">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Hindsight Long-Term Memory Bank Preview</CardTitle>
                <Badge variant="default" size="sm" className="gap-1 font-mono text-[10px]">
                  <Sparkles className="w-2.5 h-2.5" />
                  TEMPR Retrieval
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Targeted, persistent episodic clinical facts retained across patient interactions.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToMemories}
            className="text-xs text-teal-700 hover:text-teal-800"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Bank
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="p-3.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-teal-200 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm" className="font-mono text-[10px] uppercase">
                  {mem.category}
                </Badge>
                <StatusBadge status={mem.temporal_status} />
              </div>
              <div className="flex items-center gap-3">
                <SourceBadge source={mem.source} />
                {mem.score && (
                  <span className="font-mono text-[11px] text-teal-700 font-semibold">
                    Score: {(mem.score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              &quot;{mem.text}&quot;
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                {mem.tags && mem.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span className="font-mono text-slate-500">{mem.tags.join(', ')}</span>
                  </div>
                )}
              </div>
              <span className="font-mono text-[10px]">
                Memory ID: <strong className="text-slate-600">{mem.id}</strong> | Anchor:{' '}
                <strong className="text-teal-700">{mem.document_id}</strong>
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
