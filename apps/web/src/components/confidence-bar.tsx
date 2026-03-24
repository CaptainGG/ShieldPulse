import clsx from "clsx";

type Props = {
  label: string;
  value: number;
  tone: string;
};

export function ConfidenceBar({ label, value, tone }: Props) {
  const percentage = Math.round(value * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm uppercase tracking-[0.22em] text-[rgba(243,236,223,0.64)]">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={clsx("h-full rounded-full transition-all duration-500")}
          style={{ width: `${percentage}%`, backgroundColor: tone }}
        />
      </div>
    </div>
  );
}
