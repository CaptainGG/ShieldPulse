"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackAnalyticsEvent, useTrackOnceOnView } from "@/lib/analytics";
import { MeasurementPlan } from "@/lib/types";

type Props = {
  plan: MeasurementPlan;
};

type ExperimentCardProps = {
  expectedLift: string;
  hypothesis: string;
  name: string;
  successMetric: string;
};

function ExperimentCard({ expectedLift, hypothesis, name, successMetric }: ExperimentCardProps) {
  const trackRef = useTrackOnceOnView(
    "experiment_backlog_item_viewed",
    {
      experiment_name: name,
      surface: "measurement_plan"
    },
    name,
    { threshold: 0.65 }
  );

  return (
    <article ref={trackRef} className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <p className="text-xl font-semibold text-[var(--color-cream)]">{name}</p>
      <p className="mt-3 text-sm leading-6 text-[rgba(223,244,240,0.74)]">{hypothesis}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.54)]">Success metric</p>
      <p className="mt-1 text-sm text-[rgba(223,244,240,0.82)]">{successMetric}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.54)]">Expected lift</p>
      <p className="mt-1 text-sm text-[rgba(223,244,240,0.82)]">{expectedLift}</p>
    </article>
  );
}

export function SettingsPageContent({ plan }: Props) {
  useEffect(() => {
    void trackAnalyticsEvent("measurement_plan_viewed", {
      surface: "measurement_plan"
    });
  }, []);

  return (
    <main className="grid-shell min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="panel rounded-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(223,244,240,0.52)]">Measurement plan</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold leading-none md:text-6xl">
            Measure trust, activation, and revenue without over-collecting.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[rgba(223,244,240,0.76)]">{plan.summary}</p>
          <div className="mt-6">
            <Link className="rounded-full border border-white/10 px-4 py-2 text-sm" href="/">
              Back to weekly readout
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <article className="panel rounded-card p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.5)]">Tracked events</p>
            <h2 className="mt-2 text-3xl font-semibold">{plan.title}</h2>
            <div className="mt-6 space-y-4">
              {plan.trackedEvents.map((event) => (
                <div key={event.event} className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-medium text-[var(--color-cream)]">{event.event}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.68)]">
                      {event.owner}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">{event.whyItMatters}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel rounded-card p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.5)]">Core funnel</p>
            <h2 className="mt-2 text-3xl font-semibold">What the team should watch every week.</h2>
            <div className="mt-6 space-y-3">
              {plan.funnelSteps.map((step) => (
                <div key={step.step} className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <p className="text-lg font-medium text-[var(--color-cream)]">{step.step}</p>
                  <p className="mt-2 text-sm text-[rgba(223,244,240,0.7)]">{step.metric}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.54)]">
                    Benchmark: {step.benchmark}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="panel rounded-card p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.5)]">Instrumentation gaps</p>
            <div className="mt-5 space-y-4">
              {plan.instrumentationGaps.map((gap) => (
                <div key={gap.issue} className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <p className="text-lg font-medium text-[var(--color-cream)]">{gap.issue}</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">
                    <strong className="font-semibold text-[var(--color-cream)]">Risk:</strong> {gap.risk}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">
                    <strong className="font-semibold text-[var(--color-cream)]">Fix:</strong> {gap.fix}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel rounded-card p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.5)]">Privacy & cost guardrails</p>
            <div className="mt-5 space-y-4">
              {plan.guardrails.map((guardrail) => (
                <div key={guardrail.title} className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <p className="text-lg font-medium text-[var(--color-cream)]">{guardrail.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">{guardrail.guidance}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel rounded-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.5)]">Analytics instrumentation</p>
          <h2 className="mt-2 text-3xl font-semibold">Amplitude events implemented in the demo.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[rgba(223,244,240,0.74)]">
            {plan.analyticsInstrumentation.summary} The integration runs only when
            {" "}
            <code>NEXT_PUBLIC_AMPLITUDE_API_KEY</code>
            {" "}
            is configured. Without a key, the app remains fully usable and can optionally log analytics calls locally.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              {plan.analyticsInstrumentation.events.map((event) => (
                <article key={event.name} className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-medium text-[var(--color-cream)]">{event.name}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.68)]">
                      {event.amplitudeSurface}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">{event.trigger}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.54)]">
                    Key properties
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {event.keyProperties.map((property) => (
                      <span
                        key={`${event.name}-${property}`}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-[rgba(223,244,240,0.82)]"
                      >
                        {property}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="space-y-4">
              <article className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                <p className="text-lg font-medium text-[var(--color-cream)]">Cohort dimensions</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[rgba(223,244,240,0.74)]">
                  {plan.analyticsInstrumentation.cohortDimensions.map((dimension) => (
                    <li key={dimension}>{dimension}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                <p className="text-lg font-medium text-[var(--color-cream)]">Example properties</p>
                <div className="mt-3 space-y-3">
                  {plan.analyticsInstrumentation.exampleProperties.map((property) => (
                    <div key={property.property} className="rounded-[18px] border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-medium text-[var(--color-cream)]">{property.property}</p>
                      <p className="mt-1 text-sm leading-6 text-[rgba(223,244,240,0.74)]">{property.description}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[rgba(223,244,240,0.54)]">
                        Example: {property.example}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="panel rounded-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.5)]">Experiment backlog</p>
          <h2 className="mt-2 text-3xl font-semibold">Three next bets to validate quickly.</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {plan.experiments.map((experiment) => (
              <ExperimentCard
                key={experiment.name}
                expectedLift={experiment.expectedLift}
                hypothesis={experiment.hypothesis}
                name={experiment.name}
                successMetric={experiment.successMetric}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
