"""
Database session and connection management with PostgreSQL and resilient local SQLite fallback.
"""
import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from backend.app.core.config import get_settings

logger = logging.getLogger("healthcare_memory.database")
settings = get_settings()

Base = declarative_base()

def get_database_url() -> str:
    """Resolve database URL with PostgreSQL priority and SQLite dev fallback."""
    if settings.LOCAL_SQLITE_FALLBACK:
        # Use SQLite for reliable, deterministic local development without requiring local postgres daemon
        return f"sqlite+aiosqlite:///{settings.SQLITE_DATABASE_PATH}"
    return settings.DATABASE_URL

db_url = get_database_url()
is_sqlite = db_url.startswith("sqlite")

engine_kwargs = {"echo": False}
if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_async_engine(db_url, **engine_kwargs)
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining an asynchronous database session."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """Initialize database tables and seed baseline synthetic data if empty."""
    from backend.app.models.clinical import (
        PatientModel,
        MedicationModel,
        AllergyModel,
        SymptomModel,
        ConflictModel,
        TimelineEventModel,
        EvidenceModel,
    )
    from backend.app.database.seed import seed_initial_data

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        await seed_initial_data(session)
