import type { ProjectComparison } from "@/content/memory-content";

const columnDescriptions = [
  { label: "Project", description: "项目与路线归类", width: "w-[150px]" },
  { label: "Core Paths", description: "源码核验入口", width: "w-[130px]" },
  { label: "Route", description: "整体实现路线", width: "w-[285px]" },
  { label: "Write", description: "记忆如何形成/写入", width: "w-[285px]" },
  { label: "Read", description: "记忆如何召回/进入上下文", width: "w-[285px]" },
  { label: "Storage", description: "持久化与索引后端", width: "w-[200px]" },
  { label: "Best Fit", description: "最适合的 agent 场景", width: "w-[175px]" },
  { label: "Risk", description: "主要工程风险", width: "w-[235px]" },
];

function ProjectRow({ item, subtle = false }: { item: ProjectComparison; subtle?: boolean }) {
  return (
    <tr
      className={`border-b align-top last:border-b-0 ${
        subtle
          ? "border-zinc-900/80 hover:bg-zinc-900/30"
          : "border-cyan-950/70 hover:bg-cyan-950/15"
      }`}
    >
      <td className="px-4 py-5">
        <div className="font-semibold text-white">{item.project}</div>
        <div
          className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] ${
            subtle
              ? "border-zinc-700 bg-zinc-900/70 text-zinc-400"
              : "border-cyan-400/35 bg-cyan-400/10 text-cyan-200"
          }`}
        >
          {item.category}
        </div>
      </td>
      <td className="px-3 py-5 text-xs leading-6 text-zinc-300">
        <ul className="space-y-1.5">
          {item.corePaths.map((path) => (
            <li key={path}>
              <code className="block break-all rounded-lg border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[9px] leading-4 text-zinc-400">
                {path}
              </code>
            </li>
          ))}
        </ul>
      </td>
      <td className="px-5 py-5 leading-8 text-zinc-300">{item.route}</td>
      <td className="px-5 py-5 leading-8 text-zinc-300">{item.writePath}</td>
      <td className="px-5 py-5 leading-8 text-zinc-300">{item.readPath}</td>
      <td className="px-4 py-5 leading-8 text-zinc-300">{item.storage}</td>
      <td className="px-4 py-5 leading-8 text-zinc-300">{item.bestFit}</td>
      <td className="px-5 py-5 leading-8 text-zinc-300">{item.risk}</td>
    </tr>
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
      className={`overflow-x-auto rounded-3xl border ${
        subtle
          ? "border-zinc-800 bg-zinc-950/45"
          : "border-cyan-400/30 bg-gradient-to-br from-cyan-950/30 via-zinc-950/80 to-zinc-950/70 shadow-[0_0_45px_rgba(34,211,238,0.08)]"
      }`}
    >
      <table className="min-w-[1745px] table-fixed border-collapse text-left text-sm">
        <thead
          className={`text-xs uppercase tracking-[0.12em] ${
            subtle
              ? "bg-zinc-900/80 text-zinc-500"
              : "bg-cyan-950/60 text-cyan-100"
          }`}
        >
          <tr>
            {columnDescriptions.map((column) => (
              <th
                key={column.label}
                className={`${column.width} border-b px-4 py-4 font-medium ${
                  subtle ? "border-zinc-800" : "border-cyan-500/25"
                }`}
              >
                <div className="text-[12px] font-semibold text-white">{column.label}</div>
                <div
                  className={`mt-1 normal-case tracking-normal ${
                    subtle ? "text-[11px] text-zinc-500" : "text-[11px] text-cyan-200/80"
                  }`}
                >
                  {column.description}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ProjectRow key={item.project} item={item} subtle={subtle} />
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
        <p className="mt-4 max-w-5xl text-sm leading-8 text-zinc-300">
          主表只保留以 agent memory 为核心能力、且能在源码中追踪写入、持久化、召回和上下文注入链路的项目。
          表头第二行说明每列的判断含义；阅读时优先比较 Route、Write、Read 和 Storage，而不是只看项目名或 star 数。
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "Write: 是否有明确记忆形成入口",
            "Storage: 是否有长期持久化后端",
            "Read: 是否能按需召回并进入上下文",
            "Risk: 是否暴露污染、同步或治理成本",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-xs leading-6 text-cyan-100/90">
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
          <h3 className="mt-3 text-2xl font-semibold text-zinc-100">弱相关或框架型 memory 参考</h3>
          <p className="mt-3 max-w-5xl text-sm leading-8 text-zinc-400">
            这些项目包含 memory 接口、memory block 或用户记忆模块，但项目主体更偏 agent framework、RAG framework 或工具编排。
            它们适合作为接口设计与集成方式参考，不作为最核心的 agent memory 系统样本。
          </p>
          <div className="mt-5">
            <ComparisonTable items={secondaryItems} subtle />
          </div>
        </div>
      ) : null}
    </section>
  );
}
