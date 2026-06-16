import type { ImplementationRoute } from "@/content/memory-content";

export function ImplementationRouteMap({ routes }: { routes: ImplementationRoute[] }) {
  return (
    <section className="section-shell rounded-[1.75rem] p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Route Map</div>
      <h2 className="mt-3 text-3xl font-semibold text-white">先按实现路线合并，而不是按项目名平铺</h2>
      <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
        很多项目看起来都在做 memory，但其实落点不同。更稳的读法是先把它们归到几条路线里：
        哪些解决长期事实，哪些解决工作流状态，哪些解决 coding agent 上下文续航，哪些在做经验和 skill 演化。
      </p>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {routes.map((route, index) => (
          <article
            key={route.title}
            className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-zinc-950/65 p-5"
          >
            <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-500/25 bg-cyan-500/10 text-sm font-semibold text-cyan-300">
                  {index + 1}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">{route.label}</div>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{route.title}</h3>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {route.projects.map((project) => (
                  <span
                    key={project}
                    className="rounded-full border border-zinc-700 bg-zinc-900/75 px-3 py-1 text-xs text-zinc-200"
                  >
                    {project}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-3 text-sm leading-7 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Solves</div>
                  <p className="mt-2 text-zinc-200">{route.whatItSolves}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Read It As</div>
                  <p className="mt-2 text-zinc-200">{route.howToRead}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Typical Stack</div>
                  <p className="mt-2 text-zinc-200">{route.typicalStack}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Caveat</div>
                  <p className="mt-2 text-zinc-200">{route.caveat}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
