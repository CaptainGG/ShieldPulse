from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_session
from app.schemas import DigestResponse, HealthResponse, SettingsPayload
from app.services.pipeline import generate_digest
from app.services.repository import get_digest_by_date, get_latest_digest, get_settings_payload, save_settings_payload

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(status="ok", environment=settings.app_env)


@router.get("/api/v1/digest/latest", response_model=DigestResponse)
def latest_digest(session: Session = Depends(get_session)) -> DigestResponse:
    digest = get_latest_digest(session)
    if digest is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No digest available yet.")
    return digest


@router.get("/api/v1/digest/history", response_model=DigestResponse)
def digest_history(date: date, session: Session = Depends(get_session)) -> DigestResponse:
    digest = get_digest_by_date(session, date)
    if digest is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Digest not found for that date.")
    return digest


@router.get("/api/v1/settings", response_model=SettingsPayload)
def read_settings(session: Session = Depends(get_session)) -> SettingsPayload:
    return get_settings_payload(session)


@router.put("/api/v1/settings", response_model=SettingsPayload)
def write_settings(payload: SettingsPayload, session: Session = Depends(get_session)) -> SettingsPayload:
    return save_settings_payload(session, payload)


@router.post("/api/v1/admin/digest/run", response_model=DigestResponse)
async def run_digest(
    session: Session = Depends(get_session),
    x_oracle_admin_secret: str | None = Header(default=None),
) -> DigestResponse:
    settings = get_settings()
    if x_oracle_admin_secret != settings.admin_run_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin secret.")
    return await generate_digest(session)
