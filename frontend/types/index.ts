/**
 * Core clinical and memory types for Healthcare Memory Assistant.
 */

export type MemoryStatus = 'CURRENT' | 'HISTORICAL' | 'STOPPED' | 'TEMPORARY' | 'CONFLICTED' | 'UNKNOWN';

export type SourceType = 'PATIENT_REPORTED' | 'DOCTOR_RECOMMENDATION' | 'SYSTEM_GENERATED' | 'SYNTHETIC_DEMO_RECORD' | 'UNKNOWN';

export interface Patient {
  id: string;
  synthetic_label: string;
  age: number;
  gender?: string;
  primary_condition?: string;
  is_synthetic: boolean;
  created_at?: string;
}

export interface Medication {
  id?: string;
  name: string;
  status: MemoryStatus;
  start_date?: string;
  end_date?: string;
  indication?: string;
  source: SourceType;
  last_updated?: string;
  evidence?: string;
}

export interface Allergy {
  id?: string;
  allergen: string;
  reaction?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'active' | 'disputed' | 'resolved';
  reported_date?: string;
  source: SourceType;
  has_conflict: boolean;
  evidence?: string;
}

export interface Symptom {
  id?: string;
  description: string;
  status: 'active' | 'resolved' | 'temporary';
  reported_date?: string;
  source: SourceType;
  evidence?: string;
}

export interface ConflictRecord {
  id: string;
  patient_id: string;
  conflict_type: string;
  description: string;
  record_a_summary: string;
  record_a_source: string;
  record_a_date?: string;
  record_b_summary: string;
  record_b_source: string;
  record_b_date?: string;
  status: 'unresolved' | 'clinician_verified';
  action_required: string;
}

export interface EvidenceRecord {
  id: string;
  interaction_id: string;
  memory_id?: string;
  fact_type: string;
  description: string;
  timestamp: string;
}

export interface MemoryItem {
  id: string;
  text: string;
  category: 'medication' | 'allergy' | 'symptom' | 'condition' | 'recommendation' | 'general';
  temporal_status: MemoryStatus;
  source: SourceType;
  occurred_start?: string;
  occurred_end?: string;
  mentioned_at?: string;
  document_id?: string;
  tags?: string[];
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  memories_recalled?: MemoryItem[];
  conflicts_detected?: ConflictRecord[];
  evidence_citations?: EvidenceRecord[];
}

export interface HealthStatus {
  status: string;
  environment: string;
  version: string;
  timestamp: string;
  services: Record<string, string>;
  synthetic_mode: boolean;
}
