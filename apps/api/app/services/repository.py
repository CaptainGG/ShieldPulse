from __future__ import annotations

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import AppSettingsModel, DigestRun, ScenarioBranchModel, ScenarioTreeModel, SourceSignalModel
from app.schemas import DigestResponse, ScenarioTree, SettingsPayload


LATEST_CACHE_KEY = "oracle:digest:latest"


def _tree_from_model(model: ScenarioTreeModel) -> ScenarioTree:
    return ScenarioTree(
        id=model.id,
        domain=model.domain,  # type: ignore[arg-type]
        rootScenario=model.root_scenario,
        dominantTension=model.dominant_tension,
        summary=model.summary,
        updatedAt=model.updated_at,
        branches=[
            {
                "id": branch.id,
                "label": branch.label,
                "probability": branch.probability,
                "causalChain": branch.causal_chain,
                "outcomeType": branch.outcome_type,
                "supportingSignalIds": branch.supporting_signal_ids,
            }
            for branch in model.branches
        ],
        signals=[
            {
                "id": signal.id,
                "source": signal.source,
                "domain": signal.domain,
                "title": signal.title,
                "summary": signal.summary,
                "url": signal.url,
                "publishedAt": signal.published_at,
                "sourceType": signal.source_type,
                "credibilityScore": signal.credibility_score,
                "rawMetadata": signal.raw_metadata,
            }
            for signal in model.signals
        ],
    )


def store_digest(session: Session, digest: DigestResponse) -> DigestResponse:
    existing = session.execute(select(DigestRun).where(DigestRun.digest_date == digest.digestDate)).scalar_one_or_none()
    if existing is not None:
        session.delete(existing)
        session.flush()

    run = DigestRun(
        id=f"digest-run-{digest.digestDate.isoformat()}",
        digest_date=digest.digestDate,
        generated_at=digest.generatedAt,
        status="published",
        edition_label=digest.editionLabel,
    )
    session.add(run)

    for scenario in digest.domains:
        scenario_model = ScenarioTreeModel(
            id=scenario.id,
            digest_run_id=run.id,
            domain=scenario.domain,
            root_scenario=scenario.rootScenario,
            dominant_tension=scenario.dominantTension,
            summary=scenario.summary,
            updated_at=scenario.updatedAt,
        )
        session.add(scenario_model)

        for branch in scenario.branches:
            session.add(
                ScenarioBranchModel(
                    id=branch.id,
                    scenario_tree_id=scenario.id,
                    label=branch.label,
                    probability=branch.probability,
                    causal_chain=branch.causalChain,
                    outcome_type=branch.outcomeType,
                    supporting_signal_ids=branch.supportingSignalIds,
                )
            )

        for signal in scenario.signals:
            session.add(
                SourceSignalModel(
                    id=signal.id,
                    scenario_tree_id=scenario.id,
                    source=signal.source,
                    domain=signal.domain,
                    title=signal.title,
                    summary=signal.summary,
                    url=signal.url,
                    published_at=signal.publishedAt,
                    source_type=signal.sourceType,
                    credibility_score=signal.credibilityScore,
                    raw_metadata=signal.rawMetadata,
                )
            )

    session.commit()
    return digest


def _digest_query(session: Session, digest_date: date) -> DigestResponse | None:
    statement = (
        select(DigestRun)
        .where(DigestRun.digest_date == digest_date)
        .order_by(DigestRun.generated_at.desc())
    )
    run = session.execute(statement).scalar_one_or_none()
    if not run:
        return None

    domains = [_tree_from_model(tree) for tree in run.scenarios]
    return DigestResponse(
        digestDate=run.digest_date,
        generatedAt=run.generated_at,
        editionLabel=run.edition_label,
        domains=domains,
    )


def get_latest_digest(session: Session) -> DigestResponse | None:
    statement = select(DigestRun).order_by(DigestRun.digest_date.desc()).limit(1)
    run = session.execute(statement).scalar_one_or_none()
    if not run:
        return None
    return _digest_query(session, run.digest_date)


def get_digest_by_date(session: Session, digest_date: date) -> DigestResponse | None:
    return _digest_query(session, digest_date)


def get_settings_payload(session: Session) -> SettingsPayload:
    model = session.get(AppSettingsModel, "private-ui")
    if model is None:
        payload = SettingsPayload()
        save_settings_payload(session, payload)
        return payload
    return SettingsPayload.model_validate(model.payload)


def save_settings_payload(session: Session, payload: SettingsPayload) -> SettingsPayload:
    model = session.get(AppSettingsModel, "private-ui")
    if model is None:
        model = AppSettingsModel(key="private-ui", payload=payload.model_dump(mode="json"))
        session.add(model)
    else:
        model.payload = payload.model_dump(mode="json")
    session.commit()
    return payload
