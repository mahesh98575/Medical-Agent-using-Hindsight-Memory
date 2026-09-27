# Database Design

## 1. Dual-Persistence Rationale

In a clinical AI assistant, attempting to force all storage into a single paradigm leads to failure:
* A pure relational database lacks semantic similarity, entity-graph associations, and conversational recall capabilities.
* A pure vector database or memory bank lacks relational integrity, cascading deletes, foreign keys, deterministic queries, and ACID compliance for audit trails.

Therefore, the system uses two distinct, complementary persistence layers:
1. **PostgreSQL:** Application state, patient records, sessions, interaction audits, and conflict tracking.
2. **Hindsight:** Agent episodic memory, temporal indexing, entity extraction, and multi-strategy recall.

---

## 2. PostgreSQL Schema Specification

```sql
-- Patients Table
CREATE TABLE patients (
    id VARCHAR(64) PRIMARY KEY,
    synthetic_label VARCHAR(128) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(32),
    primary_condition VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversations Table
CREATE TABLE conversations (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interactions Table
CREATE TABLE interactions (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conflicts Table
CREATE TABLE conflicts (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    conflict_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    record_a_summary TEXT NOT NULL,
    record_a_source VARCHAR(64) NOT NULL,
    record_a_date TIMESTAMP WITH TIME ZONE,
    record_b_summary TEXT NOT NULL,
    record_b_source VARCHAR(64) NOT NULL,
    record_b_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) NOT NULL DEFAULT 'unresolved',
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Evidence Table
CREATE TABLE evidence (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    interaction_id VARCHAR(64) NOT NULL REFERENCES interactions(id) ON DELETE CASCADE,
    memory_id VARCHAR(128),
    fact_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Storage Division Matrix

| Data Item | Storage Engine | Rationale |
| :--- | :--- | :--- |
| Patient Demographics (ID, Age, Label) | PostgreSQL | Exact relational lookup and privacy scoping |
| Chat Session Audits & Messages | PostgreSQL | Immutable audit logging and compliance |
| Clinical Conflict Status & Resolution | PostgreSQL | Relational workflow management |
| Discrete Clinical Facts & Timeline Events | Hindsight | Multi-strategy search, semantic and temporal recall |
| Inferred Temporal Validity Windows | Hindsight | Dynamic reasoning over start/stop periods |
| Evidence Reference Links | PostgreSQL + Hindsight | Relational pointer backed by memory chunk |
