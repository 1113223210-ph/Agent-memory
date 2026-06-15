"use client";

import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <motion.a
          href="#top"
          className="flex items-center gap-3 text-white no-underline"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sm font-semibold text-sky-300">
            AM
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-400">专题网页</div>
            <div className="text-base font-semibold tracking-tight">Agent Memory</div>
          </div>
        </motion.a>

        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
            Mechanism Overview
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
            中文主叙述 + 英文术语
          </span>
        </div>
      </div>
    </header>
  );
}
