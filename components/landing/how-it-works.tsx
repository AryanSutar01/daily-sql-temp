"use client";

import { Database, Code2, Server, CheckCircle2, Flame, Terminal, Sparkles, Trophy } from "lucide-react";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "100px 0 90px",
        background: "var(--ls-surface-low)",
        borderBottom: "1px solid var(--ls-outline)",
      }}
    >
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-4"
            style={{
              background: "var(--ls-primary-container)",
              color: "var(--ls-primary)",
              border: "1px solid rgba(31,158,142,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            How it works
          </div>
          <h2
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(2.1rem, 3.8vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "var(--ls-on-surface)",
            }}
          >
            A simple daily flow.
            <br />
            <span style={{ color: "var(--ls-on-surface-muted)", fontWeight: 400 }}>
              Designed for busy data professionals.
            </span>
          </h2>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ──────── STEP 01 ──────── */}
          <div
            className="rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "1px solid var(--ls-outline)",
              boxShadow: "var(--ls-shadow-md)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider"
                  style={{
                    background: "var(--ls-surface-container)",
                    color: "var(--ls-primary)",
                    border: "1px solid var(--ls-outline)",
                  }}
                >
                  STEP 01
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
                  9 daily problems
                </span>
              </div>

              <h3
                className="text-xl font-medium mb-2.5"
                style={{
                  color: "var(--ls-on-surface)",
                  letterSpacing: "-0.015em",
                }}
              >
                Pick your discipline
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--ls-on-surface-muted)" }}
              >
                Every day, 9 fresh problems are waiting — 3 SQL, 3 Python, and 3 PySpark. Each in Easy, Medium, and Advanced.
              </p>
            </div>

            {/* Visual preview */}
            <div
              className="rounded-xl p-4 space-y-2.5"
              style={{
                background: "var(--ls-surface-low)",
                border: "1px solid var(--ls-outline)",
              }}
            >
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center dark:bg-sky-500/10 dark:text-sky-300">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-zinc-800">SQL (Postgres)</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded dark:text-sky-300 dark:bg-sky-500/10">
                  3 Problems
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-500/10 dark:text-amber-300">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-zinc-800">Python (Pandas)</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded dark:text-amber-300 dark:bg-amber-500/10">
                  3 Problems
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center dark:bg-violet-500/10 dark:text-violet-300">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-zinc-800">PySpark</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded dark:text-violet-300 dark:bg-violet-500/10">
                  3 Problems
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-zinc-400 font-mono">
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Easy</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Medium</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Advanced</span>
              </div>
            </div>
          </div>

          {/* ──────── STEP 02 ──────── */}
          <div
            className="rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "1px solid var(--ls-outline)",
              boxShadow: "var(--ls-shadow-md)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider"
                  style={{
                    background: "var(--ls-surface-container)",
                    color: "var(--ls-primary)",
                    border: "1px solid var(--ls-outline)",
                  }}
                >
                  STEP 02
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
                  Zero setup
                </span>
              </div>

              <h3
                className="text-xl font-medium mb-2.5"
                style={{
                  color: "var(--ls-on-surface)",
                  letterSpacing: "-0.015em",
                }}
              >
                Solve in the browser
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--ls-on-surface-muted)" }}
              >
                Write code in the editor. Your submission runs in an isolated sandbox — real PostgreSQL, real Python, real Spark. Instant feedback.
              </p>
            </div>

            {/* Visual preview */}
            <div
              className="rounded-xl overflow-hidden text-xs font-mono shadow-xs"
              style={{
                background: "#0d1117",
                border: "1px solid #21262d",
              }}
            >
              <div className="px-3 py-2 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
                  <span className="ml-2 text-zinc-300 font-sans text-[11px]">sandbox.sql</span>
                </div>
                <span className="text-emerald-400 font-sans text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <div className="p-3.5 space-y-1 text-zinc-300 leading-relaxed text-[11px]">
                <p><span className="text-pink-400">SELECT</span> user_id, <span className="text-cyan-400">COUNT</span>(*) <span className="text-pink-400">AS</span> solved</p>
                <p><span className="text-pink-400">FROM</span> submissions</p>
                <p><span className="text-pink-400">GROUP BY</span> <span className="text-purple-400">1</span></p>
                <p><span className="text-pink-400">HAVING</span> <span className="text-cyan-400">COUNT</span>(*) &gt;= <span className="text-purple-400">10</span>;</p>
              </div>
              <div className="px-3.5 py-2 bg-[#161b22]/90 border-t border-[#21262d] flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  ✓ Output Match (14ms)
                </span>
                <span className="text-zinc-500 text-[10px]">Real Postgres 16</span>
              </div>
            </div>
          </div>

          {/* ──────── STEP 03 ──────── */}
          <div
            className="rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "1px solid var(--ls-outline)",
              boxShadow: "var(--ls-shadow-md)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider"
                  style={{
                    background: "var(--ls-primary-container)",
                    color: "var(--ls-primary)",
                    border: "1px solid rgba(31,158,142,0.2)",
                  }}
                >
                  STEP 03
                </span>
                <span className="text-xs font-medium text-orange-500 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" /> Daily habit
                </span>
              </div>

              <h3
                className="text-xl font-medium mb-2.5"
                style={{
                  color: "var(--ls-on-surface)",
                  letterSpacing: "-0.015em",
                }}
              >
                Build your streak
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--ls-on-surface-muted)" }}
              >
                Track your daily streak and solve history. Share your public profile, check the leaderboard, and discuss solutions.
              </p>
            </div>

            {/* Visual preview */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: "var(--ls-surface-low)",
                border: "1px solid var(--ls-outline)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ls-on-surface-subtle)" }}>
                    Current Streak
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold font-mono" style={{ color: "var(--ls-on-surface)" }}>
                      47
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-muted)" }}>
                      days unbroken
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center dark:bg-orange-500/10 dark:border-orange-500/30">
                  <Flame className="w-6 h-6 fill-orange-500 text-orange-500 animate-pulse" />
                </div>
              </div>

              {/* 7-day tracker */}
              <div className="pt-2 border-t border-black/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="flex items-center justify-between">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                      style={{
                        background: idx === 6 ? "var(--ls-primary)" : "#10b981",
                      }}
                    >
                      ✓
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-emerald-700 font-medium flex items-center gap-1 dark:text-emerald-300">
                  <Trophy className="w-3 h-3 text-amber-500" /> Top 5% rank
                </span>
                <span className="text-zinc-500">Public profile active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

