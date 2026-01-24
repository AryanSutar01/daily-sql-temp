"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  CheckCircle2,
  ArrowLeft,
  Database,
  Clock,
  Terminal,
  Loader2
} from "lucide-react";

// --- Real World Scenarios Data ---
const QUESTIONS = [
  {
    id: "basic",
    level: "Basic",
    time: "15 min",
    title: "Marketing Campaign ROI",
    description: "You're analyzing the efficiency of Q4 marketing campaigns. Given tables for 'campaigns' and 'conversions', calculate the Click-Through Rate (CTR) and Cost Per Acquisition (CPA) for each campaign. Filter out campaigns with less than 500 impressions to ensure statistical significance. This helps the marketing team reallocate budget to high-performing channels.",
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
      { campaign_name: "Q4_Retargeting", ctr_percentage: "2.4%", cpa: "$14.20" },
      { campaign_name: "BlackFriday_Email", ctr_percentage: "5.1%", cpa: "$8.50" },
      { campaign_name: "Influencer_Collab", ctr_percentage: "1.8%", cpa: "$22.10" }
    ]
  },
  {
    id: "intermediate",
    level: "Intermediate",
    time: "20 min",
    title: "User Sessionization",
    description: "We need to reconstruct user sessions from raw event logs. A new session starts if there is a 30-minute gap between events. Write a query to identify session boundaries and assign a unique session_id to each user's activity stream. This is critical for calculating average time-on-site correctly.",
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
    description: "You're analyzing user retention for a SaaS product. Given a transactions table with `customer_id`, `transaction_date`, and `amount`, calculate the monthly retention rate for each cohort (grouped by first purchase month). Show which cohorts have the highest retention over time. This metric directly impacts our LTV projections.",
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
      { cohort_month: "2023-01-01", activity_month: "2023-02-01", retention_rate: "42%" },
      { cohort_month: "2023-01-01", activity_month: "2023-03-01", retention_rate: "38%" }
    ]
  }
];

const HighlightCode = ({ code }: { code: string }) => {
  if (!code) return null;

  // Enhanced SQL syntax highlighting with more vibrant colors
  // Split by keywords, functions, strings, numbers, operators, and punctuation
  const parts = code.split(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bPARTITION\s+BY\b|\bLEFT\s+JOIN\b|\bRIGHT\s+JOIN\b|\bINNER\s+JOIN\b|\bOUTER\s+JOIN\b|\bCROSS\s+JOIN\b|\bFULL\s+JOIN\b|\bHAVING\b|\bLIMIT\b|\bJOIN\b|\bWITH\b|\bAS\b|\bON\b|\bAND\b|\bOR\b|\bNOT\b|\bIN\b|\bEXISTS\b|\bBETWEEN\b|\bLIKE\b|\bIS\b|\bNULL\b|\bTRUE\b|\bFALSE\b|\bCASE\b|\bWHEN\b|\bTHEN\b|\bELSE\b|\bEND\b|\bIF\b|\bWINDOW\b|\bDISTINCT\b|\bUNIQUE\b|\bALL\b|\bANY\b|\bSOME\b|\bVALUES\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bCREATE\b|\bDROP\b|\bALTER\b|\bTABLE\b|\bINDEX\b|\bVIEW\b|\bPROCEDURE\b|\bFUNCTION\b|\bTRIGGER\b|\bBEGIN\b|\bCOMMIT\b|\bROLLBACK\b|\bCOUNT\b|\bSUM\b|\bAVG\b|\bMIN\b|\bMAX\b|\bLAG\b|\bLEAD\b|\bFIRST_VALUE\b|\bLAST_VALUE\b|\bEXTRACT\b|\bDATE_TRUNC\b|\bNULLIF\b|\bCOALESCE\b|\bCAST\b|\bCONVERT\b|\bNOW\b|\bCURRENT_DATE\b|\bCURRENT_TIME\b|\bCURRENT_TIMESTAMP\b|\bROW_NUMBER\b|\bRANK\b|\bDENSE_RANK\b|\bNTILE\b|\bCUME_DIST\b|\bPERCENT_RANK\b|\bSUBSTRING\b|\bCONCAT\b|\bUPPER\b|\bLOWER\b|\bTRIM\b|\bLENGTH\b|\bROUND\b|\bFLOOR\b|\bCEIL\b|\bABS\b|\bOVER\b|'[^']*'|"[^"]*"|\b\d+\.?\d*\b|[(),;.]|[+\-*\/%=<>!]+)/gi);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        // SQL Keywords - Vibrant Pink/Magenta
        if (/^(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|PARTITION\s+BY|LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN|OUTER\s+JOIN|CROSS\s+JOIN|FULL\s+JOIN|HAVING|LIMIT|JOIN|WITH|AS|ON|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL|TRUE|FALSE|CASE|WHEN|THEN|ELSE|END|IF|WINDOW|DISTINCT|UNIQUE|ALL|ANY|SOME|VALUES|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER|BEGIN|COMMIT|ROLLBACK)$/i.test(part)) {
          return <span key={i} className="text-[#ff79c6] font-semibold">{part}</span>;
        }

        // Functions - Bright Green (including OVER for window functions)
        if (/^(COUNT|SUM|AVG|MIN|MAX|LAG|LEAD|FIRST_VALUE|LAST_VALUE|EXTRACT|DATE_TRUNC|NULLIF|COALESCE|CAST|CONVERT|NOW|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|ROW_NUMBER|RANK|DENSE_RANK|NTILE|CUME_DIST|PERCENT_RANK|SUBSTRING|CONCAT|UPPER|LOWER|TRIM|LENGTH|ROUND|FLOOR|CEIL|ABS|OVER)$/i.test(part)) {
          return <span key={i} className="text-[#50fa7b] font-medium">{part}</span>;
        }

        // Strings - Golden/Orange
        if (/^['"][^'"]*['"]$/.test(part)) {
          return <span key={i} className="text-[#ffb86c]">{part}</span>;
        }

        // Numbers - Purple
        if (/^\d+\.?\d*$/.test(part)) {
          return <span key={i} className="text-[#bd93f9]">{part}</span>;
        }

        // Comments - Muted Gray
        if (/^(--[^\n]*|\/\*[\s\S]*?\*\/)$/.test(part)) {
          return <span key={i} className="text-zinc-600 italic">{part}</span>;
        }

        // Operators - Bright Red
        if (/^[+\-*\/%=<>!]+$/.test(part)) {
          return <span key={i} className="text-[#ff5555]">{part}</span>;
        }

        // Punctuation - Cyan
        if (/^[(),;.]$/.test(part)) {
          return <span key={i} className="text-[#8be9fd]">{part}</span>;
        }

        // Default text (identifiers, whitespace, etc.)
        return <span key={i} className="text-zinc-300">{part}</span>;
      })}
    </>
  );
};

export function ProductPreview() {
  const [activeQuestion, setActiveQuestion] = useState<typeof QUESTIONS[0] | null>(QUESTIONS[2]); // Default to Advanced for "Real World" feel
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

  // Typing effect
  useEffect(() => {
    if (!isTyping || !activeQuestion) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      // Speed increased: 2 chars per tick
      if (currentIndex < activeQuestion.query.length) {
        setCode(activeQuestion.query.slice(0, currentIndex + 2));
        currentIndex += 2;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        // Auto-run after typing
        setTimeout(() => handleRun(), 300);
      }
    }, 5); // 5ms typing speed (very fast)

    return () => clearInterval(interval);
  }, [isTyping, activeQuestion]);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
    }, 800);
  };

  const handleClose = () => {
    setActiveQuestion(null); // This is reachable if we modify UI to allow closing, but mainly for type safety
    setCode("");
    setShowResult(false);
  };

  // Calculate actual line numbers for dynamic rendering (prevents layout shift)
  const codeLines = code.split('\n').length;
  const maxLines = activeQuestion ? activeQuestion.query.split('\n').length : 15;
  const lineNumbers = Math.max(codeLines, maxLines, 15);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            See the <span className="text-brand-base">workflow</span> in action
          </h2>
          <p className="text-lg text-muted-foreground">
            From notification to solution in 15 minutes.
          </p>
        </div>

        {/* IDE Container - Fixed height to prevent layout shift */}
        <div className="relative rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl overflow-hidden flex flex-col md:flex-row" style={{ height: '650px' }}>

          {/* LEFT SIDEBAR: Question List */}
          <div className={`w-full md:w-72 border-r border-white/10 bg-[#0c0c0e] flex flex-col ${activeQuestion ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-semibold text-sm tracking-wide text-zinc-300">Today's Practice</span>
              <span className="text-xs text-brand-base font-mono bg-brand-base/10 px-2 py-0.5 rounded border border-brand-base/20">Day 47</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestion(q)}
                  className={`w-full text-left p-4 rounded-xl transition-all border group relative overflow-hidden ${activeQuestion?.id === q.id
                    ? "bg-[#30B5A6]/10 border-[#30B5A6]/50"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                >
                  {/* Hover Glow */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#30B5A6] transition-opacity duration-300 ${activeQuestion?.id === q.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                  <div className="flex flex-col gap-1.5 pl-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider w-fit px-1.5 py-0.5 rounded-sm ${q.level === "Basic" ? "text-green-400 bg-green-400/10" :
                      q.level === "Intermediate" ? "text-yellow-400 bg-yellow-400/10" :
                        "text-red-400 bg-red-400/10"
                      }`}>
                      {q.level}
                    </span>
                    <span className={`text-sm font-medium truncate ${activeQuestion?.id === q.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                      {q.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Compact Streak */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Daily Streak</span>
                <span className="text-sm font-bold text-brand-base flex items-center gap-1">
                  47 <span className="text-orange-500">🔥</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-base w-[80%] shadow-[0_0_10px_rgba(48,181,166,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* RIGHT / MAIN CONTENT AREA */}
          <div className={`flex-1 flex flex-col relative bg-[#1e1e1e] ${!activeQuestion ? 'hidden md:flex' : 'flex'}`}>

            {!activeQuestion ? (
              // Empty State
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Database size={32} className="opacity-50" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Select a question</h3>
                <p className="max-w-xs mx-auto">Click on any question from the sidebar to verify the interactive workspace.</p>
              </div>
            ) : (
              // Active IDE State
              <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">

                {/* IDE Header */}
                <div className="h-12 border-b border-black/40 flex items-center justify-between px-4 bg-[#252526] flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={handleClose} className="md:hidden text-zinc-400 hover:text-white">
                      <ArrowLeft size={18} />
                    </button>
                    <span className="font-mono text-xs text-zinc-400 flex items-center gap-2">
                      <Terminal size={14} className="text-[#30B5A6]" />
                      query_editor.sql
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/20 rounded text-xs text-zinc-400 border border-white/5">
                      <Clock size={12} /> {activeQuestion.time}
                    </div>
                    <button
                      onClick={handleRun}
                      disabled={isRunning || isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#30B5A6] hover:bg-[#2A9D90] text-[#080C16] text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                      Run
                    </button>
                  </div>
                </div>

                {/* Split Content: Desc + Code */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                  {/* Question Description */}
                  <div className="hidden lg:block w-[40%] border-r border-black/40 p-6 overflow-y-auto bg-[#1e1e1e] custom-scrollbar">
                    <div className="mb-6 space-y-2">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${activeQuestion.level === "Basic" ? "text-green-400 bg-green-400/10 border border-green-400/20" :
                        activeQuestion.level === "Intermediate" ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20" :
                          "text-red-400 bg-red-400/10 border border-red-400/20"
                        }`}>
                        {activeQuestion.level}
                      </span>
                      <h2 className="text-2xl font-bold text-zinc-100 leading-tight">{activeQuestion.title}</h2>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                      {activeQuestion.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Database size={12} /> Database Schema
                      </h4>
                      <div className="p-3 rounded bg-[#252526] border border-black/20 text-xs font-mono text-zinc-300">
                        {/* Mock Schema based on question */}
                        {activeQuestion.id === 'basic' ? 'campaigns(id, name, spend), conversions(id, campaign_id)' :
                          activeQuestion.id === 'intermediate' ? 'page_views(user_id, timestamp, url)' :
                            'transactions(id, customer_id, amount, date)'}
                      </div>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
                    <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-auto relative">
                      {/* Line Numbers Sidebar (Visual only) - Dynamic count */}
                      <div className="absolute left-0 top-6 bottom-0 w-12 text-right pr-4 text-zinc-700 select-none font-mono text-sm leading-relaxed hidden sm:block">
                        {Array.from({ length: lineNumbers }).map((_, i) => <div key={i}>{i + 1}</div>)}
                      </div>

                      <pre className="whitespace-pre-wrap pl-0 sm:pl-12 min-h-[350px]">
                        <code>
                          <HighlightCode code={code} />
                          {isTyping && <span className="inline-block w-2 h-4 bg-[#30B5A6] ml-0.5 animate-pulse align-middle"></span>}
                        </code>
                      </pre>
                    </div>

                    {/* Results Pane (Slide Up) */}
                    <div className={`border-t border-black/40 bg-[#0c0c0e] transition-all duration-300 ease-in-out flex flex-col ${showResult ? "h-64" : "h-0 overflow-hidden"}`}>
                      <div className="px-4 py-2 border-b border-white/5 bg-[#252526] flex items-center justify-between flex-shrink-0">
                        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                          <Terminal size={12} />
                          Query Result
                        </span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Success (14ms)
                        </span>
                      </div>
                      <div className="flex-1 overflow-auto p-0">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#1e1e1e] text-zinc-400 sticky top-0">
                            <tr>
                              {activeQuestion.result.length > 0 && Object.keys(activeQuestion.result[0]).map(key => (
                                <th key={key} className="px-6 py-3 font-medium capitalize border-b border-white/5">{key.replace('_', ' ')}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {activeQuestion.result.map((row, i) => (
                              <tr key={i} className="hover:bg-white/[0.02]">
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="px-6 py-3 text-zinc-300 font-mono">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

