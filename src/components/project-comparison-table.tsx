import type { ProjectComparison } from "@/content/memory-content";

export function ProjectComparisonTable({ items }: { items: ProjectComparison[] }) {
  return (
    <section className="section-shell rounded-[1.75rem] p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Code Comparison</div>
      <h2 className="mt-3 text-3xl font-semibold text-white">把源码实现路线放在同一张表里看</h2>
      <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
        这张表不是 star 排行榜，而是看每个项目到底把 memory 放在哪一层：有人做成独立服务，有人做成框架接口，
        有人主要解决会话压缩和状态恢复。横向比较时，重点看写入、读取、存储和风险是否匹配你的 agent 类型。
      </p>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/55">
        <table className="min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Project</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Core Paths</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Route</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Write</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Read</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Storage</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Best Fit</th>
              <th className="border-b border-zinc-800 px-4 py-4 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.project} className="border-b border-zinc-900/90 align-top last:border-b-0">
                <td className="w-[150px] px-4 py-5">
                  <div className="font-semibold text-white">{item.project}</div>
                  <div className="mt-2 inline-flex rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-300">
                    {item.category}
                  </div>
                </td>
                <td className="w-[230px] px-4 py-5 text-xs leading-6 text-zinc-300">
                  <ul className="space-y-2">
                    {item.corePaths.map((path) => (
                      <li key={path}>
                        <code className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-2 py-1 text-[11px] text-zinc-200">
                          {path}
                        </code>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="w-[190px] px-4 py-5 leading-7 text-zinc-300">{item.route}</td>
                <td className="w-[190px] px-4 py-5 leading-7 text-zinc-300">{item.writePath}</td>
                <td className="w-[190px] px-4 py-5 leading-7 text-zinc-300">{item.readPath}</td>
                <td className="w-[150px] px-4 py-5 leading-7 text-zinc-300">{item.storage}</td>
                <td className="w-[160px] px-4 py-5 leading-7 text-zinc-300">{item.bestFit}</td>
                <td className="w-[170px] px-4 py-5 leading-7 text-zinc-300">{item.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
