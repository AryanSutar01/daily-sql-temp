"use client";

import { useState, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  Database,
  Terminal,
  Loader2,
  Flame,
  ChevronRight
} from "lucide-react";

// --- Mock Data Matching Request ---
const QUESTIONS = [
  {
    id: "basic",
    level: "Basic",
    title: "Marketing Campaign ROI",
    time: "10 min",
    completed: true,
    description: "You're analyzing the efficiency of Q4 marketing campaigns. Given tables for 'campaigns' and 'conversions', calculate the Click-Through Rate (CTR) and Cost Per Acquisition (CPA) for each campaign. Filter out campaigns with less than 500 impressions.",
    tableData: {
      name: "campaigns",
      headers: ["id", "name", "spend", "impressions"],
      rows: [
        ["1", "BlackFriday_2023", "$5,000", "150k"],
        ["2", "Winter_Promo", "$3,200", "85k"]
      ]
    },
    query: `SELECT 
  c.campaign_name,
  SUM(c.clicks) * 100.0 / NULLIF(SUM(c.impressions), 0) as ctr_percentage,
  SUM(c.spend) / NULLIF(COUNT(cv.conversion_id), 0) as cpa
FROM campaigns c
LEFT JOIN conversions cv ON c.id = cv.campaign_id
GROUP BY 1
HAVING SUM(c.impressions) > 500
ORDER BY 3 ASC;`,
    result: [
      { campaign_name: "BlackFriday_2023", ctr_percentage: "5.1%", cpa: "$8.50" },
      { campaign_name: "Winter_Promo", ctr_percentage: "3.8%", cpa: "$12.20" },
      { campaign_name: "Fall_Retargeting", ctr_percentage: "2.4%", cpa: "$14.20" }
    ]
  },
  {
    id: "intermediate",
    level: "Intermediate",
    title: "User Sessionization",
    time: "20 min",
    completed: true,
    description: "We need to reconstruct user sessions from raw event logs. A new session starts if there is a 30-minute gap between events. Write a query to identify session boundaries and assign a unique session_id to each user's activity stream.",
    tableData: {
      name: "page_views",
      headers: ["user_id", "timestamp", "url"],
      rows: [
        ["u_123", "10:00:00", "/home"],
        ["u_123", "10:05:00", "/pricing"],
        ["u_123", "14:00:00", "/blog"]
      ]
    },
    query: `WITH lagged_events AS (
  SELECT 
    user_id, 
    timestamp,
    LAG(timestamp) OVER (PARTITION BY user_id ORDER BY timestamp) as prev_ts
  FROM page_views
),
new_sessions AS (
  SELECT 
    *,
    CASE 
      WHEN EXTRACT(EPOCH FROM (timestamp - prev_ts)) > 1800 THEN 1 
      ELSE 0 
    END as is_new_session
  FROM lagged_events
)
SELECT 
  user_id,
  timestamp,
  SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY timestamp) as session_id
FROM new_sessions;`,
    result: [
      { user_id: "u_123", timestamp: "10:00:00", session_id: 1 },
      { user_id: "u_123", timestamp: "10:05:00", session_id: 1 },
      { user_id: "u_123", timestamp: "14:00:00", session_id: 2 }
    ]
  },
  {
    id: "advanced",
    level: "Advanced",
    title: "Cohort Retention Analysis",
    time: "15 min",
    completed: false, // Selected
    description: "You're analyzing user retention for a SaaS product. Given a transactions table with `customer_id`, `transaction_date`, and `amount`, calculate the monthly retention rate for each cohort (grouped by first purchase month). Show which cohorts have the highest retention over time. This metric directly impacts our LTV projections.",
    tableData: {
      name: "transactions",
      headers: ["id", "customer", "amount", "date"],
      rows: [
        ["1", "101", "$49.99", "2023-01-15"],
        ["2", "102", "$129.00", "2023-01-16"],
        ["3", "101", "$19.99", "2023-02-10"]
      ]
    },
    query: `WITH first_purchase AS (
  SELECT 
    customer_id, 
    date_trunc('month', min(transaction_date)) as cohort_month
  FROM transactions
  GROUP BY 1
),
retention_matrix AS (
  SELECT 
    fp.cohort_month,
    date_trunc('month', t.transaction_date) as activity_month,
    COUNT(DISTINCT t.customer_id) as active_users
  FROM transactions t
  JOIN first_purchase fp ON t.customer_id = fp.customer_id
  GROUP BY 1, 2
)
SELECT 
  cohort_month,
  activity_month,
  active_users,
  active_users::float / first_value(active_users) OVER (PARTITION BY cohort_month ORDER BY activity_month) as retention_rate
FROM retention_matrix
WHERE activity_month >= cohort_month;`,
    result: [
      { cohort_month: "2023-01-01", activity_month: "2023-01-01", retention_rate: "100%" },
      { cohort_month: "2023-01-01", activity_month: "2023-02-01", retention_rate: "50%" },
      { cohort_month: "2023-01-01", activity_month: "2023-03-01", retention_rate: "33%" }
    ]
  }
];

export const HighlightCode = ({ code }: { code: string }) => {
  if (!code) return null;
  // Simple syntax highlighting tailored for the visible query
  const parts = code.split(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bPARTITION\s+BY\b|\bJOIN\b|\bWITH\b|\bAS\b|\bON\b|\bAND\b|\bOVER\b|'[^']*'|\b\d+\.?\d*\b|[(),;.]|[+\-*\/%=<>!]+)/gi);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|PARTITION\s+BY|JOIN|WITH|AS|ON|AND|OVER)$/i.test(part)) return <span key={i} className="text-[#ff79c6] font-semibold">{part}</span>; // Pink/Magenta Keywords
        if (/^(COUNT|SUM|MIN|MAX|DATE_TRUNC|FIRST_VALUE)$/i.test(part)) return <span key={i} className="text-[#50fa7b]">{part}</span>; // Green Functions
        if (/^'[^']*'$/.test(part)) return <span key={i} className="text-[#f1fa8c]">{part}</span>; // Yellow Strings
        if (/^\d+$/.test(part)) return <span key={i} className="text-[#bd93f9]">{part}</span>; // Purple Numbers
        return <span key={i} className="text-[#f8f8f2]">{part}</span>; // Default White
      })}
    </>
  );
};

export function ProductPreview() {
  const [activeQuestion, setActiveQuestion] = useState(QUESTIONS[2]); // Default to Advanced
  const [code, setCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Reset state when switching questions
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
    }, 400); // Reduced delay to 400ms for responsiveness
  };

  // Typing effect
  useEffect(() => {
    if (!isTyping || !activeQuestion) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      // Speed increased: 3 chars per tick for faster feel
      if (currentIndex < activeQuestion.query.length) {
        setCode(activeQuestion.query.slice(0, currentIndex + 3));
        currentIndex += 3;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        // Auto-run after typing
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
              See the workflow in action
            </h2>
            <p className="text-lg text-[#7b8ca3]">
              From notification to solution in 15 minutes.
            </p>
          </div>

          {/* Editor Container */}
          <div className="relative rounded-xl border border-[#202736] bg-[#121826] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[800px] lg:h-[650px]">

            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-72 border-r border-[#202736] bg-[#0b101c] flex flex-col shrink-0">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-[#202736] flex justify-between items-center bg-[#0b101c]">
                <span className="font-semibold text-sm tracking-wide text-zinc-300">Today's Practice</span>
                <span className="text-xs text-[#4DD4C4] font-mono bg-[#4DD4C4]/10 px-2 py-0.5 rounded border border-[#4DD4C4]/20">Day 47</span>
              </div>

              {/* Question List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestion(q)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${activeQuestion.id === q.id
                      ? "bg-[#4DD4C4]/10 border-[#4DD4C4]/40"
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
                  <Terminal size={14} className="text-[#4DD4C4]" />
                  query_editor.sql
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
                <div className="hidden lg:flex w-[350px] border-r border-[#202736] flex-col bg-[#131924] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                      {Array.from({ length: 18 }).map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                    </div>
                    <pre className="p-4 pl-16 leading-6 text-zinc-100">
                      <code>
                        <HighlightCode code={code} />
                        {isTyping && <span className="inline-block w-2 h-4 bg-[#30B5A6] ml-0.5 animate-pulse align-middle"></span>}
                      </code>
                    </pre>
                  </div>

                  {/* Result Panel */}
                  <div className={`border-t border-[#202736] bg-[#080c16] transition-all duration-300 ease-in-out flex flex-col shrink-0 ${showResult ? "h-[200px]" : "h-0 overflow-hidden"}`}>
                    <div className="px-4 py-2 border-b border-[#202736] bg-[#1a2230] flex items-center justify-between flex-shrink-0">
                      <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                        <Terminal size={12} />
                        Query Result
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
