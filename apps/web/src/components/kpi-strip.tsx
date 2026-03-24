import { KpiMetric } from "@/lib/types";

type Props = {
  kpis: KpiMetric[];
};

export function KpiStrip({ kpis }: Props) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map((metric) => {
        const trendColor =
          metric.trend === "up"
            ? "#6bd2c1"
            : metric.trend === "down"
              ? "#fb7185"
              : "rgba(223,244,240,0.72)";

        return (
          <article key={metric.id} className="panel rounded-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(223,244,240,0.54)]">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold text-[var(--color-cream)]">{metric.value}</p>
              <span
                className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
                style={{ backgroundColor: `${trendColor}22`, color: trendColor }}
              >
                {metric.change}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[rgba(223,244,240,0.74)]">{metric.note}</p>
          </article>
        );
      })}
    </section>
  );
}
