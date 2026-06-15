"use client";

import { motion } from "framer-motion";
import type { Dimension } from "@/content/memory-content";
import { MechanismGrid } from "@/components/mechanism-grid";

const ACCENT_RING: Record<Dimension["accent"], string> = {
  blue: "from-sky-500/18 via-sky-400/6 to-transparent",
  green: "from-emerald-500/18 via-emerald-400/6 to-transparent",
  purple: "from-violet-500/18 via-violet-400/6 to-transparent",
  amber: "from-amber-500/18 via-amber-400/6 to-transparent",
  rose: "from-rose-500/18 via-rose-400/6 to-transparent",
  cyan: "from-cyan-500/18 via-cyan-400/6 to-transparent",
};

export function DimensionCard({ dimension, index }: { dimension: Dimension; index: number }) {
  return (
    <motion.section
      id={dimension.id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="scroll-mt-28"
    >
      <div className={`section-shell relative overflow-hidden rounded-[2rem] p-6 md:p-8`}>
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ACCENT_RING[dimension.accent]}`} />
        <div className="relative">
          <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">{dimension.eyebrow}</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {dimension.title}
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
                {dimension.thesis}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">{dimension.definition}</p>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Design Questions</div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
                {dimension.designQuestions.map((question) => (
                  <li key={question} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <MechanismGrid accent={dimension.accent} items={dimension.mechanisms} />
        </div>
      </div>
    </motion.section>
  );
}
