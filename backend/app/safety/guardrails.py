"""
Medical Safety Guardrails and Conflict Policy Layer.
Enforces non-diagnostic, non-prescriptive boundaries and ensures clinical conflict transparency.
"""
from typing import Tuple, Optional

PROHIBITED_INTENTS = [
    "diagnose",
    "what illness do i have",
    "what disease",
    "prescribe",
    "recommend dosage",
    "how many mg",
    "how much should i take",
    "change my treatment",
    "emergency help",
]

SAFE_REFUSAL_MESSAGE = (
    "I can help organize, track, and summarize your available healthcare information, but I cannot "
    "diagnose medical conditions, prescribe treatments, or recommend medication dosages. "
    "Please consult a qualified healthcare professional or seek immediate emergency care for urgent symptoms."
)

def evaluate_safety_boundaries(user_query: str) -> Tuple[bool, Optional[str]]:
    """
    Evaluate user input against non-negotiable healthcare safety rules.
    Returns (is_safe: bool, refusal_response: Optional[str]).
    """
    q_lower = user_query.lower()
    for trigger in PROHIBITED_INTENTS:
        if trigger in q_lower:
            return False, SAFE_REFUSAL_MESSAGE
    return True, None

def format_conflict_warning(
    allergen: str,
    record_a_summary: str,
    record_a_date: str,
    record_b_summary: str,
    record_b_date: str,
) -> str:
    """Format an explicit clinical conflict warning that refuses autonomous resolution."""
    return (
        f"⚠️ **Potential Clinical Conflict Detected for {allergen}:**\n"
        f"• **Record 1 ({record_a_date}):** {record_a_summary}\n"
        f"• **Record 2 ({record_b_date}):** {record_b_summary}\n\n"
        f"**Safety Rule:** The system will not automatically overwrite or discard either record. "
        f"Human clinical verification is required before administering or prescribing related treatments."
    )
