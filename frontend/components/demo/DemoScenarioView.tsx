'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Database,
  Clock,
  Brain,
} from 'lucide-react';
import { DemoStep, EvidenceDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface DemoScenarioViewProps {
  onReviewEvidence: (evidence: EvidenceDetail) => void;
  onJumpToAiAssistant?: () => void;
}

export function DemoScenarioView({
  onReviewEvidence,
  onJumpToAiAssistant,
}: DemoScenarioViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const scenarioSteps: DemoStep[] = [
    {
      stepNumber: 1,
      speaker: 'Doctor',
      statement: 'Patient diagnosed with Essential Hypertension. Initiating Medicine A 10mg PO daily. Patient confirms past anaphylactic hives reaction to Penicillin.',
      explanation: 'Episodic memory retains Medicine A as CURRENT and Penicillin allergy as CONFIRMED with severe reaction risk.',
      retainedFact: 'Medicine A: CURRENT | Penicillin: ALLERGY (Anaphylaxis)',
      evidenceRef: 'clinical_encounter_2025_10_12',
    },
    {
      stepNumber: 2,
      speaker: 'Patient',
      statement: 'I have been having terrible heart palpitations and dizziness since starting Medicine A. My doctor told me to stop taking Medicine A immediately and switch to Medicine B 50mg daily.',
      explanation: 'Temporal engine automatically transitions Medicine A to STOPPED / HISTORICAL with adverse event rationale, while Medicine B is registered as CURRENT.',
      retainedFact: 'Medicine A: STOPPED (Adverse Event) | Medicine B: CURRENT',
      statusChange: 'Medicine A -> STOPPED; Medicine B -> CURRENT',
      evidenceRef: 'clinical_encounter_2026_02_04',
    },
    {
      stepNumber: 3,
      speaker: 'Patient',
      statement: 'At nurse intake: "Do you have any known drug allergies?" Patient replies: "No, I do not have any drug allergies that I know of."',
      explanation: 'Zero-Silent-Overwrite Architecture: Rather than erasing the 2024 Penicillin anaphylaxis record, the system detects a direct contradiction, flags CONFLICT DETECTED, and demands clinician sign-off.',
      retainedFact: 'Penicillin: CONFLICT DETECTED (Chart Anaphylaxis vs Intake Denial)',
      conflictDetected: true,
      conflictDetails: 'Historical Chart Review (Anaphylaxis) vs Recent Intake Statement ("No known allergies")',
      evidenceRef: 'intake_triage_2026_02_05',
    },
    {
      stepNumber: 4,
      speaker: 'System',
      statement: 'Clinician query: "What medications is this patient currently taking?" Assistant answers: "Medicine B (50mg) is CURRENT. Medicine A was STOPPED on 2026-02-04 due to palpitations."',
      explanation: 'Demonstrates temporal precision: The assistant never confuses historical therapies with active regimens, providing source citations for both.',
      retainedFact: 'Distinguishes CURRENT (Medicine B) from HISTORICAL (Medicine A)',
      evidenceRef: 'memory_recall_query_001',
    },
    {
      stepNumber: 5,
      speaker: 'System',
      statement: 'Clinician / User asks: "Can you prescribe 500mg Amoxicillin for respiratory infection?" Assistant refuses: Declines autonomous prescribing and flags Penicillin allergy conflict.',
      explanation: 'Medical safety boundaries: Enforces non-prescriptive and non-diagnostic limits while alerting the user to the active penicillin contraindication.',
      retainedFact: 'Safety refusal triggered + Contraindication alert raised',
      conflictDetected: true,
      evidenceRef: 'safety_boundary_enforcement_001',
    },
  ];

  const currentStep = scenarioSteps[currentStepIndex];

  const handleReviewStepEvidence = (step: DemoStep) => {
    onReviewEvidence({
      memoryId: `step_${step.stepNumber}`,
      title: `Demo Scenario Step ${step.stepNumber}: ${step.retainedFact || 'Clinical Trace'}`,
      category: step.conflictDetected ? 'Conflict Alert' : 'Episodic Memory',
      source: step.speaker === 'Doctor' ? 'DOCTOR_RECOMMENDATION' : step.speaker === 'Patient' ? 'PATIENT_REPORTED' : 'SYSTEM_RECORD',
      originalStatement: step.statement,
      date: '2026-02-05',
      interactionId: step.evidenceRef,
      status: step.conflictDetected ? 'CONFLICTED' : 'CURRENT',
      context: step.explanation,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Interactive Clinical Memory Walkthrough
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Experience the 5-step clinical lifecycle: memory retention, temporal updates, contradiction detection, and safety boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStepIndex(0)}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Walkthrough
          </Button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-5 gap-2">
          {scenarioSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-white border-slate-150 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Step {step.stepNumber}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  ) : step.conflictDetected ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  ) : null}
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {step.stepNumber === 1 && 'Baseline Care'}
                  {step.stepNumber === 2 && 'Med Switching'}
                  {step.stepNumber === 3 && 'Contradiction'}
                  {step.stepNumber === 4 && 'Time-Aware Recall'}
                  {step.stepNumber === 5 && 'Safety Guardrail'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center">
              {currentStep.stepNumber}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step {currentStep.stepNumber} of 5
              </h2>
              <span className="text-xs text-slate-500">
                Speaker: <strong>{currentStep.speaker}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep.conflictDetected && (
              <Badge variant="rose" size="md">
                Active Conflict Detected
              </Badge>
            )}
            <Badge variant="teal" size="md">
              Evidence Grounded
            </Badge>
          </div>
        </div>

        {/* Clinical Dialogue Excerpt */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Clinical Dialogue / Encounter Excerpt
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed font-serif italic">
            &ldquo;{currentStep.statement}&rdquo;
          </div>
        </div>

        {/* System Memory Reaction & Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <Database className="w-4 h-4 text-teal-700" />
              <span>Episodic Memory Reaction</span>
            </div>
            <p className="text-teal-950 leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Retained Clinical Fact</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-150 font-mono text-[11px] text-slate-700">
              {currentStep.retainedFact}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReviewStepEvidence(currentStep)}
            className="flex items-center gap-1.5 text-xs text-teal-700 border-teal-300"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Inspect Evidence Trace</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </Button>

            {currentStepIndex < scenarioSteps.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                className="flex items-center gap-1"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              onJumpToAiAssistant && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onJumpToAiAssistant}
                  className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1.5"
                >
                  <Brain className="w-4 h-4" />
                  <span>Try Live Query in Assistant</span>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
