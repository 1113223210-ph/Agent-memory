"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { dimensions, getMechanismDetail, type Dimension } from "@/content/memory-content";
import { MechanismGrid } from "@/components/mechanism-grid";
import { MechanismDetailDialog } from "@/components/mechanism-detail-dialog";
import { ProjectComparisonTable } from "@/components/project-comparison-table";

export function DetailShell({ dimension }: { dimension: Dimension }) {
  const [activeMechanismKey, setActiveMechanismKey] = useState<string | null>(null);
  const activeMechanism =
    dimension.mainstreamMechanisms
      .map((item) => getMechanismDetail(item))
      .find((detail) => detail?.key === activeMechanismKey) ?? null;
  const currentIndex = dimensions.findIndex((item) => item.id === dimension.id);
  const previousDimension = currentIndex > 0 ? dimensions[currentIndex - 1] : null;
  const nextDimension = currentIndex >= 0 && currentIndex < dimensions.length - 1
    ? dimensions[currentIndex + 1]
    : null;

  return (
    <>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-20 pt-8 lg:px-8">
        <section className="section-shell relative overflow-hidden rounded-[2rem] p-7 md:p-9">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-zinc-400 transition hover:text-white"
              >
                <span aria-hidden="true">←</span>
                返回总览
              </Link>
              {previousDimension ? (
                <Link
                  href={`/dimensions/${previousDimension.id}/`}
                  className="inline-flex items-center gap-2 text-zinc-500 transition hover:text-zinc-200"
                >
                  <span aria-hidden="true">·</span>
                  上一章
                </Link>
              ) : null}
              {nextDimension ? (
                <Link
                  href={`/dimensions/${nextDimension.id}/`}
                  className="inline-flex items-center gap-2 text-zinc-500 transition hover:text-zinc-200"
                >
                  <span aria-hidden="true">·</span>
                  下一章
                </Link>
              ) : null}
            </div>

            <div className="mt-5 text-xs uppercase tracking-[0.3em] text-zinc-500">{dimension.eyebrow}</div>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {dimension.title}
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-zinc-300 md:text-lg">
              {dimension.thesis}
            </p>
            <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-400">{dimension.definition}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card rounded-[1.75rem] p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Plain Explanation</div>
            <p className="mt-4 text-sm leading-8 text-zinc-200">{dimension.plainExplanation}</p>
          </div>

          <div className="glass-card rounded-[1.75rem] p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">When To Use</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
              {dimension.whenToUse.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[1.75rem] p-6">
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

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Evaluation Metrics</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {dimension.metrics.map((metric) => (
              <div
                key={metric}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/55 px-4 py-4 text-sm leading-7 text-zinc-200"
              >
                {metric}
              </div>
            ))}
          </div>
        </div>
      </section>

        <section className="section-shell rounded-[1.75rem] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Mainstream Mechanisms</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">先抓住这一页真正主流的机制主线</h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
            这一组不是“所有相关概念”，而是这个维度最核心、最值得先理解的主线。带下划线的机制可以直接点开，会弹出一个更细的解释窗。
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {dimension.mainstreamMechanisms.map((item, index) => {
              const detail = getMechanismDetail(item);

              return detail ? (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveMechanismKey(detail.key)}
                  className="mechanism-link rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm"
                >
                  {index + 1}. {item}
                </button>
              ) : (
                <div
                  key={item}
                  className="rounded-full border border-zinc-700 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-200"
                >
                  {index + 1}. {item}
                </div>
              );
            })}
          </div>
        </section>

      <section className="section-shell rounded-[1.75rem] p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Pipeline</div>
        <h2 className="mt-3 text-3xl font-semibold text-white">把这些机制放回一条工作流里看</h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
          如果只看孤立卡片，机制之间的关系会很模糊。把它们放回 pipeline 中，就能看清每一步在系统里承担什么角色，以及问题通常出在什么位置。
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {dimension.pipeline.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Mechanisms</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">扩展机制与细部取舍</h2>
        </div>
        <MechanismGrid accent={dimension.accent} items={dimension.mechanisms} />
      </section>

      {dimension.projectComparisons ? (
        <ProjectComparisonTable items={dimension.projectComparisons} />
      ) : null}

      <section className="section-shell rounded-[1.75rem] p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Examples</div>
        <h2 className="mt-3 text-3xl font-semibold text-white">把这一章放进真实场景里看</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {dimension.examples.map((example) => (
            <div
              key={example.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
            >
              <h3 className="text-xl font-semibold text-white">{example.title}</h3>
              <p className="mt-3 text-sm leading-8 text-zinc-300">{example.scenario}</p>
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/55 px-4 py-3 text-sm leading-7 text-zinc-200">
                <span className="font-medium text-white">Takeaway:</span> {example.takeaway}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell rounded-[1.75rem] p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Architecture Notes</div>
        <h2 className="mt-3 text-3xl font-semibold text-white">从系统设计角度看这个维度</h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">
          这一部分补充的是更偏 memory system design 的视角：不只看概念本身，而是看这些机制在真实系统里应该放在哪一层、如何被组织、如何被观测。
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {dimension.architectureNotes.map((note) => (
            <div
              key={note}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-200"
            >
              {note}
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell rounded-[1.75rem] p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Misconceptions</div>
        <h2 className="mt-3 text-3xl font-semibold text-white">这一章最容易被误解的地方</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {dimension.misconceptions.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Deep Dive</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">展开理解这个维度</h2>
        </div>

        <div className="grid gap-4">
          {dimension.deepDive.map((section, index) => (
            <motion.article
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.26, delay: index * 0.04 }}
              className="section-shell rounded-[1.75rem] p-6"
            >
              <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
              <p className="mt-4 max-w-4xl text-sm leading-8 text-zinc-300">{section.body}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-200">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

        <section className="section-shell rounded-[1.75rem] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Failure Modes</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">常见失败模式</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {dimension.failureModes.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {previousDimension ? (
            <Link
              href={`/dimensions/${previousDimension.id}/`}
              className="section-shell group rounded-[1.75rem] p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Previous Chapter</div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-zinc-400">{previousDimension.eyebrow}</div>
                  <h3 className="mt-2 text-2xl font-semibold text-white group-hover:text-sky-300">
                    {previousDimension.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {previousDimension.summaryLabel}
                  </p>
                </div>
                <span className="text-zinc-500 transition group-hover:-translate-x-1 group-hover:text-sky-300">
                  ←
                </span>
              </div>
            </Link>
          ) : (
            <div className="section-shell rounded-[1.75rem] p-6 opacity-55">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Previous Chapter</div>
              <h3 className="mt-4 text-2xl font-semibold text-white">已经是第一章</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                这一章前面没有别的章节了，可以继续往后读，或者返回总览。
              </p>
            </div>
          )}

          {nextDimension ? (
            <Link
              href={`/dimensions/${nextDimension.id}/`}
              className="section-shell group rounded-[1.75rem] p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Next Chapter</div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-zinc-400">{nextDimension.eyebrow}</div>
                  <h3 className="mt-2 text-2xl font-semibold text-white group-hover:text-sky-300">
                    {nextDimension.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {nextDimension.summaryLabel}
                  </p>
                </div>
                <span className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-sky-300">
                  →
                </span>
              </div>
            </Link>
          ) : (
            <div className="section-shell rounded-[1.75rem] p-6 opacity-55">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Next Chapter</div>
              <h3 className="mt-4 text-2xl font-semibold text-white">已经是最后一章</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                你已经读到最后一章了，可以回总览重新跳读，或者继续回看前面的章节。
              </p>
            </div>
          )}
        </section>
      </main>

      <MechanismDetailDialog detail={activeMechanism} onClose={() => setActiveMechanismKey(null)} />
    </>
  );
}
