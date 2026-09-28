import { Patient } from '@/types';
import { DEMO_PATIENT } from '@/services/mockData';

const INITIAL_PATIENTS: Patient[] = [
  { ...DEMO_PATIENT },
  {
    id: 'P002',
    synthetic_label: 'Marcus Chen',
    age: 62,
    gender: 'Male',
    primary_condition: 'Hypertension & Type 2 Diabetes',
    is_synthetic: true,
    created_at: '2026-02-01T10:00:00Z',
    blood_type: 'A+',
  },
];

const STORAGE_KEY = 'hma_registered_patients';

function getStoredPatients(): Patient[] {
  if (typeof window === 'undefined') return INITIAL_PATIENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_e) {
    // Ignore error
  }
  return INITIAL_PATIENTS;
}

function saveStoredPatients(patients: Patient[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch (_e) {
    // Ignore error
  }
}

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredPatients()), 50);
    });
  },

  async getPatientById(id: string): Promise<Patient | null> {
    return new Promise((resolve) => {
      const patients = getStoredPatients();
      const found = patients.find((p) => p.id === id);
      setTimeout(() => resolve(found ? { ...found } : null), 50);
    });
  },

  async createPatient(patientData: Omit<Patient, 'is_synthetic'>): Promise<Patient> {
    return new Promise((resolve) => {
      const current = getStoredPatients();
      const newPatient: Patient = {
        ...patientData,
        is_synthetic: true,
        created_at: new Date().toISOString(),
      };
      const updated = [newPatient, ...current.filter((p) => p.id !== newPatient.id)];
      saveStoredPatients(updated);
      setTimeout(() => resolve(newPatient), 100);
    });
  },
};
