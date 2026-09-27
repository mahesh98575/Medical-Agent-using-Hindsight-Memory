'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Brain, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Database,
  CheckCircle2,
  Server
} from 'lucide-react';
import { api } from '@/services/api';
import { HealthStatus } from '@/types';

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await api.getHealth();
        setHealth(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unable to connect to backend service');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner: Synthetic Data Disclaimer */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>SYNTHETIC DEMO ENVIRONMENT — All patient profiles and clinical data are artificial and for testing purposes only.</span>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Healthcare Memory Assistant</h1>
              <p className="text-xs text-slate-500">Persistent, Time-Aware Clinical Memory & Decision Support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 border border-slate-200">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>Backend:</span>
              {loading ? (
                <span className="text-slate-400">Connecting...</span>
              ) : health?.status === 'healthy' ? (
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Operational
                </span>
              ) : (
                <span className="text-amber-700 font-semibold" title={error || 'Backend standby'}>
                  {error ? 'Standby (Offline)' : 'Offline / Standby'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Phase 2 Architecture Ready
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Intelligent, Persistent Memory for Continuous Patient Care
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Maintains time-aware, evidence-backed memory of a patient&apos;s medical history, allergies, medication transitions, and symptoms across multiple interactions without epistemic forgetting or silent record collisions.
            </p>
          </div>
        </div>

        {/* Core Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Temporal Understanding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Distinguishes current medications from discontinued therapies and temporary symptoms based on date-anchored memory recall.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Active Conflict Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never silently overwrites conflicting clinical records. Detects contradictions (e.g. allergy status) and requests human review.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Evidence & Provenance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every factual statement is grounded in retrieved memory units with explicit source tracking and interaction anchors.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Medical Safety Layer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strictly prohibited from autonomous diagnoses or prescriptions. Enforces safety boundaries on all responses.
            </p>
          </div>
        </div>

        {/* Dual-Persistence Status Overview */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            Dual-Persistence Engine Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">PostgreSQL Application State</span>
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Initialized
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Manages structured relational entities: synthetic patient profiles, conversation logs, interactions, tracked conflicts, and evidence links.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Hindsight Long-Term Memory</span>
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Client Verified
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Manages episodic patient memory banks with multi-strategy retrieval (semantic, BM25, graph, and temporal indexing) using official <code className="text-teal-700 bg-teal-50 px-1 rounded">hindsight-client 0.10.1</code>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
