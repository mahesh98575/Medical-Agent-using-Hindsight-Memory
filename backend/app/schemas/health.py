"""Health check schema."""
from datetime import datetime, timezone
from typing import Dict, Any
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """System health check response."""
    status: str = Field(default="healthy", description="Overall system health status")
    environment: str = Field(..., description="Active runtime environment")
    version: str = Field(default="1.0.0", description="Application version")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp of the health check"
    )
    services: Dict[str, Any] = Field(default_factory=dict, description="Status of individual system services")
    synthetic_mode: bool = Field(default=True, description="Indicates synthetic data and safety boundaries active")
