from datetime import UTC, date, datetime

from app.schemas import SignalItem
from app.services.aggregation import deduplicate_signals, package_signals


def make_signal(signal_id: str, title: str, credibility: float) -> SignalItem:
    return SignalItem(
        id=signal_id,
        source="Reuters",
        domain="finance",
        title=title,
        summary="summary",
        url=f"https://example.com/{signal_id}",
        publishedAt=datetime.now(UTC),
        sourceType="news",
        credibilityScore=credibility,
        rawMetadata={},
    )


def test_deduplicate_signals_prefers_highest_credibility() -> None:
    signals = [
        make_signal("a", "Fed holds rates steady", 1.0),
        make_signal("b", "Fed holds rates steady.", 0.7),
    ]

    result = deduplicate_signals(signals)

    assert len(result) == 1
    assert result[0].id == "a"


def test_package_signals_groups_by_domain() -> None:
    signals = [make_signal("a", "Fed holds rates steady", 1.0)]

    packages = package_signals(signals, date(2026, 3, 20))

    assert len(packages) == 1
    assert packages[0].domain == "finance"
