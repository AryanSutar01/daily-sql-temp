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
    { id: "sql", label: "SQL", icon: Database, color: "text-[#1f9e8e]", bg: "bg-[#e6f7f5]", border: "border-[#1f9e8e]/40", fileLabel: "query_editor.sql" },
    { id: "python", label: "Python", icon: Code2, color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-300 dark:border-amber-500/30", fileLabel: "solution.py" },
    { id: "pyspark", label: "PySpark", icon: Server, color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-300 dark:border-violet-500/30", fileLabel: "spark_job.py" },
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
        const parts = code.split(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bHAVING\b|\bPARTITION\s+BY\b|\bJOIN\b|\bLEFT\s+JOIN\b|\bWITH\b|\bAS\b|\bON\b|\bAND\b|\bOVER\b|\bCASE\b|\bWHEN\b|\bTHEN\b|\bELSE\b|\bEND\b|'[^']*'|\b\d+\.?\d*\b|[(),;.]|[+\-*\/%=<>!]+)/gi);
        return (
            <>
                {parts.map((part, i) => {
                    if (!part) return null;
                    if (/^(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING|PARTITION\s+BY|JOIN|LEFT\s+JOIN|WITH|AS|ON|AND|OVER|CASE|WHEN|THEN|ELSE|END)$/i.test(part)) {
                        return <span key={i} className="text-[#0000ff] dark:text-[#569cd6] font-bold">{part}</span>;
                    }
                    if (/^(COUNT|SUM|MIN|MAX|DATE_TRUNC|FIRST_VALUE|LAG|EXTRACT|EPOCH|NULLIF)$/i.test(part)) {
                        return <span key={i} className="text-[#795e26] dark:text-[#dcdcaa] font-semibold">{part}</span>;
                    }
                    if (/^'[^']*'$/.test(part)) {
                        return <span key={i} className="text-[#a31515] dark:text-[#ce9178] font-medium">{part}</span>;
                    }
                    if (/^\d+(\.\d+)?$/.test(part)) {
                        return <span key={i} className="text-[#098658] dark:text-[#b5cea8] font-semibold">{part}</span>;
                    }
                    if (/^[(),;.]|[+\-*\/%=<>!]+$/.test(part)) {
                        return <span key={i} className="text-zinc-800">{part}</span>;
                    }
                    return <span key={i} className="text-[#1e293b] dark:text-[#e2e8f0]">{part}</span>;
                })}
            </>
        );
    }

    // Python / PySpark highlighting
    const parts = code.split(/(\bimport\b|\bfrom\b|\bdef\b|\breturn\b|\bas\b|\bfor\b|\bin\b|\bif\b|\belse\b|\blambda\b|\bwith\b|\bpass\b|#[^\n]*|"[^"]*"|'[^']*'|\b\d+\.?\d*\b|\b(?:groupby|sum|reset_index|sort_values|head|to_datetime|nunique|rename|set_index|rolling|agg|cut|partitionby|orderby|withcolumn|filter|drop|round|avg|alias)\b)/gi);
    return (
        <>
            {parts.map((part, i) => {
                if (!part) return null;
                if (/^(import|from|def|return|as|for|in|if|else|lambda|with|pass)$/i.test(part)) {
                    return <span key={i} className="text-[#af00db] dark:text-[#c586c0] font-bold">{part}</span>;
                }
                if (/^(groupby|sum|reset_index|sort_values|head|to_datetime|nunique|rename|set_index|rolling|agg|cut|partitionby|orderby|withcolumn|filter|drop|round|avg|alias)$/i.test(part)) {
                    return <span key={i} className="text-[#795e26] dark:text-[#dcdcaa] font-semibold">{part}</span>;
                }
                if (/^#/.test(part)) {
                    return <span key={i} className="text-[#008000] dark:text-[#6a9955] italic">{part}</span>;
                }
                if (/^["']/.test(part)) {
                    return <span key={i} className="text-[#a31515] dark:text-[#ce9178] font-medium">{part}</span>;
                }
                if (/^\d+(\.\d+)?$/.test(part)) {
                    return <span key={i} className="text-[#098658] dark:text-[#b5cea8] font-semibold">{part}</span>;
                }
                return <span key={i} className="text-[#1e293b] dark:text-[#e2e8f0]">{part}</span>;
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

    const getLevelBadge = (level: string) => {
        if (level === "Basic") return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30";
        if (level === "Intermediate") return "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30";
        return "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30";
    };

    return (
        <section
            style={{
                background: "var(--ls-surface-low, #f7f7f8)",
                paddingTop: 80,
                paddingBottom: 96,
                borderBottom: "1px solid var(--ls-outline, #dedee2)",
            }}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

                    {/* Header — light theme */}
                    <div>
                        <p
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "var(--ls-primary, #1f9e8e)",
                                marginBottom: 12,
                            }}
                        >
                            The editor
                        </p>
                        <h2
                            style={{
                                fontFamily: "'Overused Grotesk', system-ui, sans-serif",
                                fontSize: "clamp(1.75rem, 3.5vw, 2.55rem)",
                                fontWeight: 800,
                                lineHeight: 1.1,
                                letterSpacing: "-0.03em",
                                color: "var(--ls-on-surface, #18181b)",
                                marginBottom: 14,
                            }}
                        >
                            Practice across all three disciplines
                        </h2>
                        <p
                            style={{
                                fontSize: "1rem",
                                lineHeight: 1.65,
                                color: "var(--ls-on-surface-muted, #6e6e6e)",
                                maxWidth: 480,
                            }}
                        >
                            SQL, Python (Pandas), and PySpark — one editor, real execution, instant feedback.
                        </p>
                    </div>

                    {/* Editor Container — clean white frame */}
                    <div
                        style={{
                            borderRadius: 14,
                            border: "1px solid #dedee2",
                            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
                            overflow: "hidden",
                        }}
                        className="flex flex-col lg:flex-row h-[800px] lg:h-[650px] bg-white font-sans"
                    >

                        {/* LEFT SIDEBAR */}
                        <div className="w-full lg:w-72 border-r border-[#dedee2] bg-[#fafafa] flex flex-col shrink-0">
                            {/* Sidebar Header */}
                            <div className="p-4 border-b border-[#dedee2] bg-white space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm tracking-tight text-zinc-900">Today&apos;s Practice</span>
                                    <span className="text-xs text-[#1f9e8e] font-mono font-bold bg-[#e6f7f5] px-2.5 py-0.5 rounded-full border border-[#1f9e8e]/30">Day 47</span>
                                </div>
                                {/* Discipline tabs */}
                                <div className="flex gap-1.5 bg-[#f4f4f5] p-1 rounded-lg border border-[#dedee2]">
                                    {DISCIPLINE_TABS.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = tab.id === activeDiscipline;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveDiscipline(tab.id)}
                                                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${isActive
                                                        ? `${tab.bg} ${tab.color} border ${tab.border} shadow-xs`
                                                        : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60 border border-transparent"
                                                    } dark:hover:bg-[#0F1419]/60`}
                                            >
                                                <Icon size={13} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Question List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {questions.map((q) => {
                                    const isSelected = activeQuestion.id === q.id;
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setActiveQuestion(q)}
                                            className={`w-full text-left p-3.5 rounded-xl border transition-all ${isSelected
                                                ? "bg-[#e6f7f5]/40 border-[#1f9e8e] shadow-sm"
                                                : "bg-white border-[#dedee2] hover:border-zinc-300 hover:bg-zinc-50/80 dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getLevelBadge(q.level)}`}>
                                                        {q.level}
                                                    </span>
                                                    {q.completed && <CheckCircle2 size={15} className="text-[#1f9e8e]" />}
                                                </div>
                                                <span className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-zinc-950 font-bold' : 'text-zinc-700'}`}>
                                                    {q.title}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Streak Footer */}
                            <div className="p-4 border-t border-[#dedee2] bg-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider font-mono">Daily Streak</span>
                                    <span className="text-sm font-bold text-zinc-900 flex items-center gap-1 font-mono">
                                        47 <Flame size={14} className="text-orange-500 fill-orange-500" />
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#1f9e8e] w-[80%] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* MAIN CONTENT Area */}
                        <div className="flex-1 flex flex-col bg-white overflow-hidden">

                            {/* Top Bar — query_editor.sql */}
                            <div className="h-12 border-b border-[#dedee2] flex items-center justify-between px-4 bg-[#fafafa] shrink-0">
                                <span className="font-mono text-xs font-semibold text-zinc-700 flex items-center gap-2">
                                    <Terminal size={14} className="text-[#1f9e8e]" />
                                    {activeTab.fileLabel}
                                </span>
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning || isTyping}
                                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed bg-[#1f9e8e] text-white hover:bg-[#177a6d]"
                                >
                                    {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                                    Run
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                                {/* Description Panel */}
                                <div className="hidden lg:flex w-[350px] border-r border-[#dedee2] flex-col bg-white overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <div className="space-y-4">
                                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border w-fit ${getLevelBadge(activeQuestion.level)}`}>
                                            {activeQuestion.level}
                                        </span>
                                        <h3 className="text-xl font-bold text-zinc-900 tracking-tight leading-tight">
                                            {activeQuestion.title}
                                        </h3>
                                        {activeQuestion.description && (
                                            <p className="text-sm text-zinc-600 leading-relaxed">
                                                {activeQuestion.description}
                                            </p>
                                        )}

                                        {activeQuestion.tableData && (
                                            <div className="pt-4 border-t border-[#dedee2]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-2">
                                                        <Database size={12} className="text-[#1f9e8e]" /> {activeQuestion.tableData.name}
                                                    </h4>
                                                    <span className="text-[10px] text-zinc-400 font-mono">Example Data</span>
                                                </div>
                                                <div className="rounded-xl border border-[#dedee2] overflow-hidden bg-white shadow-xs font-mono">
                                                    <table className="w-full text-left text-[11px] border-collapse font-mono">
                                                        <thead className="bg-[#f8fafc] text-zinc-700 border-b border-[#dedee2]">
                                                            <tr>
                                                                {activeQuestion.tableData.headers.map((header) => (
                                                                    <th key={header} className="px-3 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider border-r last:border-r-0 border-[#dedee2]">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-[#dedee2]">
                                                            {activeQuestion.tableData.rows.map((row, i) => (
                                                                <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                                                                    {row.map((cell, j) => (
                                                                        <td key={j} className="px-3 py-1.5 text-zinc-800 font-mono border-r last:border-r-0 border-[#dedee2]">
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
                                <div className="flex-1 flex flex-col min-w-0 bg-white">
                                    {/* Editor */}
                                    <div className="flex-1 p-0 font-mono text-sm overflow-auto relative bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#fafafa] border-r border-[#dedee2] text-right pr-3 pt-4 text-zinc-400 font-mono select-none text-xs">
                                            {Array.from({ length: 25 }).map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                                        </div>
                                        <pre className="p-4 pl-16 leading-6 text-zinc-900 font-mono text-[13px]">
                                            <code>
                                                <HighlightCode code={code} discipline={activeDiscipline} />
                                                {isTyping && <span className="inline-block w-2 h-4 bg-[#1f9e8e] ml-0.5 animate-pulse align-middle"></span>}
                                            </code>
                                        </pre>
                                    </div>

                                    {/* Result Panel */}
                                    <div className={`border-t border-[#dedee2] bg-white transition-all duration-300 ease-in-out flex flex-col shrink-0 ${showResult ? "h-[200px]" : "h-0 overflow-hidden"}`}>
                                        <div className="px-4 py-2 border-b border-[#dedee2] bg-[#f8fafc] flex items-center justify-between flex-shrink-0">
                                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                                                <Terminal size={13} className="text-[#1f9e8e]" />
                                                Output
                                            </span>
                                            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                                                <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-300" /> Success (14ms)
                                            </span>
                                        </div>
                                        {activeQuestion.result && (
                                            <div className="flex-1 overflow-auto bg-white font-mono [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                <table className="w-full text-left text-xs border-collapse font-mono">
                                                    <thead className="bg-[#f8fafc] text-zinc-700 sticky top-0 border-b border-[#dedee2]">
                                                        <tr>
                                                            {activeQuestion.result.length > 0 && Object.keys(activeQuestion.result[0]).map(key => (
                                                                <th key={key} className="px-6 py-2 font-mono font-bold text-[11px] uppercase tracking-wider whitespace-nowrap border-r last:border-r-0 border-[#dedee2]">{key.replace(/_/g, ' ')}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#dedee2]">
                                                        {activeQuestion.result.map((row, i) => (
                                                            <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                                                                {Object.values(row).map((val, j) => (
                                                                    <td key={j} className="px-6 py-2 text-zinc-800 font-mono whitespace-nowrap border-r last:border-r-0 border-[#dedee2]">{val}</td>
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
