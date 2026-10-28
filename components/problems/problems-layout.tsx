"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Database,
  Code2,
  Server,
  Search,
  CheckCircle2,
  Circle,
  Lock,
  Flame,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  ArrowRight,
  Layers,
  Award,
  Zap,
  LogIn,
  Target,
  ChevronDown,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { DailyPractice } from "@/types/api";
import { appToday, dateKey } from "@/lib/app-day";

export interface ProblemItem {
  id: string;
  num: number;
  title: string;
  discipline: "sql" | "python" | "pyspark";
  difficulty: "easy" | "medium" | "advanced";
  /** Real acceptance rate (% of all attempts that were correct); null until someone has attempted it. */
  acceptanceRate: number | null;
  topics: string[];
  isLocked: boolean;
}

// Topic tags are derived from the problem title (the backend has no topic field yet).
// Chip counts are computed from the loaded problems, and topics nobody matches are hidden.
const TOPIC_RULES: { id: string; name: string; match: (title: string, discipline: ProblemItem["discipline"]) => boolean }[] = [
  { id: "window-functions", name: "Window Functions", match: (t) => /\b(window|rank|ranking|row_number|dense_rank|lead|lag|partition|running|cumulative)\b/i.test(t) },
  { id: "aggregations", name: "Aggregations & GroupBy", match: (t) => /\b(group|groupby|aggregate|aggregation|count|sum|average|avg|total|max|min)\b/i.test(t) },
  { id: "joins-ctes", name: "Joins & CTEs", match: (t) => /\b(join|joins|cte|recursive)\b/i.test(t) },
  { id: "subqueries", name: "Subqueries & Self-Joins", match: (t) => /\b(subquery|subqueries|self-join|self join|nested|correlated)\b/i.test(t) },
  { id: "time-series", name: "Time-Series & Dates", match: (t) => /\b(date|dates|day|days|week|weekly|month|monthly|year|rolling|consecutive|streak|time|daily)\b/i.test(t) },
  { id: "data-cleaning", name: "Data Cleaning & Nulls", match: (t) => /\b(null|nulls|clean|cleaning|missing|duplicate|duplicates|dedup|deduplicate)\b/i.test(t) },
  { id: "pandas-transforms", name: "Python", match: (_t, d) => d === "python" },
  { id: "spark-dataframes", name: "PySpark", match: (_t, d) => d === "pyspark" },
];

function tagTopics(title: string, discipline: ProblemItem["discipline"]): string[] {
  return TOPIC_RULES.filter((r) => r.match(title, discipline)).map((r) => r.id);
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DAILY_GROUPS: { label: string; keys: (keyof DailyPractice)[] }[] = [
  { label: "SQL", keys: ["easy", "medium", "advanced"] },
  { label: "Python", keys: ["python_easy", "python_medium", "python_advanced"] },
  { label: "Spark", keys: ["pyspark_easy", "pyspark_medium", "pyspark_advanced"] },
  { label: "DSA", keys: ["dsa_easy", "dsa_medium", "dsa_advanced"] },
];

export function ProblemsLayout() {
  const router = useRouter();
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [streakCount, setStreakCount] = useState(0);
  const [activeToday, setActiveToday] = useState(false);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});
  const [daily, setDaily] = useState<DailyPractice | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [studyPlansOpen, setStudyPlansOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<"all" | "sql" | "python" | "pyspark">("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "advanced">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "solved" | "todo">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);

    // Problems + today's set are public; the rest is per-user and independent of each other,
    // so one failing call never wipes out the others.
    const signedIn = !!getToken();
    const [problemsRes, dailyRes, profileRes, streakRes, solvedRes, heatmapRes] = await Promise.allSettled([
      api.getProblems(),
      api.getDailyPractice(),
      signedIn ? api.getProfile() : Promise.resolve(null),
      signedIn ? api.getStreak() : Promise.resolve(null),
      signedIn ? api.getSolvedIds() : Promise.resolve(null),
      signedIn ? api.getHeatmap() : Promise.resolve(null),
    ]);

    if (problemsRes.status === "fulfilled") {
      const mapped: ProblemItem[] = problemsRes.value.map((p, index) => {
        const rawType = (p.challenge_type || "sql").toLowerCase();
        const discipline: ProblemItem["discipline"] =
          rawType.includes("spark") ? "pyspark" : rawType.includes("python") ? "python" : "sql";
        return {
          id: p.id,
          num: index + 1,
          title: p.title,
          discipline,
          difficulty: (p.difficulty || "easy").toLowerCase() as ProblemItem["difficulty"],
          acceptanceRate: typeof p.acceptance_rate === "number" ? p.acceptance_rate : null,
          topics: tagTopics(p.title, discipline),
          isLocked: !!p.is_locked,
        };
      });
      setProblems(mapped);
    } else {
      console.error("Failed to load problems:", problemsRes.reason);
      setLoadError(true);
    }

    if (dailyRes.status === "fulfilled") setDaily(dailyRes.value);
    if (profileRes.status === "fulfilled" && profileRes.value) setUser(profileRes.value);
    if (streakRes.status === "fulfilled" && streakRes.value) {
      setStreakCount(streakRes.value.current_streak || 0);
      setActiveToday(!!streakRes.value.active_today);
    }
    if (solvedRes.status === "fulfilled" && solvedRes.value) setSolvedIds(new Set(solvedRes.value.solved_ids || []));
    if (heatmapRes.status === "fulfilled" && heatmapRes.value) setHeatmap(heatmapRes.value);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Today's set as the Daily page will show it (only when it really is for today's app-day)
  const todaySet = useMemo(() => {
    if (!daily || String(daily.date).slice(0, 10) !== dateKey(appToday())) return null;
    const groups = DAILY_GROUPS
      .map((g) => ({ label: g.label, count: g.keys.filter((k) => !!daily[k]).length }))
      .filter((g) => g.count > 0);
    const total = groups.reduce((sum, g) => sum + g.count, 0);
    return total > 0 ? { total, summary: groups.map((g) => `${g.count} ${g.label}`).join(", ") } : null;
  }, [daily]);

  const disciplineCounts = useMemo(() => {
    const counts = { sql: 0, python: 0, pyspark: 0 };
    for (const p of problems) counts[p.discipline] += 1;
    return counts;
  }, [problems]);

  const topics = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of problems) for (const t of p.topics) counts[t] = (counts[t] || 0) + 1;
    return [
      { id: "all", name: "All Topics", count: problems.length },
      ...TOPIC_RULES.filter((r) => counts[r.id]).map((r) => ({ id: r.id, name: r.name, count: counts[r.id] })),
    ];
  }, [problems]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // Discipline filter
      if (selectedDiscipline !== "all" && p.discipline !== selectedDiscipline) return false;

      // Difficulty filter
      if (selectedDifficulty !== "all" && p.difficulty !== selectedDifficulty) return false;

      // Topic filter
      if (selectedTopic !== "all" && !p.topics.includes(selectedTopic)) return false;

      // Status filter
      const isSolved = solvedIds.has(p.id);
      if (selectedStatus === "solved" && !isSolved) return false;
      if (selectedStatus === "todo" && isSolved) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          p.num.toString().includes(q) ||
          p.discipline.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [problems, selectedDiscipline, selectedDifficulty, selectedTopic, selectedStatus, searchQuery, solvedIds]);

  // Paginated list
  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  // Random picker
  const handlePickRandom = () => {
    if (filteredProblems.length === 0) return;
    // Free users only get the first 30 SQL problems + today's free daily set, so a random pick
    // must come from that same unlocked pool — otherwise it just lands on a paywall.
    const pickable = filteredProblems.filter((p) => !p.isLocked);
    const pool = pickable.length > 0 ? pickable : filteredProblems;
    const rand = pool[Math.floor(Math.random() * pool.length)];
    // A random pick usually isn't in today's set, so open the daily-set page with its
    // sidebar on "Problem List" (not "Today's Set") — otherwise the picked problem shows
    // under a tab it doesn't belong to and prev/next navigation there breaks.
    router.push(`/practice/daily/${rand.id}?tab=list`);
  };

  const solvedCount = useMemo(() => {
    return problems.filter((p) => solvedIds.has(p.id)).length;
  }, [problems, solvedIds]);

  // Streak calendar: real solve days from the backend heat-map, on the app-day (UTC) clock
  const calendar = useMemo(() => {
    const today = appToday();
    const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1));
    const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const todayKey = dateKey(today);
    const cells = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), i + 1));
      const key = dateKey(d);
      return { day: i + 1, isToday: key === todayKey, isFuture: key > todayKey, solved: (heatmap[key] || 0) > 0 };
    });
    const solvedThisMonth = cells.filter((c) => c.solved).length;

    let solvedLast7 = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
      if ((heatmap[dateKey(d)] || 0) > 0) solvedLast7 += 1;
    }

    return {
      title: `${MONTH_NAMES[first.getUTCMonth()]} ${first.getUTCFullYear()}`,
      leadingBlanks: first.getUTCDay(),
      cells,
      solvedThisMonth,
      solvedLast7,
      isCurrentMonth: monthOffset === 0,
      todayDay: today.getUTCDate(),
    };
  }, [heatmap, monthOffset]);

  // Difficulty badge colors (Light theme)
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30">Easy</span>;
      case "medium":
        return <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30">Med.</span>;
      case "advanced":
      case "hard":
        return <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30">Hard</span>;
      default:
        return <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">{difficulty}</span>;
    }
  };

  // Discipline badge (Light theme)
  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case "sql":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30">
            <Database className="w-3 h-3 text-sky-600 dark:text-sky-300" /> SQL
          </span>
        );
      case "python":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30">
            <Code2 className="w-3 h-3 text-amber-600 dark:text-amber-300" /> Python
          </span>
        );
      case "pyspark":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30">
            <Server className="w-3 h-3 text-purple-600 dark:text-purple-300" /> PySpark
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: "var(--ls-bg)",
        color: "var(--ls-on-surface)",
      }}
      className="min-h-screen font-sans antialiased"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ════════════════════════════════════════════════════════════════
              LEFT SIDEBAR: NAV & USER STATUS (LIGHT THEME)
             ════════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-2 hidden lg:flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* LeetCode style nav items */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setSelectedDiscipline("all");
                    setSelectedTopic("all");
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "var(--ls-primary-container)",
                    color: "var(--ls-primary)",
                    border: "1px solid rgba(31,158,142,0.25)",
                    boxShadow: "var(--ls-shadow-sm)",
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Problemset</span>
                </button>

                <Link
                  href="/practice/daily"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white dark:hover:bg-[#1A2332]"
                  style={{
                    color: "var(--ls-on-surface-muted)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span style={{ color: "var(--ls-on-surface)" }}>Daily Quest</span>
                  </div>
                  {todaySet && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                      {todaySet.total} Today
                    </span>
                  )}
                </Link>

                <div>
                  <button
                    onClick={() => setStudyPlansOpen((v) => !v)}
                    aria-expanded={studyPlansOpen}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white dark:hover:bg-[#1A2332]"
                    style={{
                      color: "var(--ls-on-surface)",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                      <span>Study Plans</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studyPlansOpen ? "rotate-180" : ""}`} style={{ color: "var(--ls-on-surface-subtle)" }} />
                  </button>
                  {studyPlansOpen && (
                    <div className="mt-1 ml-4 pl-3.5 space-y-0.5 border-l" style={{ borderColor: "var(--ls-outline)" }}>
                      <Link
                        href="/practice/learn/sql"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white dark:hover:bg-[#1A2332]"
                        style={{ color: "var(--ls-on-surface-muted)" }}
                      >
                        <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                        <span>SQL</span>
                      </Link>
                      <Link
                        href="/practice/learn/python"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white dark:hover:bg-[#1A2332]"
                        style={{ color: "var(--ls-on-surface-muted)" }}
                      >
                        <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                        <span>Python</span>
                      </Link>
                      <Link
                        href="/practice/learn/pyspark"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white dark:hover:bg-[#1A2332]"
                        style={{ color: "var(--ls-on-surface-muted)" }}
                      >
                        <Server className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                        <span>PySpark</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white dark:hover:bg-[#1A2332]"
                  style={{
                    color: "var(--ls-on-surface)",
                  }}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Leaderboard</span>
                </Link>
              </div>

              {/* Discipline Quick Filters */}
              <div className="pt-4 space-y-2 border-t" style={{ borderColor: "var(--ls-outline)" }}>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ls-on-surface-subtle)" }}>
                  Disciplines
                </p>
                <button
                  onClick={() => setSelectedDiscipline("sql")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedDiscipline === "sql"
                      ? "bg-sky-50 text-sky-800 border border-sky-300 font-semibold dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30"
                      : "hover:bg-white dark:hover:bg-[#1A2332]"
                  }`}
                  style={{ color: selectedDiscipline === "sql" ? undefined : "var(--ls-on-surface-muted)" }}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                    <span>SQL (Postgres/MySQL)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{disciplineCounts.sql}</span>
                </button>

                <button
                  onClick={() => setSelectedDiscipline("python")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedDiscipline === "python"
                      ? "bg-amber-50 text-amber-800 border border-amber-300 font-semibold dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                      : "hover:bg-white dark:hover:bg-[#1A2332]"
                  }`}
                  style={{ color: selectedDiscipline === "python" ? undefined : "var(--ls-on-surface-muted)" }}
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                    <span>Python (Pandas)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{disciplineCounts.python}</span>
                </button>

                <button
                  onClick={() => setSelectedDiscipline("pyspark")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedDiscipline === "pyspark"
                      ? "bg-purple-50 text-purple-800 border border-purple-300 font-semibold dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
                      : "hover:bg-white dark:hover:bg-[#1A2332]"
                  }`}
                  style={{ color: selectedDiscipline === "pyspark" ? undefined : "var(--ls-on-surface-muted)" }}
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                    <span>PySpark</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{disciplineCounts.pyspark}</span>
                </button>
              </div>
            </div>

            {/* Bottom Auth status card */}
            <div
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: "var(--ls-surface)",
                border: "1px solid var(--ls-outline)",
                boxShadow: "var(--ls-shadow-sm)",
              }}
            >
              {user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{
                        background: "var(--ls-primary-container)",
                        color: "var(--ls-primary)",
                        border: "1px solid rgba(31,158,142,0.3)",
                      }}
                    >
                      {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--ls-on-surface)" }}>
                        {user.full_name || user.username || user.email?.split("@")[0]}
                      </p>
                      <p className="text-[11px] flex items-center gap-1 font-mono text-orange-600 dark:text-orange-300">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                        {streakCount} day streak
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--ls-outline)" }}>
                    <span style={{ color: "var(--ls-on-surface-muted)" }}>Solved</span>
                    <span className="font-mono font-bold" style={{ color: "var(--ls-primary)" }}>{solvedCount} / {problems.length}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-center">
                  <p className="text-xs leading-relaxed" style={{ color: "var(--ls-on-surface-muted)" }}>
                    Sign in to track solve history and preserve daily streaks.
                  </p>
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all bg-[#1f9e8e] hover:bg-[#177a6d] shadow-2xs font-mono"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* ════════════════════════════════════════════════════════════════
              CENTER: PROBLEM LIST, SEARCH & CAROUSEL (LIGHT THEME)
             ════════════════════════════════════════════════════════════════ */}
          <main className="lg:col-span-7 space-y-5">

            {/* Top Featured Banners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                href="/practice/daily"
                className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-200/80 hover:border-teal-400 transition-all group shadow-xs dark:from-teal-500/10 dark:to-emerald-500/5 dark:border-teal-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                    {todaySet ? `Daily ${todaySet.total} Set` : "Daily Set"}
                  </span>
                  <Zap className="w-4 h-4 text-teal-600 dark:text-teal-300" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors dark:group-hover:text-teal-200">
                  Today&apos;s Challenge
                </h4>
                <p className="text-xs text-zinc-600 mt-1">{todaySet ? todaySet.summary : "Open today's practice set"}</p>
              </Link>

              <Link
                href="/pricing"
                className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 hover:border-amber-400 transition-all group shadow-xs dark:from-amber-500/10 dark:to-orange-500/5 dark:border-amber-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                    Premium Pass
                  </span>
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-amber-700 transition-colors dark:group-hover:text-amber-200">
                  {problems.length > 0 ? `Unlock All ${problems.length} Problems` : "Unlock the Full Archive"}
                </h4>
                <p className="text-xs text-zinc-600 mt-1">From ₹125/month</p>
              </Link>

              <div
                className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-indigo-50 to-sky-50/50 border border-indigo-200/80 transition-all shadow-xs dark:from-indigo-500/10 dark:to-sky-500/5 dark:border-indigo-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300">
                    Progress
                  </span>
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900">
                  {user ? `${solvedCount} / ${problems.length} Solved` : "Track Your Progress"}
                </h4>
                <p className="text-xs text-zinc-600 mt-1">
                  {user ? `${streakCount} day streak` : "Sign in to track solves and streaks"}
                </p>
              </div>
            </div>

            {/* Horizontal Topics Chips Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
              {topics.map((topic) => {
                const isActive = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setCurrentPage(1);
                    }}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition-all ${
                      isActive
                        ? "bg-[#1f9e8e] text-white shadow-xs font-semibold"
                        : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
                    }`}
                  >
                    {topic.name} <span className="opacity-75 text-[10px]">({topic.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Direct Circular Discipline Tabs & Difficulty Pills */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl"
              style={{
                background: "var(--ls-surface)",
                border: "1px solid var(--ls-outline)",
                boxShadow: "var(--ls-shadow-sm)",
              }}
            >
              {/* Circular Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDiscipline("all");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedDiscipline === "all"
                      ? "bg-[#1f9e8e] text-white font-semibold shadow-xs"
                      : "bg-[#f4f4f5] text-zinc-700 hover:bg-[#eaeaea] dark:hover:bg-[#1A2332]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Disciplines</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedDiscipline("sql");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedDiscipline === "sql"
                      ? "bg-sky-600 text-white font-semibold shadow-xs"
                      : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20 dark:border-sky-500/30"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white text-sky-700 flex items-center justify-center shadow-xs dark:text-sky-300">
                    <Database className="w-2.5 h-2.5" />
                  </div>
                  <span>SQL</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedDiscipline("python");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedDiscipline === "python"
                      ? "bg-amber-600 text-white font-semibold shadow-xs"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20 dark:border-amber-500/30"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white text-amber-700 flex items-center justify-center shadow-xs dark:text-amber-300">
                    <Code2 className="w-2.5 h-2.5" />
                  </div>
                  <span>Python</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedDiscipline("pyspark");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedDiscipline === "pyspark"
                      ? "bg-purple-600 text-white font-semibold shadow-xs"
                      : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20 dark:border-purple-500/30"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-xs dark:text-purple-300">
                    <Server className="w-2.5 h-2.5" />
                  </div>
                  <span>PySpark</span>
                </button>
              </div>

              {/* Difficulty Pills */}
              <div className="flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-xl border border-black/5 text-xs">
                {(["all", "easy", "medium", "advanced"] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      selectedDifficulty === diff
                        ? "bg-white text-zinc-900 font-semibold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {diff === "advanced" ? "Hard" : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Actions Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search questions by name or number..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    background: "var(--ls-surface)",
                    borderColor: "var(--ls-outline)",
                    color: "var(--ls-on-surface)",
                  }}
                  className="w-full pl-9.5 pr-4 py-2 border rounded-xl text-xs placeholder-zinc-400 focus:outline-none focus:border-[#1f9e8e] shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right Side: Status Filter & Pick Random */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs">
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  style={{
                    background: "var(--ls-surface)",
                    borderColor: "var(--ls-outline)",
                    color: "var(--ls-on-surface)",
                  }}
                  className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1f9e8e] shadow-xs"
                >
                  <option value="all">Status: All</option>
                  <option value="solved">Solved</option>
                  <option value="todo">Todo (Unsolved)</option>
                </select>

                <button
                  onClick={handlePickRandom}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-semibold hover:bg-zinc-100 shadow-xs"
                  style={{
                    background: "var(--ls-surface)",
                    border: "1px solid var(--ls-outline)",
                    color: "var(--ls-on-surface)",
                  }}
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#1f9e8e]" />
                  <span>Pick Random</span>
                </button>
              </div>
            </div>


            {/* Problem Table */}
            <div
              className="rounded-2xl overflow-hidden shadow-sm"
              style={{
                background: "var(--ls-surface)",
                border: "1px solid var(--ls-outline)",
              }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-12 px-5 py-3 text-[11px] font-mono uppercase tracking-wider font-semibold border-b"
                style={{
                  borderColor: "var(--ls-outline)",
                  background: "var(--ls-surface-low)",
                  color: "var(--ls-on-surface-subtle)",
                }}
              >
                <span className="col-span-1">Status</span>
                <span className="col-span-6">Title</span>
                <span className="col-span-2 text-right">Acceptance</span>
                <span className="col-span-2 text-right">Difficulty</span>
                <span className="col-span-1 text-center">Solve</span>
              </div>

              {/* Rows */}
              <div className="divide-y" style={{ borderColor: "var(--ls-outline)" }}>
                {loading ? (
                  <div className="py-16 text-center text-sm" style={{ color: "var(--ls-on-surface-muted)" }}>
                    Loading problems…
                  </div>
                ) : loadError ? (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-sm" style={{ color: "var(--ls-on-surface-muted)" }}>
                      Couldn&apos;t load problems. Please check your connection and try again.
                    </p>
                    <button
                      onClick={() => loadData()}
                      className="px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all hover:opacity-90"
                      style={{ background: "var(--ls-primary)" }}
                    >
                      Retry
                    </button>
                  </div>
                ) : paginatedProblems.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-sm" style={{ color: "var(--ls-on-surface-muted)" }}>
                      No problems match your current filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDiscipline("all");
                        setSelectedDifficulty("all");
                        setSelectedTopic("all");
                        setSelectedStatus("all");
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all hover:opacity-90"
                      style={{
                        background: "var(--ls-primary)",
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  paginatedProblems.map((prob) => {
                    const isSolved = solvedIds.has(prob.id);
                    return (
                      <div
                        key={prob.id}
                        className="grid grid-cols-12 items-center px-5 py-3.5 text-xs transition-colors group cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[#0F1419]"
                        onClick={() => router.push(`/practice/daily/${prob.id}`)}
                      >
                        {/* Status */}
                        <div className="col-span-1 flex items-center">
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                          ) : prob.isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500" />
                          )}
                        </div>

                        {/* Title & Tags */}
                        <div className="col-span-6 space-y-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-zinc-400 text-xs font-medium">
                              {prob.num}.
                            </span>
                            <span className="font-medium text-zinc-800 group-hover:text-[#1f9e8e] transition-colors truncate">
                              {prob.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {getDisciplineIcon(prob.discipline)}
                          </div>
                        </div>

                        {/* Acceptance */}
                        <div className="col-span-2 text-right font-mono text-xs text-zinc-500">
                          {prob.acceptanceRate === null ? "—" : `${prob.acceptanceRate.toFixed(1)}%`}
                        </div>

                        {/* Difficulty */}
                        <div className="col-span-2 text-right">
                          {getDifficultyBadge(prob.difficulty)}
                        </div>

                        {/* Solve Button */}
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/practice/daily/${prob.id}`);
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#1f9e8e] transition-all"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Footer */}
              <div
                className="px-5 py-3.5 flex items-center justify-between border-t text-xs"
                style={{
                  borderColor: "var(--ls-outline)",
                  background: "var(--ls-surface-low)",
                  color: "var(--ls-on-surface-muted)",
                }}
              >
                <span>
                  Showing {filteredProblems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
                  {Math.min(currentPage * pageSize, filteredProblems.length)} of {filteredProblems.length} problems
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-white border border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg bg-white border border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </main>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT SIDEBAR: STREAK CALENDAR & TRENDING COMPANIES (LIGHT THEME)
             ════════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-6">

            {/* STREAK CALENDAR WIDGET — real solve days from the backend */}
            <div
              className="p-5 rounded-2xl space-y-4 shadow-sm"
              style={{
                background: "var(--ls-surface)",
                border: "1px solid var(--ls-outline)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center dark:bg-orange-500/20 dark:text-orange-300">
                    <Flame className="w-4 h-4 fill-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                      {calendar.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      {user
                        ? `${calendar.solvedThisMonth} day${calendar.solvedThisMonth === 1 ? "" : "s"} solved · ${streakCount} day streak`
                        : "Sign in to track your streak"}
                    </p>
                  </div>
                </div>
                {user ? (
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                    style={{
                      background: "var(--ls-primary-container)",
                      color: "var(--ls-primary)",
                    }}
                  >
                    {activeToday ? "Solved today" : "Not yet today"}
                  </span>
                ) : (
                  <Link
                    href="/login"
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                    style={{
                      background: "var(--ls-primary-container)",
                      color: "var(--ls-primary)",
                    }}
                  >
                    Sign in
                  </Link>
                )}
              </div>

              {/* Month calendar grid */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-zinc-500">
                  <button
                    onClick={() => setMonthOffset((m) => m - 1)}
                    disabled={monthOffset <= -11}
                    aria-label="Previous month"
                    className="p-1 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMonthOffset(0)}
                    disabled={calendar.isCurrentMonth}
                    className="text-[10px] font-mono font-semibold uppercase tracking-wider disabled:opacity-40"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setMonthOffset((m) => m + 1)}
                    disabled={calendar.isCurrentMonth}
                    aria-label="Next month"
                    className="p-1 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center text-[10px] font-mono text-zinc-400 font-semibold">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
                  {Array.from({ length: calendar.leadingBlanks }).map((_, i) => (
                    <span key={`blank-${i}`} />
                  ))}
                  {calendar.cells.map((c) => (
                    <div
                      key={c.day}
                      className={`p-1.5 rounded-lg text-center transition-all ${
                        c.solved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                          : c.isToday
                          ? "bg-[#1f9e8e] text-white font-bold shadow-xs scale-105"
                          : c.isFuture
                          ? "text-zinc-300"
                          : "text-zinc-600 hover:bg-zinc-100"
                      } ${c.solved && c.isToday ? "ring-2 ring-[#1f9e8e]" : ""}`}
                    >
                      {c.day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Last 7 days */}
              {user && (
                <div className="pt-3 border-t space-y-2" style={{ borderColor: "var(--ls-outline)" }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Last 7 days</span>
                    <span className="font-mono text-emerald-700 font-semibold dark:text-emerald-300">{calendar.solvedLast7} / 7 Days</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#1f9e8e] rounded-full transition-all"
                      style={{ width: `${(calendar.solvedLast7 / 7) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
