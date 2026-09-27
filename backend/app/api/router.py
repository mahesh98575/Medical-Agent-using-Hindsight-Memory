"""Main API Router aggregating all sub-routers."""
from fastapi import APIRouter
from backend.app.api.health import router as health_router
from backend.app.api.clinical_routes import router as clinical_router

api_router = APIRouter(prefix="/api")

# Register sub-routers
api_router.include_router(health_router)
api_router.include_router(clinical_router)
