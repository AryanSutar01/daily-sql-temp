"use client";

import {
    Play,
    CheckCircle2,
    Database,
    Loader2,
    Flame,
    AlertCircle,
    XCircle,
    Search,
    Filter,
    Undo,
    Maximize2,
    Minimize2,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    TerminalSquare,
    ChevronRight,
    ChevronDown,
    ArrowLeft,
    User,
    Lock,
    Sparkles,
    UploadCloud,
    Timer,
    Pause,
    RotateCcw,
    LogOut,
    ArrowRight as ArrowRightIcon
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel, Group, Separator } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';
import { api } from "@/lib/api";
import { Problem, DailyPractice, Dataset, ExecutionResponse } from "@/types/api";

type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced';

export function DailySetClient() {
    const router = useRouter();

    // ── Data State ──────────────────────────────────────
    const [streak, setStreak] = useState<number>(0);
    const [activeSidebarTab, setActiveSidebarTab] = useState<'today' | 'list'>('today');
    const [searchQuery, setSearchQuery] = useState('');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [dailySet, setDailySet] = useState<DailyPractice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');
    const [userProfile, setUserProfile] = useState<any>(null);

    // ── Drill-down State ─────────────────────────────────
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [viewingDetails, setViewingDetails] = useState<boolean>(false);
    const [activeDatasets, setActiveDatasets] = useState<Dataset[]>([]);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [expectedOutput, setExpectedOutput] = useState<{ columns: string[]; rows: any[][] } | null>(null);

    // ── Editor & Results State ───────────────────────────
    const [code, setCode] = useState("-- Select a problem to begin\n");
    const [isRunning, setIsRunning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [executionResult, setExecutionResult] = useState<ExecutionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });

    // ── UI / Overlay State ───────────────────────────────
    const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // ── Timer / Stopwatch State ──────────────────────────
    const [timerMode, setTimerMode] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [timerExpanded, setTimerExpanded] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);

    // ── Refs ─────────────────────────────────────────────
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarDropdownRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // ── Effects ──────────────────────────────────────────
    useEffect(() => {
        async function loadData() {
            try {
                let profileData = null;
                try {
                    profileData = await api.getProfile();
                    setAuthStatus('authenticated');
                    setUserProfile(profileData);
                } catch {
                    setAuthStatus('unauthenticated');
                }
                const [probs, daily, streakData] = await Promise.all([
                    api.getProblems(),
                    api.getDailyPractice().catch(() => null),
                    api.getProfile().then(() => api.getStreak()).catch(() => ({ current_streak: 0 })),
                ]);
                setProblems(probs);
                setDailySet(daily);
                setStreak(streakData?.current_streak || 0);
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    // Timer tick
    useEffect(() => {
        if (!timerRunning) return;
        const interval = setInterval(() => {
            setTimerSeconds(s => {
                if (timerMode === 'timer' && s <= 0) { setTimerRunning(false); return 0; }
                return timerMode === 'stopwatch' ? s + 1 : s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerRunning, timerMode]);

    // Outside-click: sidebar dropdown
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (sidebarDropdownRef.current && !sidebarDropdownRef.current.contains(e.target as Node))
                setSidebarDropdownOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // Outside-click: profile dropdown
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node))
                setProfileDropdownOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // Fullscreen change
    useEffect(() => {
        const onChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    // ── Helpers ──────────────────────────────────────────
    /**
     * Extracts column names in declaration order from a CREATE TABLE ... SQL string.
     * Falls back to Object.keys(row) (which may be alphabetical due to JSONB) if parsing fails.
     */
    const getColumnOrder = (schemaSql: string, fallbackRow?: Record<string, any>): string[] => {
        try {
            // Match the body between the first '(' and the matching last ')'
            const bodyMatch = schemaSql.replace(/\n/g, ' ').match(/CREATE\s+TABLE\s+[\w"`.]+\s*\((.+)\)/i);
            if (!bodyMatch) throw new Error('no match');
            const body = bodyMatch[1];

            const columns: string[] = [];
            // Split by commas that are NOT inside parentheses (to handle CHECK(...), DEFAULT(...), etc.)
            let depth = 0;
            let current = '';
            for (const ch of body) {
                if (ch === '(') depth++;
                else if (ch === ')') depth--;
                else if (ch === ',' && depth === 0) {
                    current = current.trim();
                    if (current) {
                        // Skip table-level constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, INDEX
                        const upper = current.toUpperCase();
                        if (!upper.startsWith('PRIMARY') && !upper.startsWith('FOREIGN') &&
                            !upper.startsWith('UNIQUE') && !upper.startsWith('CHECK') &&
                            !upper.startsWith('INDEX') && !upper.startsWith('KEY')) {
                            // First token is the column name (strip quotes/backticks)
                            const nameMatch = current.match(/^[`"']?([\w]+)[`"']?/);
                            if (nameMatch) columns.push(nameMatch[1]);
                        }
                    }
                    current = '';
                    continue;
                }
                current += ch;
            }
            // Handle the last column (no trailing comma)
            current = current.trim();
            if (current) {
                const upper = current.toUpperCase();
                if (!upper.startsWith('PRIMARY') && !upper.startsWith('FOREIGN') &&
                    !upper.startsWith('UNIQUE') && !upper.startsWith('CHECK') &&
                    !upper.startsWith('INDEX') && !upper.startsWith('KEY')) {
                    const nameMatch = current.match(/^[`"']?([\w]+)[`"']?/);
                    if (nameMatch) columns.push(nameMatch[1]);
                }
            }

            // Validate: at least one column must exist in the fallback row (if provided)
            if (columns.length === 0) throw new Error('no columns parsed');
            return columns;
        } catch {
            // Fallback: use Object.keys of the first row (may be alphabetical due to JSONB)
            return fallbackRow ? Object.keys(fallbackRow) : [];
        }
    };

    // ── Computed ─────────────────────────────────────────
    const todayStr = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();
    const activeProblem = problems.find(p => p.id === activeProblemId);
    const filteredProblems = problems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const descriptionText = activeProblem?.description || '';
    const descParts = descriptionText.split('### Hint');
    const mainDesc = descParts[0];
    const hintText = descParts.length > 1 ? descParts[1].trim() : null;

    const formatTime = (s: number) => {
        const m = Math.floor(Math.abs(s) / 60).toString().padStart(2, '0');
        const sec = (Math.abs(s) % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    const markdownComponents = {
        h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-md font-bold text-zinc-300 mt-3 mb-1" {...props} />,
        p: ({ node, ...props }: any) => <p className="mb-2" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
        li: ({ node, ...props }: any) => <li className="" {...props} />,
        code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;
            return isInline ? (
                <code className="bg-[#202736] px-1.5 py-0.5 rounded text-xs text-[#4DD4C4] font-mono" {...props}>{children}</code>
            ) : (
                <div className="bg-[#131924] p-3 rounded border border-[#202736] overflow-x-auto text-xs my-3 font-mono">
                    <code className="text-[#4DD4C4]" {...props}>{children}</code>
                </div>
            );
        },
    };

    // ── Handlers ─────────────────────────────────────────
    const handleProblemSelect = async (id: string) => {
        setActiveProblemId(id);
        setViewingDetails(true);
        setShowResult(false);
        setError(null);
        setExecutionResult(null);
        setActiveDatasets([]);
        setShowHint(false);
        setExpectedOutput(null);
        try {
            const [datasets, savedSol] = await Promise.all([
                api.getDatasets(id),
                api.getSavedSolution(id).catch(() => ({ submitted_query: null }))
            ]);
            const normalizedDatasets = datasets.map(ds => ({
                ...ds,
                sample_rows: typeof ds.sample_rows === 'string'
                    ? JSON.parse(ds.sample_rows)
                    : (Array.isArray(ds.sample_rows) ? ds.sample_rows : []),
            }));
            setActiveDatasets(normalizedDatasets);
            if (savedSol?.submitted_query) {
                setCode(savedSol.submitted_query);
            } else {
                const p = problems.find(x => x.id === id);
                const dsName = datasets[0]?.table_name || 'table_name';
                setCode(`-- Write your query for: ${p?.title}\nSELECT * FROM ${dsName};\n`);
            }
            api.getExpectedOutput(id)
                .then(data => setExpectedOutput(data))
                .catch(() => setExpectedOutput(null));
        } catch (err) {
            console.error("Failed to load datasets", err);
        }
    };

    const handleBackToList = () => setViewingDetails(false);

    const handleRun = async () => {
        if (!activeProblemId) return;
        if (authStatus === 'unauthenticated') { setError("LOGIN_REQUIRED"); return; }
        if (userProfile && !userProfile.exists) { setError("PROFILE_REQUIRED"); return; }
        setIsRunning(true);
        setError(null);
        setShowResult(true);
        try {
            const res = await api.execute(activeProblemId, code);
            setExecutionResult(res);
            if (res.status === 'error' && res.error === 'PROFILE_REQUIRED') { setError("PROFILE_REQUIRED"); return; }
            if (res.status === 'error' && res.error) setError(res.error);
        } catch (err: any) {
            setError(err.message || "Execution failed");
            setExecutionResult(null);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = () => {
        if (authStatus === 'unauthenticated') { setError("LOGIN_REQUIRED"); return; }
        if (userProfile && !userProfile.exists) { setError("PROFILE_REQUIRED"); return; }
        if (executionResult?.status === 'correct') {
            alert(`Solution Submitted for ${activeProblem?.title}! Streaks are updated automatically!`);
            api.getStreak().then(s => setStreak(s.current_streak)).catch(console.error);
        }
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleLogout = () => {
        document.cookie = "ds_token=; path=/; max-age=0; SameSite=Lax;";
        router.push("/login");
        router.refresh();
    };

    const getDiffStyle = (diff: string) => {
        const d = diff?.toLowerCase();
        if (d === 'easy') return { label: 'BASIC', color: 'text-[#4DD4C4]', bg: 'bg-[#4DD4C4]/10', border: 'border-[#4DD4C4]/30', hex: '#4DD4C4' };
        if (d === 'medium') return { label: 'INTERMEDIATE', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', hex: '#eab308' };
        return { label: 'ADVANCED', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', hex: '#f87171' };
    };

    const handleEditorWillMount = (monaco: any) => {
        monaco.editor.defineTheme('dailySqlTheme', {
            base: 'vs-dark', inherit: true, rules: [],
            colors: {
                'editor.background': '#0b101c',
                'editor.lineHighlightBackground': '#ffffff0a',
                'editorLineNumber.foreground': '#4f5b72',
                'editorGutter.background': '#0b101c'
            }
        });
    };

    const handleEditorMount = (editor: any) => {
        editor.onDidChangeCursorPosition((e: any) => {
            setCursorPos({ lineNumber: e.position.lineNumber, column: e.position.column });
        });
    };

    // ── Shared tooltip snippets ──────────────────────────
    const LoginTooltip = ({ text }: { text: string }) => (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-[#0b101c] border border-[#202736] rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl z-[300]">
            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-[5px] border-l-transparent border-r-transparent border-b-[#202736]" />
            <span className="flex items-center gap-1.5"><Lock size={10} className="text-[#4DD4C4]" /> {text}</span>
        </div>
    );

    // ── Loading screen ───────────────────────────────────
    if (isLoading) {
        return (
            <div className="h-screen bg-[#080c16] text-white flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-[#4DD4C4]" />
                    <span className="text-sm font-mono text-zinc-400">Loading Environment...</span>
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className="h-screen bg-[#080c16] text-white flex flex-col font-sans overflow-hidden [&_*::-webkit-scrollbar]:w-1.5 [&_*::-webkit-scrollbar-track]:bg-transparent [&_*::-webkit-scrollbar-thumb]:bg-[#202736] [&_*::-webkit-scrollbar-thumb]:rounded-full hover:[&_*::-webkit-scrollbar-thumb]:bg-zinc-600"
        >
            {/* ════════════════════════════════════════════
                INTEGRATED TOP BAR
            ════════════════════════════════════════════ */}
            <div className="h-14 bg-[#0d121c] border-b border-[#202736] flex items-center px-6 shrink-0 relative z-[100] gap-3">

                {/* ── LEFT: Logo + Set selector ── */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/" className="text-base font-bold text-white hover:text-[#4DD4C4] transition-colors">
                        DailySQL
                    </Link>
                    <div className="w-px h-5 bg-[#202736]" />
                    <div className="relative" ref={sidebarDropdownRef}>
                        <button
                            onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                            className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-[#131924] border border-[#202736] rounded px-3 py-1.5 transition-colors"
                        >
                            {activeSidebarTab === 'today' ? "Today's Set" : "Problem List"}
                            <ChevronDown size={13} className={`transition-transform duration-200 ${sidebarDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {sidebarDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-40 bg-[#131924] border border-[#202736] rounded-lg overflow-hidden py-1 z-[300] shadow-xl">
                                <button
                                    onClick={() => { setActiveSidebarTab('today'); setSidebarDropdownOpen(false); setViewingDetails(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeSidebarTab === 'today' ? 'text-[#4DD4C4] bg-[#4DD4C4]/5' : 'text-zinc-300 hover:text-white hover:bg-[#202736]'}`}
                                >Today's Set</button>
                                <button
                                    onClick={() => { setActiveSidebarTab('list'); setSidebarDropdownOpen(false); setViewingDetails(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeSidebarTab === 'list' ? 'text-[#4DD4C4] bg-[#4DD4C4]/5' : 'text-zinc-300 hover:text-white hover:bg-[#202736]'}`}
                                >Problem List</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CENTER: Run + Submit (absolutely centered) ── */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                    {/* Run */}
                    <div className="relative group">
                        <button
                            onClick={handleRun}
                            disabled={!activeProblemId}
                            className={`flex items-center gap-2 px-5 py-2 text-[#080C16] text-sm font-bold rounded transition-colors shadow-[0_0_10px_rgba(77,212,196,0.2)] ${activeProblemId ? 'bg-[#4DD4C4] hover:bg-[#3dbdb0]' : 'bg-zinc-700 cursor-not-allowed shadow-none text-zinc-500'}`}
                        >
                            {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
                            Run
                        </button>
                        {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to run queries" />}
                    </div>

                    {/* Submit */}
                    <div className="relative group">
                        <button
                            onClick={handleSubmit}
                            disabled={executionResult?.status !== 'correct'}
                            title="Submit solution"
                            className={`flex items-center justify-center w-9 h-9 rounded transition-colors ${
                                executionResult?.status === 'correct'
                                    ? 'bg-[#4DD4C4]/15 border border-[#4DD4C4]/40 text-[#4DD4C4] hover:bg-[#4DD4C4]/25 shadow-[0_0_8px_rgba(77,212,196,0.15)]'
                                    : 'text-zinc-600 border border-[#202736] cursor-not-allowed'
                            }`}
                        >
                            <UploadCloud size={16} />
                        </button>
                        {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to submit" />}
                    </div>
                </div>

                {/* ── RIGHT: Streak + Timer + Fullscreen + Profile ── */}
                <div className="ml-auto flex items-center gap-4">

                    {/* Streak */}
                    {authStatus === 'authenticated' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 rounded">
                            <span className="text-sm font-bold text-[#4DD4C4]">{streak}</span>
                            <Flame size={13} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                        </div>
                    )}

                    {/* Timer / Stopwatch */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setTimerExpanded(!timerExpanded)}
                            title={timerExpanded ? 'Collapse timer' : 'Expand timer'}
                            className={`flex items-center gap-2 transition-colors ${timerRunning ? 'text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Timer size={16} />
                            {timerExpanded && (
                                <span className="font-mono text-sm tabular-nums w-[42px]">
                                    {formatTime(timerSeconds)}
                                </span>
                            )}
                        </button>
                        {timerExpanded && (
                            <div className="flex items-center gap-1.5 pl-2 border-l border-[#202736]">
                                <button
                                    onClick={() => setTimerRunning(!timerRunning)}
                                    title={timerRunning ? 'Pause' : 'Start'}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <button
                                    onClick={() => {
                                        setTimerRunning(false);
                                        setTimerSeconds(timerMode === 'timer' ? ((activeProblem?.estimated_time_minutes || 15) * 60) : 0);
                                    }}
                                    title="Reset"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    <RotateCcw size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        const newMode = timerMode === 'stopwatch' ? 'timer' : 'stopwatch';
                                        setTimerMode(newMode);
                                        setTimerRunning(false);
                                        setTimerSeconds(newMode === 'timer' ? ((activeProblem?.estimated_time_minutes || 15) * 60) : 0);
                                    }}
                                    title={timerMode === 'stopwatch' ? 'Switch to Countdown Timer' : 'Switch to Stopwatch'}
                                    className="text-xs font-mono font-bold text-zinc-500 hover:text-zinc-200 bg-[#0b101c] border border-[#202736] rounded px-1.5 py-0.5 transition-colors"
                                >
                                    {timerMode === 'stopwatch' ? 'SW' : 'TM'}
                                </button>
                                {timerMode === 'timer' && !timerRunning && (
                                    <div className="flex items-center gap-1 border-l border-[#202736] pl-1 ml-0.5">
                                        <button
                                            onClick={() => setTimerSeconds(s => Math.max(60, s - 60))}
                                            title="-1 minute"
                                            className="text-zinc-500 hover:text-white bg-[#0b101c] border border-[#202736] rounded w-5 h-5 flex items-center justify-center font-mono text-xs leading-none transition-colors"
                                        >
                                            -
                                        </button>
                                        <button
                                            onClick={() => setTimerSeconds(s => s + 60)}
                                            title="+1 minute"
                                            className="text-zinc-500 hover:text-white bg-[#0b101c] border border-[#202736] rounded w-5 h-5 flex items-center justify-center font-mono text-xs leading-none transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fullscreen */}
                    <button
                        onClick={handleFullscreen}
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>

                    {/* Profile */}
                    {authStatus === 'loading' ? (
                        <Loader2 size={16} className="animate-spin text-zinc-500" />
                    ) : authStatus === 'authenticated' ? (
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="w-9 h-9 rounded-full bg-[#131924] border-2 border-[#202736] hover:border-[#4DD4C4] transition-colors flex items-center justify-center overflow-hidden focus:outline-none"
                            >
                                {userProfile?.avatar_url ? (
                                    <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-6 h-6 text-[#4DD4C4] mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </button>
                            {profileDropdownOpen && (
                                <div className="absolute top-10 right-0 w-48 bg-[#131924] border border-[#202736] rounded-xl shadow-2xl overflow-hidden py-1 z-[300]">
                                    <div className="px-4 py-3 border-b border-[#202736] bg-[#0b101c]">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {userProfile?.full_name || userProfile?.email?.split('@')[0]}
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate">{userProfile?.email}</p>
                                    </div>
                                    <Link href="/profile" onClick={() => setProfileDropdownOpen(false)}>
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                                            <User size={14} /> My Profile
                                        </div>
                                    </Link>
                                    <button onClick={() => { handleLogout(); setProfileDropdownOpen(false); }} className="w-full text-left">
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer">
                                            <LogOut size={14} /> Log Out
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-xs font-semibold text-[#4DD4C4] hover:text-white border border-[#4DD4C4]/30 hover:border-[#4DD4C4] rounded px-2.5 py-1 transition-colors"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>

            {/* ════════════════════════════════════════════
                MAIN WORKSPACE
            ════════════════════════════════════════════ */}
            <div className="flex-1 flex overflow-hidden">
                <Group orientation="horizontal" className="flex-1 w-full h-full">

                    {/* ── LEFT PANE ── */}
                    <Panel defaultSize="40" minSize="25" maxSize="60" className="flex flex-col bg-[#080c16] border-r border-[#202736]">
                        {!viewingDetails ? (
                            // STATE 1: List Navigation
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                {activeSidebarTab === 'today' ? (
                                    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                                        <div className="flex flex-col bg-[#131924] p-4 rounded-lg border border-[#202736]">
                                            <span className="text-[10px] text-[#4DD4C4] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Flame size={12} className="fill-[#4DD4C4]" /> Today's Practice
                                            </span>
                                            <div className="flex justify-between items-end">
                                                <span className="font-semibold text-xl text-zinc-100">{todayStr}</span>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#202736] bg-[#0b101c]">
                                                    <Flame size={14} className="fill-[#4DD4C4] text-[#4DD4C4]" />
                                                    <span className="text-sm text-zinc-300 font-bold tracking-wide">{streak} Days</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {dailySet ? (['easy', 'medium', 'advanced'] as const).map((dLevel) => {
                                                const pId = dailySet[dLevel as keyof DailyPractice];
                                                if (!pId) return null;
                                                const pInfo = problems.find(p => p.id === pId);
                                                if (!pInfo) return null;
                                                const dStyle = getDiffStyle(pInfo.difficulty);
                                                return (
                                                    <div key={dLevel}
                                                        onClick={() => handleProblemSelect(pId)}
                                                        className="p-3 bg-[#131924] rounded-lg cursor-pointer border border-[#202736] hover:border-[#4DD4C4]/50 transition-all flex items-center justify-between group"
                                                    >
                                                        <div className="text-sm font-medium text-white group-hover:text-[#4DD4C4] transition-colors line-clamp-1 pr-4">{pInfo.title}</div>
                                                        <div className="flex items-center gap-4 shrink-0">
                                                            <div className="w-[100px] flex justify-center shrink-0">
                                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${dStyle.color} ${dStyle.bg} ${dStyle.border}`}>{dStyle.label}</span>
                                                            </div>
                                                            <CheckCircle2 size={16} className="text-zinc-600" />
                                                        </div>
                                                    </div>
                                                );
                                            }) : (
                                                <div className="text-xs text-zinc-500 italic p-4 text-center border border-[#202736] rounded bg-[#131924]">No daily set found.</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
                                        <div className="flex flex-col items-center justify-center gap-3 shrink-0 mb-2">
                                            <div className="w-16 h-16 rounded-full border-2 border-[#202736] flex items-center justify-center relative shadow-[0_0_15px_rgba(77,212,196,0.1)]">
                                                <svg className="w-16 h-16 absolute -rotate-90" viewBox="0 0 36 36">
                                                    <path className="text-[#202736]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    <path className="text-[#4DD4C4]" strokeDasharray="15, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                </svg>
                                                <span className="text-sm text-white font-bold">15%</span>
                                            </div>
                                            <span className="text-xs text-zinc-400 font-medium font-mono">15/100 Solved</span>
                                        </div>

                                        <div className="flex gap-2 shrink-0">
                                            <div className="flex-1 relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Questions..."
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    className="w-full bg-[#131924] border border-[#202736] rounded text-xs py-2 pl-9 pr-3 text-zinc-300 outline-none focus:border-[#4DD4C4]/50 transition-colors"
                                                />
                                            </div>
                                            <button className="p-2 bg-[#131924] border border-[#202736] rounded text-[#4DD4C4] hover:bg-[#1a2230] transition-colors"><Filter size={14} /></button>
                                        </div>

                                        <div className="space-y-2 overflow-y-auto pr-1 pb-4 flex-1">
                                            {filteredProblems.map((p, index) => (
                                                <div key={p.id} onClick={() => handleProblemSelect(p.id)} className="flex items-center justify-between p-3 rounded bg-[#131924] border border-[#202736] hover:border-[#4DD4C4]/30 cursor-pointer transition-colors group">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="text-[10px] font-mono text-zinc-500 shrink-0 w-[40px] truncate">{index + 1}.</span>
                                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">{p.title}</span>
                                                    </div>
                                                    <div className="w-[100px] flex justify-center shrink-0">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getDiffStyle(p.difficulty).color} ${getDiffStyle(p.difficulty).bg} ${getDiffStyle(p.difficulty).border}`}>
                                                            {getDiffStyle(p.difficulty).label}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {filteredProblems.length === 0 && <div className="text-center text-xs text-zinc-500 mt-8">No problems found.</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // STATE 2: Problem Details
                            <div className="flex-1 flex flex-col h-full bg-[#0d121c] overflow-hidden">
                                <div className="h-11 border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0">
                                    <button onClick={handleBackToList} className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 break-all line-clamp-1 max-w-[200px]">
                                        {activeSidebarTab === 'today' ? "Today's Set" : "Problem List"} <ChevronRight size={10} /> <span className="text-[#4DD4C4]">{activeProblem?.title}</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <div>
                                        {activeProblem && (
                                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-3 ${getDiffStyle(activeProblem.difficulty).color} ${getDiffStyle(activeProblem.difficulty).bg} ${getDiffStyle(activeProblem.difficulty).border}`}>
                                                {getDiffStyle(activeProblem.difficulty).label}
                                            </span>
                                        )}
                                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{activeProblem?.title}</h1>
                                        <div className="flex gap-4 text-xs text-zinc-500 mb-6 font-mono font-medium">
                                            <span className="flex items-center gap-1.5"><Timer size={12} /> {activeProblem?.estimated_time_minutes}m Avg</span>
                                        </div>
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Task</h3>
                                        <div className="h-px w-full bg-[#202736] mb-4" />
                                        <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                                            <ReactMarkdown components={markdownComponents}>{mainDesc}</ReactMarkdown>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Database size={12} /> Sample Data
                                        </h3>
                                        <div className="h-px w-full bg-[#202736] mb-4" />
                                        {activeDatasets.length === 0 && <span className="text-xs text-zinc-600 font-mono italic">No datasets available</span>}
                                        {activeDatasets.map((ds, idx) => {
                                            // Derive column order from schema_sql (TEXT, order-preserving)
                                            // to avoid JSONB alphabetical ordering of sample_rows keys
                                            const colOrder = getColumnOrder(
                                                ds.schema_sql,
                                                ds.sample_rows[0]
                                            );
                                            return (
                                            <div key={idx} className="border border-[#202736] rounded-lg overflow-hidden mb-4">
                                                <div className="bg-[#131924] px-4 py-2 border-b border-[#202736]">
                                                    <span className="text-xs font-bold text-zinc-400 font-mono">{ds.table_name}</span>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-[11px] text-left">
                                                        <thead className="bg-[#0b101c] text-zinc-500">
                                                            <tr>
                                                                {colOrder.map(h => (
                                                                    <th key={h} className="px-3 py-1.5 border-b border-[#202736] font-mono">
                                                                        <span>{h}</span>
                                                                        {ds.column_types?.[h] && <span className="ml-2 text-[10px] text-[#4DD4C4]/70">({ds.column_types[h]})</span>}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ds.sample_rows.map((row: any, i: number) => (
                                                                <tr key={i} className="border-b border-[#202736]/50 last:border-0 text-zinc-400 font-mono hover:bg-white/[0.02]">
                                                                    {colOrder.map((col: string) => (
                                                                        <td key={col} className="px-3 py-1.5">{row[col]?.toString() ?? ''}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Expected Output</h3>
                                        <div className="h-px w-full bg-[#202736] mb-4" />
                                        {(() => {
                                            const output = executionResult?.expected || expectedOutput;
                                            if (output && output.columns.length > 0) {
                                                return (
                                                    <div className="border border-[#202736] rounded-lg overflow-hidden mb-4">
                                                        <table className="w-full text-[11px] text-left">
                                                            <thead className="bg-[#131924] text-zinc-400">
                                                                <tr>{output.columns.map(h => <th key={h} className="px-3 py-1.5 border-b border-[#202736] font-mono">{h}</th>)}</tr>
                                                            </thead>
                                                            <tbody className="bg-[#0b101c]">
                                                                {output.rows.map((row: any, i: number) => (
                                                                    <tr key={i} className="border-b border-[#202736]/50 last:border-0 text-green-400/80 font-mono hover:bg-white/[0.02]">
                                                                        {row.map((cell: any, j: number) => <td key={j} className="px-3 py-1.5">{cell?.toString()}</td>)}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                );
                                            }
                                            return <div className="p-4 bg-[#131924] rounded-lg border border-[#202736] text-xs text-zinc-500 font-mono italic">Loading expected output...</div>;
                                        })()}
                                    </div>

                                    {hintText && (
                                        <div className="pt-2">
                                            <h3
                                                className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2 cursor-pointer hover:text-white transition-colors flex justify-between items-center"
                                                onClick={() => setShowHint(!showHint)}
                                            >
                                                <span>Hints</span>
                                                <span className={`text-[10px] transform transition-transform ${showHint ? 'rotate-180' : ''}`}>&darr;</span>
                                            </h3>
                                            <div className="h-px w-full bg-[#202736] mb-4" />
                                            {showHint && (
                                                <div className="p-4 bg-[#131924] rounded-lg border border-[#202736] text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                                                    <ReactMarkdown components={markdownComponents}>{hintText}</ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-[#202736] bg-[#0b101c] p-4 flex justify-between items-center text-zinc-400 shrink-0">
                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-1.5 hover:text-[#4DD4C4] transition-colors"><ThumbsUp size={16} /></button>
                                        <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors"><ThumbsDown size={16} /></button>
                                    </div>
                                    <button className="flex items-center gap-2 text-xs font-medium hover:text-white transition-colors">
                                        Join Discussion <MessageSquare size={16} /> 30
                                    </button>
                                </div>
                            </div>
                        )}
                    </Panel>

                    {/* Resize Handle */}
                    <Separator className="w-1.5 bg-[#080c16] hover:bg-[#4DD4C4]/20 transition-colors cursor-col-resize flex flex-col items-center justify-center relative">
                        <div className="absolute inset-y-0 -left-2 -right-2 z-10" />
                        <div className="h-8 w-0.5 bg-[#202736] rounded-full z-0" />
                    </Separator>

                    {/* ── RIGHT PANE: Editor + Output ── */}
                    <Panel minSize="30" className="flex flex-col bg-[#0b101c]">
                        {/* Editor toolbar (simplified) */}
                        <div className="h-11 border-b border-[#202736] bg-[#131924] flex items-center justify-between px-4 shrink-0">
                            <span className="text-xs font-mono font-medium text-[#4DD4C4] flex items-center gap-2">
                                <span className="text-zinc-500">&gt;_</span> solution.sql
                            </span>
                            <div className="flex items-center gap-3 text-zinc-400">
                                <button
                                    onClick={() => setCode('')}
                                    className="hover:text-zinc-200 transition-colors"
                                    title="Clear Code"
                                >
                                    <Undo size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Monaco */}
                        <div className="flex-1 relative overflow-hidden bg-[#0b101c]">
                            <Editor
                                height="100%"
                                language="sql"
                                theme="dailySqlTheme"
                                value={code}
                                onChange={(val) => setCode(val || "")}
                                beforeMount={handleEditorWillMount}
                                onMount={handleEditorMount}
                                options={{
                                    minimap: { enabled: false },
                                    overviewRulerLanes: 0,
                                    hideCursorInOverviewRuler: true,
                                    overviewRulerBorder: false,
                                    scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                                    fontSize: 14,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                                    lineHeight: 24,
                                    padding: { top: 4 },
                                    scrollBeyondLastLine: false,
                                    smoothScrolling: true,
                                    cursorBlinking: "smooth",
                                    cursorSmoothCaretAnimation: "on",
                                    formatOnPaste: true,
                                }}
                            />
                            <div className="absolute right-6 bottom-4 text-[10px] text-zinc-500 font-mono pointer-events-none px-2 py-1 rounded">
                                Ln {cursorPos.lineNumber}, Col {cursorPos.column}
                            </div>
                        </div>

                        {/* Output panel */}
                        <div className={`border-t border-[#202736] bg-[#0d121c] flex flex-col transition-all duration-300 shrink-0 ${showResult ? 'h-[280px]' : 'h-0 border-t-0'}`}>
                            {showResult && (
                                <>
                                    <div className="h-10 border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                                            <TerminalSquare size={14} /> Query Output
                                        </span>
                                        <span className={`text-xs font-bold font-mono flex items-center gap-1.5 ${executionResult?.status === 'correct' ? 'text-green-400' : executionResult?.status === 'incorrect' ? 'text-red-400' : 'text-zinc-400'}`}>
                                            {executionResult?.status === 'correct' ? <><CheckCircle2 size={14} /> Success ({executionResult.user?.execution_time_ms}ms)</> :
                                                executionResult?.status === 'incorrect' ? <><XCircle size={14} /> Incorrect Result</> :
                                                    error ? <><AlertCircle size={14} /> Execution Error</> :
                                                        "Executing..."}
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4 bg-[#0d121c]">
                                        {error === "LOGIN_REQUIRED" ? (
                                            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#4DD4C4]/10 flex items-center justify-center border border-[#4DD4C4]/20 mb-2 shadow-inner">
                                                    <Lock size={24} className="text-[#4DD4C4]" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white tracking-tight">Practice is Locked</h3>
                                                <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">Join our community of data pros to run queries, track streaks, and save your progress.</p>
                                                <div className="flex gap-4 pt-2">
                                                    <Link href="/login" className="px-6 py-2 bg-[#4DD4C4] text-[#080c16] rounded-xl font-bold text-sm hover:bg-[#3dbdb0] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#4DD4C4]/20">Log In</Link>
                                                    <Link href="/signup" className="px-6 py-2 bg-[#131924] border border-[#202736] text-white rounded-xl font-bold text-sm hover:bg-[#202736] transition-all">Sign Up</Link>
                                                </div>
                                            </div>
                                        ) : error === "PROFILE_REQUIRED" ? (
                                            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center border border-[#60a5fa]/20 mb-2">
                                                    <Sparkles size={24} className="text-[#60a5fa]" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white tracking-tight">One Last Step!</h3>
                                                <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">Complete your profile setup to unlock full access to the daily practice engine.</p>
                                                <button
                                                    onClick={() => router.push('/profile')}
                                                    className="px-8 py-2.5 bg-[#60a5fa] text-white rounded-xl font-bold text-sm hover:bg-[#4f83cc] transition-all flex items-center gap-2 group shadow-lg shadow-[#60a5fa]/20"
                                                >
                                                    Complete Setup <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        ) : error ? (
                                            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 font-mono text-sm flex flex-col gap-3">
                                                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-80">
                                                    <AlertCircle size={14} /> Execution Error
                                                </div>
                                                <div className="p-4 bg-[#080c16] border border-red-500/20 rounded-lg text-red-200/90 leading-relaxed whitespace-pre-wrap">{error}</div>
                                            </div>
                                        ) : executionResult?.user ? (
                                            <div className="rounded-lg border border-[#202736] overflow-hidden bg-[#131924]">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-[#0b101c] text-zinc-400">
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
                                                                    <td key={j} className="px-4 py-2 text-zinc-300 font-mono whitespace-nowrap">{cell?.toString()}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {executionResult?.diff_reason && (
                                                    <div className="bg-red-500/10 text-red-400 w-full p-3 font-mono mt-4 rounded-b-lg border-t border-red-500/20">
                                                        Failed against expected output: {executionResult.diff_reason}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="p-4 border-t border-[#202736] bg-[#0b101c] flex justify-between items-center shrink-0">
                                        <div className="flex text-xs text-zinc-500 gap-4 font-mono">
                                            <span className="cursor-pointer hover:text-zinc-300 transition-colors">Hint</span>
                                            <span className="cursor-pointer hover:text-zinc-300 transition-colors border-l border-[#202736] pl-4">Solution</span>
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={executionResult?.status !== 'correct'}
                                            className={`px-6 py-2 rounded text-xs font-bold transition-all ${executionResult?.status === 'correct' ? 'bg-[#4DD4C4] text-[#080C16] hover:bg-[#3dbdb0] shadow-[0_0_10px_rgba(77,212,196,0.2)]' : 'bg-[#18212f] text-zinc-500 cursor-not-allowed border border-[#202736]'}`}
                                        >
                                            SUBMIT
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Panel>
                </Group>
            </div>
        </div>
    );
}
