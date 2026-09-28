'use client';

import React, { useState, useEffect } from 'react';
import { X, BrainCircuit, Plus } from 'lucide-react';
import { MemoryItem, MemoryStatus } from '@/types';
import { Button } from '@/components/ui/Button';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: { text: string; category: MemoryItem['category']; status: MemoryStatus }) => void;
  patientName: string;
}

export function AddMemoryModal({
  isOpen,
  onClose,
  onAddMemory,
  patientName,
}: AddMemoryModalProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('general');
  const [status, setStatus] = useState<MemoryStatus>('CURRENT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    onAddMemory({
      text: text.trim(),
      category,
      status,
    });

    setIsSubmitting(false);
    setText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-teal-100 text-teal-700 rounded-xl">
              <BrainCircuit className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Record Clinical Memory Note
              </h2>
              <p className="text-xs text-slate-500">
                Index longitudinal observation for <strong className="text-slate-700">{patientName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Statement / Observation *
            </label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Patient advised to measure blood pressure daily before morning breakfast. Blood sugar levels stable."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MemoryItem['category'])}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600 font-medium"
              >
                <option value="general">General Clinical Note</option>
                <option value="medication">Medication Adherence / Order</option>
                <option value="allergy">Allergy / Sensitivity</option>
                <option value="symptom">Symptom Observation</option>
                <option value="condition">Diagnostic Condition</option>
                <option value="recommendation">Physician Directive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Temporal Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MemoryStatus)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600 font-medium"
              >
                <option value="CURRENT">CURRENT - Active Insight</option>
                <option value="HISTORICAL">HISTORICAL - Past Observation</option>
                <option value="TEMPORARY">TEMPORARY - Transient Note</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!text.trim() || isSubmitting}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Record Memory'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
