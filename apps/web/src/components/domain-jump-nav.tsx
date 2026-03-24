import { WorkstreamSlug, workstreamMeta } from "@/lib/types";

type Props = {
  domains: WorkstreamSlug[];
};

export function DomainJumpNav({ domains }: Props) {
  return (
    <nav className="sticky top-4 z-20 rounded-full border border-white/10 bg-[rgba(7,20,22,0.82)] px-3 py-2 backdrop-blur">
      <ul className="flex flex-wrap items-center gap-2">
        {domains.map((domain) => (
          <li key={domain}>
            <a
              className="inline-flex rounded-full px-4 py-2 text-sm font-medium text-[rgba(223,244,240,0.8)] transition hover:bg-white/10"
              href={`#${domain}`}
            >
              {workstreamMeta[domain].label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
