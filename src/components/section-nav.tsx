"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dimension } from "@/content/memory-content";

export function SectionNav({ sections }: { sections: Dimension[] }) {
  return (
    <aside className="top-24 h-fit lg:sticky">
      <div className="glass-card noise-grid rounded-3xl p-4">
        <div className="mb-4 px-2">
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Dimension Map</div>
          <h2 className="mt-2 text-sm font-semibold text-white">6 个独立页面</h2>
        </div>
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
            >
              <Link
                href={`/dimensions/${section.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-800/70 bg-zinc-950/55 px-3 py-3 transition hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-400 group-hover:text-white">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-100">{section.navLabel}</div>
                  <div className="truncate text-xs text-zinc-500">{section.summaryLabel}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
