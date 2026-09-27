# Medical Safety Boundaries & Conflict Policy

## 1. Safety Guardrails & Non-Negotiable Boundaries

The **Healthcare Memory Assistant** is strictly an informational memory, tracking, and clinical decision-support tool. It is engineered with robust guardrails to prevent unsafe autonomous behaviors.

### Prohibited Operations
* ❌ **Disease Diagnosis:** The system must NEVER formulate autonomous diagnoses based on patient symptoms.
* ❌ **Prescription & Dosage Advice:** The system must NEVER advise on initiating, adjusting, or tapering medication dosages.
* ❌ **Emergency Triage:** The system must NEVER handle acute life-threatening situations; emergency disclaimers are immediately presented.
* ❌ **Fabrication of Evidence:** The system must NEVER invent clinical records, dates, or physician instructions.

---

## 2. Uncertainty & Verification Handling

When evidence is missing, incomplete, or ambiguous:
* The system responds with explicit boundaries:
  > *"Insufficient evidence in the available record regarding this symptom."*
* It always recommends that the patient or clinician verify critical details with the treating healthcare team.

---

## 3. Conflict Detection & Resolution Workflow

When a direct contradiction is detected (e.g., historical Penicillin allergy vs. recent intake stating 'No allergies'):
1. **No Silent Overwriting:** The system NEVER overwrites or deletes the older record.
2. **Clinical Flagging:** A record is generated in the PostgreSQL `conflicts` table.
3. **User Alert:** The system surfaces a prominent alert banner in the interface:
   > ⚠️ **Potential Allergy Conflict Detected:** Record 1 states 'Penicillin allergy' (reported 2026-03-12). Record 2 states 'No known drug allergies' (reported 2026-09-27). This discrepancy requires human clinical verification.
4. **Resolution by Clinician Only:** Only a verified clinician can mark a conflict as resolved with explanatory clinical notes.
