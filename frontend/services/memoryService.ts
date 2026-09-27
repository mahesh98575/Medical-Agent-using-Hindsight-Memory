import { MemoryItem, SearchResultItem } from '@/types';
import { DEMO_MEMORIES } from '@/services/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const memoryService = {
  async getMemories(patientId: string, query?: string): Promise<MemoryItem[]> {
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

    if (query) {
      const qLower = query.toLowerCase();
      return DEMO_MEMORIES.filter(
        (m) =>
          m.text.toLowerCase().includes(qLower) ||
          m.category.toLowerCase().includes(qLower)
      );
    }
    return [...DEMO_MEMORIES];
  },

  async retainMemory(
    patientId: string,
    memory: { text: string; category: string; source?: string }
  ): Promise<MemoryItem> {
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
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    return {
      id: `mem_${Date.now()}`,
      text: memory.text,
      category: memory.category as MemoryItem['category'],
      temporal_status: 'CURRENT',
      source: (memory.source as MemoryItem['source']) || 'PATIENT_REPORTED',
      mentioned_at: new Date().toISOString().split('T')[0],
      score: 1.0,
      original_statement: memory.text,
    };
  },

  async loadDemo(_patientId: string = 'P001'): Promise<Record<string, unknown>> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/demo/load`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }
    return { status: 'loaded_offline' };
  },

  async search(query: string, patientId: string = 'P001'): Promise<SearchResultItem[]> {
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

    return [];
  },
};
