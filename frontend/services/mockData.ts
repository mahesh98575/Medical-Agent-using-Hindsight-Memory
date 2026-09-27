import { Patient, Medication, Allergy, Symptom, ConflictRecord, MemoryItem, TimelineEvent } from '@/types';
export type { TimelineEvent };

export const DEMO_PATIENT: Patient = {
  id: 'P001',
  synthetic_label: 'Demo Patient 001 (Synthetic Profile)',
  age: 45,
  gender: 'Female',
  primary_condition: 'Mild Persistent Asthma',
  is_synthetic: true,
  created_at: '2026-01-15T09:00:00Z',
};

export const DEMO_MEDICATIONS: Medication[] = [
  {
    id: 'med_002',
    name: 'Medicine B',
    status: 'CURRENT',
    indication: 'Asthma maintenance inhaler (Daily 2 puffs)',
    start_date: '2026-08-15',
    source: 'PATIENT_REPORTED',
    last_updated: '2026-08-15',
    evidence: 'Interaction 002: Patient reported starting Medicine B as maintenance therapy.',
  },
  {
    id: 'med_001',
    name: 'Medicine A',
    status: 'STOPPED',
    indication: 'Former asthma controller',
    start_date: '2026-01-15',
    end_date: '2026-08-10',
    source: 'PATIENT_REPORTED',
    last_updated: '2026-08-10',
    evidence: 'Interaction 002: Patient confirmed stopping Medicine A approximately one month prior.',
  },
];

export const DEMO_ALLERGIES: Allergy[] = [
  {
    id: 'alg_001',
    allergen: 'Penicillin',
    reaction: 'Hives, cutaneous rash, mild bronchospasm',
    severity: 'High',
    status: 'disputed',
    reported_date: '2026-03-12',
    source: 'PATIENT_REPORTED',
    has_conflict: true,
    evidence: 'Interaction 001: Patient reported severe penicillin allergy during initial clinical intake.',
  },
];

export const DEMO_SYMPTOMS: Symptom[] = [
  {
    id: 'sym_001',
    description: 'Occasional morning shortness of breath',
    status: 'resolved',
    reported_date: '2026-08-12',
    source: 'PATIENT_REPORTED',
    evidence: 'Interaction 002: Resolved after transition to Medicine B inhaler.',
  },
  {
    id: 'sym_002',
    description: 'Mild transient dry cough during seasonal pollen peak',
    status: 'temporary',
    reported_date: '2026-09-05',
    source: 'PATIENT_REPORTED',
    evidence: 'Interaction 003: Self-limiting, resolved within 5 days.',
  },
];

export const DEMO_CONFLICTS: ConflictRecord[] = [
  {
    id: 'conf_001',
    patient_id: 'P001',
    conflict_type: 'Allergy Contradiction',
    description: 'Contradiction between recorded Penicillin allergy and subsequent denial during routine screening.',
    record_a_summary: 'Documented Penicillin allergy with high severity reaction (hives & bronchospasm).',
    record_a_source: 'Initial Clinical Intake (Interaction 001)',
    record_a_date: '2026-03-12',
    record_b_summary: "Patient stated: 'I have no known drug allergies' during routine update.",
    record_b_source: 'Follow-up Screening (Interaction 004)',
    record_b_date: '2026-09-20',
    status: 'unresolved',
    action_required: 'Human clinical verification required before administering or prescribing beta-lactam antibiotics.',
  },
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl_005',
    date: '2026-09-20',
    formatted_date: 'Sep 20, 2026',
    title: 'Potential Allergy Conflict Detected',
    description: "Patient stated 'No known drug allergies' contradicting earlier documented Penicillin allergy.",
    category: 'conflict',
    status: 'CONFLICTED',
    evidence_ref: 'Interaction 004',
  },
  {
    id: 'tl_004',
    date: '2026-08-15',
    formatted_date: 'Aug 15, 2026',
    title: 'Medicine B Started',
    description: 'Initiated daily maintenance inhaler (2 puffs daily) as replacement therapy.',
    category: 'medication',
    status: 'CURRENT',
    evidence_ref: 'Interaction 002',
  },
  {
    id: 'tl_003',
    date: '2026-08-10',
    formatted_date: 'Aug 10, 2026',
    title: 'Medicine A Discontinued',
    description: 'Patient discontinued Medicine A due to mild tremors and plateaued symptom control.',
    category: 'medication',
    status: 'STOPPED',
    evidence_ref: 'Interaction 002',
  },
  {
    id: 'tl_002',
    date: '2026-03-12',
    formatted_date: 'Mar 12, 2026',
    title: 'Penicillin Allergy Reported',
    description: 'Documented high-severity adverse reaction involving hives and mild wheezing.',
    category: 'allergy',
    status: 'CURRENT',
    evidence_ref: 'Interaction 001',
  },
  {
    id: 'tl_001',
    date: '2026-01-15',
    formatted_date: 'Jan 15, 2026',
    title: 'Medicine A Initiated',
    description: 'Started as initial daily asthma controller for symptom regulation.',
    category: 'medication',
    status: 'HISTORICAL',
    evidence_ref: 'Interaction 001',
  },
];

export const DEMO_MEMORIES: MemoryItem[] = [
  {
    id: 'mem_001',
    text: 'Patient currently takes Medicine B (2 puffs daily) as active maintenance inhaler for asthma.',
    category: 'medication',
    temporal_status: 'CURRENT',
    source: 'PATIENT_REPORTED',
    occurred_start: '2026-08-15',
    mentioned_at: '2026-08-15T10:30:00Z',
    document_id: 'interaction_002',
    tags: ['medication', 'current', 'asthma'],
    score: 0.98,
  },
  {
    id: 'mem_002',
    text: 'Medicine A was stopped in August 2026 and should not be treated as an active medication.',
    category: 'medication',
    temporal_status: 'STOPPED',
    source: 'PATIENT_REPORTED',
    occurred_start: '2026-01-15',
    occurred_end: '2026-08-10',
    mentioned_at: '2026-08-15T10:30:00Z',
    document_id: 'interaction_002',
    tags: ['medication', 'stopped', 'historical'],
    score: 0.95,
  },
  {
    id: 'mem_003',
    text: 'Documented Penicillin allergy with hives and wheezing; conflicts with subsequent denial in Sep 2026.',
    category: 'allergy',
    temporal_status: 'CONFLICTED',
    source: 'PATIENT_REPORTED',
    occurred_start: '2026-03-12',
    mentioned_at: '2026-09-20T14:15:00Z',
    document_id: 'interaction_004',
    tags: ['allergy', 'penicillin', 'conflict'],
    score: 0.96,
  },
  {
    id: 'mem_004',
    text: 'Morning shortness of breath reported in August 2026 resolved after switching to Medicine B.',
    category: 'symptom',
    temporal_status: 'HISTORICAL',
    source: 'PATIENT_REPORTED',
    occurred_start: '2026-08-12',
    occurred_end: '2026-08-25',
    mentioned_at: '2026-08-15T10:30:00Z',
    document_id: 'interaction_002',
    tags: ['symptom', 'asthma', 'resolved'],
    score: 0.88,
  },
];
