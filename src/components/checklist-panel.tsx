"use client";

import { motion } from "framer-motion";

export function ChecklistPanel({ items }: { items: string[] }) {
  return (
    <section id="checklist" className="scroll-mt-28">
      <div className="section-shell rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Design Checklist</div>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              如何比较一个 agent memory 方案
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
              真正有用的比较框架，不是问“有没有长期记忆”，而是看短期、长期、工作记忆与治理目标是否在同一条设计线上。
            </p>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <div className="space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.24, delay: index * 0.04 }}
                  className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/55 px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-zinc-200">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
