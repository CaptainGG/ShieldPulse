"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid-shell flex min-h-screen items-center justify-center px-4">
      <div className="panel rounded-card max-w-xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-[rgba(223,244,240,0.52)]">ShieldPulse</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold leading-none">
          The weekly readout hit an unexpected fault.
        </h1>
        <p className="mt-4 text-base leading-7 text-[rgba(223,244,240,0.76)]">
          {error.message || "Something went wrong while loading the latest mobile analytics report."}
        </p>
        <button
          className="mt-6 rounded-full bg-white px-5 py-3 font-medium text-[var(--color-ink)]"
          onClick={reset}
          type="button"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
