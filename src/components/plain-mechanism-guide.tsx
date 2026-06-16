import type { PlainMechanismGuide as PlainMechanismGuideItem } from "@/content/memory-content";

export function PlainMechanismGuide({ items }: { items: PlainMechanismGuideItem[] }) {
  return (
    <section className="section-shell rounded-[1.75rem] p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Plain Guide</div>
      <h2 className="mt-3 text-3xl font-semibold text-white">这些 memory 实现机制到底在干嘛</h2>
      <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
        先别急着记术语。可以把不同 memory 路线理解成几种不同的“记事方式”：有的像通讯录，
        有的像档案馆，有的像案件证据板，有的像游戏存档，有的像程序员的工作台。
      </p>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/65 p-5 transition hover:border-cyan-500/35"
          >
            <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm leading-7 text-cyan-100">
              <span className="font-semibold text-cyan-200">像什么：</span>
              {item.analogy}
            </div>
            <div className="mt-4 grid gap-3 text-sm leading-7 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">核心想法</div>
                <p className="mt-2 text-zinc-200">{item.plainIdea}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">怎么工作</div>
                <p className="mt-2 text-zinc-200">{item.howItWorks}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">别误会</div>
                <p className="mt-2 text-zinc-200">{item.easyMisread}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
