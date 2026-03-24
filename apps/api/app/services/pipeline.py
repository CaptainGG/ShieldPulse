from __future__ import annotations

from datetime import UTC, date, datetime

from sqlalchemy.orm import Session

from app.core.cache import cache_client
from app.core.config import get_settings
from app.schemas import DigestResponse
from app.services.aggregation import package_signals
from app.services.providers import fetch_all_signals
from app.services.repository import LATEST_CACHE_KEY, store_digest
from app.services.sample_data import build_sample_digest
from app.services.synthesis import synthesize_scenario


async def generate_digest(session: Session, target_date: date | None = None) -> DigestResponse:
    settings = get_settings()
    digest_date = target_date or date.today()
    raw_signals = await fetch_all_signals(settings)

    if not raw_signals:
        digest = build_sample_digest(digest_date)
        store_digest(session, digest)
        cache_client.set_json(LATEST_CACHE_KEY, digest.model_dump(mode="json"), ttl_seconds=60 * 60 * 12)
        cache_client.set_json(f"oracle:digest:{digest_date.isoformat()}", digest.model_dump(mode="json"), ttl_seconds=60 * 60 * 12)
        return digest

    packages = package_signals(raw_signals, digest_date)
    scenarios = [await synthesize_scenario(package, settings) for package in packages]
    digest = DigestResponse(
        digestDate=digest_date,
        generatedAt=datetime.now(UTC),
        editionLabel=datetime.now(UTC).strftime("%A briefing"),
        domains=scenarios,
    )
    store_digest(session, digest)
    cache_client.delete(LATEST_CACHE_KEY)
    cache_client.set_json(LATEST_CACHE_KEY, digest.model_dump(mode="json"), ttl_seconds=60 * 60 * 12)
    cache_client.set_json(f"oracle:digest:{digest_date.isoformat()}", digest.model_dump(mode="json"), ttl_seconds=60 * 60 * 12)
    return digest
