from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DigestRun(Base):
    __tablename__ = "digest_runs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    digest_date: Mapped[date] = mapped_column(Date, index=True, unique=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    status: Mapped[str] = mapped_column(String(32), default="published")
    edition_label: Mapped[str] = mapped_column(String(120))

    scenarios: Mapped[list["ScenarioTreeModel"]] = relationship(back_populates="digest_run", cascade="all, delete-orphan")


class ScenarioTreeModel(Base):
    __tablename__ = "scenario_trees"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    digest_run_id: Mapped[str] = mapped_column(ForeignKey("digest_runs.id", ondelete="CASCADE"), index=True)
    domain: Mapped[str] = mapped_column(String(32), index=True)
    root_scenario: Mapped[str] = mapped_column(Text)
    dominant_tension: Mapped[str] = mapped_column(Text)
    summary: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    digest_run: Mapped["DigestRun"] = relationship(back_populates="scenarios")
    branches: Mapped[list["ScenarioBranchModel"]] = relationship(back_populates="scenario_tree", cascade="all, delete-orphan")
    signals: Mapped[list["SourceSignalModel"]] = relationship(back_populates="scenario_tree", cascade="all, delete-orphan")


class ScenarioBranchModel(Base):
    __tablename__ = "scenario_branches"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    scenario_tree_id: Mapped[str] = mapped_column(ForeignKey("scenario_trees.id", ondelete="CASCADE"), index=True)
    label: Mapped[str] = mapped_column(String(240))
    probability: Mapped[float] = mapped_column(Float)
    causal_chain: Mapped[str] = mapped_column(Text)
    outcome_type: Mapped[str] = mapped_column(String(32))
    supporting_signal_ids: Mapped[list[str]] = mapped_column(JSON, default=list)

    scenario_tree: Mapped["ScenarioTreeModel"] = relationship(back_populates="branches")


class SourceSignalModel(Base):
    __tablename__ = "source_signals"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    scenario_tree_id: Mapped[str] = mapped_column(ForeignKey("scenario_trees.id", ondelete="CASCADE"), index=True)
    source: Mapped[str] = mapped_column(String(120))
    domain: Mapped[str] = mapped_column(String(32), index=True)
    title: Mapped[str] = mapped_column(Text)
    summary: Mapped[str] = mapped_column(Text)
    url: Mapped[str] = mapped_column(Text)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    source_type: Mapped[str] = mapped_column(String(32))
    credibility_score: Mapped[float] = mapped_column(Float)
    raw_metadata: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    scenario_tree: Mapped["ScenarioTreeModel"] = relationship(back_populates="signals")


class AppSettingsModel(Base):
    __tablename__ = "app_settings"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
