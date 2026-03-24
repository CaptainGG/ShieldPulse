from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import select

from app.api.routes import router
from app.core.database import Base, SessionLocal, engine
from app.models import DigestRun
from app.services.repository import get_settings_payload, store_digest
from app.services.sample_data import build_sample_digest


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        has_digest = session.execute(select(DigestRun.id).limit(1)).first()
        get_settings_payload(session)
        if not has_digest:
            store_digest(session, build_sample_digest())
    yield


app = FastAPI(title="ShieldPulse API", version="0.1.0", lifespan=lifespan)
app.include_router(router)
