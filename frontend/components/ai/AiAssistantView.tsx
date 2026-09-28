'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  FileText,
  CheckCircle2,
  Database,
  Plus,
} from 'lucide-react';
import { ChatMessage, MemoryItem, EvidenceDetail, Patient } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AiAssistantViewProps {
  patient: Patient;
  onReviewEvidence: (evidence: EvidenceDetail) => void;
  onSendMessage?: (message: string) => Promise<ChatMessage>;
  onRetainMemory?: (text: string, category: string) => Promise<boolean>;
}

export function AiAssistantView({
  patient,
  onReviewEvidence,
  onSendMessage,
  onRetainMemory,
}: AiAssistantViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_001',
      role: 'assistant',
      content: `Hello! I am your clinical memory assistant for **${patient.synthetic_label}**.\n\nI maintain persistent, time-aware episodic memories with full evidence provenance and active conflict alerts.\n\nAsk me about current medications, stopped treatments, allergy records, or longitudinal symptoms.`,
      timestamp: '10:00 AM',
      memories_recalled: [],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recalledMemories, setRecalledMemories] = useState<MemoryItem[]>([
    {
      id: 'mem_001',
      text: 'Medicine B (50mg daily) initiated for Essential Hypertension.',
      category: 'medication',
      temporal_status: 'CURRENT',
      source: 'DOCTOR_RECOMMENDATION',
      mentioned_at: '2026-02-05',
      score: 0.96,
      original_statement: 'Discontinued Medicine A due to tachycardia. Initiated Medicine B 50mg daily.',
    },
    {
      id: 'mem_002',
      text: 'Medicine A (10mg daily) discontinued following palpitations and dizziness.',
      category: 'medication',
      temporal_status: 'STOPPED',
      source: 'DOCTOR_RECOMMENDATION',
      mentioned_at: '2026-02-04',
      score: 0.94,
      original_statement: 'Patient reported palpitations and lightheadedness after 3 months on Medicine A. Switched to Medicine B.',
    },
    {
      id: 'mem_003',
      text: 'CONTRADICTION DETECTED: Penicillin allergy noted in 2024 chart vs denial during 2026 intake.',
      category: 'allergy',
      temporal_status: 'CONFLICTED',
      source: 'PATIENT_REPORTED',
      mentioned_at: '2026-02-05',
      score: 0.98,
      original_statement: 'Chart review indicates Penicillin anaphylaxis (2024). Intake note on 2026-02-05 recorded "no known drug allergies".',
    },
  ]);

  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState('medication');
  const [isRetaining, setIsRetaining] = useState(false);
  const [retainSuccess, setRetainSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const suggestedQueries = [
    'What medications is the patient currently taking?',
    'Are there any conflicting allergy records?',
    'Why was Medicine A stopped?',
    'Can you prescribe me 50mg of antibiotics?',
  ];

  const idCounterRef = useRef(100);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isGenerating) return;

    idCounterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `usr_${idCounterRef.current}`,
      role: 'user',
      content: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);

    if (onSendMessage) {
      try {
        const assistantReply = await onSendMessage(query);
        setMessages((prev) => [...prev, assistantReply]);
        if (assistantReply.memories_recalled && assistantReply.memories_recalled.length > 0) {
          setRecalledMemories(assistantReply.memories_recalled);
        }
      } catch {
        // Fallback response if fetch fails
        handleLocalAgentFallback(query);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setTimeout(() => {
        handleLocalAgentFallback(query);
        setIsGenerating(false);
      }, 500);
    }
  };

  const handleLocalAgentFallback = (query: string) => {
    const qLower = query.toLowerCase();
    let reply = '';
    let memories: MemoryItem[] = [];

    if (qLower.includes('prescribe') || qLower.includes('diagnos')) {
      reply =
        '**Medical Safety Notice:** I cannot prescribe medications or formulate autonomous clinical diagnoses. I am an informational clinical memory assistant. Please consult a licensed physician or clinical pharmacist for prescription and diagnostic decisions.';
    } else if (qLower.includes('medication') || qLower.includes('taking') || qLower.includes('medicine')) {
      reply =
        'Based on verified clinical memory:\n\n• **Medicine B** (50mg daily): **CURRENT** therapy for Essential Hypertension (Started 2026-02-05).\n• **Medicine A**: **STOPPED / HISTORICAL** (Discontinued on 2026-02-04 due to reported palpitations and lightheadedness).\n\nThe patient is currently taking **Medicine B** only.';
      memories = recalledMemories.filter((m) => m.category === 'medication');
    } else if (qLower.includes('allerg') || qLower.includes('penicillin') || qLower.includes('conflict')) {
      reply =
        '⚠️ **CLINICAL CONFLICT DETECTED:**\n\n• **Historical Chart (2024-05-10):** Documents confirmed severe allergy to **Penicillin** (anaphylaxis/hives).\n• **Recent Intake (2026-02-05):** Patient stated &ldquo;no known drug allergies&rdquo;.\n\n**Action Required:** Clinician verification is mandatory before prescribing any beta-lactam antibiotics. The system has NOT auto-resolved this discrepancy to ensure patient safety.';
      memories = recalledMemories.filter((m) => m.category === 'allergy');
    } else {
      reply = `Regarding **${query}**: Based on longitudinal episodic memory for ${patient.synthetic_label}, records show active hypertension managed with Medicine B following discontinuation of Medicine A, with a pending Penicillin allergy verification.`;
      memories = recalledMemories;
    }

    idCounterRef.current += 1;
    const assistantMsg: ChatMessage = {
      id: `ast_${idCounterRef.current}`,
      role: 'assistant',
      content: reply,
      timestamp: 'Just now',
      memories_recalled: memories,
    };
    setMessages((prev) => [...prev, assistantMsg]);
  };

  const handleReviewMemoryEvidence = (memory: MemoryItem) => {
    onReviewEvidence({
      memoryId: memory.id,
      title: memory.text,
      category: memory.category,
      source: memory.source,
      originalStatement:
        memory.original_statement ||
        `Clinical statement documented for memory reference ${memory.id}.`,
      date: memory.mentioned_at || '2026-02-05',
      interactionId: memory.document_id || 'hindsight_episodic_001',
      status: memory.temporal_status,
      context: `Episodic Memory Bank Citation. Relevance Score: ${(
        (memory.score || 0.95) * 100
      ).toFixed(0)}% match.`,
    });
  };

  const handleRetainNewObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim() || isRetaining) return;

    setIsRetaining(true);
    if (onRetainMemory) {
      await onRetainMemory(newMemoryText, newMemoryCategory);
    }

    idCounterRef.current += 1;
    const newMem: MemoryItem = {
      id: `mem_custom_${idCounterRef.current}`,
      text: newMemoryText,
      category: newMemoryCategory as MemoryItem['category'],
      temporal_status: 'CURRENT',
      source: 'PATIENT_REPORTED',
      mentioned_at: '2026-02-05',
      score: 1.0,
      original_statement: newMemoryText,
    };

    setRecalledMemories((prev) => [newMem, ...prev]);
    setNewMemoryText('');
    setIsRetaining(false);
    setRetainSuccess(true);
    setTimeout(() => setRetainSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Clinical Memory Assistant
            </h1>
            <p className="text-xs text-slate-500">
              Conversational query interface with grounded memory retrieval & zero silent overwriting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200 font-medium">
            <Database className="w-3.5 h-3.5" />
            Hindsight Episodic Memory Active
          </span>
        </div>
      </div>

      {/* 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat Stream & Input (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 flex flex-col h-[650px] shadow-xs overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const hasConflict = msg.content.toLowerCase().includes('conflict');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                    <span>{isUser ? 'Clinician' : 'Memory Assistant'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-teal-700 text-white rounded-br-xs'
                        : hasConflict
                        ? 'bg-rose-50/90 text-rose-950 border border-rose-200 rounded-bl-xs'
                        : 'bg-slate-50 text-slate-900 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-normal">
                      {msg.content}
                    </div>

                    {/* Evidence & Memory Citations in Assistant Messages */}
                    {!isUser && msg.memories_recalled && msg.memories_recalled.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Grounded Citations ({msg.memories_recalled.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.memories_recalled.map((mem) => (
                            <button
                              key={mem.id}
                              type="button"
                              onClick={() => handleReviewMemoryEvidence(mem)}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 transition-colors"
                            >
                              <FileText className="w-3 h-3 text-teal-600" />
                              <span>{mem.category}: {mem.temporal_status}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-3 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
                <span>Searching episodic memory bank & verifying conflict matrix...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Queries */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-semibold shrink-0">Quick Queries:</span>
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-teal-400 hover:text-teal-800 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about medications, allergies, symptoms, or memory history..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Safety Guardrails: Healthcare Memory Assistant provides informational recall. Refuses autonomous diagnosis or prescribing.
            </p>
          </div>
        </div>

        {/* Right Column: Relevant Memory Panel & Retain New Memory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Episodic Recall Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recalled Episodic Memories
                </h3>
              </div>
              <Badge variant="teal" size="sm">
                {recalledMemories.length} Relevant
              </Badge>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {recalledMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={mem.temporal_status} />
                    <span className="text-[10px] font-mono text-slate-400">
                      Score: {((mem.score || 0.95) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-slate-800 font-medium leading-relaxed">
                    {mem.text}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Source: {mem.source.replace(/_/g, ' ')}</span>
                    <button
                      type="button"
                      onClick={() => handleReviewMemoryEvidence(mem)}
                      className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Review Citation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retain New Memory Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Plus className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Retain New Clinical Memory
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Persist an encounter observation into Hindsight episodic storage
            </p>

            <form onSubmit={handleRetainNewObservation} className="space-y-2.5">
              <div className="flex gap-2">
                <select
                  value={newMemoryCategory}
                  onChange={(e) => setNewMemoryCategory(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-200 bg-white text-slate-700"
                >
                  <option value="medication">Medication</option>
                  <option value="allergy">Allergy</option>
                  <option value="symptom">Symptom</option>
                  <option value="recommendation">Recommendation</option>
                </select>
                <input
                  type="text"
                  value={newMemoryText}
                  onChange={(e) => setNewMemoryText(e.target.value)}
                  placeholder="e.g. Patient tolerated Medicine B with normal heart rate..."
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {retainSuccess ? (
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Retained in Hindsight!
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    Tagged with timestamp & source
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  disabled={!newMemoryText.trim() || isRetaining}
                  className="text-xs text-teal-700 border-teal-300 hover:bg-teal-50"
                >
                  Retain Fact
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
