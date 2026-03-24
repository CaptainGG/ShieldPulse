"use client";

import Link from "next/link";
import { useEffect } from "react";
import { DomainJumpNav } from "@/components/domain-jump-nav";
import { KpiStrip } from "@/components/kpi-strip";
import { ScenarioCard } from "@/components/scenario-card";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { WeeklyInsightReport, workstreamMeta } from "@/lib/types";

type Props = {
  report: WeeklyInsightReport;
  isArchive?: boolean;
};

export function DigestExperience({ report, isArchive = false }: Props) {
  useEffect(() => {
    if (isArchive) {
      void trackAnalyticsEvent("prior_week_compared", {
        report_date: report.reportDate,
        surface: "weekly_readout",
        archive_mode: true
      });
      return;
    }

    void trackAnalyticsEvent("weekly_readout_viewed", {
      report_date: report.reportDate,
      surface: "weekly_readout",
      archive_mode: false
    });
  }, [isArchive, report.reportDate]);

  return (
    <main className="grid-shell min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="panel rounded-card p-6 md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.35em] text-[rgba(223,244,240,0.58)]">ShieldPulse</p>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[0.92] text-[var(--color-cream)] md:text-7xl">
                Mobile security analytics,
                <br />
                built for decisive product moves.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[rgba(223,244,240,0.78)] md:text-lg">
                {report.overview}
              </p>
            </div>
            <div className="grid gap-3 text-sm text-[rgba(223,244,240,0.8)]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.52)]">Edition</p>
                <p className="mt-1 text-lg font-medium">{report.editionLabel}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.52)]">Reporting window</p>
                <p className="mt-1">{report.timeframeLabel}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.52)]">North star</p>
                <p className="mt-1">{report.northStar}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.52)]">Generated</p>
                <p className="mt-1">
                  {new Date(report.generatedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link className="rounded-full bg-white px-4 py-2 font-medium text-[var(--color-ink)]" href="/settings">
                  Open measurement plan
                </Link>
                {isArchive ? (
                  <Link className="rounded-full border border-white/10 px-4 py-2" href="/">
                    Back to current week
                  </Link>
                ) : (
                  <Link className="rounded-full border border-white/10 px-4 py-2" href={`/digest/${report.previousReportDate}`}>
                    Compare with prior week
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <KpiStrip kpis={report.kpis} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <DomainJumpNav domains={report.workstreams.map((item) => item.workstream)} />
          <div className="flex flex-wrap gap-2">
            {report.workstreams.map((item) => (
              <span
                key={item.workstream}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em]"
                style={{ color: workstreamMeta[item.workstream].accent }}
              >
                {workstreamMeta[item.workstream].label}
              </span>
            ))}
          </div>
        </div>

        <section className="space-y-6">
          {report.workstreams.map((insight) => (
            <div key={insight.id} className="scroll-mt-24" id={insight.workstream}>
              <ScenarioCard insight={insight} reportDate={report.reportDate} archiveMode={isArchive} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
