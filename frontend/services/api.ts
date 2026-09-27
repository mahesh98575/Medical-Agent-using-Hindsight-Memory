/**
 * API service for communicating with Healthcare Memory Assistant Backend.
 */
import { HealthStatus, Patient } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${this.baseUrl}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.statusText}`);
    }
    return res.json();
  }

  async getPatients(): Promise<Patient[]> {
    const res = await fetch(`${this.baseUrl}/api/patients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      // In phase 2 before patients endpoint is mounted, return default synthetic patient
      return [
        {
          id: 'patient_001',
          synthetic_label: 'Demo Patient 001 (Synthetic)',
          age: 42,
          gender: 'Female',
          primary_condition: 'Mild Persistent Asthma',
          is_synthetic: true,
        },
      ];
    }
    return res.json();
  }
}

export const api = new ApiService(API_BASE_URL);
