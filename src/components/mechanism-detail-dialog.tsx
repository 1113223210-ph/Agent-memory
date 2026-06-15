"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { MechanismDetail } from "@/content/memory-content";

export function MechanismDetailDialog({
  detail,
  onClose,
}: {
  detail: MechanismDetail | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!detail) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [detail, onClose]);

  return (
    <AnimatePresence>
      {detail ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 md:items-center md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:text-white"
              aria-label="关闭"
            >
              ×
            </button>

            <div className="pr-10">
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Mechanism Detail</div>
              <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{detail.title}</h3>
              <p className="mt-4 text-base leading-8 text-zinc-200">{detail.oneLiner}</p>
              <p className="mt-4 text-sm leading-8 text-zinc-300">{detail.explanation}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <SectionCard title="怎么工作" items={detail.howItWorks} />
              <SectionCard title="什么时候适合" items={detail.goodFor} />
              <SectionCard title="要小心什么" items={detail.watchOut} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SectionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/65 p-5">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{title}</div>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
