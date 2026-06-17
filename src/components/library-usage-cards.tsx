import type { LibraryUsageCard } from "@/content/memory-content";

function SourcePaths({ paths }: { paths: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {paths.map((path) => (
        <code
          key={path}
          className="rounded-full border border-emerald-500/20 bg-zinc-950/80 px-2.5 py-1 text-[10px] leading-5 text-emerald-100/80"
        >
          {path}
        </code>
      ))}
    </div>
  );
}

function MiniSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="mt-2 text-sm leading-7 text-zinc-200">{children}</div>
    </div>
  );
}

export function LibraryUsageCards({ items }: { items: LibraryUsageCard[] }) {
  return (
    <section className="section-shell rounded-[1.75rem] p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Library Guide</div>
      <h2 className="mt-3 text-3xl font-semibold text-white">开源 Agent Memory 库的作用与接入方式</h2>
      <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
        每张卡片对应一个可参考的库或框架模块，重点放在源码中可追踪的入口、最小接入流程和适用边界。
      </p>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {items.map((item, index) => (
          <article
            key={item.project}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-zinc-950/65 p-5 transition hover:border-emerald-400/40 hover:shadow-[0_20px_70px_rgba(16,185,129,0.1)]"
          >
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-emerald-300/80">
                    {String(index + 1).padStart(2, "0")} · {item.category}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{item.project}</h3>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  {item.status}
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-50">
                <span className="font-semibold text-emerald-200">作用：</span>
                {item.role}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <MiniSection label="源码依据">
                  <p>{item.sourceBasis}</p>
                  <SourcePaths paths={item.sourcePaths} />
                </MiniSection>

                <MiniSection label="适用场景">
                  <p>{item.bestFor}</p>
                </MiniSection>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">接入步骤</div>
                <ol className="mt-3 space-y-2 text-sm leading-7 text-zinc-200">
                  {item.useSteps.map((step, stepIndex) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-[11px] text-emerald-200">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-black/35">
                <div className="border-b border-zinc-800 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                  最小代码形态
                </div>
                <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-200">
                  <code>{item.minimalCode}</code>
                </pre>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-50">
                <span className="font-semibold text-amber-200">注意：</span>
                {item.caveat}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
