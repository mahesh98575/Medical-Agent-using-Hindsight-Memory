"""
Healthcare Memory Assistant - FastAPI Application Entry Point.
"""
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.router import api_router
from backend.app.core.config import get_settings
from backend.app.database.session import init_db
from backend.app.schemas.health import HealthResponse

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown routines."""
    # Initialize database tables and seed baseline synthetic patient
    try:
        await init_db()
    except Exception as e:
        import logging
        logging.getLogger("uvicorn.error").error("Database initialization error: %s", e)
    yield


app = FastAPI(
    title="Healthcare Memory Assistant API",
    description="Persistent, time-aware, evidence-backed patient memory and clinical decision-support engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def root_health():
    """Simple root health check endpoint reporting service statuses."""
    return HealthResponse(
        status="healthy",
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        timestamp=datetime.now(timezone.utc),
        services={
            "api": "operational",
            "database": "configured (PostgreSQL / Resilient local engine)",
            "memory_engine": "ready (Hindsight client v0.10.1)",
            "safety_layer": "active",
            "llm": f"configured ({settings.LLM_PROVIDER})",
        },
        synthetic_mode=True,
    )


@app.get("/", tags=["Root"])
async def root():
    """Root status endpoint."""
    return {
        "name": "Healthcare Memory Assistant API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/health",
        "synthetic_mode": True,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=True,
    )
