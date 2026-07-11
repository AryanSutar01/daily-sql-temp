"use client";

import { useState, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  Database,
  Terminal,
  Loader2,
  Flame,
  Code2,
  Server
} from "lucide-react";

const DISCIPLINE_TABS = [
  { id: "sql", label: "SQL", icon: Database, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/30", fileLabel: "query_editor.sql" },
  { id: "python", label: "Python", icon: Code2, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", fileLabel: "solution.py" },
  { id: "pyspark", label: "PySpark", icon: Server, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30", fileLabel: "spark_job.py" },
];

interface Question {
  id: string;
  level: string;
  completed: boolean;
  title: string;
  description: string;
  tableData: {
    name: string;
    headers: string[];
    rows: string[][];
  };
  query: string;
  result: Record<string, any>[];
}

const SQL_QUESTIONS: Question[] = [
  {
    id: "sql-basic",
    level: "Basic",
    completed: true,
    title: "Marketing Campaign ROI",
    description: "Given tables for 'campaigns' and 'conversions', calculate the CTR and Cost Per Acquisition for each campaign. Filter out campaigns with less than 500 impressions.",
    tableData: {
      name: "campaigns",
      headers: ["id", "name", "spend", "impressions"],
      rows: [
        ["1", "BlackFriday_2023", "$5,000", "150k"],
        ["2", "Winter_Promo", "$3,200", "85k"]
      ]
    },
    query: `SELECT \n  c.campaign_name,\n  SUM(c.clicks) * 100.0 / NULLIF(SUM(c.impressions), 0) as ctr_percentage,\n  SUM(c.spend) / NULLIF(COUNT(cv.conversion_id), 0) as cpa\nFROM campaigns c\nLEFT JOIN conversions cv ON c.id = cv.campaign_id\nGROUP BY 1\nHAVING SUM(c.impressions) > 500\nORDER BY 3 ASC;`,
    result: [
      { campaign_name: "BlackFriday_2023", ctr_percentage: "5.1%", cpa: "$8.50" },
      { campaign_name: "Winter_Promo", ctr_percentage: "3.8%", cpa: "$12.20" },
    ]
  },
  {
    id: "sql-intermediate",
    level: "Intermediate",
    completed: true,
    title: "User Sessionization",
    description: "A new session starts if there is a 30-minute gap between events. Assign a unique session_id to each user's activity stream using window functions.",
    tableData: {
      name: "page_views",
      headers: ["user_id", "timestamp", "url"],
      rows: [
        ["u_123", "10:00:00", "/home"],
        ["u_123", "10:05:00", "/pricing"],
        ["u_123", "14:00:00", "/blog"]
      ]
    },
    query: `WITH lagged AS (\n  SELECT user_id, timestamp,\n    LAG(timestamp) OVER (\n      PARTITION BY user_id ORDER BY timestamp\n    ) as prev_ts\n  FROM page_views\n),\nsessions AS (\n  SELECT *,\n    CASE WHEN EXTRACT(EPOCH FROM\n      (timestamp - prev_ts)) > 1800\n    THEN 1 ELSE 0 END as is_new\n  FROM lagged\n)\nSELECT user_id, timestamp,\n  SUM(is_new) OVER (\n    PARTITION BY user_id ORDER BY timestamp\n  ) as session_id\nFROM sessions;`,
    result: [
      { user_id: "u_123", timestamp: "10:00:00", session_id: 1 },
      { user_id: "u_123", timestamp: "10:05:00", session_id: 1 },
      { user_id: "u_123", timestamp: "14:00:00", session_id: 2 }
    ]
  },
  {
    id: "sql-advanced",
    level: "Advanced",
    completed: false,
    title: "Cohort Retention Analysis",
    description: "Calculate the monthly retention rate for each cohort grouped by first purchase month. Show which cohorts have the highest retention over time.",
    tableData: {
      name: "transactions",
      headers: ["id", "customer", "amount", "date"],
      rows: [
        ["1", "101", "$49.99", "2023-01-15"],
        ["2", "102", "$129.00", "2023-01-16"],
        ["3", "101", "$19.99", "2023-02-10"]
      ]
    },
    query: `WITH first_purchase AS (\n  SELECT customer_id,\n    date_trunc('month', min(transaction_date))\n      as cohort_month\n  FROM transactions GROUP BY 1\n),\nmatrix AS (\n  SELECT fp.cohort_month,\n    date_trunc('month', t.transaction_date)\n      as activity_month,\n    COUNT(DISTINCT t.customer_id) as active_users\n  FROM transactions t\n  JOIN first_purchase fp\n    ON t.customer_id = fp.customer_id\n  GROUP BY 1, 2\n)\nSELECT cohort_month, activity_month,\n  active_users::float /\n    first_value(active_users) OVER (\n      PARTITION BY cohort_month\n      ORDER BY activity_month\n    ) as retention_rate\nFROM matrix\nWHERE activity_month >= cohort_month;`,
    result: [
      { cohort_month: "2023-01-01", activity_month: "2023-01-01", retention_rate: "100%" },
      { cohort_month: "2023-01-01", activity_month: "2023-02-01", retention_rate: "50%" },
      { cohort_month: "2023-01-01", activity_month: "2023-03-01", retention_rate: "33%" }
    ]
  }
];

const PYTHON_QUESTIONS: Question[] = [
  {
    id: "py-basic",
    level: "Basic",
    completed: true,
    title: "Top Products by Revenue",
    description: "Given a sales DataFrame with columns order_id, product, quantity, and price, calculate total revenue per product and return the top 5 sorted by revenue descending.",
    tableData: {
      name: "sales",
      headers: ["order_id", "product", "quantity", "price"],
      rows: [
        ["1", "Widget A", "3", "29.99"],
        ["2", "Widget B", "1", "99.99"],
        ["3", "Widget A", "2", "29.99"]
      ]
    },
    query: `import pandas as pd\n\ndef top_products(df: pd.DataFrame) -> pd.DataFrame:\n    df["revenue"] = df["quantity"] * df["price"]\n    \n    result = (\n        df.groupby("product")["revenue"]\n        .sum()\n        .reset_index()\n        .sort_values("revenue", ascending=False)\n        .head(5)\n    )\n    \n    return result`,
    result: [
      { product: "Widget A", revenue: "149.95" },
      { product: "Widget B", revenue: "99.99" },
    ]
  },
  {
    id: "py-intermediate",
    level: "Intermediate",
    completed: true,
    title: "Rolling 7-Day Active Users",
    description: "From an events DataFrame with user_id and event_date, calculate the 7-day rolling count of distinct active users for each date.",
    tableData: {
      name: "events",
      headers: ["user_id", "event_date"],
      rows: [
        ["u1", "2024-01-01"],
        ["u2", "2024-01-01"],
        ["u1", "2024-01-03"]
      ]
    },
    query: `import pandas as pd\n\ndef rolling_dau(df: pd.DataFrame) -> pd.DataFrame:\n    df["event_date"] = pd.to_datetime(df["event_date"])\n    \n    daily = (\n        df.groupby("event_date")["user_id"]\n        .nunique()\n        .reset_index()\n        .rename(columns={"user_id": "dau"})\n        .set_index("event_date")\n    )\n    \n    daily["rolling_7d"] = (\n        daily["dau"]\n        .rolling("7D")\n        .sum()\n    )\n    \n    return daily.reset_index()`,
    result: [
      { event_date: "2024-01-01", dau: 2, rolling_7d: 2 },
      { event_date: "2024-01-03", dau: 1, rolling_7d: 3 },
    ]
  },
  {
    id: "py-advanced",
    level: "Advanced",
    completed: false,
    title: "Customer LTV Segmentation",
    description: "From a purchases DataFrame, compute each customer's LTV, assign RFM (Recency, Frequency, Monetary) scores, and segment into High/Mid/Low value tiers.",
    tableData: {
      name: "purchases",
      headers: ["customer_id", "purchase_date", "amount"],
      rows: [
        ["c1", "2024-01-10", "120.00"],
        ["c1", "2024-02-15", "80.00"],
        ["c2", "2024-01-20", "45.00"]
      ]
    },
    query: `import pandas as pd\nimport numpy as np\n\ndef ltv_segments(df: pd.DataFrame) -> pd.DataFrame:\n    df["purchase_date"] = pd.to_datetime(df["purchase_date"])\n    snapshot = df["purchase_date"].max()\n    \n    rfm = df.groupby("customer_id").agg(\n        recency=("purchase_date",\n            lambda x: (snapshot - x.max()).days),\n        frequency=("purchase_date", "count"),\n        monetary=("amount", "sum")\n    ).reset_index()\n    \n    rfm["segment"] = pd.cut(\n        rfm["monetary"],\n        bins=[0, 100, 300, float("inf")],\n        labels=["Low", "Mid", "High"]\n    )\n    \n    return rfm`,
    result: [
      { customer_id: "c1", recency: 5, frequency: 2, monetary: "200.00", segment: "Mid" },
      { customer_id: "c2", recency: 25, frequency: 1, monetary: "45.00", segment: "Low" },
    ]
  }
];

const PYSPARK_QUESTIONS: Question[] = [
  {
    id: "spark-basic",
    level: "Basic",
    completed: true,
    title: "Daily Revenue by Region",
    description: "Given a sales Spark DataFrame with columns date, region, and amount, compute total daily revenue per region sorted by date and region.",
    tableData: {
      name: "sales",
      headers: ["date", "region", "amount"],
      rows: [
        ["2024-01-01", "North", "500.00"],
        ["2024-01-01", "South", "320.00"],
        ["2024-01-02", "North", "610.00"]
      ]
    },
    query: `from pyspark.sql import functions as F\n\ndef daily_revenue(df):\n    return (\n        df.groupBy("date", "region")\n        .agg(\n            F.sum("amount").alias("total_revenue")\n        )\n        .orderBy("date", "region")\n    )`,
    result: [
      { date: "2024-01-01", region: "North", total_revenue: "500.00" },
      { date: "2024-01-01", region: "South", total_revenue: "320.00" },
      { date: "2024-01-02", region: "North", total_revenue: "610.00" },
    ]
  },
  {
    id: "spark-intermediate",
    level: "Intermediate",
    completed: true,
    title: "User Purchase Rank",
    description: "Using window functions, rank each customer's purchases by amount within each month. Return the top purchase per customer per month.",
    tableData: {
      name: "purchases",
      headers: ["customer_id", "month", "amount"],
      rows: [
        ["c1", "2024-01", "120.00"],
        ["c1", "2024-01", "85.00"],
        ["c2", "2024-01", "200.00"]
      ]
    },
    query: `from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef top_purchase_per_month(df):\n    w = Window.partitionBy(\n        "customer_id", "month"\n    ).orderBy(F.desc("amount"))\n    \n    return (\n        df.withColumn("rank", F.rank().over(w))\n        .filter(F.col("rank") == 1)\n        .drop("rank")\n    )`,
    result: [
      { customer_id: "c1", month: "2024-01", amount: "120.00" },
      { customer_id: "c2", month: "2024-01", amount: "200.00" },
    ]
  },
  {
    id: "spark-advanced",
    level: "Advanced",
    completed: false,
    title: "Session Duration Analysis",
    description: "From a clickstream DataFrame with user_id, timestamp, and page, detect session boundaries (30-min gap), compute session duration, and return average session time per user.",
    tableData: {
      name: "clickstream",
      headers: ["user_id", "timestamp", "page"],
      rows: [
        ["u1", "2024-01-01 10:00", "/home"],
        ["u1", "2024-01-01 10:12", "/docs"],
        ["u1", "2024-01-01 14:00", "/pricing"]
      ]
    },
    query: `from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef avg_session_duration(df):\n    w = Window.partitionBy("user_id")\\\n        .orderBy("timestamp")\n    \n    df = df.withColumn(\n        "prev_ts",\n        F.lag("timestamp").over(w)\n    ).withColumn(\n        "gap_mins",\n        (F.unix_timestamp("timestamp") -\n         F.unix_timestamp("prev_ts")) / 60\n    ).withColumn(\n        "is_new_session",\n        (F.col("gap_mins") > 30).cast("int")\n    ).withColumn(\n        "session_id",\n        F.sum("is_new_session").over(\n            w.rowsBetween(Window.unboundedPreceding, 0)\n        )\n    )\n    \n    session_dur = df.groupBy(\n        "user_id", "session_id"\n    ).agg(\n        (\n            (F.max(F.unix_timestamp("timestamp")) -\n             F.min(F.unix_timestamp("timestamp"))) / 60\n        ).alias("duration_mins")\n    )\n    \n    return session_dur.groupBy("user_id").agg(\n        F.round(F.avg("duration_mins"), 1)\n         .alias("avg_session_mins")\n    )`,
    result: [
      { user_id: "u1", avg_session_mins: "12.0" },
    ]
  }
];

const QUESTIONS_BY_DISCIPLINE: Record<string, Question[]> = {
  sql: SQL_QUESTIONS,
  python: PYTHON_QUESTIONS,
  pyspark: PYSPARK_QUESTIONS,
};

export const HighlightCode = ({ code, discipline }: { code: string; discipline: string }) => {
  if (!code) return null;

  if (discipline === "sql") {
    const parts = code.split(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bPARTITION\s+BY\b|\bJOIN\b|\bWITH\b|\bAS\b|\bON\b|\bAND\b|\bOVER\b|\bCASE\b|\bWHEN\b|\bTHEN\b|\bELSE\b|\bEND\b|'[^']*'|\b\d+\.?\d*\b|[(),;.]|[+\-*\/%=<>!]+)/gi);
    return (
      <>
        {parts.map((part, i) => {
          if (!part) return null;
          if (/^(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|PARTITION\s+BY|JOIN|WITH|AS|ON|AND|OVER|CASE|WHEN|THEN|ELSE|END)$/i.test(part)) return <span key={i} className="text-[#ff79c6] font-semibold">{part}</span>;
          if (/^(COUNT|SUM|MIN|MAX|DATE_TRUNC|FIRST_VALUE|LAG|EXTRACT|EPOCH|NULLIF)$/i.test(part)) return <span key={i} className="text-[#50fa7b]">{part}</span>;
          if (/^'[^']*'$/.test(part)) return <span key={i} className="text-[#f1fa8c]">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-[#bd93f9]">{part}</span>;
          return <span key={i} className="text-[#f8f8f2]">{part}</span>;
        })}
      </>
    );
  }

  // Python / PySpark highlighting
  const parts = code.split(/(import\s+\w+|from\s+[\w.]+\s+import\s+[\w,\s]+|def\s+\w+|return\b|#[^\n]*|"[^"]*"|'[^']*'|\b\d+\.?\d*\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^(import|from|def|return|as|for|in|if|else|lambda)/.test(part)) return <span key={i} className="text-[#ff79c6] font-semibold">{part}</span>;
        if (/^#/.test(part)) return <span key={i} className="text-zinc-500 italic">{part}</span>;
        if (/^["']/.test(part)) return <span key={i} className="text-[#f1fa8c]">{part}</span>;
        if (/^\d+/.test(part)) return <span key={i} className="text-[#bd93f9]">{part}</span>;
        return <span key={i} className="text-[#f8f8f2]">{part}</span>;
      })}
    </>
  );
};

export function ProductPreview() {
  const [activeDiscipline, setActiveDiscipline] = useState("sql");
  const questions = QUESTIONS_BY_DISCIPLINE[activeDiscipline];
  const [activeQuestion, setActiveQuestion] = useState(questions[2]);
  const [code, setCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const activeTab = DISCIPLINE_TABS.find(t => t.id === activeDiscipline)!;

  // When discipline switches, reset to the advanced question of that discipline
  useEffect(() => {
    const qs = QUESTIONS_BY_DISCIPLINE[activeDiscipline];
    setActiveQuestion(qs[2]);
  }, [activeDiscipline]);

  // Reset and restart typing when question changes
  useEffect(() => {
    if (activeQuestion) {
      setCode("");
      setIsTyping(true);
      setShowResult(false);
      setIsRunning(false);
    }
  }, [activeQuestion]);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
    }, 400);
  };

  // Typing effect
  useEffect(() => {
    if (!isTyping || !activeQuestion) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < activeQuestion.query.length) {
        setCode(activeQuestion.query.slice(0, currentIndex + 3));
        currentIndex += 3;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        setTimeout(() => handleRun(), 300);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [isTyping, activeQuestion]);

  return (
    <section className="py-24 md:py-32 border-b border-[#202736] bg-[#080c16]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Practice across all three disciplines
            </h2>
            <p className="text-lg text-[#7b8ca3]">
              SQL, Python (Pandas), and PySpark — all in one editor. From problem to solution in 15 minutes.
            </p>
          </div>

          {/* Editor Container */}
          <div className="relative rounded-xl border border-[#202736] bg-[#121826] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[800px] lg:h-[650px]">

            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-72 border-r border-[#202736] bg-[#0b101c] flex flex-col shrink-0">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-[#202736] bg-[#0b101c] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm tracking-wide text-zinc-300">Today's Practice</span>
                  <span className="text-xs text-[#4DD4C4] font-mono bg-[#4DD4C4]/10 px-2 py-0.5 rounded border border-[#4DD4C4]/20">Day 47</span>
                </div>
                {/* Discipline tabs */}
                <div className="flex gap-1">
                  {DISCIPLINE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeDiscipline;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDiscipline(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-md text-[10px] font-semibold transition-all ${
                          isActive
                            ? `${tab.bg} ${tab.color} border ${tab.border}`
                            : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] border border-transparent"
                        }`}
                      >
                        <Icon size={12} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestion(q)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${activeQuestion.id === q.id
                      ? `${activeTab.bg} border-${activeTab.id === 'sql' ? 'sky' : activeTab.id === 'python' ? 'amber' : 'violet'}-400/40`
                      : "bg-[#121826] border-[#202736] opacity-60 hover:opacity-100 hover:bg-[#1a2130]"
                      }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${q.level === "Advanced" ? "text-red-400 bg-red-400/10" :
                          q.level === "Intermediate" ? "text-yellow-400 bg-yellow-400/10" :
                            "text-green-400 bg-green-400/10"
                          }`}>
                          {q.level}
                        </span>
                        {q.completed && <CheckCircle2 size={14} className="text-[#4DD4C4]" />}
                      </div>
                      <span className={`text-sm font-medium ${activeQuestion.id === q.id ? 'text-white' : 'text-zinc-400'}`}>
                        {q.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Streak Footer */}
              <div className="p-5 border-t border-[#202736] bg-[#0b101c]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Daily Streak</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1">
                    47 <Flame size={14} className="text-orange-500 fill-orange-500" />
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#121826] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4DD4C4] w-[80%] shadow-[0_0_10px_rgba(77,212,196,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT Area */}
            <div className="flex-1 flex flex-col bg-[#131924] overflow-hidden">

              {/* Top Bar */}
              <div className="h-12 border-b border-[#202736] flex items-center justify-between px-4 bg-[#1a2230] shrink-0">
                <span className="font-mono text-xs text-zinc-400 flex items-center gap-2">
                  <Terminal size={14} className={activeTab.color} />
                  {activeTab.fileLabel}
                </span>
                <button
                  onClick={handleRun}
                  disabled={isRunning || isTyping}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080C16] text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                  Run
                </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Description Panel */}
                <div className="hidden lg:flex w-[350px] border-r border-[#202736] flex-col bg-[#131924] overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="space-y-4">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border w-fit ${activeQuestion.level === "Advanced" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                      activeQuestion.level === "Intermediate" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                        "text-green-400 bg-green-400/10 border-green-400/20"
                      }`}>
                      {activeQuestion.level}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {activeQuestion.title}
                    </h3>
                    {activeQuestion.description && (
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {activeQuestion.description}
                      </p>
                    )}

                    {activeQuestion.tableData && (
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                            <Database size={12} /> {activeQuestion.tableData.name}
                          </h4>
                          <span className="text-[10px] text-zinc-600 font-mono">Example Data</span>
                        </div>
                        <div className="rounded-lg border border-[#202736] overflow-hidden">
                          <table className="w-full text-left text-[10px]">
                            <thead className="bg-[#1a2230] text-zinc-400">
                              <tr>
                                {activeQuestion.tableData.headers.map((header) => (
                                  <th key={header} className="px-3 py-1.5 font-medium border-b border-[#202736] font-mono">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-[#131924]">
                              {activeQuestion.tableData.rows.map((row, i) => (
                                <tr key={i} className="border-b border-[#202736]/50 last:border-0">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-3 py-1.5 text-zinc-300 font-mono">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Code & Result */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Editor */}
                  <div className="flex-1 p-0 font-mono text-sm overflow-auto relative bg-[#131924] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#131924] border-r border-[#202736] text-right pr-3 pt-4 text-zinc-600 select-none">
                      {Array.from({ length: 25 }).map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                    </div>
                    <pre className="p-4 pl-16 leading-6 text-zinc-100">
                      <code>
                        <HighlightCode code={code} discipline={activeDiscipline} />
                        {isTyping && <span className="inline-block w-2 h-4 bg-[#30B5A6] ml-0.5 animate-pulse align-middle"></span>}
                      </code>
                    </pre>
                  </div>

                  {/* Result Panel */}
                  <div className={`border-t border-[#202736] bg-[#080c16] transition-all duration-300 ease-in-out flex flex-col shrink-0 ${showResult ? "h-[200px]" : "h-0 overflow-hidden"}`}>
                    <div className="px-4 py-2 border-b border-[#202736] bg-[#1a2230] flex items-center justify-between flex-shrink-0">
                      <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                        <Terminal size={12} />
                        Output
                      </span>
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Success (14ms)
                      </span>
                    </div>
                    {activeQuestion.result && (
                      <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#080c16] text-zinc-400 sticky top-0">
                            <tr>
                              {activeQuestion.result.length > 0 && Object.keys(activeQuestion.result[0]).map(key => (
                                <th key={key} className="px-6 py-2 font-medium border-b border-[#202736] whitespace-nowrap">{key.replace(/_/g, ' ')}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {activeQuestion.result.map((row, i) => (
                              <tr key={i} className="hover:bg-white/[0.02]">
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="px-6 py-2 text-zinc-300 font-mono whitespace-nowrap">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
