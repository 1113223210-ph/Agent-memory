"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dimension } from "@/content/memory-content";

const ACCENT_CLASS: Record<Dimension["accent"], string> = {
  blue: "from-sky-500/20 via-sky-400/5 to-transparent border-sky-500/20 hover:border-sky-400/40",
  green: "from-emerald-500/20 via-emerald-400/5 to-transparent border-emerald-500/20 hover:border-emerald-400/40",
  purple: "from-violet-500/20 via-violet-400/5 to-transparent border-violet-500/20 hover:border-violet-400/40",
  amber: "from-amber-500/20 via-amber-400/5 to-transparent border-amber-500/20 hover:border-amber-400/40",
  cyan: "from-cyan-500/20 via-cyan-400/5 to-transparent border-cyan-500/20 hover:border-cyan-400/40",
  rose: "from-rose-500/20 via-rose-400/5 to-transparent border-rose-500/20 hover:border-rose-400/40",
};

export function DimensionOverviewCard({
  dimension,
  index,
}: {
  dimension: Dimension;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className={`relative overflow-hidden rounded-[1.75rem] border bg-zinc-950/62 p-6 transition ${ACCENT_CLASS[dimension.accent]}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ACCENT_CLASS[dimension.accent].split(" ").slice(0, 3).join(" ")}`} />
      <div className="relative">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{dimension.eyebrow}</div>
        <h3 className="mt-3 text-2xl font-semibold text-white">{dimension.title}</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-300">{dimension.thesis}</p>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Focus</div>
          <p className="mt-2 text-sm leading-7 text-zinc-200">{dimension.summaryLabel}</p>
        </div>

        <div className="mt-5">
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Preview Questions</div>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-300">
            {dimension.designQuestions.slice(0, 2).map((question) => (
              <li key={question} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={`/dimensions/${dimension.id}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-white transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          查看独立页面
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </motion.article>
  );
}
