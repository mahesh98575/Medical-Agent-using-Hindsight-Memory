import { ChatMessage, MemoryItem, ConflictRecord } from '@/types';
import { DEMO_MEMORIES, DEMO_CONFLICTS } from '@/services/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const chatService = {
  async sendMessage(patientId: string, message: string): Promise<ChatMessage> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/patients/${patientId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          id: data.id || `msg_${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          memories_recalled: data.memories_recalled || [],
          conflicts_detected: data.conflicts_detected || [],
        };
      }
    } catch (_e) {
      // Backend offline or unreachable - use client-side clinical fallback
    }

    return this.fallbackResponse(message);
  },

  fallbackResponse(message: string): ChatMessage {
    const qLower = message.toLowerCase();
    let content = '';
    let memories: MemoryItem[] = [];
    let conflicts: ConflictRecord[] = [];

    if (qLower.includes('prescribe') || qLower.includes('diagnos')) {
      content =
        '**Medical Safety Notice:** I cannot prescribe medications or formulate autonomous clinical diagnoses. I am an informational clinical memory assistant. Please consult a licensed clinician for diagnosis and medication prescription.';
    } else if (qLower.includes('medication') || qLower.includes('taking') || qLower.includes('medicine')) {
      content =
        'Based on verified clinical memory:\n\n• **Medicine B** (50mg daily): **CURRENT** therapy for Essential Hypertension (Started 2026-02-05).\n• **Medicine A**: **STOPPED / HISTORICAL** (Discontinued on 2026-02-04 due to reported palpitations and lightheadedness).\n\nThe patient is currently taking **Medicine B** only.';
      memories = DEMO_MEMORIES.filter((m) => m.category === 'medication');
    } else if (qLower.includes('allerg') || qLower.includes('penicillin') || qLower.includes('conflict')) {
      content =
        '⚠️ **CLINICAL CONFLICT DETECTED:**\n\n• **Historical Chart (2024-05-10):** Documents confirmed severe allergy to **Penicillin** (anaphylaxis/hives).\n• **Recent Intake (2026-02-05):** Patient stated "no known drug allergies".\n\n**Action Required:** Clinician verification is mandatory before prescribing any beta-lactam antibiotics. The system has NOT auto-resolved this discrepancy to ensure patient safety.';
      memories = DEMO_MEMORIES.filter((m) => m.category === 'allergy');
      conflicts = DEMO_CONFLICTS;
    } else {
      content =
        'Longitudinal clinical memory shows active Essential Hypertension managed with Medicine B following discontinuation of Medicine A, with a pending Penicillin allergy verification requiring clinician review.';
      memories = DEMO_MEMORIES.slice(0, 3);
    }

    return {
      id: `ast_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      memories_recalled: memories,
      conflicts_detected: conflicts,
    };
  },
};
