/**
 * Core clinical and memory types for Healthcare Memory Assistant.
 */

export type MemoryStatus =
  | 'CURRENT'
  | 'HISTORICAL'
  | 'STOPPED'
  | 'TEMPORARY'
  | 'CONFLICTED'
  | 'UNKNOWN'
  | 'UNVERIFIED';

export type SourceType =
  | 'PATIENT_REPORTED'
  | 'DOCTOR_RECOMMENDATION'
  | 'SYSTEM_GENERATED'
  | 'SYNTHETIC_DEMO_RECORD'
  | 'UNKNOWN';

export interface Patient {
  id: string;
  synthetic_label: string;
  age: number;
  gender?: string;
  primary_condition?: string;
  is_synthetic: boolean;
  created_at?: string;
  blood_type?: string;
  emergency_contact?: string;
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
  notes?: string;
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
  notes?: string;
}

export interface Symptom {
  id?: string;
  description: string;
  status: 'active' | 'resolved' | 'temporary';
  reported_date?: string;
  source: SourceType;
  evidence?: string;
  notes?: string;
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
  evidence_ref_a?: string;
  evidence_ref_b?: string;
}

export interface EvidenceRecord {
  id: string;
  interaction_id: string;
  memory_id?: string;
  fact_type: string;
  description: string;
  timestamp: string;
  source?: SourceType;
  original_statement?: string;
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
  original_statement?: string;
  evidence_available?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  memories_recalled?: MemoryItem[];
  conflicts_detected?: ConflictRecord[];
  evidence_citations?: EvidenceRecord[];
  is_generating?: boolean;
}

export interface HealthStatus {
  status: string;
  environment: string;
  version: string;
  timestamp: string;
  services: Record<string, string>;
  synthetic_mode: boolean;
}

export interface EvidenceDetail {
  memoryId: string;
  title: string;
  category: string;
  source: SourceType | string;
  originalStatement: string;
  date: string;
  interactionId: string;
  status: MemoryStatus;
  context?: string;
}

export interface DemoStep {
  stepNumber: number;
  speaker: 'Patient' | 'Doctor' | 'System';
  statement: string;
  explanation: string;
  retainedFact?: string;
  updatedFact?: string;
  statusChange?: string;
  conflictDetected?: boolean;
  conflictDetails?: string;
  evidenceRef: string;
}

export interface TimelineEvent {
  id: string;
  date?: string;
  formatted_date?: string;
  timestamp?: string;
  title: string;
  description: string;
  category: 'medication' | 'allergy' | 'symptom' | 'conflict' | 'recommendation' | string;
  status?: 'CURRENT' | 'HISTORICAL' | 'STOPPED' | 'CONFLICTED' | 'TEMPORARY' | string;
  evidence_ref?: string;
  evidence_id?: string;
  source?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: 'patients' | 'medications' | 'allergies' | 'memories' | 'conflicts' | 'symptoms' | string;
  status?: MemoryStatus | string;
  targetSection?: string;
  source?: string;
  relevance_score?: number;
}

