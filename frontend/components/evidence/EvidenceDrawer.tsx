'use client';

import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2, Calendar, User, Database } from 'lucide-react';
import { EvidenceDetail } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceDetail | null;
}

export function EvidenceDrawer({ isOpen, onClose, evidence }: EvidenceDrawerProps) {
  React.useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !evidence) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/75 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                <FileText className="w-4 h-4" />
              </span>
              <h3 id="evidence-drawer-title" className="text-lg font-bold text-slate-900">
                Clinical Evidence Citation
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Audit trail grounded in persistent clinical memory
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close evidence panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Fact Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="teal" size="sm">
                {evidence.category.toUpperCase()}
              </Badge>
              <StatusBadge status={evidence.status} />
            </div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {evidence.title}
            </h4>
            {evidence.context && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {evidence.context}
              </p>
            )}
          </div>

          {/* Source Attribution & Timestamp */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Source Attribution</span>
              </div>
              <div className="font-semibold text-slate-800 break-words">
                {evidence.source.replace(/_/g, ' ')}
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Recorded Date</span>
              </div>
              <div className="font-semibold text-slate-800">
                {evidence.date || 'Historical Record'}
              </div>
            </div>
          </div>

          {/* Original Statement / Clinical Record Quote */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Original Statement / Source Excerpt</span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono">
                GROUND TRUTH
              </span>
            </div>
            <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200/70 text-slate-800 font-serif italic text-sm leading-relaxed relative">
              <span className="text-teal-400 text-3xl font-serif absolute -top-1 left-2 pointer-events-none">
                “
              </span>
              <div className="pl-4">
                {evidence.originalStatement || 'Original documentation excerpt not provided.'}
              </div>
            </div>
          </div>

          {/* Interaction & Memory Metadata */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Memory Trace Metadata
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 font-mono text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Interaction ID:</span>
                <span className="text-slate-700 font-medium">{evidence.interactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Memory Ref ID:</span>
                <span className="text-slate-700 font-medium">{evidence.memoryId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Memory Layer:</span>
                <span className="text-teal-700 font-semibold flex items-center gap-1">
                  <Database className="w-3 h-3" /> Hindsight Episodic Bank
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Clinician Note */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-amber-950">
                Clinical Audit Compliance
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Healthcare Memory Assistant maintains immutable provenance. Memory facts are never silently merged or overwritten. Verification should be confirmed by a licensed clinician before making prescribing decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail Verified</span>
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done Reviewing
          </Button>
        </div>
      </div>
    </div>
  );
}
