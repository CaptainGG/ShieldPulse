import { SignalBreakdownDrawer } from "@/components/signal-breakdown-drawer";
import { WorkstreamInsight, workstreamMeta } from "@/lib/types";
import { ConfidenceBar } from "./confidence-bar";

type Props = {
  insight: WorkstreamInsight;
};

export function ScenarioCard({ insight }: Props) {
  const tone = workstreamMeta[insight.workstream].accent;

  return (
    <article className="panel rounded-card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(223,244,240,0.52)]">
            {workstreamMeta[insight.workstream].label}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-none text-[var(--color-cream)] md:text-5xl">
            {insight.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(223,244,240,0.76)] md:text-lg">
            {insight.summary}
          </p>
        </div>
        <div className="min-w-[220px] rounded-[22px] border border-white/10 bg-black/10 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.5)]">Key tension</p>
          <p className="mt-2 leading-6 text-[rgba(223,244,240,0.88)]">{insight.keyTension}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {insight.recommendations.map((recommendation) => (
            <section
              key={recommendation.id}
              aria-label={`${recommendation.label} recommendation`}
              className="rounded-[24px] border border-white/10 bg-black/10 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="max-w-3xl text-2xl font-semibold text-[var(--color-cream)]">{recommendation.label}</h3>
                <span
                  className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em]"
                  style={{ backgroundColor: `${tone}22`, color: tone }}
                >
                  {recommendation.impact}
                </span>
              </div>
              <div className="mt-4">
                <ConfidenceBar label="Analyst confidence" value={recommendation.confidence} tone={tone} />
              </div>
              <p className="mt-4 text-sm leading-6 text-[rgba(223,244,240,0.8)] md:text-base">
                {recommendation.rationale}
              </p>
              <div className="mt-4">
                <SignalBreakdownDrawer
                  evidence={insight.evidence}
                  supportingEvidenceIds={recommendation.supportingEvidenceIds}
                />
              </div>
            </section>
          ))}
        </div>
        <aside className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.52)]">Section read</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[rgba(223,244,240,0.78)]">
            <li>{insight.evidence.length} evidence sources reviewed</li>
            <li>{insight.recommendations.length} recommended moves surfaced</li>
            <li>
              Updated{" "}
              {new Date(insight.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </li>
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[rgba(223,244,240,0.52)]">Why this matters</p>
          <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">
            {workstreamMeta[insight.workstream].description}
          </p>
        </aside>
      </div>
    </article>
  );
}
