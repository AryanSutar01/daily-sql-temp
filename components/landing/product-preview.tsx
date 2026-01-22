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

// --- Mock Data ---
const QUESTIONS = [
  {
    id: "easy",
    level: "Easy",
    time: "15 min",
    title: "Monthly Revenue by Category",
    description: "Calculate the total revenue for each product category for the current month. Order by revenue descending.",
    query: `SELECT 
  category,
  SUM(amount) as revenue
FROM sales
WHERE 
  date_trunc('month', sale_date) = 
  date_trunc('month', current_date)
GROUP BY 1
ORDER BY 2 DESC;`,
    result: [
      { category: "Enterprise", revenue: "$124,500" },
      { category: "SMB", revenue: "$48,200" },
      { category: "Consumer", revenue: "$12,150" }
    ]
  },
  {
    id: "medium",
    level: "Medium",
    time: "20 min",
    title: "Top 10 Customers by LTV",
    description: "Identify the top 10 customers based on their lifetime value (LTV) across all orders.",
    query: `SELECT 
  c.customer_name,
  COUNT(o.order_id) as total_orders,
  SUM(o.amount) as lifetime_value
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY 1
ORDER BY 3 DESC
LIMIT 10;`,
    result: [
      { customer_name: "Acme Corp", total_orders: 142, lifetime_value: "$892,100" },
      { customer_name: "Globex Inc", total_orders: 85, lifetime_value: "$540,220" },
      { customer_name: "Soylent Corp", total_orders: 63, lifetime_value: "$412,000" }
    ]
  },
  {
    id: "advanced",
    level: "Advanced",
    time: "30 min",
    title: "Cohort Retention Analysis",
    description: "Calculate the monthly retention rate for each user cohort grouped by their first purchase month.",
    query: `WITH cohorts AS (
  SELECT 
    user_id, 
    date_trunc('month', min(tx_date)) as cohort
  FROM transactions
  GROUP BY 1
)
SELECT 
  cohort,
  COUNT(DISTINCT user_id) as users,
  retention_rate
FROM cohorts
-- (truncated for demo)
LIMIT 5;`,
    result: [
      { cohort: "2024-01-01", users: 1250, retention_rate: "82%" },
      { cohort: "2024-02-01", users: 1420, retention_rate: "79%" },
      { cohort: "2024-03-01", users: 1680, retention_rate: "85%" }
    ]
  }
];

export function ProductPreview() {
  const [activeQuestion, setActiveQuestion] = useState<typeof QUESTIONS[0] | null>(null);
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
      if (currentIndex < activeQuestion.query.length) {
        setCode(activeQuestion.query.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        // Auto-run after typing
        setTimeout(() => handleRun(), 500);
      }
    }, 30); // Typing speed

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
    setActiveQuestion(null);
    setCode("");
    setShowResult(false);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/40 border-y border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            See the <span className="text-brand-base">workflow</span> in action
          </h2>
          <p className="text-lg text-muted-foreground">
            From notification to solution in 15 minutes.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

          {/* LEFT SIDEBAR: Question List */}
          <div className={`w-full md:w-64 border-r border-white/10 bg-[#0c0c0e] flex flex-col ${activeQuestion ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-semibold text-sm tracking-wide">Today's Questions</span>
              <span className="text-xs text-brand-base font-mono bg-brand-base/10 px-2 py-0.5 rounded">Day 47</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestion(q)}
                  className={`w-full text-left p-3 rounded-md transition-all border group ${activeQuestion?.id === q.id
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Minimalist Level Indicator Dot */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${q.level === "Easy" ? "bg-green-500 shadow-[0_0_8px_-2px_rgba(34,197,94,0.5)]" :
                      q.level === "Medium" ? "bg-yellow-500 shadow-[0_0_8px_-2px_rgba(234,179,8,0.5)]" :
                        "bg-red-500 shadow-[0_0_8px_-2px_rgba(239,68,68,0.5)]"
                      }`} />

                    <span className="text-sm font-medium truncate">{q.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Compact Streak */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Streak</span>
                <span className="text-sm font-bold text-brand-base flex items-center gap-1">
                  47 <span className="text-orange-500">🔥</span>
                </span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-base w-[80%]"></div>
              </div>
            </div>
          </div>

          {/* RIGHT / MAIN CONTENT AREA */}
          <div className={`flex-1 flex flex-col relative bg-[#09090b] ${!activeQuestion ? 'hidden md:flex' : 'flex'}`}>

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

                {/* Header */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <button onClick={handleClose} className="md:hidden text-zinc-400 hover:text-white">
                      <ArrowLeft size={20} />
                    </button>
                    <span className="font-mono text-sm text-zinc-400">query_editor.sql</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-zinc-400 hover:text-white transition-colors">
                      <Clock size={16} />
                    </button>
                    <div className="h-4 w-px bg-white/10 mx-1"></div>
                    <button
                      onClick={handleRun}
                      disabled={isRunning || isTyping}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-brand-base hover:bg-brand-light text-white text-xs font-semibold transition-all shadow-[0_0_15px_-3px_rgba(var(--brand-base-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                      Run
                    </button>
                  </div>
                </div>

                {/* Split Content: Desc + Code */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                  {/* Question Description */}
                  <div className="hidden lg:block w-1/3 border-r border-white/10 p-6 overflow-y-auto bg-[#0c0c0e]/50">
                    <h2 className="text-xl font-bold mb-4">{activeQuestion.title}</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                      {activeQuestion.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Database size={12} /> Schema
                      </h4>
                      <div className="p-3 rounded bg-white/5 border border-white/5 text-xs font-mono text-zinc-300">
                        sales (id, category, amount, sale_date)
                      </div>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 flex flex-col relative bg-[#09090b]">
                    <div className="flex-1 p-6 font-mono text-sm overflow-auto">
                      <pre className="whitespace-pre-wrap">
                        <code className="text-zinc-300">
                          {code}
                          {isTyping && <span className="inline-block w-2 h-4 bg-brand-base ml-1 animate-pulse align-middle"></span>}
                        </code>
                      </pre>
                    </div>

                    {/* Results Pane (Slide Up) */}
                    <div className={`border-t border-white/10 bg-[#0c0c0e] transition-all duration-500 ease-in-out flex flex-col ${showResult ? "h-64" : "h-0 overflow-hidden"}`}>
                      <div className="px-4 py-2 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                          <Terminal size={12} />
                          Query Result
                        </span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> 14ms
                        </span>
                      </div>
                      <div className="flex-1 overflow-auto p-0">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-white/5 text-zinc-400 sticky top-0">
                            <tr>
                              {activeQuestion.result.length > 0 && Object.keys(activeQuestion.result[0]).map(key => (
                                <th key={key} className="px-6 py-3 font-medium capitalize border-b border-white/10">{key.replace('_', ' ')}</th>
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

