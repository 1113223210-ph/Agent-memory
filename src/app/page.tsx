"use client";

import { motion } from "framer-motion";
import { ChecklistPanel } from "@/components/checklist-panel";
import { DimensionOverviewCard } from "@/components/dimension-overview-card";
import { Header } from "@/components/header";
import { SectionNav } from "@/components/section-nav";
import {
  checklist,
  dimensions,
  foundationalModel,
  furtherReading,
  heroStats,
} from "@/content/memory-content";

export default function Page() {
  return (
    <div id="top">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-20 pt-8 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="section-shell noise-grid relative overflow-hidden rounded-[2rem] p-7 md:p-9"
          >
            <div className="absolute -right-16 top-6 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Agent Memory Field Guide</div>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                把 agent memory
                <span className="block bg-gradient-to-r from-sky-300 via-white to-violet-300 bg-clip-text text-transparent">
                  拆成 6 个机制维度、2 个总结章和 2 个开源实现页
                </span>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
                这版首页不再把所有内容挤成一个长页面，而是作为总览地图：
                你先在这里看清楚比较框架，再进入每个维度的独立页面做深入阅读。除了机制 taxonomy，本版也更强调 memory system design 视角，例如分层架构、写入管线、检索编排、生命周期治理与评估指标。
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.26 }}
                    className="glass-card rounded-3xl p-5"
                  >
                    <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{stat.label}</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{stat.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.06 }}
            className="glass-card rounded-[2rem] p-6 md:p-7"
          >
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Base Model</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">先把基础三层想清楚</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              参考 Agent Wiki 的骨架，memory 至少要先分清楚短期、长期与工作记忆。后续 6 个维度，其实都是在这三层基础上继续下钻。
            </p>

            <div className="mt-6 space-y-4">
              {foundationalModel.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950/55 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300">
                      {index + 1}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <SectionNav sections={dimensions} />

          <div className="space-y-8">
            <section className="space-y-5">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Six Dimensions</div>
                <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                  6 个比较维度 + 2 个总结章 + 2 个开源实现页
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-zinc-300">
                  首页现在更像一张阅读地图：前面 6 章负责拆开 memory 的关键维度，中间 2 章负责把这些维度重新收束成整体视角和 agent 类型视角，最后 2 章再回到开源项目源码，看真实系统到底怎么写入、读取、存储、治理和接入 memory。
                </p>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {dimensions.map((dimension, index) => (
                  <DimensionOverviewCard
                    key={dimension.id}
                    dimension={dimension}
                    index={index}
                  />
                ))}
              </div>
            </section>

            <ChecklistPanel items={checklist} />

            <section id="reading" className="scroll-mt-28">
              <div className="section-shell rounded-[2rem] p-6 md:p-8">
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Further Reading</div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    继续阅读
                  </h3>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-zinc-300">
                    如果首页解决的是“怎么搭比较框架”，这些资料则继续回答“这个框架为什么成立、研究里怎么讨论、工程上有哪些风险”。
                  </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {furtherReading.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.26, delay: index * 0.04 }}
                      className="group rounded-3xl border border-zinc-800 bg-zinc-950/55 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/75"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white group-hover:text-sky-300">
                            {item.label}
                          </h4>
                          <p className="mt-3 text-sm leading-7 text-zinc-300">{item.note}</p>
                        </div>
                        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400">
                          Link
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
