import { ConflictRecord } from '@/types';
import { DEMO_CONFLICTS } from '@/services/mockData';

export const conflictService = {
  async getConflicts(_patientId: string): Promise<ConflictRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEMO_CONFLICTS]), 80);
    });
  },

  async getConflictById(id: string): Promise<ConflictRecord | null> {
    return new Promise((resolve) => {
      const conflict = DEMO_CONFLICTS.find((c) => c.id === id);
      setTimeout(() => resolve(conflict ? { ...conflict } : null), 50);
    });
  },
};
