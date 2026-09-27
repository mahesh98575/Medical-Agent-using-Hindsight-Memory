"""
Clinical REST API routes for Healthcare Memory Assistant.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.memory.hindsight_service import hindsight_service
from backend.app.agents.memory_agent import healthcare_agent
from backend.app.models.clinical import (
    PatientModel,
    MedicationModel,
    AllergyModel,
    SymptomModel,
    ConflictModel,
    TimelineEventModel,
    EvidenceModel,
)
from backend.app.schemas.clinical import (
    PatientCreate,
    PatientResponse,
    MedicationResponse,
    AllergyResponse,
    SymptomResponse,
    ConflictResponse,
    TimelineEventResponse,
    EvidenceResponse,
    MemoryCreateRequest,
    MemoryResponse,
    ChatRequest,
    ChatResponse,
)

router = APIRouter(prefix="", tags=["Clinical"])


# 1. Patients
@router.get("/patients", response_model=List[PatientResponse])
async def list_patients(db: AsyncSession = Depends(get_db)):
    """List all synthetic patient profiles."""
    res = await db.execute(select(PatientModel).order_by(PatientModel.id))
    return res.scalars().all()


@router.post("/patients", response_model=PatientResponse, status_code=201)
async def create_patient(data: PatientCreate, db: AsyncSession = Depends(get_db)):
    """Create a new synthetic patient profile."""
    existing = await db.execute(select(PatientModel).filter_by(id=data.id))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=400, detail=f"Patient ID {data.id} already exists")

    new_patient = PatientModel(
        id=data.id,
        synthetic_label=data.synthetic_label,
        age=data.age,
        gender=data.gender,
        primary_condition=data.primary_condition,
        blood_type=data.blood_type,
        is_synthetic=True,
    )
    db.add(new_patient)

    # Add any initial medications provided
    for idx, med_name in enumerate(data.medications or []):
        db.add(
            MedicationModel(
                id=f"med_{data.id}_{idx+1}",
                patient_id=data.id,
                name=med_name,
                status="CURRENT",
                source="PATIENT_REPORTED",
                indication="Initial intake",
            )
        )

    # Add any initial allergies provided
    for idx, alg_name in enumerate(data.allergies or []):
        db.add(
            AllergyModel(
                id=f"alg_{data.id}_{idx+1}",
                patient_id=data.id,
                allergen=alg_name,
                severity="High",
                status="active",
                source="PATIENT_REPORTED",
            )
        )

    # Add any initial symptoms provided
    for idx, sym_desc in enumerate(data.symptoms or []):
        db.add(
            SymptomModel(
                id=f"sym_{data.id}_{idx+1}",
                patient_id=data.id,
                description=sym_desc,
                status="active",
                source="PATIENT_REPORTED",
            )
        )

    await db.commit()
    await db.refresh(new_patient)
    return new_patient


@router.get("/patients/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve patient demographic and summary details."""
    res = await db.execute(select(PatientModel).filter_by(id=patient_id))
    patient = res.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


# 2. Medications
@router.get("/patients/{patient_id}/medications", response_model=List[MedicationResponse])
async def get_medications(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve all current and historical medications for a patient."""
    res = await db.execute(
        select(MedicationModel).filter_by(patient_id=patient_id).order_by(MedicationModel.status)
    )
    return res.scalars().all()


# 3. Allergies
@router.get("/patients/{patient_id}/allergies", response_model=List[AllergyResponse])
async def get_allergies(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve all documented allergies and potential contradictions."""
    res = await db.execute(
        select(AllergyModel).filter_by(patient_id=patient_id)
    )
    return res.scalars().all()


# 4. Symptoms
@router.get("/patients/{patient_id}/symptoms", response_model=List[SymptomResponse])
async def get_symptoms(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve symptom complaint records for a patient."""
    res = await db.execute(
        select(SymptomModel).filter_by(patient_id=patient_id)
    )
    return res.scalars().all()


# 5. Conflicts
@router.get("/patients/{patient_id}/conflicts", response_model=List[ConflictResponse])
async def get_conflicts(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve unresolved or clinician-verified conflicts."""
    res = await db.execute(
        select(ConflictModel).filter_by(patient_id=patient_id)
    )
    return res.scalars().all()


# 6. Timeline
@router.get("/patients/{patient_id}/timeline", response_model=List[TimelineEventResponse])
async def get_timeline(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve chronological medical event evolution."""
    res = await db.execute(
        select(TimelineEventModel).filter_by(patient_id=patient_id).order_by(TimelineEventModel.date.desc())
    )
    return res.scalars().all()


# 7. Evidence
@router.get("/patients/{patient_id}/evidence", response_model=List[EvidenceResponse])
async def get_evidence(patient_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve traceable evidence citations for remembered facts."""
    res = await db.execute(
        select(EvidenceModel).filter_by(patient_id=patient_id)
    )
    return res.scalars().all()


# 8. Hindsight Memories
@router.get("/patients/{patient_id}/memories", response_model=List[MemoryResponse])
async def get_memories(
    patient_id: str,
    query: Optional[str] = Query(default="", description="Search query for memory recall"),
):
    """Retrieve persistent episodic facts from patient's Hindsight memory bank."""
    return await hindsight_service.recall_memories(
        patient_id=patient_id,
        query=query or "general medical facts",
    )


@router.post("/patients/{patient_id}/memories", response_model=MemoryResponse, status_code=201)
async def create_memory(patient_id: str, request: MemoryCreateRequest):
    """Retain a new episodic clinical fact in Hindsight memory."""
    return await hindsight_service.retain_memory(patient_id, request)


# 9. Healthcare Memory Agent Chat
@router.post("/patients/{patient_id}/chat", response_model=ChatResponse)
async def chat_with_agent(
    patient_id: str,
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """Orchestrate turn with Healthcare Memory Agent."""
    return await healthcare_agent.process_turn(
        patient_id=patient_id,
        user_message=request.message,
        db_session=db,
    )


# 10. Load Demo Data Endpoint
@router.post("/demo/load", response_model=PatientResponse)
async def load_demo_patient(db: AsyncSession = Depends(get_db)):
    """Reset or ensure Demo Patient 001 is primed and loaded."""
    from backend.app.database.seed import seed_initial_data
    await seed_initial_data(db)
    hindsight_service.seed_demo_memories("P001")
    res = await db.execute(select(PatientModel).filter_by(id="P001"))
    return res.scalar_one()


# 11. Search
@router.get("/search")
async def global_search(
    q: str = Query(..., min_length=1),
    patient_id: str = Query(default="P001"),
    db: AsyncSession = Depends(get_db),
):
    """Search across patients, medications, allergies, memories, and conflicts."""
    q_term = f"%{q.lower()}%"
    results = []

    # Search medications
    meds_res = await db.execute(
        select(MedicationModel).filter(
            MedicationModel.patient_id == patient_id,
            MedicationModel.name.ilike(q_term)
        )
    )
    for m in meds_res.scalars().all():
        results.append({
            "id": m.id,
            "title": m.name,
            "subtitle": f"Medication • {m.status} ({m.indication or 'Active therapy'})",
            "category": "medications",
            "status": m.status,
            "targetSection": "medications",
        })

    # Search allergies
    alg_res = await db.execute(
        select(AllergyModel).filter(
            AllergyModel.patient_id == patient_id,
            AllergyModel.allergen.ilike(q_term)
        )
    )
    for a in alg_res.scalars().all():
        results.append({
            "id": a.id,
            "title": a.allergen,
            "subtitle": f"Allergy • Severity: {a.severity} (Reaction: {a.reaction})",
            "category": "allergies",
            "status": "CONFLICTED" if a.has_conflict else "CURRENT",
            "targetSection": "allergies",
        })

    # Search memories
    mems = await hindsight_service.recall_memories(patient_id, q)
    for mem in mems[:3]:
        results.append({
            "id": mem.id,
            "title": mem.text[:60] + "...",
            "subtitle": f"Memory Bank • {mem.category.upper()} • {mem.temporal_status}",
            "category": "memories",
            "status": mem.temporal_status,
            "targetSection": "memories",
        })

    # Search conflicts
    conf_res = await db.execute(
        select(ConflictModel).filter(
            ConflictModel.patient_id == patient_id,
            ConflictModel.description.ilike(q_term) | ConflictModel.conflict_type.ilike(q_term)
        )
    )
    for c in conf_res.scalars().all():
        results.append({
            "id": c.id,
            "title": c.conflict_type,
            "subtitle": f"Clinical Conflict • {c.description[:60]}...",
            "category": "conflicts",
            "status": "CONFLICTED",
            "targetSection": "conflicts",
        })

    return {"query": q, "results": results}
