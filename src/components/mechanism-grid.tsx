"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getMechanismDetail, type Accent, type MechanismItem } from "@/content/memory-content";
import { MechanismDetailDialog } from "@/components/mechanism-detail-dialog";

const ACCENT_STYLES: Record<Accent, { border: string; glow: string; badge: string }> = {
  blue: {
    border: "border-sky-500/25 hover:border-sky-400/45",
    glow: "hover:shadow-[0_18px_60px_rgba(59,130,246,0.12)]",
    badge: "bg-sky-500/12 text-sky-300 border-sky-500/25",
  },
  green: {
    border: "border-emerald-500/25 hover:border-emerald-400/45",
    glow: "hover:shadow-[0_18px_60px_rgba(16,185,129,0.12)]",
    badge: "bg-emerald-500/12 text-emerald-300 border-emerald-500/25",
  },
  purple: {
    border: "border-violet-500/25 hover:border-violet-400/45",
    glow: "hover:shadow-[0_18px_60px_rgba(139,92,246,0.12)]",
    badge: "bg-violet-500/12 text-violet-300 border-violet-500/25",
  },
  amber: {
    border: "border-amber-500/25 hover:border-amber-400/45",
    glow: "hover:shadow-[0_18px_60px_rgba(245,158,11,0.12)]",
    badge: "bg-amber-500/12 text-amber-300 border-amber-500/25",
  },
  rose: {
    border: "border-rose-500/25 hover:border-rose-400/45",
    glow: "hover:shadow-[0_18px_60px_rgba(244,63,94,0.12)]",
    badge: "bg-rose-500/12 text-rose-300 border-rose-500/25",
  },
  cyan: {
    border: "border-cyan-500/25 hover:border-cyan-400/45",
    glow: "hover:shadow-[0_18px_60px_rgba(34,211,238,0.12)]",
    badge: "bg-cyan-500/12 text-cyan-300 border-cyan-500/25",
  },
};

const EXPAND_BUTTON_STYLES: Record<Accent, string> = {
  blue: "border-sky-500/40 bg-sky-500/12 text-sky-300 hover:border-sky-400/70 hover:bg-sky-500/18 hover:text-sky-200",
  green: "border-emerald-500/40 bg-emerald-500/12 text-emerald-300 hover:border-emerald-400/70 hover:bg-emerald-500/18 hover:text-emerald-200",
  purple: "border-violet-500/40 bg-violet-500/12 text-violet-300 hover:border-violet-400/70 hover:bg-violet-500/18 hover:text-violet-200",
  amber: "border-amber-500/40 bg-amber-500/12 text-amber-300 hover:border-amber-400/70 hover:bg-amber-500/18 hover:text-amber-200",
  rose: "border-rose-500/40 bg-rose-500/12 text-rose-300 hover:border-rose-400/70 hover:bg-rose-500/18 hover:text-rose-200",
  cyan: "border-cyan-500/40 bg-cyan-500/12 text-cyan-300 hover:border-cyan-400/70 hover:bg-cyan-500/18 hover:text-cyan-200",
};

export function MechanismGrid({ accent, items }: { accent: Accent; items: MechanismItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [detailKey, setDetailKey] = useState<string | null>(null);
  const style = ACCENT_STYLES[accent];
  const expandButtonStyle = EXPAND_BUTTON_STYLES[accent];
  const activeDetail = detailKey
    ? items
        .map((item) => getMechanismDetail(item.title))
        .find((detail) => detail?.key === detailKey) ?? null
    : null;

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const detail = getMechanismDetail(item.title);

          return (
            <motion.article
              key={item.title}
              layout
              className={`rounded-3xl border bg-zinc-950/60 p-5 transition ${style.border} ${style.glow}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] tracking-wide ${style.badge}`}>
                    {item.tag}
                  </span>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                    {detail ? (
                      <button
                        type="button"
                        onClick={() => setDetailKey(detail.key)}
                        className="mechanism-link rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs"
                      >
                        详细讲解
                      </button>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`mt-1 inline-flex shrink-0 items-center gap-3 rounded-full border px-3 py-2 text-sm font-medium shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition ${expandButtonStyle}`}
                  aria-label={isOpen ? `收起 ${item.title}` : `展开 ${item.title}`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current/30 bg-black/15 text-2xl leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                  <span className="hidden sm:inline">{isOpen ? "收起详情" : "展开详情"}</span>
                </button>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">{item.summary}</p>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 space-y-4 border-t border-zinc-800 pt-4 text-sm leading-7">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Strengths</div>
                        <p className="mt-1 text-zinc-200">{item.strengths}</p>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Risks</div>
                        <p className="mt-1 text-zinc-200">{item.risks}</p>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Best Fit</div>
                        <p className="mt-1 text-zinc-200">{item.fit}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      <MechanismDetailDialog detail={activeDetail} onClose={() => setDetailKey(null)} />
    </>
  );
}
