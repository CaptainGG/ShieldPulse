from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

import httpx

from app.core.config import Settings
from app.schemas import ScenarioBranch, ScenarioTree, SignalPackage

SYSTEM_PROMPT = """You are Oracle, an editorial forecaster.
Take the supplied weighted signal package and return exactly one JSON object.
Rules:
- Surface the dominant tension, not a list of headlines.
- Return one rootScenario, one dominantTension, one short summary, and 2 to 4 branches.
- Each branch must include label, probability, causalChain, outcomeType, and supportingSignalIds.
- Probabilities must sum to 1.0.
- Keep every string concise and frontend-readable.
- Do not include markdown fences or commentary.
"""


def _fallback_tree(package: SignalPackage) -> ScenarioTree:
    signals = package.signals[:3]
    primary_signal = signals[0]
    remaining_signal_ids = [signal.id for signal in signals[1:]] or [primary_signal.id]
    summary = (
        f"{primary_signal.source} and adjacent signals imply a controlled but unstable path for {package.domain}, "
        "with the base case still intact and one meaningful disruption branch in view."
    )

    return ScenarioTree(
        id=f"{package.domain}-{package.digestDate.isoformat()}",
        domain=package.domain,
        rootScenario=primary_signal.title,
        dominantTension=package.dominantCluster,
        summary=summary,
        updatedAt=datetime.now(UTC),
        signals=package.signals,
        branches=[
            ScenarioBranch(
                id=f"branch-{uuid4().hex[:12]}",
                label="Base case holds",
                probability=0.58,
                causalChain="If the highest-credibility signals continue in the same direction, the market absorbs the tension without a regime break.",
                outcomeType="base case",
                supportingSignalIds=[primary_signal.id],
            ),
            ScenarioBranch(
                id=f"branch-{uuid4().hex[:12]}",
                label="Pressure spills wider",
                probability=0.27,
                causalChain="If the secondary signals reinforce the same stress, a contained issue starts propagating across adjacent systems.",
                outcomeType="disruption",
                supportingSignalIds=remaining_signal_ids,
            ),
            ScenarioBranch(
                id=f"branch-{uuid4().hex[:12]}",
                label="Counter-move stabilizes",
                probability=0.15,
                causalChain="If policymakers or operators respond faster than expected, the dominant tension softens before it reshapes the whole domain.",
                outcomeType="upside",
                supportingSignalIds=[primary_signal.id],
            ),
        ],
    )


def build_prompt(package: SignalPackage) -> str:
    payload = {
        "domain": package.domain,
        "digestDate": package.digestDate.isoformat(),
        "dominantCluster": package.dominantCluster,
        "signals": [
            {
                "id": signal.id,
                "source": signal.source,
                "title": signal.title,
                "summary": signal.summary,
                "credibilityScore": signal.credibilityScore,
                "publishedAt": signal.publishedAt.isoformat(),
            }
            for signal in package.signals
        ],
        "macroSignals": [
            {
                "id": signal.id,
                "source": signal.source,
                "title": signal.title,
                "credibilityScore": signal.credibilityScore,
            }
            for signal in package.macroSignals
        ],
        "schema": {
            "id": "string",
            "domain": package.domain,
            "rootScenario": "string",
            "dominantTension": "string",
            "summary": "string",
            "updatedAt": "ISO8601 datetime",
            "signals": "copy through the provided package signals",
            "branches": [
                {
                    "id": "string",
                    "label": "string",
                    "probability": "float 0-1",
                    "causalChain": "string",
                    "outcomeType": "base case | upside | disruption | tail risk",
                    "supportingSignalIds": ["signal ids from package"],
                }
            ],
        },
    }
    return json.dumps(payload, default=str)


async def _call_anthropic(settings: Settings, prompt: str) -> dict[str, Any]:
    headers = {
        "x-api-key": settings.anthropic_api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    body = {
        "model": settings.anthropic_model,
        "max_tokens": 1600,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": prompt}],
    }

    async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
        response = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=body)
        response.raise_for_status()
        payload = response.json()
        text_blocks = [block.get("text", "") for block in payload.get("content", []) if block.get("type") == "text"]
        return json.loads("".join(text_blocks).strip())


def _coerce_tree(payload: dict[str, Any], package: SignalPackage) -> ScenarioTree:
    payload.setdefault("id", f"{package.domain}-{package.digestDate.isoformat()}")
    payload.setdefault("domain", package.domain)
    payload.setdefault("updatedAt", datetime.now(UTC).isoformat())
    payload["signals"] = [signal.model_dump(mode="json") for signal in package.signals]
    for branch in payload.get("branches", []):
        branch.setdefault("id", f"branch-{uuid4().hex[:12]}")
    return ScenarioTree.model_validate(payload)


async def synthesize_scenario(package: SignalPackage, settings: Settings) -> ScenarioTree:
    if not settings.anthropic_api_key:
        return _fallback_tree(package)

    prompt = build_prompt(package)
    strict_suffix = ""
    for _ in range(3):
        try:
            payload = await _call_anthropic(settings, prompt + strict_suffix)
            return _coerce_tree(payload, package)
        except Exception:
            strict_suffix += "\nReturn only valid JSON. Do not add commentary. Keep probabilities normalized."

    return _fallback_tree(package)
