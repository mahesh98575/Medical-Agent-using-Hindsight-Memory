'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Plus } from 'lucide-react';
import { Allergy } from '@/types';
import { Button } from '@/components/ui/Button';

interface AddAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  patientName: string;
}

export function AddAllergyModal({
  isOpen,
  onClose,
  onAddAllergy,
  patientName,
}: AddAllergyModalProps) {
  const [allergen, setAllergen] = useState('');
  const [reaction, setReaction] = useState('');
  const [severity, setSeverity] = useState<Allergy['severity']>('Medium');
  const [status, setStatus] = useState<Allergy['status']>('active');
  const [reportedDate, setReportedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
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
    if (!allergen.trim()) return;

    setIsSubmitting(true);
    onAddAllergy({
      allergen: allergen.trim(),
      reaction: reaction.trim() || 'Adverse cutaneous reaction',
      severity,
      status,
      reported_date: reportedDate || new Date().toISOString().split('T')[0],
      source: 'PATIENT_REPORTED',
      has_conflict: false,
      evidence: notes.trim() || `Reported during clinical encounter for ${patientName}`,
    });

    setIsSubmitting(false);
    setAllergen('');
    setReaction('');
    setNotes('');
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
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Record Patient Allergy
              </h2>
              <p className="text-xs text-slate-500">
                Log contraindication warning for <strong className="text-slate-700">{patientName}</strong>
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
              Allergen / Substance *
            </label>
            <input
              type="text"
              required
              value={allergen}
              onChange={(e) => setAllergen(e.target.value)}
              placeholder="e.g. Sulfa Antibiotics, Latex, Aspirin"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observed Reaction / Symptoms
            </label>
            <input
              type="text"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="e.g. Urticaria (hives), facial angioedema, wheezing"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Risk Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Allergy['severity'])}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600 font-medium"
              >
                <option value="Low">Low - Mild localized rash</option>
                <option value="Medium">Medium - Generalized hives or swelling</option>
                <option value="High">High - Severe bronchospasm / Anaphylaxis risk</option>
                <option value="Critical">Critical - Life-threatening emergency history</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Documentation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Allergy['status'])}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600 font-medium"
              >
                <option value="active">Active & Confirmed</option>
                <option value="disputed">Under Clinical Review</option>
                <option value="resolved">Resolved / Tolerated upon retest</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reported Date
            </label>
            <input
              type="date"
              value={reportedDate}
              onChange={(e) => setReportedDate(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Encounter Documentation / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reported by patient during intake; advised patient to avoid all related compounds."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600 resize-none"
            />
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
              disabled={!allergen.trim() || isSubmitting}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Record Allergy'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
