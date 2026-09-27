import { Patient } from '@/types';
import { DEMO_PATIENT } from '@/services/mockData';

// In-memory patient store for frontend session state
const patientsStore: Patient[] = [
  { ...DEMO_PATIENT },
  {
    id: 'P002',
    synthetic_label: 'Demo Patient 002 (Synthetic Profile)',
    age: 62,
    gender: 'Male',
    primary_condition: 'Hypertension & Type 2 Diabetes',
    is_synthetic: true,
    created_at: '2026-02-01T10:00:00Z',
    blood_type: 'O+',
  },
];

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...patientsStore]), 100);
    });
  },

  async getPatientById(id: string): Promise<Patient | null> {
    return new Promise((resolve) => {
      const found = patientsStore.find((p) => p.id === id);
      setTimeout(() => resolve(found ? { ...found } : null), 80);
    });
  },

  async createPatient(patientData: Omit<Patient, 'is_synthetic'>): Promise<Patient> {
    return new Promise((resolve) => {
      const newPatient: Patient = {
        ...patientData,
        is_synthetic: true,
        created_at: new Date().toISOString(),
      };
      patientsStore.push(newPatient);
      setTimeout(() => resolve(newPatient), 150);
    });
  },
};
