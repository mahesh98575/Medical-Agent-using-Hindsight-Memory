"""
Pydantic schemas for clinical and memory REST endpoints.
"""
from typing import List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict

class PatientCreate(BaseModel):
    id: str = Field(..., description="Unique Patient ID (e.g. P001)")
    synthetic_label: str = Field(..., description="Display name or label")
    age: int = Field(..., ge=0, le=130)
    gender: Optional[str] = None
    primary_condition: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[List[str]] = Field(default_factory=list)
    medications: Optional[List[str]] = Field(default_factory=list)
    symptoms: Optional[List[str]] = Field(default_factory=list)
    medical_history: Optional[str] = None

class PatientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    synthetic_label: str
    age: int
    gender: Optional[str] = None
    primary_condition: Optional[str] = None
    blood_type: Optional[str] = None
    is_synthetic: bool = True
    created_at: Optional[Any] = None

class MedicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    name: str
    status: str  # CURRENT, STOPPED, HISTORICAL
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    indication: Optional[str] = None
    source: str = "PATIENT_REPORTED"
    last_updated: Optional[str] = None
    evidence: Optional[str] = None

class AllergyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    allergen: str
    reaction: Optional[str] = None
    severity: str = "High"
    status: str = "active"
    reported_date: Optional[str] = None
    source: str = "PATIENT_REPORTED"
    has_conflict: bool = False
    evidence: Optional[str] = None

class SymptomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    description: str
    status: str = "active"
    reported_date: Optional[str] = None
    source: str = "PATIENT_REPORTED"
    evidence: Optional[str] = None

class ConflictResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    conflict_type: str
    description: str
    record_a_summary: str
    record_a_source: str
    record_a_date: Optional[str] = None
    record_b_summary: str
    record_b_source: str
    record_b_date: Optional[str] = None
    status: str = "unresolved"
    action_required: str
    evidence_ref_a: Optional[str] = None
    evidence_ref_b: Optional[str] = None

class TimelineEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    date: str
    formatted_date: str
    title: str
    description: str
    category: str
    status: str
    evidence_ref: Optional[str] = None

class EvidenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    interaction_id: str
    memory_id: Optional[str] = None
    fact_type: str
    description: str
    original_statement: Optional[str] = None
    source: str = "PATIENT_REPORTED"
    timestamp: Optional[str] = None

class MemoryCreateRequest(BaseModel):
    text: str = Field(..., description="Fact or memory content to retain")
    category: str = Field(default="general", description="medication, allergy, symptom, condition, recommendation")
    temporal_status: str = Field(default="CURRENT", description="CURRENT, STOPPED, HISTORICAL, TEMPORARY")
    source: str = Field(default="PATIENT_REPORTED")
    occurred_start: Optional[str] = None
    occurred_end: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    document_id: Optional[str] = None

class MemoryResponse(BaseModel):
    id: str
    patient_id: str
    text: str
    category: str
    temporal_status: str
    source: str
    occurred_start: Optional[str] = None
    occurred_end: Optional[str] = None
    mentioned_at: Optional[str] = None
    document_id: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    score: Optional[float] = 1.0
    evidence_available: bool = True

class ChatRequest(BaseModel):
    message: str = Field(..., description="User or clinician message/query")

class ChatResponse(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    timestamp: str
    memories_recalled: List[MemoryResponse] = Field(default_factory=list)
    conflicts_detected: List[ConflictResponse] = Field(default_factory=list)
    evidence_citations: List[EvidenceResponse] = Field(default_factory=list)
    safety_notice: str = "For healthcare decision-support only. Not an autonomous clinical diagnosis or prescription system."
