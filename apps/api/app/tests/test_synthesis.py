from datetime import UTC, date, datetime

from app.core.config import Settings
from app.schemas import SignalItem, SignalPackage
from app.services.synthesis import build_prompt, synthesize_scenario


def build_package() -> SignalPackage:
    signal = SignalItem(
        id="signal-1",
        source="Reuters",
        domain="finance",
        title="Fed patience shapes the rates path.",
        summary="Rates stay higher for longer.",
        url="https://example.com/fed",
        publishedAt=datetime.now(UTC),
        sourceType="news",
        credibilityScore=1.0,
        rawMetadata={},
    )
    return SignalPackage(
        domain="finance",
        digestDate=date(2026, 3, 20),
        generatedAt=datetime.now(UTC),
        dominantCluster=signal.title,
        signals=[signal],
        macroSignals=[signal],
    )


def test_build_prompt_includes_signal_ids() -> None:
    prompt = build_prompt(build_package())

    assert "signal-1" in prompt
    assert "dominantCluster" in prompt


@pytest.mark.asyncio
async def test_synthesize_scenario_falls_back_without_api_key() -> None:
    result = await synthesize_scenario(build_package(), Settings(anthropic_api_key=""))

    assert result.domain == "finance"
    assert len(result.branches) >= 2
import pytest
