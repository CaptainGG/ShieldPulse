"use client";

import { trackAnalyticsEvent } from "@/lib/analytics";
import { EvidenceItem } from "@/lib/types";

type Props = {
  archiveMode: boolean;
  evidence: EvidenceItem[];
  recommendationId: string;
  reportDate: string;
  supportingEvidenceIds: string[];
  workstream: string;
};

export function SignalBreakdownDrawer({
  archiveMode,
  evidence,
  recommendationId,
  reportDate,
  supportingEvidenceIds,
  workstream
}: Props) {
  const visibleEvidence = evidence.filter((item) => supportingEvidenceIds.includes(item.id));

  return (
    <details
      className="group rounded-[24px] border border-white/10 bg-white/5 p-4"
      onToggle={(event) => {
        if (!(event.currentTarget as HTMLDetailsElement).open) {
          return;
        }

        void trackAnalyticsEvent("evidence_pack_opened", {
          report_date: reportDate,
          workstream,
          recommendation_id: recommendationId,
          surface: "evidence_pack",
          archive_mode: archiveMode
        });
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.58)]">Evidence pack</p>
          <p className="mt-1 text-sm text-[rgba(223,244,240,0.78)]">
            Inspect the supporting telemetry, store data, and qualitative signals.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.64)] group-open:bg-white/10">
          {visibleEvidence.length} sources
        </span>
      </summary>
      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
        {visibleEvidence.map((item) => (
          <article key={item.id} className="rounded-[20px] border border-white/10 bg-black/10 p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.56)]">
              <span>{item.source}</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] tracking-[0.16em] text-white">
                {item.evidenceType}
              </span>
              <span>{item.metric}</span>
              <span>{item.change}</span>
              <span>{Math.round(item.confidenceScore * 100)} confidence</span>
              <span>{new Date(item.capturedAt).toLocaleString()}</span>
            </div>
            <h4 className="mt-2 text-lg font-semibold text-[var(--color-cream)]">{item.title}</h4>
            <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.72)]">{item.summary}</p>
            <a
              className="mt-3 inline-flex text-sm font-medium text-[rgba(223,244,240,0.84)] underline decoration-white/20 underline-offset-4"
              href={item.url}
              onClick={() =>
                void trackAnalyticsEvent("source_reference_clicked", {
                  report_date: reportDate,
                  workstream,
                  recommendation_id: recommendationId,
                  evidence_source: item.source,
                  surface: "evidence_pack",
                  archive_mode: archiveMode
                })
              }
              rel="noreferrer"
              target="_blank"
            >
              Open source reference
            </a>
          </article>
        ))}
      </div>
    </details>
  );
}
