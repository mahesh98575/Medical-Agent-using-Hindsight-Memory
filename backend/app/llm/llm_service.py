"""
LLM Integration Service with Google Gemini support and structured clinical reasoning fallback.
"""
import logging
from typing import List, Dict, Any, Optional
from backend.app.core.config import get_settings

logger = logging.getLogger("healthcare_memory.llm")
settings = get_settings()

class LLMService:
    """Service abstraction for LLM calls with Gemini and structured clinical reasoning."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.LLM_MODEL
        self.gemini_client = None
        self._init_gemini()

    def _init_gemini(self):
        if self.api_key:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google Gemini client with model %s", self.model_name)
            except Exception as e:
                logger.warning("Gemini client initialization failed: %s", e)
                self.gemini_client = None

    async def generate_response(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
    ) -> Optional[str]:
        """Generate response via Gemini API if configured."""
        if self.gemini_client:
            try:
                response = self.gemini_client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config={"system_instruction": system_instruction} if system_instruction else None,
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                logger.warning("Gemini generate_content failed: %s", e)
        return None

llm_service = LLMService()
