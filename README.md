# Healthcare Memory Assistant

A production-grade, AI-powered healthcare memory and decision-support assistant that maintains structured, persistent, time-aware memory of patient information across multiple interactions and sessions.

---

## Overview

The **Healthcare Memory Assistant** is designed to solve a fundamental challenge in digital health and patient care continuity: **epistemic forgetting and stateless interactions**. Rather than treating patient dialogues as ephemeral text chats, the system acts as an intelligent cognitive partner that extracts, retains, tracks, and recalls clinically critical information—including medications, dosage changes, allergies, symptoms, and doctor recommendations—over time.

---

## Problem

In healthcare interactions, patients often repeat their medical histories, allergy records, and current symptoms across different consultations. As care progresses:
1. **Medications Change:** A patient might stop a drug (*"I stopped Medicine A last month"*) and start a replacement (*"I began taking Medicine B"*). A naive LLM or flat database often confuses historical treatments with current regimens.
2. **Contradictions Arise:** A patient may previously record a life-threatening penicillin allergy, and later casually remark, *"I have no drug allergies."* A standard system might silently overwrite the earlier record or pick one at random.
3. **Temporal Confusion:** Historical events (*"I had a migraine six months ago"*) are frequently misinterpreted by conversational assistants as acute current complaints.
4. **Lack of Evidence:** Standard LLM outputs offer assertions without showing the origin, date, or clinical interaction where the information was introduced.

---

## Solution

The Healthcare Memory Assistant combines a **FastAPI** backend, a **Next.js** interactive clinical workspace, a **PostgreSQL** relational database for application state, and **Hindsight**—an open-source, long-term agent memory engine by Vectorize.io with multi-strategy retrieval (**TEMPR**: semantic, keyword BM25, entity-graph, and temporal indexing).

The assistant:
* **Retains** discrete, time-anchored clinical facts.
* **Recalls** only the relevant memories needed for a specific query.
* **Distinguishes** current medications from stopped/historical therapies.
* **Detects Conflicts** explicitly without overwriting and flags them for human/clinical verification.
* **Provides Evidence & Source Attribution** linking every clinical statement back to specific patient interaction records.
* **Enforces Strict Safety Boundaries**, refusing autonomous diagnosis or prescribing.

---

## Core Features

* **Persistent Episodic Memory:** Long-term memory banks organized per patient, surviving session resets and system reboots.
* **Temporal Intelligence:** Understands status transitions (`CURRENT`, `STOPPED`, `HISTORICAL`, `TEMPORARY`, `UNKNOWN`).
* **Active Conflict Detection:** Detects contradictions between historical records and new patient inputs, surfacing high-visibility clinical alerts.
* **Evidence Traceability:** Every recalled fact references the originating interaction, timestamp, and reporting party.
* **Targeted Memory Retrieval:** Uses token budgets and intent-guided queries to avoid blowing context windows with irrelevant records.
* **Dedicated Medical Safety Layer:** Guards against prescription advice, diagnostic claims, and fabricated evidence.
* **Interactive Healthcare Dashboard:** Complete patient portal featuring timelines, active medication cards, allergy badges, conflict resolution centers, and live memory inspection.

---

## Why Persistent Memory Matters

| Scenario | Without Persistent Memory | With Healthcare Memory Assistant |
| :--- | :--- | :--- |
| **Medication Change** | User: *"I told you earlier I stopped Medicine A."*<br>System: *"I have no record of that."* | User: *"I told you earlier I stopped Medicine A."*<br>System: *"Confirmed. Our records from August 2026 reflect that Medicine A was discontinued, and Medicine B was initiated."* |
| **Allergy Contradiction** | User: *"I have no allergies."*<br>System silently deletes penicillin allergy record. | System retains both records, refuses to guess, and creates an alert: *"⚠️ Potential Allergy Conflict Detected: Penicillin allergy reported on March 12, 2026 vs 'No allergies' stated today. Clinical verification required."* |
| **Historical Symptoms** | Treats a headache from 6 months ago as an acute emergency complaint today. | Classifies the symptom as `HISTORICAL / RESOLVED`, contextualizing ongoing health trends accurately. |

---

## Architecture

The system uses a clean separation of concerns with dual-persistence:

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

## Agent Workflow

For every interaction:
1. **Intent Detection:** Analyzes the prompt to classify purpose (medication query, allergy lookup, status update, clinical history).
2. **Hindsight RECALL:** Queries the patient's private memory bank with semantic and temporal filters.
3. **Temporal Status Evaluation:** Categorizes each recalled fact (e.g. `CURRENT` vs `STOPPED`).
4. **Conflict Check:** Cross-references incoming claims against recalled knowledge. Contradictions trigger PostgreSQL conflict records.
5. **Safety Check:** Validates input and planned response against medical boundaries.
6. **Response Generation:** Formulates an evidence-backed reply citing sources.
7. **Clinical Fact Extraction:** Extracts newly introduced medical entities and dates.
8. **Hindsight RETAIN:** Commits new facts into Hindsight with entity resolution and timestamps.
9. **State Persistence:** Saves interaction history and evidence links to PostgreSQL.

---

## Hindsight Memory

* **SDK:** `hindsight-client` (v0.10.1).
* **Architecture:** Dedicated memory banks (`f"patient_{patient_id}"`).
* **Retrieval Strategies:** Dense vector search, sparse keyword (BM25) matching, graph traversal, and temporal indexing executed in parallel with reranking.
* **Token Budgeting:** Dynamically balances retrieved context against token limits to prevent context bloat.

---

## PostgreSQL Database

PostgreSQL maintains structured application state, relational constraints, and audit trails:
* `patients`: Synthetic patient demographic and condition records.
* `conversations`: Conversation sessions per patient.
* `interactions`: Immutable record of every user and assistant turn.
* `conflicts`: Unresolved and verified clinical discrepancies.
* `evidence`: Relational links between answers, memories, and interactions.

---

## Temporal Memory

Temporal understanding categorizes information into distinct states:
* `CURRENT`: Ongoing treatments or active confirmed conditions.
* `STOPPED / HISTORICAL`: Discontinued therapies or past symptoms.
* `TEMPORARY`: Acute, time-limited conditions (e.g. 5-day antibiotic courses).
* `UNKNOWN / UNVERIFIED`: Statements lacking temporal clarity or clinical confirmation.

---

## Conflict Detection

* Contradictory medical claims are **never silently merged or overwritten**.
* Discrepancies are flagged with `CONFLICTED` status and surfaced with full provenance (both conflicting statements, reporting dates, and sources).
* The agent explicitly advises human clinical review before making decisions.

---

## Evidence and Sources

All factual statements cite provenance:
* **Source Types:** `PATIENT_REPORTED`, `DOCTOR_RECOMMENDATION`, `SYSTEM_GENERATED`, `SYNTHETIC_DEMO_RECORD`.
* **Traceability:** Direct references to interaction IDs, timestamps, and quotes from earlier exchanges.

---

## Safety Boundaries

The system is strictly an information-organization and decision-support assistant:
* ❌ **NO autonomous disease diagnoses**
* ❌ **NO drug or dosage prescriptions**
* ❌ **NO treatment modifications**
* ❌ **NO emergency triage**
* ✅ **Grounded summarization & memory tracking only**
* ✅ **Explicit disclaimers recommending consultation with licensed healthcare professionals**

---

## Technology Stack

* **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** Python 3.13, FastAPI, Pydantic 2, SQLAlchemy 2
* **Database:** PostgreSQL (with asyncpg/psycopg drivers and SQLite dev fallback)
* **Memory Engine:** Hindsight (`hindsight-client` 0.10.1 by Vectorize.io)
* **AI / LLM:** Google Gemini (`gemini-2.5-flash` via `google-genai` SDK)

---

## Project Structure

```
healthcare-memory-assistant/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/             # REST endpoints (health, chat, memory, patients)
│   │   ├── agents/          # Core agent, intent analyzer, orchestrator
│   │   ├── memory/          # Hindsight client, adapter, memory schemas
│   │   ├── llm/             # Gemini client, prompt templates, structured output
│   │   ├── safety/          # Medical safety rules, conflict detection
│   │   ├── services/        # Patient, timeline, medication services
│   │   ├── models/          # SQLAlchemy PostgreSQL models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── database/        # Database session and connection manager
│   │   ├── core/            # Configuration and settings
│   │   └── utils/           # Formatting, date helpers, logging
│   ├── tests/               # Pytest suite
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js App Router (dashboard, chat, timeline)
│   ├── components/          # UI components (cards, badges, memory panels)
│   ├── services/            # API client services
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript interfaces
│   └── lib/                 # Utilities and constants
├── data/
│   └── synthetic_patients/  # Deterministic synthetic test profiles
├── docs/
│   ├── architecture.md
│   ├── memory-design.md
│   ├── database-design.md
│   ├── safety.md
│   └── demo-scenarios.md
├── .env.example
├── .gitignore
└── README.md
```

---

## Setup & Running Locally

### 1. Prerequisites
* Python 3.11+
* Node.js v20+ and npm

### 2. Backend Setup
```bash
# From project root
cd backend
python -m pip install -r requirements.txt

# Start backend server
python -m uvicorn backend.app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend UI will be accessible at: `http://localhost:3000`

---

## Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
* `DATABASE_URL`: PostgreSQL connection string (or set `LOCAL_SQLITE_FALLBACK=true` for local development).
* `GEMINI_API_KEY`: Google Gemini API key.
* `HINDSIGHT_BASE_URL`: Endpoint for Hindsight memory server (default: `http://localhost:8888`).
* `NEXT_PUBLIC_API_URL`: Backend URL for frontend requests (default: `http://localhost:8000`).

---

## Testing

```bash
# Run backend test suite
python -m pytest backend/tests -v

# Run frontend type and lint checks
cd frontend
npm run lint
npm run build
```

---

## Synthetic Data

All clinical data provided in this repository and application is **100% synthetic**. No real patient data is used or stored.

---

## Limitations & Future Roadmap

* **Clinical Boundaries:** Always requires human clinical oversight; not certified as a medical device.
* **Multimodal Records:** Planned support for ingesting scanned lab results and diagnostic images into Hindsight memory blocks.
* **FHIR / HL7 Export:** Planned export adapters to synchronize memories with standard electronic health record (EHR) systems.
