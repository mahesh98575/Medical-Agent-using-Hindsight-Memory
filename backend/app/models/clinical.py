"""
SQLAlchemy models for structured healthcare application state.
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

def utc_now():
    return datetime.now(timezone.utc)

class PatientModel(Base):
    __tablename__ = "patients"

    id = Column(String(64), primary_key=True, index=True)
    synthetic_label = Column(String(128), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(32), nullable=True)
    primary_condition = Column(String(255), nullable=True)
    blood_type = Column(String(16), nullable=True)
    is_synthetic = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    medications = relationship("MedicationModel", back_populates="patient", cascade="all, delete-orphan")
    allergies = relationship("AllergyModel", back_populates="patient", cascade="all, delete-orphan")
    symptoms = relationship("SymptomModel", back_populates="patient", cascade="all, delete-orphan")
    conflicts = relationship("ConflictModel", back_populates="patient", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEventModel", back_populates="patient", cascade="all, delete-orphan")
    evidence_records = relationship("EvidenceModel", back_populates="patient", cascade="all, delete-orphan")

class MedicationModel(Base):
    __tablename__ = "medications"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False)  # CURRENT, STOPPED, HISTORICAL
    start_date = Column(String(32), nullable=True)
    end_date = Column(String(32), nullable=True)
    indication = Column(String(255), nullable=True)
    source = Column(String(64), default="PATIENT_REPORTED")
    last_updated = Column(String(64), nullable=True)
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("PatientModel", back_populates="medications")

class AllergyModel(Base):
    __tablename__ = "allergies"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    allergen = Column(String(128), nullable=False)
    reaction = Column(String(255), nullable=True)
    severity = Column(String(32), default="High")
    status = Column(String(32), default="active")  # active, disputed, resolved
    reported_date = Column(String(32), nullable=True)
    source = Column(String(64), default="PATIENT_REPORTED")
    has_conflict = Column(Boolean, default=False)
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("PatientModel", back_populates="allergies")

class SymptomModel(Base):
    __tablename__ = "symptoms"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    description = Column(String(255), nullable=False)
    status = Column(String(32), default="active")  # active, resolved, temporary
    reported_date = Column(String(32), nullable=True)
    source = Column(String(64), default="PATIENT_REPORTED")
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("PatientModel", back_populates="symptoms")

class ConflictModel(Base):
    __tablename__ = "conflicts"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    conflict_type = Column(String(64), nullable=False)
    description = Column(Text, nullable=False)
    record_a_summary = Column(Text, nullable=False)
    record_a_source = Column(String(128), nullable=False)
    record_a_date = Column(String(32), nullable=True)
    record_b_summary = Column(Text, nullable=False)
    record_b_source = Column(String(128), nullable=False)
    record_b_date = Column(String(32), nullable=True)
    status = Column(String(32), default="unresolved")  # unresolved, clinician_verified
    action_required = Column(Text, nullable=False)
    evidence_ref_a = Column(String(64), nullable=True)
    evidence_ref_b = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("PatientModel", back_populates="conflicts")

class TimelineEventModel(Base):
    __tablename__ = "timeline_events"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String(32), nullable=False)
    formatted_date = Column(String(32), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(64), nullable=False)  # medication, allergy, symptom, conflict, recommendation
    status = Column(String(32), nullable=False)
    evidence_ref = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("PatientModel", back_populates="timeline_events")

class EvidenceModel(Base):
    __tablename__ = "evidence"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    interaction_id = Column(String(64), nullable=False)
    memory_id = Column(String(64), nullable=True)
    fact_type = Column(String(64), nullable=False)
    description = Column(Text, nullable=False)
    original_statement = Column(Text, nullable=True)
    source = Column(String(64), default="PATIENT_REPORTED")
    timestamp = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("PatientModel", back_populates="evidence_records")
