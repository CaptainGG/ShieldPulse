from __future__ import annotations

from collections import defaultdict
from datetime import UTC, date, datetime
from difflib import SequenceMatcher

from app.schemas import SignalItem, SignalPackage

MACRO_DOMAINS = {"finance", "geopolitics", "tech", "health"}


def _title_key(value: str) -> str:
    return "".join(character.lower() for character in value if character.isalnum() or character.isspace()).strip()


def deduplicate_signals(signals: list[SignalItem]) -> list[SignalItem]:
    deduped: list[SignalItem] = []
    for signal in sorted(signals, key=lambda item: item.credibilityScore, reverse=True):
        is_duplicate = False
        for existing in deduped:
            title_similarity = SequenceMatcher(None, _title_key(signal.title), _title_key(existing.title)).ratio()
            same_url = signal.url == existing.url
            if same_url or title_similarity > 0.88:
                is_duplicate = True
                break
        if not is_duplicate:
            deduped.append(signal)
    return deduped


def package_signals(signals: list[SignalItem], target_date: date | None = None) -> list[SignalPackage]:
    digest_date = target_date or date.today()
    generated_at = datetime.now(UTC)
    by_domain: dict[str, list[SignalItem]] = defaultdict(list)

    for signal in deduplicate_signals(signals):
        by_domain[signal.domain].append(signal)

    macro_signals = sorted(by_domain.get("finance", []), key=lambda item: item.credibilityScore, reverse=True)[:3]
    packages: list[SignalPackage] = []
    for domain in sorted(MACRO_DOMAINS):
        domain_signals = sorted(by_domain.get(domain, []), key=lambda item: item.credibilityScore, reverse=True)[:10]
        if not domain_signals:
            continue
        packages.append(
            SignalPackage(
                domain=domain,  # type: ignore[arg-type]
                digestDate=digest_date,
                generatedAt=generated_at,
                dominantCluster=domain_signals[0].title,
                signals=domain_signals,
                macroSignals=macro_signals,
            )
        )
    return packages
