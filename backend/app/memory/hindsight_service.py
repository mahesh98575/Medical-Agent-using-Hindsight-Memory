"""
Hindsight Long-Term Memory Integration Service.
Uses official hindsight-client with resilient embedded fallback for offline development.
"""
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from backend.app.core.config import get_settings
from backend.app.schemas.clinical import MemoryResponse, MemoryCreateRequest

logger = logging.getLogger("healthcare_memory.hindsight")
settings = get_settings()

class LocalHindsightMemoryStore:
    """In-memory resilient fallback store mimicking Hindsight memory banks."""

    def __init__(self):
        # banks[bank_id] = list of memory dicts
        self.banks: Dict[str, List[Dict[str, Any]]] = {}

    def retain(
        self,
        bank_id: str,
        content: str,
        category: str = "general",
        temporal_status: str = "CURRENT",
        source: str = "PATIENT_REPORTED",
        occurred_start: Optional[str] = None,
        occurred_end: Optional[str] = None,
        document_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        if bank_id not in self.banks:
            self.banks[bank_id] = []

        mem_id = f"mem_{len(self.banks[bank_id]) + 1:03d}"
        now_iso = datetime.now(timezone.utc).isoformat()

        item = {
            "id": mem_id,
            "patient_id": bank_id.replace("patient_", ""),
            "text": content,
            "category": category,
            "temporal_status": temporal_status,
            "source": source,
            "occurred_start": occurred_start,
            "occurred_end": occurred_end,
            "mentioned_at": now_iso,
            "document_id": document_id or f"interaction_{len(self.banks[bank_id]) + 1:03d}",
            "tags": tags or [category],
            "score": 0.95,
            "evidence_available": True,
        }
        self.banks[bank_id].append(item)
        return item

    def recall(
        self,
        bank_id: str,
        query: str,
        tags: Optional[List[str]] = None,
        max_results: int = 10,
    ) -> List[Dict[str, Any]]:
        if bank_id not in self.banks:
            return []

        memories = self.banks[bank_id]
        results = []
        q_lower = query.lower()

        for m in memories:
            # Multi-strategy scoring (semantic keywords, tags, category match)
            relevance = 0.5
            if any(term in m["text"].lower() for term in q_lower.split()):
                relevance += 0.35
            if tags and any(t in m["tags"] for t in tags):
                relevance += 0.15
            if m["category"].lower() in q_lower:
                relevance += 0.2

            score = min(0.99, relevance)
            item_copy = dict(m)
            item_copy["score"] = round(score, 2)
            results.append(item_copy)

        # Sort by relevance score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:max_results]


class HindsightService:
    """Orchestration service for Hindsight Memory Bank operations."""

    def __init__(self):
        self.local_store = LocalHindsightMemoryStore()
        self.client = None
        self._init_client()

    def _init_client(self):
        try:
            from hindsight_client import Hindsight
            self.client = Hindsight(
                base_url=settings.HINDSIGHT_BASE_URL,
                api_key=settings.HINDSIGHT_API_KEY,
            )
            logger.info("Initialized Hindsight official client at %s", settings.HINDSIGHT_BASE_URL)
        except Exception as e:
            logger.warning("Hindsight client initialization deferred: %s", e)
            self.client = None

    def get_bank_id(self, patient_id: str) -> str:
        return f"patient_{patient_id}"

    async def retain_memory(
        self,
        patient_id: str,
        request: MemoryCreateRequest,
    ) -> MemoryResponse:
        bank_id = self.get_bank_id(patient_id)

        # Try live Hindsight server if client initialized and online
        if self.client:
            try:
                # Official Hindsight retain call
                self.client.retain(
                    bank_id=bank_id,
                    content=request.text,
                    document_id=request.document_id,
                    metadata={"category": request.category, "temporal_status": request.temporal_status},
                    tags=request.tags,
                )
            except Exception as e:
                logger.info("Remote Hindsight retain skipped (operating in resilient local mode): %s", e)

        # Commit to local resilient store
        raw = self.local_store.retain(
            bank_id=bank_id,
            content=request.text,
            category=request.category,
            temporal_status=request.temporal_status,
            source=request.source,
            occurred_start=request.occurred_start,
            occurred_end=request.occurred_end,
            document_id=request.document_id,
            tags=request.tags,
        )
        return MemoryResponse(**raw)

    async def recall_memories(
        self,
        patient_id: str,
        query: str,
        tags: Optional[List[str]] = None,
        max_tokens: int = 2048,
    ) -> List[MemoryResponse]:
        bank_id = self.get_bank_id(patient_id)

        # Try live Hindsight server if client initialized and online
        if self.client:
            try:
                # Official Hindsight recall call
                resp = self.client.recall(
                    bank_id=bank_id,
                    query=query,
                    tags=tags,
                    max_tokens=max_tokens,
                )
                if resp and hasattr(resp, "results") and resp.results:
                    return [
                        MemoryResponse(
                            id=r.id,
                            patient_id=patient_id,
                            text=r.text,
                            category=(r.tags[0] if r.tags else "general"),
                            temporal_status="CURRENT",
                            source="PATIENT_REPORTED",
                            occurred_start=r.occurred_start,
                            occurred_end=r.occurred_end,
                            mentioned_at=r.mentioned_at,
                            document_id=r.document_id,
                            tags=r.tags or [],
                            score=0.96,
                            evidence_available=True,
                        )
                        for r in resp.results
                    ]
            except Exception as e:
                logger.info("Remote Hindsight recall skipped (operating in resilient local mode): %s", e)

        # Resilient local retrieval
        raw_items = self.local_store.recall(bank_id=bank_id, query=query, tags=tags)
        return [MemoryResponse(**item) for item in raw_items]

    def seed_demo_memories(self, patient_id: str = "P001"):
        """Seed baseline memories for Demo Patient 001."""
        bank_id = self.get_bank_id(patient_id)
        if bank_id in self.local_store.banks and len(self.local_store.banks[bank_id]) > 0:
            return

        demo_items = [
            {
                "content": "Patient currently takes Medicine B (2 puffs daily) as active maintenance inhaler for asthma.",
                "category": "medication",
                "temporal_status": "CURRENT",
                "source": "PATIENT_REPORTED",
                "occurred_start": "2026-08-15",
                "document_id": "interaction_002",
                "tags": ["medication", "current", "asthma"],
            },
            {
                "content": "Medicine A was stopped in August 2026 and should not be treated as an active medication.",
                "category": "medication",
                "temporal_status": "STOPPED",
                "source": "PATIENT_REPORTED",
                "occurred_start": "2026-01-15",
                "occurred_end": "2026-08-10",
                "document_id": "interaction_002",
                "tags": ["medication", "stopped", "historical"],
            },
            {
                "content": "Documented Penicillin allergy with hives and wheezing; conflicts with subsequent denial in Sep 2026.",
                "category": "allergy",
                "temporal_status": "CONFLICTED",
                "source": "PATIENT_REPORTED",
                "occurred_start": "2026-03-12",
                "document_id": "interaction_004",
                "tags": ["allergy", "penicillin", "conflict"],
            },
            {
                "content": "Morning shortness of breath reported in August 2026 resolved after switching to Medicine B.",
                "category": "symptom",
                "temporal_status": "HISTORICAL",
                "source": "PATIENT_REPORTED",
                "occurred_start": "2026-08-12",
                "occurred_end": "2026-08-25",
                "document_id": "interaction_002",
                "tags": ["symptom", "asthma", "resolved"],
            },
        ]
        for it in demo_items:
            self.local_store.retain(
                bank_id=bank_id,
                content=it["content"],
                category=it["category"],
                temporal_status=it["temporal_status"],
                source=it["source"],
                occurred_start=it.get("occurred_start"),
                occurred_end=it.get("occurred_end"),
                document_id=it.get("document_id"),
                tags=it.get("tags"),
            )

# Global singleton service
hindsight_service = HindsightService()
# Seed P001 by default
hindsight_service.seed_demo_memories("P001")
