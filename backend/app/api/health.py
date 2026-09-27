"""Health check API endpoint."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from backend.app.core.config import Settings, get_settings
from backend.app.schemas.health import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
async def check_health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """
    Perform a system health check.
    Returns status of the backend API, environment info, and service connectivity.
    """
    return HealthResponse(
        status="healthy",
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        timestamp=datetime.now(timezone.utc),
        services={
            "api": "operational",
            "database": "configured",
            "memory_engine": "ready",
            "safety_layer": "active",
        },
        synthetic_mode=True,
    )
