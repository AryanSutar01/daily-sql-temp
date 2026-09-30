"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Flame, BarChart2, Globe, Loader2, ArrowRight, Sparkles, Users } from "lucide-react";
import { PracticeLink } from "@/components/landing/practice-link";

interface LeaderboardEntry {
  rank: number;
  username: string | null;
  full_name: string;
  avatar_url: string | null;
  current_streak: number;
  total_solved: number;
}

const RANK_BADGES = ["🏆", "🥈", "🥉"];

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
  "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
  "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
  "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
  "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
];

const DEMO_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, username: "worksharmaavinash", full_name: "T", avatar_url: null, current_streak: 118, total_solved: 118 },
  { rank: 2, username: "atharvamane19",     full_name: "A", avatar_url: null, current_streak: 14,  total_solved: 84 },
  { rank: 3, username: "avinashsharma8396", full_name: "S", avatar_url: null, current_streak: 12,  total_solved: 59 },
  { rank: 4, username: "itsavicool",        full_name: "S", avatar_url: null, current_streak: 12,  total_solved: 48 },
  { rank: 5, username: "priya_m",           full_name: "P", avatar_url: null, current_streak: 9,   total_solved: 35 },
];

const FEATURES = [
  { icon: Globe, text: "Public profile with full solve history and discipline breakdown" },
  { icon: Flame, text: "Daily streaks — build and maintain your longest run" },
  { icon: BarChart2, text: "Stats across SQL, Python, and PySpark separately" },
  { icon: Trophy, text: "Top 20 leaderboard updated in real time" },
];

export function LeaderboardSection() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: LeaderboardEntry[]) => {
        if (data && data.length > 0) {
          setEntries(data);
          setIsDemo(false);
        } else {
          setEntries(DEMO_ENTRIES);
          setIsDemo(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setEntries(DEMO_ENTRIES);
        setIsDemo(true);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="community"
      style={{
        padding: "100px 0 90px",
        background: "var(--ls-bg)",
        borderBottom: "1px solid var(--ls-outline)",
      }}
    >
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column — Copy & Features */}
            <div className="w-full lg:col-span-6 space-y-6">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-4"
                  style={{
                    background: "var(--ls-primary-container)",
                    color: "var(--ls-primary)",
                    border: "1px solid rgba(31,158,142,0.2)",
                  }}
                >
                  <Users className="w-3.5 h-3.5" />
                  Community
                </div>

                <h2
                  style={{
                    fontFamily: "'Overused Grotesk', system-ui, sans-serif",
                    fontSize: "clamp(2.1rem, 3.8vw, 2.9rem)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    letterSpacing: "-0.025em",
                    color: "var(--ls-on-surface)",
                  }}
                >
                  See where you stand
                </h2>

                <p
                  className="mt-3.5 text-base leading-relaxed"
                  style={{ color: "var(--ls-on-surface-muted)" }}
                >
                  Track your progress publicly. A weekly leaderboard ranks the top practitioners by total problems solved and current streak.
                </p>
              </div>

              {/* Feature Bullet Points */}
              <ul className="space-y-3.5 pt-2">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform hover:scale-105"
                      style={{
                        background: "var(--ls-primary-container)",
                        border: "1px solid rgba(31,158,142,0.25)",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "var(--ls-primary)" }} />
                    </div>
                    <span className="text-sm font-normal leading-relaxed pt-1" style={{ color: "var(--ls-on-surface)" }}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Join CTA */}
              <div className="pt-3">
                <PracticeLink
                  label="Join the leaderboard"
                  showArrow
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-95 shadow-sm"
                  style={{
                    background: "var(--ls-primary)",
                    color: "var(--ls-on-primary)",
                    boxShadow: "0 3px 12px rgba(31,158,142,0.28)",
                  }}
                />
              </div>
            </div>

            {/* Right Column — Live Leaderboard Card */}
            <div className="w-full lg:col-span-6">
              <div
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "var(--ls-surface)",
                  border: "1px solid var(--ls-outline)",
                  boxShadow: "var(--ls-shadow-lg)",
                }}
              >
                {/* Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{
                    borderBottom: "1px solid var(--ls-outline)",
                    background: "var(--ls-surface-low)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--ls-on-surface)" }}>
                      Weekly Leaderboard
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-md"
                    style={{
                      background: "var(--ls-surface-container)",
                      color: "var(--ls-on-surface-muted)",
                      border: "1px solid var(--ls-outline)",
                    }}
                  >
                    Top 20
                  </span>
                </div>

                {/* Column Headers */}
                <div
                  className="px-6 py-2.5 grid grid-cols-12 text-[11px] font-mono uppercase tracking-wider font-semibold"
                  style={{
                    borderBottom: "1px solid var(--ls-outline)",
                    background: "var(--ls-surface)",
                    color: "var(--ls-on-surface-subtle)",
                  }}
                >
                  <span className="col-span-2">#</span>
                  <span className="col-span-5">User</span>
                  <span className="col-span-2 text-right">Streak</span>
                  <span className="col-span-3 text-right">Solved</span>
                </div>

                {/* Body rows */}
                <div className="divide-y" style={{ borderColor: "var(--ls-outline)" }}>
                  {loading && (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--ls-primary)" }} />
                    </div>
                  )}

                  {!loading && entries.slice(0, 5).map((entry, idx) => {
                    const avatarLetter = (entry.full_name || entry.username || "U").charAt(0).toUpperCase();
                    const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const isFirst = entry.rank === 1;

                    return (
                      <div
                        key={entry.rank}
                        className="px-6 py-3.5 grid grid-cols-12 items-center text-sm transition-colors duration-150 cursor-default"
                        style={{
                          background: isFirst ? "rgba(31,158,142,0.04)" : "transparent",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ls-surface-container)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = isFirst ? "rgba(31,158,142,0.04)" : "transparent")}
                      >
                        {/* Rank Badge */}
                        <div className="col-span-2 flex items-center font-bold">
                          {entry.rank <= 3 ? (
                            <span className="text-base select-none">{RANK_BADGES[entry.rank - 1]}</span>
                          ) : (
                            <span className="text-xs font-mono pl-1" style={{ color: "var(--ls-on-surface-muted)" }}>
                              {entry.rank}
                            </span>
                          )}
                        </div>

                        {/* User */}
                        <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                          {entry.avatar_url ? (
                            <img
                              src={entry.avatar_url}
                              alt={entry.full_name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-black/10"
                            />
                          ) : (
                            <div
                              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold border ${colorClass}`}
                            >
                              {avatarLetter}
                            </div>
                          )}
                          <div className="min-w-0 truncate">
                            <span className="text-xs font-medium block truncate" style={{ color: "var(--ls-on-surface)" }}>
                              {entry.username ? `@${entry.username}` : entry.full_name}
                            </span>
                          </div>
                        </div>

                        {/* Streak */}
                        <div className="col-span-2 text-right flex items-center justify-end gap-1 text-xs font-mono font-medium">
                          {entry.current_streak > 0 ? (
                            <>
                              <span style={{ color: "var(--ls-on-surface)" }}>{entry.current_streak}</span>
                              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                            </>
                          ) : (
                            <span style={{ color: "var(--ls-on-surface-subtle)" }}>-</span>
                          )}
                        </div>

                        {/* Solved */}
                        <div className="col-span-3 text-right">
                          <span
                            className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              background: isFirst ? "var(--ls-primary-container)" : "var(--ls-surface-container)",
                              color: isFirst ? "var(--ls-primary)" : "var(--ls-on-surface)",
                            }}
                          >
                            {entry.total_solved}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div
                  className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                  style={{
                    borderTop: "1px solid var(--ls-outline)",
                    background: "var(--ls-surface-low)",
                  }}
                >
                  <span style={{ color: "var(--ls-on-surface-subtle)" }}>
                    Updated daily · Top 20 shown
                  </span>
                  <Link
                    href="/profile"
                    className="font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                    style={{ color: "var(--ls-primary)" }}
                  >
                    View full leaderboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

