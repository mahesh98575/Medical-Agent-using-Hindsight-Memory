# System Architecture

## 1. High-Level Architecture Overview

The **Healthcare Memory Assistant** architecture is designed to guarantee high availability, strict patient safety, and time-aware persistent memory.

```
                    +------------------------------------+
                    |       USER / CLINICIAN UI          |
                    |   Next.js 15 + React 19 + Tailwind |
                    +-----------------+------------------+
                                      |
                           HTTPS REST API (JSON)
                                      |
                    +-----------------v------------------+
                    |           FASTAPI BACKEND          |
                    |    (Validation, Routing, Auth)     |
                    +-----------------+------------------+
                                      |
                    +-----------------v------------------+
                    |             AGENT CORE             |
                    |                                    |
                    |  1. Intent Analysis                |
                    |  2. Targeted Memory Recall         |
                    |  3. Temporal Reasoning Engine      |
                    |  4. Conflict Detection Engine      |
                    |  5. Safety & Clinical Boundary     |
                    |  6. Memory Fact Extraction         |
                    |  7. Memory Retention               |
                    +--------+------------------+--------+
                             |                  |
           +-----------------+                  +-----------------+
           |                                                      |
+----------v-----------+                               +----------v-----------+
| POSTGRESQL DATABASE  |                               |   HINDSIGHT ENGINE   |
| (Structured State)   |                               |  (Episodic Memory)   |
|                      |                               |                      |
| - Patients           |                               | - Bank per Patient   |
| - Conversations      |                               | - Multi-strategy     |
| - Interactions       |                               |   (TEMPR) Recall     |
| - Active Conflicts   |                               | - Temporal Fact      |
| - Evidence Links     |                               |   Retention          |
| - Audit Logs         |                               | - Source Metadata    |
+----------------------+                               +----------------------+
```

---

## 2. Component Responsibilities

### Frontend Layer (Next.js)
* **Framework:** Next.js 15 App Router with React 19 and Tailwind CSS.
* **Role:** Delivers a clinician-grade UI including real-time conversation streaming, interactive timelines, active medication reviews, allergy warnings, conflict verification modals, and a live memory inspection drawer.
* **Security:** Never holds LLM or database credentials; all interactions proxy through the backend REST API.

### Backend Layer (FastAPI)
* **Framework:** Python 3.13 + FastAPI + Pydantic v2.
* **Role:** Request validation, authentication, orchestration of agent pipeline, error handling, database session lifecycle, and unified response formatting.

### Agent Core
* Orchestrates memory retrieval, temporal reasoning, conflict cross-checking, response generation, and structured memory retention.
* Ensures answers are strictly grounded in retrieved evidence.

### Dual-Persistence Subsystems
* **PostgreSQL:** Manages relational entities, patient profiles, session records, conflict resolutions, and evidence links.
* **Hindsight Memory Engine:** Manages episodic, time-anchored clinical facts per patient using multi-strategy search.

---

## 3. Data & Execution Flow

```
User Input (Message + Patient ID)
    │
    ▼
FastAPI Route Handler (/api/chat)
    │
    ▼
Intent Analyzer & Query Extractor
    │
    ▼
Hindsight RECALL (Targeted by Bank & Tags)
    │
    ▼
Temporal Reasoner (Assigns CURRENT / HISTORICAL / TEMPORARY)
    │
    ▼
Conflict Detector (Flags Contradictions with Recalled History)
    │
    ▼
Safety Guardrail Check (Enforces Non-Diagnostic / Non-Prescriptive Policy)
    │
    ▼
LLM Response Synthesizer (Generates Evidence-Grounded Answer)
    │
    ▼
Fact Extractor (Pulls New Clinical Entities from Current Turn)
    │
    ▼
Hindsight RETAIN (Indexes Facts with Temporal Anchors & Source)
    │
    ▼
PostgreSQL Persistence (Stores Turn & Evidence Anchors)
    │
    ▼
Response to Frontend
```
