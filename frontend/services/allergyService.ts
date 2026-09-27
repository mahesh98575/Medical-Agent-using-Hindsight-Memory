import { Allergy } from '@/types';
import { DEMO_ALLERGIES } from '@/services/mockData';

export const allergyService = {
  async getAllergies(_patientId: string): Promise<Allergy[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEMO_ALLERGIES]), 80);
    });
  },

  async getAllergyBySubstance(patientId: string, substance: string): Promise<Allergy | null> {
    return new Promise((resolve) => {
      const allergy = DEMO_ALLERGIES.find(
        (a) => a.allergen.toLowerCase() === substance.toLowerCase()
      );
      setTimeout(() => resolve(allergy ? { ...allergy } : null), 50);
    });
  },
};
