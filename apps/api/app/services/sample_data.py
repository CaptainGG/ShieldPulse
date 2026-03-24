from __future__ import annotations

from datetime import date, datetime, timezone

from app.schemas import DigestResponse, ScenarioBranch, ScenarioTree, SettingsPayload, SignalItem


def build_sample_settings() -> SettingsPayload:
    return SettingsPayload()


def build_sample_digest(target_date: date | None = None) -> DigestResponse:
    digest_date = target_date or date.today()
    generated_at = datetime.combine(digest_date, datetime.min.time(), tzinfo=timezone.utc).replace(hour=6)

    return DigestResponse(
        digestDate=digest_date,
        generatedAt=generated_at,
        editionLabel=generated_at.strftime("%A briefing"),
        domains=[
            ScenarioTree(
                id=f"finance-{digest_date.isoformat()}",
                domain="finance",
                rootScenario="Markets brace for a slower easing path while growth data stays uneven.",
                dominantTension="Sticky inflation is colliding with a fading growth impulse.",
                summary="Treasury yields, commodity persistence, and more cautious central-bank language point to tighter financial conditions without a full risk break yet.",
                updatedAt=generated_at,
                signals=[
                    SignalItem(
                        id="signal-fred-yields",
                        source="FRED",
                        domain="finance",
                        title="Treasury term premium edges higher for a third session.",
                        summary="Rate markets are repricing the path of cuts as inflation expectations hold firm.",
                        url="https://fred.stlouisfed.org/",
                        publishedAt=generated_at,
                        sourceType="macro",
                        credibilityScore=0.95,
                        rawMetadata={"series": "DGS10"},
                    ),
                    SignalItem(
                        id="signal-reuters-fed",
                        source="Reuters",
                        domain="finance",
                        title="Fed officials reiterate patience on cuts amid persistent services inflation.",
                        summary="Recent remarks point to a slower and more conditional easing cycle.",
                        url="https://www.reuters.com/",
                        publishedAt=generated_at,
                        sourceType="news",
                        credibilityScore=1.0,
                        rawMetadata={},
                    ),
                ],
                branches=[
                    ScenarioBranch(
                        id="finance-branch-a",
                        label="Risk assets hold the line",
                        probability=0.58,
                        causalChain="If inflation stays warm but not re-accelerating, investors can tolerate slower cuts and keep leaning into quality risk.",
                        outcomeType="base case",
                        supportingSignalIds=["signal-fred-yields", "signal-reuters-fed"],
                    ),
                    ScenarioBranch(
                        id="finance-branch-b",
                        label="Rates squeeze valuation pockets",
                        probability=0.27,
                        causalChain="If yields keep drifting higher, long-duration equities and speculative sectors absorb the repricing first.",
                        outcomeType="disruption",
                        supportingSignalIds=["signal-fred-yields"],
                    ),
                    ScenarioBranch(
                        id="finance-branch-c",
                        label="Growth scare forces a policy pivot",
                        probability=0.15,
                        causalChain="If incoming data weakens faster than expected, recession hedges return and the market starts pulling cuts forward again.",
                        outcomeType="tail risk",
                        supportingSignalIds=["signal-reuters-fed"],
                    ),
                ],
            ),
            ScenarioTree(
                id=f"geopolitics-{digest_date.isoformat()}",
                domain="geopolitics",
                rootScenario="Trade friction intensifies without tipping into outright rupture.",
                dominantTension="Governments want leverage without triggering a full supply shock.",
                summary="Tariff language, export restrictions, and shipping reroutes suggest a controlled escalation path where blocs test pressure points while trying to preserve core trade flows.",
                updatedAt=generated_at,
                signals=[
                    SignalItem(
                        id="signal-ap-trade",
                        source="AP",
                        domain="geopolitics",
                        title="Officials outline narrower tariff actions tied to strategic inputs.",
                        summary="Measures are aimed at pressure rather than blanket trade closure.",
                        url="https://apnews.com/",
                        publishedAt=generated_at,
                        sourceType="news",
                        credibilityScore=1.0,
                        rawMetadata={},
                    ),
                    SignalItem(
                        id="signal-gdelt-shipping",
                        source="GDELT",
                        domain="geopolitics",
                        title="Shipping coverage clusters around route diversification and insurance costs.",
                        summary="Narrative intensity is rising around rerouting and trade resilience.",
                        url="https://www.gdeltproject.org/",
                        publishedAt=generated_at,
                        sourceType="aggregator",
                        credibilityScore=0.8,
                        rawMetadata={},
                    ),
                ],
                branches=[
                    ScenarioBranch(
                        id="geo-branch-a",
                        label="Managed escalation",
                        probability=0.62,
                        causalChain="If policymakers keep targeting strategic sectors, pressure rises but broad commerce remains intact enough for markets to adapt.",
                        outcomeType="base case",
                        supportingSignalIds=["signal-ap-trade", "signal-gdelt-shipping"],
                    ),
                    ScenarioBranch(
                        id="geo-branch-b",
                        label="Retaliation spills into logistics",
                        probability=0.24,
                        causalChain="If counterparties answer with transport or customs friction, supply chains feel the strain faster than headline tariffs imply.",
                        outcomeType="disruption",
                        supportingSignalIds=["signal-gdelt-shipping"],
                    ),
                    ScenarioBranch(
                        id="geo-branch-c",
                        label="Back-channel thaw",
                        probability=0.14,
                        causalChain="If negotiators secure symbolic concessions, governments can slow escalation while still claiming resolve domestically.",
                        outcomeType="upside",
                        supportingSignalIds=["signal-ap-trade"],
                    ),
                ],
            ),
            ScenarioTree(
                id=f"tech-{digest_date.isoformat()}",
                domain="tech",
                rootScenario="AI platform competition shifts from model headlines to distribution control.",
                dominantTension="Capability gains are no longer enough without direct user reach and infrastructure leverage.",
                summary="Chip constraints, enterprise bundling, and platform-level integrations are compressing the advantage window for standalone model providers.",
                updatedAt=generated_at,
                signals=[
                    SignalItem(
                        id="signal-reuters-chip",
                        source="Reuters",
                        domain="tech",
                        title="Cloud providers deepen commitments to AI-specific infrastructure spend.",
                        summary="The spend is shifting from experimentation toward long-cycle platform control.",
                        url="https://www.reuters.com/",
                        publishedAt=generated_at,
                        sourceType="news",
                        credibilityScore=1.0,
                        rawMetadata={},
                    )
                ],
                branches=[
                    ScenarioBranch(
                        id="tech-branch-a",
                        label="Integrated stacks extend the lead",
                        probability=0.54,
                        causalChain="If major platforms keep folding AI into default workflows, distribution compounds faster than standalone model differentiation.",
                        outcomeType="base case",
                        supportingSignalIds=["signal-reuters-chip"],
                    ),
                    ScenarioBranch(
                        id="tech-branch-b",
                        label="Enterprise buyers fragment the market",
                        probability=0.31,
                        causalChain="If enterprises resist lock-in, multi-model orchestration keeps room open for specialized vendors.",
                        outcomeType="upside",
                        supportingSignalIds=["signal-reuters-chip"],
                    ),
                    ScenarioBranch(
                        id="tech-branch-c",
                        label="Infrastructure shock resets priorities",
                        probability=0.15,
                        causalChain="If chip supply or regulatory friction bites harder, product rollouts slow and cash flow discipline overrides growth narratives.",
                        outcomeType="tail risk",
                        supportingSignalIds=["signal-reuters-chip"],
                    ),
                ],
            ),
            ScenarioTree(
                id=f"health-{digest_date.isoformat()}",
                domain="health",
                rootScenario="Public-health readiness improves, but localized stress signals keep resurfacing.",
                dominantTension="Preparedness systems are stronger than before, yet still uneven across regions and supply lines.",
                summary="WHO updates, weather-linked exposure risk, and early biotech momentum produce a picture of resilience with narrow but real points of fragility.",
                updatedAt=generated_at,
                signals=[
                    SignalItem(
                        id="signal-who-update",
                        source="WHO",
                        domain="health",
                        title="WHO update highlights localized surveillance pressure rather than global escalation.",
                        summary="The picture is manageable, but hotspot monitoring remains active.",
                        url="https://www.who.int/",
                        publishedAt=generated_at,
                        sourceType="gov",
                        credibilityScore=0.95,
                        rawMetadata={},
                    ),
                ],
                branches=[
                    ScenarioBranch(
                        id="health-branch-a",
                        label="Localized management succeeds",
                        probability=0.63,
                        causalChain="If surveillance stays targeted and response capacity holds, health systems absorb pressure without turning it into a broad emergency.",
                        outcomeType="base case",
                        supportingSignalIds=["signal-who-update"],
                    ),
                    ScenarioBranch(
                        id="health-branch-b",
                        label="Climate-linked strain widens",
                        probability=0.23,
                        causalChain="If weather volatility persists, respiratory and agricultural stress can turn a local issue into a broader resilience test.",
                        outcomeType="disruption",
                        supportingSignalIds=["signal-who-update"],
                    ),
                    ScenarioBranch(
                        id="health-branch-c",
                        label="Biotech response cycle accelerates",
                        probability=0.14,
                        causalChain="If risk stays contained but visible, capital and policy can move faster into monitoring and countermeasure capacity.",
                        outcomeType="upside",
                        supportingSignalIds=["signal-who-update"],
                    ),
                ],
            ),
        ],
    )
