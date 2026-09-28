'use client';

import React from 'react';
import { BrainCircuit, Tag, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { MemoryItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, Badge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MemoryPreviewSectionProps {
  memories: MemoryItem[];
  onNavigateToMemories: () => void;
  onOpenAddMemory?: () => void;
}

export function MemoryPreviewSection({
  memories,
  onNavigateToMemories,
  onOpenAddMemory,
}: MemoryPreviewSectionProps) {
  return (
    <Card className="border-teal-200/80 bg-teal-50/10">
      <CardHeader className="bg-teal-50/30 border-b border-teal-100/60 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Long-Term Memory Bank Preview</CardTitle>
                <Badge variant="default" size="sm" className="gap-1 font-mono text-[10px]">
                  <Sparkles className="w-2.5 h-2.5" />
                  Indexed
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Targeted, persistent episodic clinical facts retained across patient interactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenAddMemory && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddMemory}
                className="text-xs text-teal-800 border-teal-200 hover:bg-teal-100/50"
                icon={<Plus className="w-3.5 h-3.5 text-teal-600" />}
              >
                + Note
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToMemories}
              className="text-xs text-teal-700 hover:text-teal-900"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore Bank
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3">
        {memories.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No memories indexed yet. Click &ldquo;+ Note&rdquo; to add a clinical observation.
          </div>
        ) : (
          memories.map((mem) => (
            <div
              key={mem.id}
              className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-teal-200 transition-colors"
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
                      Confidence: {(mem.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                &ldquo;{mem.text}&rdquo;
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
                  Memory ID: <strong className="text-slate-600">{mem.id}</strong>
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
