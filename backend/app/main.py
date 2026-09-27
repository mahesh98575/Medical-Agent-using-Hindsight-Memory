"""
Healthcare Memory Assistant - FastAPI Application Entry Point.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.router import api_router
from backend.app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown routines."""
    # Startup actions
    yield
    # Shutdown actions


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
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)


@app.get("/", tags=["Root"])
async def root():
    """Root status endpoint."""
    return {
        "name": "Healthcare Memory Assistant API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/api/health",
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
