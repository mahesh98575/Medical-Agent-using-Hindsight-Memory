import { Medication } from '@/types';
import { DEMO_MEDICATIONS } from '@/services/mockData';

const STORAGE_PREFIX = 'hma_medications_';

function getStoredMeds(patientId: string): Medication[] {
  if (typeof window === 'undefined') return [...DEMO_MEDICATIONS];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${patientId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_e) {
    // Ignore error
  }
  return patientId === 'P001' ? [...DEMO_MEDICATIONS] : [];
}

function saveStoredMeds(patientId: string, meds: Medication[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${patientId}`, JSON.stringify(meds));
  } catch (_e) {
    // Ignore error
  }
}

export const medicationService = {
  async getMedications(patientId: string): Promise<Medication[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredMeds(patientId)), 40);
    });
  },

  async addMedication(patientId: string, medData: Omit<Medication, 'id'>): Promise<Medication> {
    return new Promise((resolve) => {
      const current = getStoredMeds(patientId);
      const newMed: Medication = {
        ...medData,
        id: `med_${Date.now()}`,
        last_updated: new Date().toISOString().split('T')[0],
      };
      const updated = [newMed, ...current];
      saveStoredMeds(patientId, updated);
      setTimeout(() => resolve(newMed), 80);
    });
  },

  async getMedicationByName(patientId: string, name: string): Promise<Medication | null> {
    const meds = getStoredMeds(patientId);
    const med = meds.find((m) => m.name.toLowerCase() === name.toLowerCase());
    return med ? { ...med } : null;
  },
};
