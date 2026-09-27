# Memory Design & Hindsight Integration

## 1. What Gets Retained vs Not Retained

The memory engine does not blindly store conversational chatter. It acts as an active clinical fact filter:

### Retained
* **Medications & Status:** Started, discontinued, changed, or paused medications.
* **Allergies & Reactions:** Substances, reaction types, severity, and reporting date.
* **Symptoms & Complaints:** Character, frequency, duration, and whether active or resolved.
* **Diagnoses & Medical Conditions:** Chronic vs acute illnesses.
* **Physician Directives:** Medical recommendations, lifestyle orders, or care instructions.
* **Discrepancies:** Explicit statements conflicting with prior records.

### NOT Retained
* Social greetings and pleasantries (*"Good morning"*, *"Thanks"*, *"How are you"*).
* Ephemeral conversational logistics (*"Can you repeat that?"*, *"Let me check my notes"*).
* Generic medical trivia unrelated to the specific patient's condition.

---

## 2. Hindsight Operations: RETAIN & RECALL

### RETAIN Specification
When new information is identified, the backend invokes Hindsight:
```python
client.retain(
    bank_id=f"patient_{patient_id}",
    content="Patient discontinued Medicine A and initiated Medicine B as a daily maintenance inhaler.",
    timestamp=datetime.now(timezone.utc),
    context="Medication update during follow-up interaction",
    document_id=f"interaction_{interaction_id}",
    metadata={
        "category": "medication",
        "action": "switch",
        "source": "patient_reported",
        "previous_status": "stopped",
        "new_status": "current"
    },
    tags=["medication", "asthma", "inhaler"]
)
```

### RECALL Specification
Before answering user queries, the agent recalls only pertinent facts:
```python
response = client.recall(
    bank_id=f"patient_{patient_id}",
    query="current active medications and allergies",
    tags=["medication", "allergy"],
    budget="mid",
    max_tokens=2048,
    query_timestamp=datetime.now(timezone.utc).isoformat()
)
```

---

## 3. Temporal State Classification

Every recalled memory unit is classified into one of five states:
1. `CURRENT`: Active ongoing treatment or confirmed allergy.
2. `STOPPED / HISTORICAL`: Previously active therapy explicitly ended.
3. `TEMPORARY`: Finite acute condition or transient complaint.
4. `CONFLICTED`: Record under active clinical contradiction.
5. `UNKNOWN / UNVERIFIED`: Ambiguous duration or unverified claim.
