import { Medication } from '@/types';
import { DEMO_MEDICATIONS } from '@/services/mockData';

export const medicationService = {
  async getMedications(_patientId: string): Promise<Medication[]> {
    return new Promise((resolve) => {
      // Deterministic demo patient medications
      setTimeout(() => resolve([...DEMO_MEDICATIONS]), 80);
    });
  },

  async getMedicationByName(patientId: string, name: string): Promise<Medication | null> {
    return new Promise((resolve) => {
      const med = DEMO_MEDICATIONS.find(
        (m) => m.name.toLowerCase() === name.toLowerCase()
      );
      setTimeout(() => resolve(med ? { ...med } : null), 50);
    });
  },
};
