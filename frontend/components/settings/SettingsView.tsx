'use client';

import React from 'react';
import {
  Settings,
  Database,
  Brain,
  Cpu,
  Lock,
  CheckCircle2,
  RefreshCw,
  Server,
} from 'lucide-react';
import { HealthStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SettingsViewProps {
  health: HealthStatus | null;
  onRefreshHealth?: () => void;
}

export function SettingsView({ health, onRefreshHealth }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              System Configuration & Safety Boundaries
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engine status, multi-layer persistence topology, and clinical safety constraints
          </p>
        </div>

        <div className="flex items-center gap-3">
          {health && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Server className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-slate-500 font-medium">API:</span>
              <span className="font-semibold text-emerald-700 capitalize">{health.status}</span>
            </div>
          )}
          {onRefreshHealth && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshHealth}
              className="flex items-center gap-1.5 text-xs text-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check Connectivity</span>
            </Button>
          )}
        </div>
      </div>

      {/* Persistence & Memory Engine Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hindsight Memory Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Brain className="w-5 h-5" />
            </span>
            <Badge variant="teal" size="sm">Active</Badge>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Hindsight Episodic Memory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Time-aware vector recall and episodic retention layer
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-mono space-y-1">
            <div>Engine: hindsight-client v0.10.1</div>
            <div>Fallback: Local Resilience Store</div>
          </div>
        </div>

        {/* Database Layer Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="w-5 h-5" />
            </span>
            <Badge variant="emerald" size="sm">Connected</Badge>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Relational Clinical Store
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Structured clinical models (medications, allergies, timeline)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-mono space-y-1">
            <div>Driver: SQLAlchemy Async / SQLite</div>
            <div>Tables: 7 clinical entities</div>
          </div>
        </div>

        {/* LLM Reasoning Engine Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Cpu className="w-5 h-5" />
            </span>
            <Badge variant="indigo" size="sm">Operational</Badge>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Clinical Reasoning Core
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Context-grounded assistant with clinical fallback
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-mono space-y-1">
            <div>Model: Google Gemini 2.5 Flash</div>
            <div>Guardrails: Pre/Post Evaluation</div>
          </div>
        </div>
      </div>

      {/* Safety Boundaries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Clinical Safety & Governance Policy
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <strong className="block text-slate-800">Autonomous Prescribing Boundary</strong>
              <span className="text-slate-500">Refuses requests to prescribe or formulate medication orders</span>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Enforced
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <strong className="block text-slate-800">Autonomous Diagnostic Boundary</strong>
              <span className="text-slate-500">Declines requests to diagnose clinical conditions from symptoms</span>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Enforced
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <strong className="block text-slate-800">Zero Silent Overwrite Architecture</strong>
              <span className="text-slate-500">Contradictory clinical statements trigger alerts; never silently overwritten</span>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Enforced
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <strong className="block text-slate-800">Clinical Data Isolation & Governance</strong>
              <span className="text-slate-500">HIPAA compliant security boundary; strict workspace isolation</span>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Enforced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
