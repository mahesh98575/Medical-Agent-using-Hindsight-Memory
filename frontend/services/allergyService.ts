import { Allergy } from '@/types';
import { DEMO_ALLERGIES } from '@/services/mockData';

const STORAGE_PREFIX = 'hma_allergies_';

function getStoredAllergies(patientId: string): Allergy[] {
  if (typeof window === 'undefined') return [...DEMO_ALLERGIES];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${patientId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_e) {
    // Ignore error
  }
  return patientId === 'P001' ? [...DEMO_ALLERGIES] : [];
}

function saveStoredAllergies(patientId: string, allergies: Allergy[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${patientId}`, JSON.stringify(allergies));
  } catch (_e) {
    // Ignore error
  }
}

export const allergyService = {
  async getAllergies(patientId: string): Promise<Allergy[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredAllergies(patientId)), 40);
    });
  },

  async addAllergy(patientId: string, allergyData: Omit<Allergy, 'id'>): Promise<Allergy> {
    return new Promise((resolve) => {
      const current = getStoredAllergies(patientId);
      const newAllergy: Allergy = {
        ...allergyData,
        id: `alg_${Date.now()}`,
        reported_date: allergyData.reported_date || new Date().toISOString().split('T')[0],
      };
      const updated = [newAllergy, ...current];
      saveStoredAllergies(patientId, updated);
      setTimeout(() => resolve(newAllergy), 80);
    });
  },

  async getAllergyBySubstance(patientId: string, substance: string): Promise<Allergy | null> {
    const allergies = getStoredAllergies(patientId);
    const allergy = allergies.find(
      (a) => a.allergen.toLowerCase() === substance.toLowerCase()
    );
    return allergy ? { ...allergy } : null;
  },
};
