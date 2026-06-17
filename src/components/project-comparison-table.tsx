import type { ProjectComparison } from "@/content/memory-content";

const focusLabels = ["写入入口", "长期持久化", "召回注入", "治理风险"];

function FieldBlock({
  label,
  children,
  subtle = false,
}: {
  label: string;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        subtle ? "border-zinc-800 bg-zinc-950/45" : "border-cyan-500/15 bg-cyan-500/[0.04]"
      }`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
          subtle ? "text-zinc-500" : "text-cyan-200/80"
        }`}
      >
        {label}
      </div>
      <div className="mt-3 text-sm leading-8 text-zinc-300">{children}</div>
    </div>
  );
}

function SourcePaths({ paths, subtle = false }: { paths: string[]; subtle?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {paths.map((path) => (
        <code
          key={path}
          className={`rounded-full border px-2.5 py-1 text-[10px] leading-5 ${
            subtle
              ? "border-zinc-800 bg-zinc-950/80 text-zinc-500"
              : "border-cyan-500/20 bg-zinc-950/70 text-cyan-100/80"
          }`}
        >
          {path}
        </code>
      ))}
    </div>
  );
}

function ProjectCard({ item, subtle = false }: { item: ProjectComparison; subtle?: boolean }) {
  return (
    <article
      className={`rounded-[1.75rem] border p-5 ${
        subtle
          ? "border-zinc-800 bg-zinc-950/45"
          : "border-cyan-400/25 bg-gradient-to-br from-cyan-950/35 via-zinc-950/85 to-zinc-950/75 shadow-[0_0_45px_rgba(34,211,238,0.08)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold text-white">{item.project}</div>
          <div
            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs ${
              subtle
                ? "border-zinc-700 bg-zinc-900/70 text-zinc-400"
                : "border-cyan-400/35 bg-cyan-400/10 text-cyan-200"
            }`}
          >
            {item.category}
          </div>
        </div>
        <div
          className={`rounded-2xl border px-3 py-2 text-[11px] uppercase tracking-[0.2em] ${
            subtle
              ? "border-zinc-800 bg-zinc-950/70 text-zinc-500"
              : "border-cyan-500/20 bg-cyan-500/5 text-cyan-100/80"
          }`}
        >
          {subtle ? "Reference" : "Core"}
        </div>
      </div>

      <div className="mt-5">
        <SourcePaths paths={item.corePaths} subtle={subtle} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <FieldBlock label="Route" subtle={subtle}>{item.route}</FieldBlock>
        <FieldBlock label="Storage" subtle={subtle}>{item.storage}</FieldBlock>
        <FieldBlock label="Write" subtle={subtle}>{item.writePath}</FieldBlock>
        <FieldBlock label="Read" subtle={subtle}>{item.readPath}</FieldBlock>
        <FieldBlock label="Best Fit" subtle={subtle}>{item.bestFit}</FieldBlock>
        <FieldBlock label="Risk" subtle={subtle}>{item.risk}</FieldBlock>
      </div>
    </article>
  );
}

function ProjectCardGrid({ items, subtle = false }: { items: ProjectComparison[]; subtle?: boolean }) {
  return (
    <div className="grid gap-5">
      {items.map((item) => (
        <ProjectCard key={item.project} item={item} subtle={subtle} />
      ))}
    </div>
  );
}

export function ProjectComparisonTable({ items }: { items: ProjectComparison[] }) {
  const primaryItems = items.filter((item) => item.tier !== "secondary");
  const secondaryItems = items.filter((item) => item.tier === "secondary");

  return (
    <section className="space-y-8">
      <div className="section-shell rounded-[1.75rem] border-cyan-400/20 p-6">
        <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          Primary Code Comparison
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-white">最符合要求的 Agent Memory 核心实现</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {focusLabels.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-center text-xs font-medium tracking-[0.16em] text-cyan-100/90"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <ProjectCardGrid items={primaryItems} />
        </div>
      </div>

      {secondaryItems.length ? (
        <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/35 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Secondary References</div>
          <h3 className="mt-3 text-2xl font-semibold text-zinc-100">框架与接口型 memory 参考</h3>
          <div className="mt-5">
            <ProjectCardGrid items={secondaryItems} subtle />
          </div>
        </div>
      ) : null}
    </section>
  );
}
