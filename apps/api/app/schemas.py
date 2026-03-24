from __future__ import annotations

from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

DOMAIN_TYPES = Literal["finance", "geopolitics", "tech", "health"]
OUTCOME_TYPES = Literal["base case", "upside", "disruption", "tail risk"]


class APIModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class SignalItem(APIModel):
    id: str
    source: str
    domain: DOMAIN_TYPES
    title: str
    summary: str
    url: str
    publishedAt: datetime
    sourceType: str
    credibilityScore: float = Field(ge=0.0, le=1.0)
    rawMetadata: dict[str, Any] = Field(default_factory=dict)


class ScenarioBranch(APIModel):
    id: str
    label: str
    probability: float = Field(ge=0.0, le=1.0)
    causalChain: str
    outcomeType: OUTCOME_TYPES
    supportingSignalIds: list[str] = Field(default_factory=list)


class ScenarioTree(APIModel):
    id: str
    domain: DOMAIN_TYPES
    rootScenario: str
    dominantTension: str
    summary: str
    updatedAt: datetime
    branches: list[ScenarioBranch]
    signals: list[SignalItem]

    @field_validator("branches")
    @classmethod
    def validate_branch_count(cls, value: list[ScenarioBranch]) -> list[ScenarioBranch]:
        if not 2 <= len(value) <= 4:
            raise ValueError("Each scenario tree must contain between 2 and 4 branches.")
        return value

    @model_validator(mode="after")
    def validate_probabilities(self) -> "ScenarioTree":
        probability_total = sum(branch.probability for branch in self.branches)
        if abs(probability_total - 1.0) > 0.025:
            raise ValueError("Scenario branch probabilities must sum to 1.0.")
        return self


class DigestResponse(APIModel):
    digestDate: date
    generatedAt: datetime
    editionLabel: str
    domains: list[ScenarioTree]


class SettingsPayload(APIModel):
    visibleDomains: list[DOMAIN_TYPES] = Field(default_factory=lambda: ["finance", "geopolitics", "tech", "health"])
    domainOrder: list[DOMAIN_TYPES] = Field(default_factory=lambda: ["finance", "geopolitics", "tech", "health"])
    revealSignalSummaries: bool = True
    highlightHighCredibility: bool = True


class HealthResponse(APIModel):
    status: str
    environment: str


class SignalPackage(APIModel):
    domain: DOMAIN_TYPES
    digestDate: date
    generatedAt: datetime
    dominantCluster: str
    signals: list[SignalItem]
    macroSignals: list[SignalItem] = Field(default_factory=list)
