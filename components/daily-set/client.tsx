"use client";

import {
    Play,
    CheckCircle2,
    Terminal,
    Database,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Flame,
    AlertCircle,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Mock Data (To be replaced by API props)
// End Mock Data

export function DailySetClient() {
    const [dailySet, setDailySet] = useState<any>(null);
    const [streak, setStreak] = useState<number>(0);
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [problemDetails, setProblemDetails] = useState<any>(null);
    const [datasets, setDatasets] = useState<any[]>([]);

    const [code, setCode] = useState("SELECT * FROM table_name;");
    const [isRunning, setIsRunning] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Result State
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        const loadDailyData = async () => {
            // 1. Fetch Daily Set (Public)
            try {
                const practice = await api.getDailyPractice();
                setDailySet(practice);

                if (practice?.easy) {
                    setActiveProblemId(practice.easy);
                }
            } catch (e) {
                console.error("Failed to load daily set", e);
            }

            // 2. Fetch Streak (Protected - might fail if not logged in)
            try {
                const streakData = await api.getStreak();
                setStreak(streakData.current_streak);
            } catch (e) {
                console.log("User not logged in or streak fetch failed (expected for guest)");
                setStreak(0);
            }
        };
        loadDailyData();
    }, []);

    // Load Problem Details when active ID changes
    useEffect(() => {
        if (!activeProblemId) return;

        const loadProblem = async () => {
            try {
                const [details, dsets] = await Promise.all([
                    api.getProblem(activeProblemId),
                    api.getDatasets(activeProblemId)
                ]);
                setProblemDetails(details);
                setDatasets(dsets);
                // Reset editor
                setCode(`-- Write your query for ${details.title}\nSELECT * FROM ${dsets[0]?.table_name || 'table'};`);
                setShowResult(false);
                setExecutionResult(null);
                setError(null);
            } catch (e) {
                console.error("Failed to load problem", e);
            }
        };
        loadProblem();
    }, [activeProblemId]);

    const handleRun = async () => {
        if (!activeProblemId) return;
        setIsRunning(true);
        setError(null);
        setShowResult(true); // Open panel

        try {
            const res = await api.execute(activeProblemId, code);

            if (res.status === 'error') {
                setError(res.error || "Unknown execution error");
                setExecutionResult(null);
            } else {
                setExecutionResult(res);
                // If correct, maybe refresh streak (might fail if not logged in)
                if (res.status === 'correct') {
                    try {
                        const s = await api.getStreak();
                        setStreak(s.current_streak);
                    } catch {
                        // Guest user - streak won't update
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || "Network error");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080c16] text-white flex flex-col font-sans">
            {/* Top Navbar Placeholder */}
            <nav className="h-16 border-b border-[#202736] bg-[#0b101c] flex items-center px-6">
                <span className="font-bold text-xl tracking-tight">DailySQL</span>
            </nav>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">


                {/* LEFT SIDEBAR (Question List) */}
                <div className="w-72 border-r border-[#202736] bg-[#0b101c] flex flex-col hidden lg:flex">
                    <div className="p-5 border-b border-[#202736] flex justify-between items-center bg-[#0b101c]">
                        <span className="font-semibold text-sm tracking-wide text-zinc-300">Today's Set</span>
                        <div className="flex items-center gap-1.5 bg-[#4DD4C4]/10 px-2 py-0.5 rounded border border-[#4DD4C4]/20">
                            <Flame size={12} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                            <span className="text-xs text-[#4DD4C4] font-mono font-bold">{streak} Days</span>
                        </div>
                    </div>

                    <div className="p-2 space-y-1">
                        {dailySet && (
                            <>
                                <div
                                    onClick={() => setActiveProblemId(dailySet.easy)}
                                    className={`p-3 rounded cursor-pointer border transition-all ${activeProblemId === dailySet.easy ? 'bg-[#4DD4C4]/10 border-[#4DD4C4]/40' : 'border-transparent hover:bg-[#121826]'}`}
                                >
                                    <span className="text-[10px] uppercase font-bold text-[#4DD4C4]">Basic</span>
                                    <div className="text-sm font-medium text-white">Daily Easy Problem</div>
                                </div>
                                <div
                                    onClick={() => setActiveProblemId(dailySet.medium)}
                                    className={`p-3 rounded cursor-pointer border transition-all ${activeProblemId === dailySet.medium ? 'bg-[#4DD4C4]/10 border-[#4DD4C4]/40' : 'border-transparent hover:bg-[#121826]'}`}
                                >
                                    <span className="text-[10px] uppercase font-bold text-yellow-500">Intermediate</span>
                                    <div className="text-sm font-medium text-white">Daily Medium Problem</div>
                                </div>
                                <div
                                    onClick={() => setActiveProblemId(dailySet.advanced)}
                                    className={`p-3 rounded cursor-pointer border transition-all ${activeProblemId === dailySet.advanced ? 'bg-[#4DD4C4]/10 border-[#4DD4C4]/40' : 'border-transparent hover:bg-[#121826]'}`}
                                >
                                    <span className="text-[10px] uppercase font-bold text-red-500">Advanced</span>
                                    <div className="text-sm font-medium text-white">Daily Advanced Problem</div>
                                </div>
                            </>
                        )}
                        {!dailySet && <div className="p-4 text-xs text-zinc-500 text-center">Loading daily set...</div>}
                    </div>
                </div>

                {/* MIDDLE (Question Description) */}
                <div className="w-96 border-r border-[#202736] bg-[#131924] flex flex-col overflow-y-auto hidden xl:flex">
                    {problemDetails ? (
                        <div className="p-6 space-y-6">
                            <div>
                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-3 ${problemDetails.difficulty === 'easy' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                    problemDetails.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                        'text-red-400 bg-red-400/10 border-red-400/20'
                                    }`}>
                                    {problemDetails.difficulty}
                                </span>
                                <h1 className="text-2xl font-bold text-white mb-2">{problemDetails.title}</h1>
                                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                                    {problemDetails.description}
                                </p>
                            </div>

                            {/* Schema Visualizer */}
                            {datasets.map((ds, idx) => (
                                <div key={idx} className="border border-[#202736] rounded-lg overflow-hidden">
                                    <div className="bg-[#1a2230] px-4 py-2 border-b border-[#202736] flex justify-between items-center">
                                        <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                            <Database size={12} /> {ds.table_name}
                                        </span>
                                    </div>
                                    <div className="p-0 overflow-x-auto">
                                        <table className="w-full text-[10px] text-left">
                                            <thead className="bg-[#0b101c] text-zinc-500">
                                                <tr>
                                                    {Array.isArray(ds.sample_rows) && ds.sample_rows.length > 0 && Object.keys(ds.sample_rows[0]).map(h => (
                                                        <th key={h} className="px-3 py-1.5 border-b border-[#202736] font-mono">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(ds.sample_rows) && ds.sample_rows.map((row: any, i: number) => (
                                                    <tr key={i} className="border-b border-[#202736]/50 last:border-0 text-zinc-400 font-mono">
                                                        {Object.values(row).map((cell: any, j: number) => <td key={j} className="px-3 py-1.5">{cell}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-zinc-500 text-sm">Select a problem to start</div>
                    )}
                </div>

                {/* RIGHT (Editor + Result) */}
                <div className="flex-1 flex flex-col bg-[#131924] min-w-0">
                    {/* Editor Toolbar */}
                    <div className="h-12 border-b border-[#202736] bg-[#1a2230] flex items-center justify-between px-4">
                        <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                            <Terminal size={14} className="text-[#4DD4C4]" />
                            solution.sql
                        </span>
                        <button
                            onClick={handleRun}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080C16] text-xs font-bold rounded transition-colors"
                        >
                            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                            Run Query
                        </button>
                    </div>

                    {/* Monaco-like Editor Area */}
                    <div className="flex-1 relative font-mono text-sm overflow-hidden bg-[#0b101c]">
                        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-[#202736] bg-[#0b101c] text-zinc-700 text-right pr-3 pt-4 select-none pointer-events-none">
                            {[...Array(20)].map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                        </div>
                        <textarea
                            className="w-full h-full bg-transparent pl-16 pt-4 p-4 text-zinc-100 outline-none resize-none leading-6"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                        />
                    </div>

                    {/* Result Panel */}
                    <div className={`border-t border-[#202736] bg-[#080c16] flex flex-col transition-all duration-300 ${showResult ? 'h-64' : 'h-10'}`}>
                        <div
                            className="h-10 border-b border-[#202736] bg-[#1a2230] px-4 flex items-center justify-between cursor-pointer hover:bg-[#20293a]"
                            onClick={() => setShowResult(!showResult)}
                        >
                            <span className={`text-xs font-bold flex items-center gap-2 ${executionResult?.status === 'correct' ? 'text-green-400' : executionResult?.status === 'incorrect' ? 'text-red-400' : 'text-zinc-400'}`}>
                                {executionResult?.status === 'correct' ? <><CheckCircle2 size={14} /> Correct ({executionResult.user.execution_time_ms}ms)</> :
                                    executionResult?.status === 'incorrect' ? <><XCircle size={14} /> Incorrect Answer</> :
                                        error ? <><AlertCircle size={14} /> Execution Error</> :
                                            "Result Output"}
                            </span>
                            {showResult ? <ChevronRight size={14} className="rotate-90 text-zinc-500" /> : <ChevronLeft size={14} className="rotate-90 text-zinc-500" />}
                        </div>

                        {showResult && (
                            <div className="flex-1 overflow-auto p-0">
                                {error ? (
                                    <div className="p-4 text-red-400 font-mono text-xs whitespace-pre-wrap flex items-start gap-2">
                                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                        {error}
                                    </div>
                                ) : executionResult?.user ? (
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#0b101c] text-zinc-500 sticky top-0">
                                            <tr>
                                                {executionResult.user.columns.map((k: string) => (
                                                    <th key={k} className="px-4 py-2 border-b border-[#202736] font-mono whitespace-nowrap">{k}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#202736]/50">
                                            {executionResult.user.rows.map((row: any[], i: number) => (
                                                <tr key={i} className="hover:bg-white/[0.02]">
                                                    {row.map((cell: any, j: number) => (
                                                        <td key={j} className="px-4 py-2 text-zinc-300 font-mono whitespace-nowrap">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-4 text-zinc-500 text-xs">Ready to run query...</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
