import { MemoryItem, SearchResultItem } from '@/types';
import { DEMO_MEMORIES } from '@/services/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const STORAGE_PREFIX = 'hma_memories_';

function isLocalhostHttpInHttps(): boolean {
  if (typeof window !== 'undefined') {
    const isHttps = window.location.protocol === 'https:';
    const isLocalhost =
      API_BASE_URL.startsWith('http://localhost') ||
      API_BASE_URL.startsWith('http://127.0.0.1');
    return isHttps && isLocalhost;
  }
  return false;
}

function getStoredMemories(patientId: string): MemoryItem[] {
  if (typeof window === 'undefined') return [...DEMO_MEMORIES];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${patientId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_e) {
    // Ignore error
  }
  return patientId === 'P001' ? [...DEMO_MEMORIES] : [];
}

function saveStoredMemories(patientId: string, memories: MemoryItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${patientId}`, JSON.stringify(memories));
  } catch (_e) {
    // Ignore error
  }
}

export const memoryService = {
  async getMemories(patientId: string, query?: string): Promise<MemoryItem[]> {
    if (!isLocalhostHttpInHttps()) {
      try {
        const url = new URL(`${API_BASE_URL}/api/patients/${patientId}/memories`);
        if (query) url.searchParams.append('query', query);

        const res = await fetch(url.toString(), {
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (_e) {
        // Fallback
      }
    }

    const memories = getStoredMemories(patientId);
    if (query) {
      const qLower = query.toLowerCase();
      return memories.filter(
        (m) =>
          m.text.toLowerCase().includes(qLower) ||
          m.category.toLowerCase().includes(qLower)
      );
    }
    return memories;
  },

  async retainMemory(
    patientId: string,
    memory: { text: string; category: string; source?: string }
  ): Promise<MemoryItem> {
    if (!isLocalhostHttpInHttps()) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/patients/${patientId}/memories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: memory.text,
            category: memory.category,
            source: memory.source || 'PATIENT_REPORTED',
            temporal_status: 'CURRENT',
          }),
        });
        if (res.ok) {
          const saved = await res.json();
          const current = getStoredMemories(patientId);
          saveStoredMemories(patientId, [saved, ...current]);
          return saved;
        }
      } catch (_e) {
        // Fallback
      }
    }

    const current = getStoredMemories(patientId);
    const newMemory: MemoryItem = {
      id: `mem_${Date.now()}`,
      text: memory.text,
      category: memory.category as MemoryItem['category'],
      temporal_status: 'CURRENT',
      source: (memory.source as MemoryItem['source']) || 'PATIENT_REPORTED',
      mentioned_at: new Date().toISOString().split('T')[0],
      score: 1.0,
      original_statement: memory.text,
    };
    const updated = [newMemory, ...current];
    saveStoredMemories(patientId, updated);
    return newMemory;
  },

  async loadDemo(patientId: string = 'P001'): Promise<Record<string, unknown>> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${patientId}`);
        localStorage.removeItem(`hma_medications_${patientId}`);
        localStorage.removeItem(`hma_allergies_${patientId}`);
      } catch (_e) {
        // Ignore error
      }
    }
    return { status: 'loaded' };
  },

  async search(query: string, patientId: string = 'P001'): Promise<SearchResultItem[]> {
    if (!isLocalhostHttpInHttps()) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&patient_id=${patientId}`
        );
        if (res.ok) {
          const data = await res.json();
          return data.results || [];
        }
      } catch (_e) {
        // Fallback
      }
    }

    const qLower = query.toLowerCase();
    const results: SearchResultItem[] = [];
    const memories = getStoredMemories(patientId);
    for (const mem of memories) {
      if (mem.text.toLowerCase().includes(qLower)) {
        results.push({
          id: mem.id,
          title: mem.text,
          description: `Category: ${mem.category} • Status: ${mem.temporal_status}`,
          category: 'memories',
          status: mem.temporal_status,
          targetSection: 'memories',
        });
      }
    }
    return results;
  },
};
