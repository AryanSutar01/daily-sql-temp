"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, Flame, Database, Code2, Server, Trophy, ArrowRight } from "lucide-react";
import { PracticeLink } from "@/components/landing/practice-link";

const ROTATING_WORDS = ["Data Analyst", "Data Engineer", "Data Scientist", "ML Engineer", "Data Architect"];

/* ── Four corner cards ─────────────────────────────────────── */

function CardSQL() {
  return (
    <div
      style={{
        width: 236,
        background: "var(--ls-surface, #fff)",
        border: "1px solid var(--ls-outline, #e8e8ec)",
        borderRadius: 16,
        padding: "18px 20px",
        boxShadow: "var(--ls-shadow-lg, 0 8px 32px rgba(0,0,0,0.09))",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(31,158,142,0.10)" }}>
            <Database className="w-3.5 h-3.5" style={{ color: "var(--ls-primary)" }} />
          </div>
          <span className="text-[11px] font-semibold" style={{ color: "var(--ls-primary)" }}>SQL · Medium</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--ls-surface-container, #f4f4f5)", color: "var(--ls-on-surface-muted, #6e6e6e)" }}>Day 47</span>
      </div>
      <p className="text-[13px] font-semibold mb-1.5 leading-snug" style={{ color: "var(--ls-on-surface, #272727)" }}>Monthly Revenue Retention</p>
      <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}>Find customers who ordered in both current and previous month.</p>
      <div className="rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed mb-3" style={{ background: "var(--ls-surface-container, #f7f8fa)", border: "1px solid var(--ls-outline, #e8e8ec)", color: "var(--ls-primary, #1a7c6d)" }}>
        <span style={{ color: "var(--ls-on-surface-subtle, #9e9e9e)" }}>SELECT</span> month,<br />
        &nbsp;&nbsp;<span style={{ color: "var(--ls-primary)" }}>ROUND</span>(retained<br />
        &nbsp;&nbsp;/ total * 100, 2) pct
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
        <span className="text-[11px] font-medium" style={{ color: "#22c55e" }}>Correct · 1 of 3 today</span>
      </div>
    </div>
  );
}

function CardLeaderboard() {
  const users = [
    { name: "priya_m", streak: 94, solved: 482, color: "#7c3aed" },
    { name: "rahul_s", streak: 71, solved: 437, color: "var(--ls-primary)" },
    { name: "arjun_k", streak: 63, solved: 399, color: "#2563eb" },
  ];
  return (
    <div
      style={{
        width: 220,
        background: "var(--ls-surface, #fff)",
        border: "1px solid var(--ls-outline, #e8e8ec)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "var(--ls-shadow-lg, 0 8px 32px rgba(0,0,0,0.09))",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--ls-outline, #f0f0f2)", background: "var(--ls-surface-low, #fafafa)" }}>
        <Trophy className="w-3.5 h-3.5" style={{ color: "var(--ls-primary)" }} />
        <span className="text-[11px] font-semibold" style={{ color: "var(--ls-on-surface, #272727)" }}>Top Streaks</span>
      </div>
      <div className="px-4 py-2 space-y-2.5">
        {users.map((u, i) => (
          <div key={u.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: u.color }}>
                {u.name[0].toUpperCase()}
              </div>
              <span className="text-[11px] font-medium" style={{ color: "var(--ls-on-surface, #272727)" }}>@{u.name}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[11px] font-semibold" style={{ color: "var(--ls-primary)" }}>{u.solved}</span>
              <span className="text-[10px]" style={{ color: "var(--ls-on-surface-subtle, #9e9e9e)" }}>pts</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5" style={{ borderTop: "1px solid var(--ls-outline, #f0f0f2)" }}>
        <span className="text-[10px]" style={{ color: "var(--ls-on-surface-subtle, #9e9e9e)" }}>Updated daily</span>
      </div>
    </div>
  );
}

function CardStreak() {
  return (
    <div
      style={{
        width: 228,
        background: "var(--ls-surface, #fff)",
        border: "1px solid var(--ls-outline, #e8e8ec)",
        borderRadius: 16,
        padding: "18px 20px",
        boxShadow: "var(--ls-shadow-lg, 0 8px 32px rgba(0,0,0,0.09))",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4" style={{ color: "#f97316", fill: "#f97316" }} />
          <span className="text-[11px] font-semibold" style={{ color: "var(--ls-on-surface-muted)" }}>STREAK</span>
        </div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.08)", color: "#ea580c", border: "1px solid rgba(249,115,22,0.15)" }}>
          On fire 🔥
        </span>
      </div>
      <div className="mb-3">
        <span className="font-bold" style={{ fontSize: 44, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--ls-on-surface, #272727)" }}>47</span>
        <span className="text-[12px] ml-1.5" style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}>day streak</span>
      </div>
      <div className="mb-1.5 flex justify-between">
        <span className="text-[10px] font-medium" style={{ color: "var(--ls-on-surface-muted)" }}>Today's progress</span>
        <span className="text-[10px] font-semibold" style={{ color: "var(--ls-primary)" }}>6 / 9</span>
      </div>
      <div className="rounded-full overflow-hidden mb-3" style={{ height: 5, background: "var(--ls-surface-high, #f0f0f2)" }}>
        <div className="h-full rounded-full" style={{ width: "67%", background: "linear-gradient(90deg, #1f9e8e, #4DD4C4)" }} />
      </div>
      <div className="space-y-1.5">
        {[{ icon: Database, label: "SQL", done: true }, { icon: Code2, label: "Python", done: true }, { icon: Server, label: "PySpark", done: false }].map(({ icon: Icon, label, done }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="w-3 h-3" style={{ color: done ? "#1f9e8e" : "#c9c9cf" }} />
            <span className="text-[11px]" style={{ color: done ? "var(--ls-on-surface, #272727)" : "var(--ls-on-surface-subtle, #9e9e9e)" }}>{label}</span>
            {done && <CheckCircle2 className="w-3 h-3 ml-auto" style={{ color: "#22c55e" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardSolved() {
  return (
    <div
      style={{
        width: 200,
        background: "var(--ls-surface, #fff)",
        border: "1px solid var(--ls-outline, #e8e8ec)",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "var(--ls-shadow-lg, 0 8px 32px rgba(0,0,0,0.09))",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ls-on-surface-subtle)" }}>Solved today · 9 problems</p>
      <div className="space-y-2">
        {[
          { icon: Database, label: "SQL Easy", time: "4 min", color: "var(--ls-primary)" },
          { icon: Database, label: "SQL Medium", time: "9 min", color: "var(--ls-primary)" },
          { icon: Code2, label: "Python Easy", time: "6 min", color: "#d97706" },
        ].map(({ icon: Icon, label, time, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
                <Icon className="w-3 h-3" style={{ color }} />
              </div>
              <span className="text-[11px]" style={{ color: "var(--ls-on-surface, #272727)" }}>{label}</span>
            </div>
            <span className="text-[10px] tabular-nums" style={{ color: "var(--ls-on-surface-subtle)" }}>{time}</span>
          </div>
        ))}
        <div className="pt-1.5 flex items-center gap-1.5" style={{ borderTop: "1px solid var(--ls-outline, #f0f0f2)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-[10px]" style={{ color: "var(--ls-on-surface-muted)" }}>3 more problems remaining</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Hero ─────────────────────────────────────────────── */

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 280);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        /* Teal glow rises from the bottom */
        background: "var(--ls-bg, #f7f7f8)",
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-dot-light opacity-50 pointer-events-none" />

      {/* Teal gradient — rises from BOTTOM upward */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 110%, rgba(31,158,142,0.18) 0%, rgba(31,158,142,0.06) 40%, transparent 70%)",
        }}
      />

      {/* ── TOP-LEFT: SQL Problem card ── */}
      <div
        className="absolute hidden lg:block animate-slide-in-left"
        style={{ top: "10%", left: "4%", transform: "rotate(-3deg)", animation: "float-card 6s ease-in-out infinite" }}
      >
        <CardSQL />
      </div>

      {/* ── BOTTOM-LEFT: Leaderboard card ── */}
      <div
        className="absolute hidden lg:block"
        style={{ bottom: "12%", left: "5%", transform: "rotate(-1.5deg)", animation: "float-card 7s 1s ease-in-out infinite" }}
      >
        <CardLeaderboard />
      </div>

      {/* ── TOP-RIGHT: Streak card ── */}
      <div
        className="absolute hidden lg:block animate-slide-in-right"
        style={{ top: "8%", right: "4%", transform: "rotate(2.5deg)", animation: "float-card-r 6.5s ease-in-out infinite" }}
      >
        <CardStreak />
      </div>

      {/* ── BOTTOM-RIGHT: Solved today card ── */}
      <div
        className="absolute hidden lg:block"
        style={{ bottom: "14%", right: "5%", transform: "rotate(1.5deg)", animation: "float-card-r 7.5s 0.5s ease-in-out infinite" }}
      >
        <CardSolved />
      </div>

      {/* ── CENTER CONTENT ── */}
      <div
        className="relative z-10 text-center px-6"
        style={{ maxWidth: 700 }}
      >
        {/* Overline badge with interactive mascot companion */}
        <div className="animate-fade-up mb-8 flex items-center justify-center gap-3">
          <div className="group relative cursor-pointer">
            <img
              src="/mascot-complete-bg-removed.png"
              alt="DailySQL Mascot"
              className="w-10 h-10 object-contain transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300 drop-shadow-xs"
            />
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(31,158,142,0.08)",
              color: "var(--ls-primary)",
              border: "1px solid rgba(31,158,142,0.20)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: "#1f9e8e", display: "inline-block" }}
            />
            9 new problems drop every day
          </div>
        </div>

        {/* Headline — strictly 2 lines, forced with <br /> */}
        <h1
          className="animate-fade-up animate-fade-up-delay-1"
          style={{
            fontFamily: "'Overused Grotesk', system-ui, sans-serif",
            fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: "var(--ls-heading)",
            marginBottom: "1.5rem",
          }}
        >
          {/* Line 1: role is inline, animated */}
          Everything a{" "}
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #1f9e8e 0%, #38c4b4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transition: "opacity 0.28s, transform 0.28s",
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateY(-6px)" : "translateY(0)",
              minWidth: "2ch",
            }}
          >
            {ROTATING_WORDS[wordIndex]}
          </span>
          <br />
          {/* Line 2: fixed */}
          needs. Daily.
        </h1>

        {/* Sub-copy */}
        <p
          className="animate-fade-up animate-fade-up-delay-2 mx-auto"
          style={{
            maxWidth: 480,
            fontSize: "1.0625rem",
            lineHeight: 1.7,
            color: "var(--ls-on-surface-muted)",
            fontWeight: 400,
            marginBottom: "2.5rem",
          }}
        >
          9 curated problems every day — SQL, Python (Pandas), and PySpark,
          each in Easy, Medium, and Advanced. 15 minutes. Real execution.
        </p>

        {/* CTA row */}
        <div className="animate-fade-up animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <PracticeLink
            label="Start practicing free"
            showArrow
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-150 select-none"
            style={{
              background: "#1c1c1e",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 2px 6px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.6)",
            }}
          />
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm transition-all duration-150"
            style={{ color: "var(--ls-on-surface-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z" fill="currentColor" />
            </svg>
            See how it works
          </Link>
        </div>

        {/* Quick social stats */}
        <div
          className="animate-fade-up animate-fade-up-delay-4 flex flex-wrap gap-5 justify-center mt-10"
          style={{ fontSize: "0.8125rem", color: "var(--ls-on-surface-subtle)" }}
        >
          {[
            { value: "100+", label: "active users" },
            { value: "3", label: "disciplines" },
            { value: "9", label: "problems/day" },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="font-semibold" style={{ color: "var(--ls-on-surface, #272727)" }}>{value}</span>
              <span>{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot inline-block" style={{ background: "#22c55e" }} />
            <span>community live</span>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section — tall white dissolve */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, var(--ls-bg, #f7f7f8) 100%)" }}
      />
    </section>
  );
}
