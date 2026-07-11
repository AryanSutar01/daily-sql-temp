"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Flame, BarChart2, Globe, Loader2 } from "lucide-react";
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

const DEMO_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, username: "priya_m",  full_name: "Priya M.",  avatar_url: null, current_streak: 94, total_solved: 482 },
  { rank: 2, username: "rahul_s",  full_name: "Rahul S.",  avatar_url: null, current_streak: 71, total_solved: 437 },
  { rank: 3, username: "arjun_k",  full_name: "Arjun K.",  avatar_url: null, current_streak: 63, total_solved: 399 },
  { rank: 4, username: "meera_d",  full_name: "Meera D.",  avatar_url: null, current_streak: 55, total_solved: 371 },
  { rank: 5, username: "kiran_p",  full_name: "Kiran P.",  avatar_url: null, current_streak: 48, total_solved: 342 },
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
        setEntries(data.length > 0 ? data : DEMO_ENTRIES);
        setIsDemo(data.length === 0);
        setLoading(false);
      })
      .catch(() => {
        setEntries(DEMO_ENTRIES);
        setIsDemo(true);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#121826]/30 border-y border-[#202736]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">

            {/* Left — copy */}
            <div className="space-y-5 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm text-violet-400 font-medium">
                <Trophy className="w-3.5 h-3.5" />
                Community &amp; Leaderboard
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">
                See where you stand
              </h2>

              <p className="text-base md:text-lg text-[#7b8ca3] leading-relaxed">
                Track your progress publicly. A weekly leaderboard ranks the
                top practitioners by total problems solved and current streak.
              </p>

              <ul className="space-y-3">
                {[
                  { icon: Globe, text: "Public profile with full solve history and discipline heatmap" },
                  { icon: Flame, text: "Daily streaks — build and maintain your longest run" },
                  { icon: BarChart2, text: "See your stats across SQL, Python, and PySpark separately" },
                  { icon: Trophy, text: "Top 20 leaderboard updated in real time" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-zinc-300">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-sm leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>

              <PracticeLink
                label="Join the leaderboard"
                showArrow
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#30B5A6] hover:bg-[#2A9D90] text-[#0a0f1c] font-semibold text-sm transition-all duration-200"
              />
            </div>

            {/* Right — live leaderboard card */}
            <div className="w-full rounded-2xl bg-[#121826] border border-[#202736] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#202736] flex items-center justify-between bg-[#0b101c]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#4DD4C4]" />
                  <span className="text-sm font-semibold text-white">Weekly Leaderboard</span>
                  {isDemo && (
                    <span className="text-[10px] text-zinc-600 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded font-mono">demo</span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 font-mono">Top 20</span>
              </div>

              {/* Column headers */}
              <div className="px-5 py-2 border-b border-[#202736] grid grid-cols-12 text-[10px] uppercase tracking-wider text-zinc-600">
                <span className="col-span-1">#</span>
                <span className="col-span-5">User</span>
                <span className="col-span-3 text-right">Streak</span>
                <span className="col-span-3 text-right">Solved</span>
              </div>

              {/* Body */}
              <div className="divide-y divide-[#202736] min-h-[200px]">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 text-[#4DD4C4] animate-spin" />
                  </div>
                )}

                {!loading && entries.map((user) => (
                  <div
                    key={user.rank}
                    className={`px-5 py-3.5 grid grid-cols-12 items-center text-sm transition-colors hover:bg-white/[0.02] ${user.rank === 1 ? "bg-[#4DD4C4]/[0.04]" : ""}`}
                  >
                    <span className="col-span-1 text-xs font-bold text-zinc-500">
                      {user.rank <= 3 ? RANK_BADGES[user.rank - 1] : user.rank}
                    </span>

                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      {/* Avatar */}
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#202736] shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-zinc-300 text-xs truncate">
                        {user.username ? `@${user.username}` : user.full_name}
                      </span>
                    </div>

                    <span className="col-span-3 text-right text-zinc-400 flex items-center justify-end gap-1 text-xs">
                      {user.current_streak > 0 && (
                        <>
                          {user.current_streak}
                          <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                        </>
                      )}
                    </span>

                    <span className="col-span-3 text-right font-mono text-[#4DD4C4] text-xs font-semibold">
                      {user.total_solved}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-[#202736] bg-[#0b101c] flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-zinc-600">Updated daily · Top 20 shown</span>
                <Link
                  href="/profile"
                  className="text-xs text-[#4DD4C4] font-medium hover:underline"
                >
                  View full leaderboard →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
