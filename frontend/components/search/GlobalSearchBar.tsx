'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Pill, ShieldAlert, Activity, BrainCircuit, AlertTriangle, ArrowRight } from 'lucide-react';
import { SearchResultItem, EvidenceDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface GlobalSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (section: string, result: SearchResultItem) => void;
  onReviewEvidence?: (evidence: EvidenceDetail) => void;
  searchData?: SearchResultItem[];
}

const DEFAULT_SEARCH_ITEMS: SearchResultItem[] = [
  {
    id: 'med_b',
    title: 'Medicine B (50mg Daily)',
    category: 'medications',
    status: 'CURRENT',
    description: 'Active therapy for Essential Hypertension. Initiated on 2026-02-05.',
    source: 'DOCTOR_RECOMMENDATION',
    relevance_score: 0.98,
  },
  {
    id: 'med_a',
    title: 'Medicine A (10mg Daily)',
    category: 'medications',
    status: 'STOPPED',
    description: 'Discontinued due to reported tachycardia and palpitations.',
    source: 'DOCTOR_RECOMMENDATION',
    relevance_score: 0.95,
  },
  {
    id: 'alg_penicillin',
    title: 'Penicillin Allergy Discrepancy',
    category: 'conflicts',
    status: 'CONFLICTED',
    description: 'Documented anaphylaxis (2024) vs intake denial (2026). Verification required.',
    source: 'SYNTHETIC_DEMO_RECORD',
    relevance_score: 0.99,
  },
  {
    id: 'sym_palpitations',
    title: 'Heart Palpitations & Tachycardia',
    category: 'symptoms',
    status: 'HISTORICAL',
    description: 'Reported after 3 months on Medicine A. Resolved following cessation.',
    source: 'PATIENT_REPORTED',
    relevance_score: 0.91,
  },
  {
    id: 'mem_htn_control',
    title: 'Blood Pressure Stabilization on Medicine B',
    category: 'memories',
    status: 'CURRENT',
    description: 'Episodic memory: Patient tolerating Medicine B with normal vital signs.',
    source: 'DOCTOR_RECOMMENDATION',
    relevance_score: 0.89,
  },
];

export function GlobalSearchBar({
  isOpen,
  onClose,
  onSelectResult,
  onReviewEvidence,
  searchData,
}: GlobalSearchBarProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultItems = searchData || DEFAULT_SEARCH_ITEMS;

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const filtered = defaultItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesQuery =
      !query.trim() ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (Boolean(item.description) && item.description!.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'medications':
        return Pill;
      case 'allergies':
        return ShieldAlert;
      case 'conflicts':
        return AlertTriangle;
      case 'symptoms':
        return Activity;
      default:
        return BrainCircuit;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[550px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medications, allergies, symptoms, conflicts, and memory records..."
            className="flex-1 text-sm bg-transparent outline-hidden text-slate-900 placeholder-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'medications', 'allergies', 'conflicts', 'symptoms', 'memories'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching clinical records found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = getCategoryIcon(item.category);

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 transition-all flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <Badge
                          variant={
                            item.status === 'CURRENT'
                              ? 'emerald'
                              : item.status === 'CONFLICTED'
                              ? 'rose'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onReviewEvidence && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onReviewEvidence({
                            memoryId: item.id,
                            title: item.title,
                            category: item.category,
                            source: 'CLINICAL_SEARCH_RECORD',
                            originalStatement: item.description || item.title,
                            date: '2026-02-05',
                            interactionId: 'search_trace_001',
                            status: (item.status as EvidenceDetail['status']) || 'CURRENT',
                            context: `Record retrieved from indexed clinical memory bank. Status: ${item.status || 'CURRENT'}.`,
                          });
                        }}
                        className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold transition-colors"
                      >
                        Evidence
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectResult(item.category, item);
                      }}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1"
                    >
                      <span>Jump</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
