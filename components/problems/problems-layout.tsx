"use client";

import { useState, useEffect, useMemo } from "react";
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
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Trophy,
  Filter,
  ArrowRight,
  ExternalLink,
  Layers,
  Award,
  Zap,
  LogIn,
  Check,
  Building2,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

export interface ProblemItem {
  id: string;
  num: number;
  title: string;
  discipline: "sql" | "python" | "pyspark";
  difficulty: "easy" | "medium" | "advanced";
  acceptanceRate: string;
  companies: string[];
  topics: string[];
  isLocked: boolean;
  isSolved?: boolean;
}

const TOPICS = [
  { id: "all", name: "All Topics", count: 110 },
  { id: "window-functions", name: "Window Functions", count: 34 },
  { id: "aggregations", name: "Aggregations & GroupBy", count: 42 },
  { id: "joins-ctes", name: "Joins & CTEs", count: 38 },
  { id: "pandas-transforms", name: "Pandas Transformations", count: 26 },
  { id: "spark-dataframes", name: "PySpark DataFrames", count: 28 },
  { id: "ranking-lead-lag", name: "Ranking & Lead/Lag", count: 22 },
  { id: "time-series", name: "Time-Series & Dates", count: 19 },
  { id: "subqueries", name: "Subqueries & Self-Joins", count: 25 },
  { id: "data-cleaning", name: "Data Cleaning & Nulls", count: 17 },
];

const COMPANIES = [
  { name: "Amazon", count: 48 },
  { name: "Google", count: 38 },
  { name: "Meta", count: 32 },
  { name: "Microsoft", count: 29 },
  { name: "Uber", count: 24 },
  { name: "Apple", count: 21 },
  { name: "Netflix", count: 19 },
  { name: "Databricks", count: 18 },
  { name: "Snowflake", count: 16 },
  { name: "Flipkart", count: 14 },
  { name: "Walmart", count: 12 },
  { name: "Stripe", count: 11 },
];

const DEFAULT_PROBLEMS: ProblemItem[] = [
  { id: "sql-1", num: 1, title: "Find All Active Customers in 2024", discipline: "sql", difficulty: "easy", acceptanceRate: "88.5%", companies: ["Amazon", "Flipkart"], topics: ["aggregations"], isLocked: false },
  { id: "sql-2", num: 2, title: "High Salary Employees in Engineering", discipline: "sql", difficulty: "easy", acceptanceRate: "82.1%", companies: ["Google", "Microsoft"], topics: ["aggregations"], isLocked: false },
  { id: "sql-3", num: 3, title: "Products Out of Stock or Low Inventory", discipline: "sql", difficulty: "easy", acceptanceRate: "79.4%", companies: ["Walmart", "Amazon"], topics: ["data-cleaning"], isLocked: false },
  { id: "sql-4", num: 4, title: "Department Average vs Median Compensation", discipline: "sql", difficulty: "medium", acceptanceRate: "64.2%", companies: ["Meta", "Netflix"], topics: ["window-functions", "aggregations"], isLocked: false },
  { id: "sql-5", num: 5, title: "Top 3 Highest Spending Customers Per Category", discipline: "sql", difficulty: "medium", acceptanceRate: "58.7%", companies: ["Amazon", "Uber"], topics: ["window-functions", "ranking-lead-lag"], isLocked: false },
  { id: "sql-6", num: 6, title: "Consecutive Active Days Streak Calculation", discipline: "sql", difficulty: "advanced", acceptanceRate: "41.3%", companies: ["Meta", "Google", "Uber"], topics: ["window-functions", "time-series"], isLocked: false },
  { id: "sql-7", num: 7, title: "Monthly Recurring Revenue (MRR) Churn Analysis", discipline: "sql", difficulty: "advanced", acceptanceRate: "38.9%", companies: ["Stripe", "Snowflake"], topics: ["joins-ctes", "time-series"], isLocked: false },
  { id: "sql-8", num: 8, title: "User First-Touch and Last-Touch Attribution", discipline: "sql", difficulty: "advanced", acceptanceRate: "35.2%", companies: ["Google", "Meta"], topics: ["window-functions", "ranking-lead-lag"], isLocked: false },
  { id: "sql-9", num: 9, title: "Detect Fraudulent Transactions in 10-Minute Windows", discipline: "sql", difficulty: "advanced", acceptanceRate: "31.4%", companies: ["Stripe", "Uber"], topics: ["joins-ctes", "time-series"], isLocked: false },
  { id: "sql-10", num: 10, title: "Customer Retention Cohort Grid Matrix", discipline: "sql", difficulty: "advanced", acceptanceRate: "29.8%", companies: ["Amazon", "Flipkart", "Netflix"], topics: ["joins-ctes", "window-functions"], isLocked: false },

  // Python (Pandas)
  { id: "py-1", num: 11, title: "Pandas - Filter and Clean Missing Telemetry Records", discipline: "python", difficulty: "easy", acceptanceRate: "86.2%", companies: ["Google", "Apple"], topics: ["data-cleaning", "pandas-transforms"], isLocked: false },
  { id: "py-2", num: 12, title: "Pandas - Aggregate Sales Revenue by Store Region", discipline: "python", difficulty: "easy", acceptanceRate: "81.0%", companies: ["Walmart", "Amazon"], topics: ["aggregations", "pandas-transforms"], isLocked: false },
  { id: "py-3", num: 13, title: "Pandas - Compute Rolling 7-Day Moving Averages", discipline: "python", difficulty: "medium", acceptanceRate: "61.5%", companies: ["Uber", "Databricks"], topics: ["time-series", "pandas-transforms"], isLocked: false },
  { id: "py-4", num: 14, title: "Pandas - Pivot Nested JSON Events to Normalized Columns", discipline: "python", difficulty: "medium", acceptanceRate: "54.8%", companies: ["Meta", "Stripe"], topics: ["pandas-transforms"], isLocked: false },
  { id: "py-5", num: 15, title: "Pandas - Multi-index GroupBy and Cumulative Retention", discipline: "python", difficulty: "advanced", acceptanceRate: "42.0%", companies: ["Netflix", "Snowflake"], topics: ["pandas-transforms", "time-series"], isLocked: false },
  { id: "py-6", num: 16, title: "Pandas - Reconcile Ledger Transactions & Flag Discrepancies", discipline: "python", difficulty: "advanced", acceptanceRate: "36.4%", companies: ["Stripe", "Amazon"], topics: ["data-cleaning", "joins-ctes"], isLocked: false },

  // PySpark
  { id: "spark-1", num: 17, title: "PySpark - Broadcast Join on Skewed Product Catalog", discipline: "pyspark", difficulty: "easy", acceptanceRate: "76.8%", companies: ["Amazon", "Databricks"], topics: ["spark-dataframes", "joins-ctes"], isLocked: false },
  { id: "spark-2", num: 18, title: "PySpark - Deduplicate Clickstream with Watermarking", discipline: "pyspark", difficulty: "medium", acceptanceRate: "59.2%", companies: ["Google", "Uber"], topics: ["spark-dataframes", "time-series"], isLocked: false },
  { id: "spark-3", num: 19, title: "PySpark - Window Partitioning with Lead/Lag Analytics", discipline: "pyspark", difficulty: "medium", acceptanceRate: "51.3%", companies: ["Apple", "Netflix"], topics: ["spark-dataframes", "ranking-lead-lag"], isLocked: false },
  { id: "spark-4", num: 20, title: "PySpark - Repartitioning & Salting for Heavy Skew Mitigation", discipline: "pyspark", difficulty: "advanced", acceptanceRate: "39.1%", companies: ["Databricks", "Meta"], topics: ["spark-dataframes", "joins-ctes"], isLocked: false },
  { id: "spark-5", num: 21, title: "PySpark - Calculate Sessionized User Idle Durations", discipline: "pyspark", difficulty: "advanced", acceptanceRate: "33.7%", companies: ["Uber", "Google"], topics: ["spark-dataframes", "time-series"], isLocked: false },
  { id: "spark-6", num: 22, title: "PySpark - Real-time Parquet Partition Pruning & Aggregation", discipline: "pyspark", difficulty: "advanced", acceptanceRate: "30.5%", companies: ["Snowflake", "Databricks"], topics: ["spark-dataframes", "aggregations"], isLocked: false },
];

export function ProblemsLayout() {
  const router = useRouter();
  const [problems, setProblems] = useState<ProblemItem[]>(DEFAULT_PROBLEMS);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [streakCount, setStreakCount] = useState(0);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<"all" | "sql" | "python" | "pyspark">("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "advanced">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "solved" | "todo">("all");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companySearch, setCompanySearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    async function loadData() {
      try {
        const token = getToken();
        if (token) {
          const profile = await api.getProfile().catch(() => null);
          const streak = await api.getStreak().catch(() => ({ current_streak: 0 }));
          const solved = await api.getSolvedIds().catch(() => ({ solved_ids: [] }));

          if (profile) {
            setUser(profile);
            setStreakCount(streak.current_streak || 0);
            setSolvedIds(new Set(solved.solved_ids || []));
          }
        }

        // Fetch backend problems
        const backendProblems = await api.getProblems().catch(() => []);
        if (backendProblems && backendProblems.length > 0) {
          const mapped: ProblemItem[] = backendProblems.map((p, index) => {
            const rawType = (p.challenge_type || "sql").toLowerCase();
            const discipline: "sql" | "python" | "pyspark" =
              rawType.includes("python") && !rawType.includes("spark") ? "python" :
              rawType.includes("spark") ? "pyspark" : "sql";

            const diff = (p.difficulty || "easy").toLowerCase() as "easy" | "medium" | "advanced";

            const matchingCompanies = COMPANIES.filter((c) =>
              p.title.toLowerCase().includes(c.name.toLowerCase()) ||
              p.description?.toLowerCase().includes(c.name.toLowerCase())
            ).map((c) => c.name);

            const assignedCompanies = matchingCompanies.length > 0
              ? matchingCompanies
              : [COMPANIES[index % COMPANIES.length].name, COMPANIES[(index + 3) % COMPANIES.length].name];

            const topicsAssigned: string[] = [];
            if (p.title.toLowerCase().includes("window") || p.title.toLowerCase().includes("lead") || p.title.toLowerCase().includes("lag")) {
              topicsAssigned.push("window-functions", "ranking-lead-lag");
            } else if (p.title.toLowerCase().includes("group") || p.title.toLowerCase().includes("count") || p.title.toLowerCase().includes("sum")) {
              topicsAssigned.push("aggregations");
            } else if (p.title.toLowerCase().includes("join") || p.title.toLowerCase().includes("cte")) {
              topicsAssigned.push("joins-ctes");
            } else if (discipline === "python") {
              topicsAssigned.push("pandas-transforms");
            } else if (discipline === "pyspark") {
              topicsAssigned.push("spark-dataframes");
            } else {
              topicsAssigned.push("aggregations");
            }

            const acceptance = `${Math.min(92, Math.max(28, 88 - (index * 2.1) + (index % 5) * 3)).toFixed(1)}%`;

            return {
              id: p.id,
              num: index + 1,
              title: p.title,
              discipline,
              difficulty: diff,
              acceptanceRate: acceptance,
              companies: assignedCompanies,
              topics: topicsAssigned,
              isLocked: (p as any).is_locked || false,
            };
          });
          setProblems(mapped);
        }
      } catch (err) {
        console.error("Failed to load problems data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // Discipline filter
      if (selectedDiscipline !== "all" && p.discipline !== selectedDiscipline) return false;

      // Difficulty filter
      if (selectedDifficulty !== "all" && p.difficulty !== selectedDifficulty) return false;

      // Topic filter
      if (selectedTopic !== "all" && !p.topics.includes(selectedTopic)) return false;

      // Company filter
      if (selectedCompany) {
        const matchesCompany =
          p.companies.some((c) => c.toLowerCase() === selectedCompany.toLowerCase()) ||
          p.title.toLowerCase().includes(selectedCompany.toLowerCase());
        if (!matchesCompany) return false;
      }

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
          p.discipline.toLowerCase().includes(q) ||
          p.companies.some((c) => c.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [problems, selectedDiscipline, selectedDifficulty, selectedTopic, selectedCompany, selectedStatus, searchQuery, solvedIds]);

  // Paginated list
  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  // Random picker
  const handlePickRandom = () => {
    if (filteredProblems.length === 0) return;
    const rand = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    router.push(`/practice/daily/${rand.id}`);
  };

  const solvedCount = useMemo(() => {
    return problems.filter((p) => solvedIds.has(p.id)).length;
  }, [problems, solvedIds]);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return COMPANIES;
    return COMPANIES.filter((c) => c.name.toLowerCase().includes(companySearch.toLowerCase()));
  }, [companySearch]);

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
                    setSelectedCompany(null);
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
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white"
                  style={{
                    color: "var(--ls-on-surface-muted)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span style={{ color: "var(--ls-on-surface)" }}>Daily Quest</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                    9 Today
                  </span>
                </Link>

                <Link
                  href="/practice/learn/sql"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white"
                  style={{
                    color: "var(--ls-on-surface)",
                  }}
                >
                  <Layers className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                  <span>Study Plans</span>
                </Link>

                <Link
                  href="/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white"
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
                      : "hover:bg-white"
                  }`}
                  style={{ color: selectedDiscipline === "sql" ? undefined : "var(--ls-on-surface-muted)" }}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                    <span>SQL (Postgres/MySQL)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">50</span>
                </button>

                <button
                  onClick={() => setSelectedDiscipline("python")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedDiscipline === "python"
                      ? "bg-amber-50 text-amber-800 border border-amber-300 font-semibold dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                      : "hover:bg-white"
                  }`}
                  style={{ color: selectedDiscipline === "python" ? undefined : "var(--ls-on-surface-muted)" }}
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                    <span>Python (Pandas)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">30</span>
                </button>

                <button
                  onClick={() => setSelectedDiscipline("pyspark")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedDiscipline === "pyspark"
                      ? "bg-purple-50 text-purple-800 border border-purple-300 font-semibold dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
                      : "hover:bg-white"
                  }`}
                  style={{ color: selectedDiscipline === "pyspark" ? undefined : "var(--ls-on-surface-muted)" }}
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                    <span>PySpark</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">30</span>
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
                    Daily 9 Set
                  </span>
                  <Zap className="w-4 h-4 text-teal-600 dark:text-teal-300" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors dark:group-hover:text-teal-200">
                  Today's Challenge
                </h4>
                <p className="text-xs text-zinc-600 mt-1">3 SQL, 3 Python, 3 Spark</p>
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
                  Unlock Full 500+ Archive
                </h4>
                <p className="text-xs text-zinc-600 mt-1">From ₹166/month</p>
              </Link>

              <div
                onClick={() => setSelectedCompany("Amazon")}
                className="cursor-pointer relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-indigo-50 to-sky-50/50 border border-indigo-200/80 hover:border-indigo-400 transition-all group shadow-xs dark:from-indigo-500/10 dark:to-sky-500/5 dark:border-indigo-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300">
                    Curated
                  </span>
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors dark:group-hover:text-indigo-200">
                  Top Tech Interview Sets
                </h4>
                <p className="text-xs text-zinc-600 mt-1">Amazon, Meta, Google & Uber</p>
              </div>
            </div>

            {/* Horizontal Topics Chips Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
              {TOPICS.map((topic) => {
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
                  placeholder="Search questions by name, number, company..."
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

            {/* Active Company Banner if Selected */}
            {selectedCompany && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                  <span>Filtered by company: <strong>{selectedCompany}</strong></span>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="flex items-center gap-1 font-semibold hover:underline text-amber-700 dark:text-amber-300"
                >
                  <X className="w-3.5 h-3.5" /> Clear filter
                </button>
              </div>
            )}

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
                {paginatedProblems.length === 0 ? (
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
                        setSelectedCompany(null);
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
                            {prob.companies.slice(0, 2).map((comp) => (
                              <span
                                key={comp}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCompany(comp);
                                }}
                                className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Acceptance */}
                        <div className="col-span-2 text-right font-mono text-xs text-zinc-500">
                          {prob.acceptanceRate}
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

            {/* 1. STREAK CALENDAR WIDGET */}
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
                      September 2026
                    </h4>
                    <p className="text-[11px] text-zinc-500">Day 20 · {streakCount} day streak</p>
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                  style={{
                    background: "var(--ls-primary-container)",
                    color: "var(--ls-primary)",
                  }}
                >
                  Active
                </span>
              </div>

              {/* Month calendar grid */}
              <div className="space-y-1.5 pt-1">
                <div className="grid grid-cols-7 text-center text-[10px] font-mono text-zinc-400 font-semibold">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
                  {/* Empty offset days for Month */}
                  <span className="p-1.5 text-zinc-300">31</span>
                  {[...Array(30)].map((_, idx) => {
                    const day = idx + 1;
                    const isToday = day === 20;
                    const isCompleted = day <= 19 && day >= 10;
                    return (
                      <div
                        key={day}
                        className={`p-1.5 rounded-lg text-center transition-all ${
                          isToday
                            ? "bg-[#1f9e8e] text-white font-bold shadow-xs scale-105"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Streak Indicator */}
              <div className="pt-3 border-t space-y-2" style={{ borderColor: "var(--ls-outline)" }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Weekly Target</span>
                  <span className="font-mono text-emerald-700 font-semibold dark:text-emerald-300">7 / 7 Days</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#1f9e8e] w-full rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 2. TRENDING COMPANIES */}
            <div
              className="p-5 rounded-2xl space-y-4 shadow-sm"
              style={{
                background: "var(--ls-surface)",
                border: "1px solid var(--ls-outline)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-700" />
                  <h4 className="text-sm font-semibold text-zinc-900">Trending Companies</h4>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">Top tech</span>
              </div>

              {/* Search company */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search for a company..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  style={{
                    background: "var(--ls-surface-low)",
                    borderColor: "var(--ls-outline)",
                    color: "var(--ls-on-surface)",
                  }}
                  className="w-full pl-8 pr-3 py-1.5 border rounded-xl text-xs placeholder-zinc-400 focus:outline-none focus:border-[#1f9e8e]"
                />
              </div>

              {/* Company chips */}
              <div className="flex flex-wrap gap-1.5 max-h-[280px] overflow-y-auto pr-1">
                {filteredCompanies.map((c) => {
                  const isSelected = selectedCompany === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedCompany(isSelected ? null : c.name);
                        setCurrentPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[#1f9e8e] text-white font-bold shadow-xs scale-105"
                          : "bg-[#f4f4f5] text-zinc-700 hover:bg-[#e4e4e7] border border-black/5 dark:hover:bg-[#1A2332]"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isSelected ? "bg-white/25 text-white" : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-700"}`}>
                        {c.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCompany && (
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="w-full py-1.5 text-xs text-center text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  Clear Company Filter
                </button>
              )}
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
