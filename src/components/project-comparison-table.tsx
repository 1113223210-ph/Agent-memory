import type { ProjectComparison } from "@/content/memory-content";

const focusLabels = ["写入入口", "长期持久化", "召回注入", "治理风险"];

function SourcePaths({ paths, subtle = false }: { paths: string[]; subtle?: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
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

function MetaLabel({ children, subtle = false }: { children: React.ReactNode; subtle?: boolean }) {
  return (
    <div
      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
        subtle ? "text-zinc-500" : "text-cyan-200/80"
      }`}
    >
      {children}
    </div>
  );
}

function StackedCell({
  sections,
  subtle = false,
}: {
  sections: Array<{ label: string; value: React.ReactNode }>;
  subtle?: boolean;
}) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.label}>
          <MetaLabel subtle={subtle}>{section.label}</MetaLabel>
          <div className="mt-2 text-sm leading-8 text-zinc-300">{section.value}</div>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({
  items,
  subtle = false,
}: {
  items: ProjectComparison[];
  subtle?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border ${
        subtle
          ? "border-zinc-800 bg-zinc-950/45"
          : "border-cyan-400/30 bg-gradient-to-br from-cyan-950/30 via-zinc-950/85 to-zinc-950/75 shadow-[0_0_45px_rgba(34,211,238,0.08)]"
      }`}
    >
      <table className="w-full table-fixed border-collapse text-left">
        <thead className={subtle ? "bg-zinc-900/80" : "bg-cyan-950/55"}>
          <tr>
            {[
              ["项目", "Project", "w-[16%]"],
              ["实现路线 / 源码入口", "Route / Source", "w-[28%]"],
              ["写入 / 召回", "Write / Read", "w-[30%]"],
              ["存储 / 场景 / 风险", "Storage / Fit / Risk", "w-[26%]"],
            ].map(([label, hint, width]) => (
              <th
                key={label}
                className={`${width} border-b px-4 py-4 ${
                  subtle ? "border-zinc-800 text-zinc-500" : "border-cyan-500/25 text-cyan-100"
                }`}
              >
                <div className="text-sm font-semibold tracking-[0.08em] text-white">{label}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] opacity-70">{hint}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.project}
              className={`border-b align-top last:border-b-0 ${
                subtle ? "border-zinc-900/80" : "border-cyan-950/80"
              }`}
            >
              <td className="px-4 py-5">
                <div className="text-lg font-semibold text-white">{item.project}</div>
                <div
                  className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] ${
                    subtle
                      ? "border-zinc-700 bg-zinc-900/70 text-zinc-400"
                      : "border-cyan-400/35 bg-cyan-400/10 text-cyan-200"
                  }`}
                >
                  {item.category}
                </div>
              </td>
              <td className="px-4 py-5">
                <StackedCell
                  subtle={subtle}
                  sections={[
                    { label: "实现路线", value: item.route },
                    { label: "源码入口", value: <SourcePaths paths={item.corePaths} subtle={subtle} /> },
                  ]}
                />
              </td>
              <td className="px-4 py-5">
                <StackedCell
                  subtle={subtle}
                  sections={[
                    { label: "写入路径", value: item.writePath },
                    { label: "召回路径", value: item.readPath },
                  ]}
                />
              </td>
              <td className="px-4 py-5">
                <StackedCell
                  subtle={subtle}
                  sections={[
                    { label: "存储后端", value: item.storage },
                    { label: "适用场景", value: item.bestFit },
                    { label: "主要风险", value: item.risk },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <ComparisonTable items={primaryItems} />
        </div>
      </div>

      {secondaryItems.length ? (
        <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/35 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Secondary References</div>
          <h3 className="mt-3 text-2xl font-semibold text-zinc-100">框架与接口型 memory 参考</h3>
          <div className="mt-5">
            <ComparisonTable items={secondaryItems} subtle />
          </div>
        </div>
      ) : null}
    </section>
  );
}
