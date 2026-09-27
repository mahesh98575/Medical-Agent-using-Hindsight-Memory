"""
Deterministic synthetic database seed data for Demo Patient 001.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.clinical import (
    PatientModel,
    MedicationModel,
    AllergyModel,
    SymptomModel,
    ConflictModel,
    TimelineEventModel,
    EvidenceModel,
)

async def seed_initial_data(session: AsyncSession):
    """Seed Demo Patient 001 and clinical history if database is fresh."""
    existing = await session.execute(select(PatientModel).filter_by(id="P001"))
    if existing.scalar_one_or_none() is not None:
        return

    # 1. Patient P001
    patient = PatientModel(
        id="P001",
        synthetic_label="Demo Patient 001 (Synthetic Profile)",
        age=45,
        gender="Female",
        primary_condition="Mild Persistent Asthma",
        blood_type="A+",
        is_synthetic=True,
    )
    session.add(patient)

    # 2. Medications
    med_b = MedicationModel(
        id="med_002",
        patient_id="P001",
        name="Medicine B",
        status="CURRENT",
        start_date="2026-08-15",
        end_date=None,
        indication="Asthma maintenance inhaler (Daily 2 puffs)",
        source="PATIENT_REPORTED",
        last_updated="2026-08-15",
        evidence="Interaction 002: Patient reported starting Medicine B as maintenance therapy.",
    )
    med_a = MedicationModel(
        id="med_001",
        patient_id="P001",
        name="Medicine A",
        status="STOPPED",
        start_date="2026-01-15",
        end_date="2026-08-10",
        indication="Former asthma controller",
        source="PATIENT_REPORTED",
        last_updated="2026-08-10",
        evidence="Interaction 002: Patient confirmed stopping Medicine A approximately one month prior.",
    )
    session.add_all([med_b, med_a])

    # 3. Allergies
    allergy = AllergyModel(
        id="alg_001",
        patient_id="P001",
        allergen="Penicillin",
        reaction="Hives, cutaneous rash, mild bronchospasm",
        severity="High",
        status="disputed",
        reported_date="2026-03-12",
        source="PATIENT_REPORTED",
        has_conflict=True,
        evidence="Interaction 001: Patient reported severe penicillin allergy during initial clinical intake.",
    )
    session.add(allergy)

    # 4. Symptoms
    sym_1 = SymptomModel(
        id="sym_001",
        patient_id="P001",
        description="Occasional morning shortness of breath",
        status="resolved",
        reported_date="2026-08-12",
        source="PATIENT_REPORTED",
        evidence="Interaction 002: Resolved after transition to Medicine B inhaler.",
    )
    sym_2 = SymptomModel(
        id="sym_002",
        patient_id="P001",
        description="Mild transient dry cough during seasonal pollen peak",
        status="temporary",
        reported_date="2026-09-05",
        source="PATIENT_REPORTED",
        evidence="Interaction 003: Self-limiting, resolved within 5 days.",
    )
    session.add_all([sym_1, sym_2])

    # 5. Conflicts
    conflict = ConflictModel(
        id="conf_001",
        patient_id="P001",
        conflict_type="Allergy Contradiction",
        description="Contradiction between recorded Penicillin allergy and subsequent denial during routine screening.",
        record_a_summary="Documented Penicillin allergy with high severity reaction (hives & bronchospasm).",
        record_a_source="Initial Clinical Intake (Interaction 001)",
        record_a_date="2026-03-12",
        record_b_summary="Patient stated: 'I have no known drug allergies' during routine update.",
        record_b_source="Follow-up Screening (Interaction 004)",
        record_b_date="2026-09-20",
        status="unresolved",
        action_required="Human clinical verification required before administering or prescribing beta-lactam antibiotics.",
        evidence_ref_a="Interaction 001",
        evidence_ref_b="Interaction 004",
    )
    session.add(conflict)

    # 6. Timeline Events
    timeline_events = [
        TimelineEventModel(
            id="tl_005",
            patient_id="P001",
            date="2026-09-20",
            formatted_date="Sep 20, 2026",
            title="Potential Allergy Conflict Detected",
            description="Patient stated 'No known drug allergies' contradicting earlier documented Penicillin allergy.",
            category="conflict",
            status="CONFLICTED",
            evidence_ref="Interaction 004",
        ),
        TimelineEventModel(
            id="tl_004",
            patient_id="P001",
            date="2026-08-15",
            formatted_date="Aug 15, 2026",
            title="Medicine B Started",
            description="Initiated daily maintenance inhaler (2 puffs daily) as replacement therapy.",
            category="medication",
            status="CURRENT",
            evidence_ref="Interaction 002",
        ),
        TimelineEventModel(
            id="tl_003",
            patient_id="P001",
            date="2026-08-10",
            formatted_date="Aug 10, 2026",
            title="Medicine A Discontinued",
            description="Patient discontinued Medicine A due to mild tremors and plateaued symptom control.",
            category="medication",
            status="STOPPED",
            evidence_ref="Interaction 002",
        ),
        TimelineEventModel(
            id="tl_002",
            patient_id="P001",
            date="2026-03-12",
            formatted_date="Mar 12, 2026",
            title="Penicillin Allergy Reported",
            description="Documented high-severity adverse reaction involving hives and mild wheezing.",
            category="allergy",
            status="CURRENT",
            evidence_ref="Interaction 001",
        ),
        TimelineEventModel(
            id="tl_001",
            patient_id="P001",
            date="2026-01-15",
            formatted_date="Jan 15, 2026",
            title="Medicine A Initiated",
            description="Started as initial daily asthma controller for symptom regulation.",
            category="medication",
            status="HISTORICAL",
            evidence_ref="Interaction 001",
        ),
    ]
    session.add_all(timeline_events)

    # 7. Evidence Records
    evidence_records = [
        EvidenceModel(
            id="evi_001",
            patient_id="P001",
            interaction_id="Interaction 001",
            memory_id="mem_003",
            fact_type="Allergy Documentation",
            description="Severe penicillin reaction (hives & bronchospasm).",
            original_statement="I am allergic to penicillin. It gives me hives and trouble breathing.",
            source="PATIENT_REPORTED",
            timestamp="2026-03-12T10:15:00Z",
        ),
        EvidenceModel(
            id="evi_002",
            patient_id="P001",
            interaction_id="Interaction 002",
            memory_id="mem_002",
            fact_type="Medication Discontinuation",
            description="Discontinued Medicine A due to mild tremors.",
            original_statement="I stopped taking Medicine A last month because my hands were shaking.",
            source="PATIENT_REPORTED",
            timestamp="2026-08-15T11:30:00Z",
        ),
        EvidenceModel(
            id="evi_003",
            patient_id="P001",
            interaction_id="Interaction 002",
            memory_id="mem_001",
            fact_type="Medication Initiation",
            description="Started Medicine B daily maintenance inhaler.",
            original_statement="I started Medicine B, 2 puffs daily, and it feels much better.",
            source="PATIENT_REPORTED",
            timestamp="2026-08-15T11:32:00Z",
        ),
        EvidenceModel(
            id="evi_004",
            patient_id="P001",
            interaction_id="Interaction 004",
            memory_id="mem_003",
            fact_type="Contradictory Statement",
            description="Denial of any drug allergies during routine screening.",
            original_statement="I have no known drug allergies.",
            source="PATIENT_REPORTED",
            timestamp="2026-09-20T14:15:00Z",
        ),
    ]
    session.add_all(evidence_records)

    await session.commit()
