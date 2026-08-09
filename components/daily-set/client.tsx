"use client";
import {
    Play,
    CheckCircle2,
    Database,
    Code2,
    Server,
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
    ChevronLeft,
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
    Trash2,
    ArrowRight as ArrowRightIcon,
    X,
    Send,
    Reply,
    MessageCircle,
    Info,
    Share2,
    Twitter,
    Linkedin,
    Copy
} from "lucide-react";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Panel, Group, Separator } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from "@/lib/api";
import { Problem, DailyPractice, Dataset, ExecutionResponse } from "@/types/api";
import { WalkthroughTour, PRACTICE_TOUR_STEPS } from "@/components/walkthrough/WalkthroughTour";
import { useWalkthrough } from "@/hooks/useWalkthrough";

SyntaxHighlighter.registerLanguage('sql', sql);

// Custom theme based on vscDarkPlus, matched to our editor background
const sqlHighlightStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: '#0b101c',
        margin: 0,
        padding: '10px 12px',
        fontSize: '11px',
        lineHeight: '1.6',
        borderRadius: '6px',
    },
    'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        background: 'none',
        fontSize: '11px',
        lineHeight: '1.6',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    },
};

type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced';

export function DailySetSkeleton() {
    return (
        <div className="h-screen bg-[#080c16] flex flex-col overflow-hidden">
            {/* Top Bar Skeleton */}
            <div className="h-14 bg-[#0d121c] border-b border-[#202736] flex items-center px-6 shrink-0 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-5 bg-[#202736] rounded animate-pulse" />
                    <div className="w-px h-5 bg-[#202736]" />
                    <div className="w-32 h-8 bg-[#202736] rounded animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="w-24 h-8 bg-[#202736] rounded animate-pulse" />
                    <div className="w-8 h-8 bg-[#202736] rounded-full animate-pulse" />
                </div>
            </div>

            {/* Main Workspace Skeleton */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-[280px] bg-[#080c16] border-r border-[#202736] flex flex-col shrink-0">
                    <div className="h-[52px] border-b border-[#202736] bg-[#0d121c] flex items-center px-4 justify-between">
                        <div className="w-24 h-4 bg-[#202736] rounded animate-pulse" />
                        <div className="w-6 h-6 bg-[#202736] rounded animate-pulse" />
                    </div>
                    <div className="p-3 space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-16 bg-[#131924] border border-[#202736] rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Question Details */}
                <div className="flex-1 border-r border-[#202736] bg-[#080c16] flex flex-col">
                    <div className="h-[52px] border-b border-[#202736] bg-[#0d121c] px-4 flex items-center gap-4">
                        <div className="w-20 h-6 bg-[#202736] rounded animate-pulse" />
                        <div className="w-20 h-6 bg-[#202736] rounded animate-pulse" />
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="w-3/4 h-8 bg-[#202736] rounded animate-pulse" />
                            <div className="w-1/4 h-5 bg-[#202736] rounded animate-pulse" />
                        </div>
                        <div className="space-y-3 mt-8">
                            <div className="w-full h-4 bg-[#202736] rounded animate-pulse" />
                            <div className="w-full h-4 bg-[#202736] rounded animate-pulse" />
                            <div className="w-5/6 h-4 bg-[#202736] rounded animate-pulse" />
                            <div className="w-4/6 h-4 bg-[#202736] rounded animate-pulse" />
                        </div>
                        <div className="h-48 mt-8 bg-[#131924] border border-[#202736] rounded-xl animate-pulse" />
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex flex-col bg-[#080c16]">
                    <div className="h-[52px] border-b border-[#202736] bg-[#0d121c] flex items-center justify-between px-4">
                        <div className="flex gap-2">
                            <div className="w-20 h-8 bg-[#202736] rounded animate-pulse" />
                            <div className="w-20 h-8 bg-[#202736] rounded animate-pulse" />
                        </div>
                        <div className="w-24 h-8 bg-[#202736] rounded animate-pulse" />
                    </div>
                    <div className="flex-1 p-4">
                        <div className="w-1/2 h-4 bg-[#202736] rounded animate-pulse mb-3" />
                        <div className="w-1/3 h-4 bg-[#202736] rounded animate-pulse mb-3" />
                        <div className="w-2/3 h-4 bg-[#202736] rounded animate-pulse mb-3" />
                        <div className="w-1/4 h-4 bg-[#202736] rounded animate-pulse" />
                    </div>
                    <div className="h-[280px] border-t border-[#202736] bg-[#0b101c] flex flex-col">
                        <div className="h-[42px] border-b border-[#202736] flex items-center px-4">
                            <div className="w-32 h-5 bg-[#202736] rounded animate-pulse" />
                        </div>
                        <div className="flex-1 p-4">
                            <div className="w-1/3 h-4 bg-[#202736] rounded animate-pulse mb-3" />
                            <div className="w-1/4 h-4 bg-[#202736] rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DailySetClient() {
    const router = useRouter();
    const { isActive: tourActive, tryAutoStart, startTour, completeTour, skipTour } = useWalkthrough();
    const params = useParams();
    const searchParams = useSearchParams();
    const urlProblemId = params.problemId as string | undefined;
    const urlTab = searchParams.get('tab');
    const urlCollapsed = searchParams.get('collapsed');

    // ── Data State ──────────────────────────────────────
    const [streak, setStreak] = useState<number>(0);
    const [activeSidebarTab, setActiveSidebarTab] = useState<'today' | 'list'>('today');
    const [activeDisciplineTab, setActiveDisciplineTab] = useState<'sql' | 'python' | 'pyspark'>('sql');
    const [searchQuery, setSearchQuery] = useState('');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [dailySet, setDailySet] = useState<DailyPractice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');
    const [userProfile, setUserProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [toast, setToast] = useState<{ message: string; subMessage?: string; visible: boolean } | null>(null);

    // ── Drill-down State ─────────────────────────────────
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [viewingDetails, setViewingDetails] = useState<boolean>(false);
    const [activeDatasets, setActiveDatasets] = useState<Dataset[]>([]);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [expectedOutput, setExpectedOutput] = useState<{ columns: string[]; rows: any[][] } | null>(null);
    const [activeSampleTab, setActiveSampleTab] = useState<number>(0);
    const [activeOutputTab, setActiveOutputTab] = useState<'test' | 'submit'>('test');

    const SQL_TEMPLATE = "\n\n```sql\nSELECT * FROM users;\n```";

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
    const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(urlCollapsed === 'true');
    const [sidebarLoaded, setSidebarLoaded] = useState(false);

    // ── Timer / Stopwatch State ──────────────────────────
    const [timerMode, setTimerMode] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [timerExpanded, setTimerExpanded] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);

    // ── Votes State ──────────────────────────────────────────────
    const [problemVotes, setProblemVotes] = useState<{ likes: number; user_has_voted: boolean } | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    // ── Discussion State ─────────────────────────────────────────
    const [activeDetailTab, setActiveDetailTab] = useState<'question' | 'discussion'>('question');
    const [comments, setComments] = useState<any[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState(SQL_TEMPLATE);
    const [isCommentPreview, setIsCommentPreview] = useState(false);
    const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);
    const [replyText, setReplyText] = useState(SQL_TEMPLATE);
    const [isReplyPreview, setIsReplyPreview] = useState(false);

    // ── Feedback State ───────────────────────────────────────────
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackSource, setFeedbackSource] = useState<'fab' | 'dislike'>('fab');
    const [feedbackProblemId, setFeedbackProblemId] = useState<string | null>(null);
    const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    // ── Refs ─────────────────────────────────────────────
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarDropdownRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const shareDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sidebarScrollRef = useRef<HTMLDivElement>(null);


    // ── Output Panel Resize ──────────────────────────────
    const [outputHeight, setOutputHeight] = useState(280);
    const handleOutputResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = outputHeight;
        const onMove = (moveEvent: MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const newHeight = Math.max(100, Math.min(600, startHeight + delta));
            setOutputHeight(newHeight);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [outputHeight]);

    // ── Discussion Panels Resize ─────────────────────────
    const [commentEditorHeight, setCommentEditorHeight] = useState(180);
    const [replyEditorHeight, setReplyEditorHeight] = useState(150);

    const handleCommentResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = commentEditorHeight;
        const onMove = (moveEvent: MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const newHeight = Math.max(120, Math.min(500, startHeight + delta));
            setCommentEditorHeight(newHeight);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [commentEditorHeight]);

    const handleReplyResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = replyEditorHeight;
        const onMove = (moveEvent: MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const newHeight = Math.max(100, Math.min(400, startHeight + delta));
            setReplyEditorHeight(newHeight);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [replyEditorHeight]);

    // ── Handlers ─────────────────────────────────────────
    const handleProblemSelect = async (id: string) => {
        if (sidebarScrollRef.current) {
            sessionStorage.setItem('sidebar_scroll_top', String(sidebarScrollRef.current.scrollTop));
        }
        router.push(`/practice/daily/${id}?tab=${activeSidebarTab}${sidebarCollapsed ? '&collapsed=true' : ''}`);
    };

    const handleBackToList = () => {
        router.push(`/practice/daily?tab=${activeSidebarTab}${sidebarCollapsed ? '&collapsed=true' : ''}`);
    };

    // Internal helper to load problem data (called by useEffect when URL changes)
    const loadProblemData = useCallback(async (id: string) => {
        setActiveProblemId(id);
        setViewingDetails(true);
        setShowResult(false);
        setError(null);
        setExecutionResult(null);
        setActiveDatasets([]);
        setShowHint(false);
        setExpectedOutput(null);
        setActiveSampleTab(0);
        setActiveOutputTab('test');
        setSqlDialect('postgresql');  // reset dialect on every problem switch
        try {
            let p = problems.find(x => x.id === id);
            if (!p) {
                try {
                    p = await api.getProblem(id);
                    setProblems(prev => {
                        if (!prev.some(x => x.id === id)) {
                            return [...prev, p!];
                        }
                        return prev;
                    });
                } catch (err) {
                    console.error("Failed to load problem metadata from API", err);
                }
            }
            if (p) {
                const pType = p.challenge_type || 'sql';
                if (pType === 'python_dsa' || pType === 'python') {
                    setActiveDisciplineTab('python');
                } else if (pType === 'pyspark') {
                    setActiveDisciplineTab('pyspark');
                } else if (pType === 'sql') {
                    setActiveDisciplineTab('sql');
                }
            }
            const isDsa = p?.challenge_type === 'python_dsa';

            const [datasets, savedSol] = await Promise.all([
                // DSA problems have no datasets table — skip the call to avoid a 404
                isDsa ? Promise.resolve([]) : api.getDatasets(id),
                api.getSavedSolution(id).catch(() => ({ submitted_query: null }))
            ]);
            const normalizedDatasets = datasets.map(ds => ({
                ...ds,
                sample_rows: typeof ds.sample_rows === 'string'
                    ? JSON.parse(ds.sample_rows)
                    : (Array.isArray(ds.sample_rows) ? ds.sample_rows : []),
            }));
            setActiveDatasets(normalizedDatasets);
            const draftQuery = localStorage.getItem(`draft_query_${id}`);
            if (draftQuery) {
                setCode(draftQuery);
            } else if (savedSol?.submitted_query) {
                setCode(savedSol.submitted_query);
            } else {
                const firstDsName = datasets[0]?.table_name || 'table_name';
                if (isDsa) {
                    if (p?.starter_code) {
                        // Admin defined a full stub with params — use it directly
                        setCode(`from typing import List, Optional\n\n${p.starter_code}\n    # Write your solution here\n    pass\n`);
                    } else {
                        // Fall back: build a minimal stub from function_name or description regex
                        const fnName = p?.function_name
                            || p?.description?.match(/def\s+(\w+)\s*\(/)?.[1]
                            || 'solution';
                        setCode(`from typing import List, Optional\n\ndef ${fnName}():\n    # Write your solution here\n    pass\n`);
                    }
                } else if (p?.challenge_type === 'python') {
                    const dfList = datasets.map(d => `'${d.table_name}_df'`).join(', ');
                    const dfLabel = datasets.length > 1
                        ? `DataFrames are available as: ${dfList}`
                        : `DataFrame is available as '${firstDsName}_df'`;
                    setCode(`# Write your Python (Pandas) code for: ${p?.title}\n# The input ${dfLabel}.\n# Assign your final DataFrame to the 'result' variable.\n\nresult = ${firstDsName}_df\n`);
                } else if (p?.challenge_type === 'pyspark') {
                    const dfList = datasets.map(d => `'${d.table_name}_df'`).join(', ');
                    const viewList = datasets.map(d => `'${d.table_name}'`).join(', ');
                    const dfLabel = datasets.length > 1
                        ? `DataFrames are available as: ${dfList} (or as temp views: ${viewList})`
                        : `DataFrame is available as '${firstDsName}_df' or as a temp view '${firstDsName}'`;
                    setCode(`# Write your PySpark code for: ${p?.title}\n# The input ${dfLabel}.\n# Assign your final DataFrame to the 'result' variable.\n\nresult = ${firstDsName}_df\n`);
                } else {
                    setCode(`-- Write your query for: ${p?.title}\nSELECT * FROM ${firstDsName};\n`);
                }
            }
            // DSA problems show test results in the output panel — no tabular expected output to fetch
            if (!isDsa) {
                api.getExpectedOutput(id)
                    .then(data => setExpectedOutput(data))
                    .catch(() => setExpectedOutput(null));
            }
            setProblemVotes(null);
            setCommentCount(0);
            setActiveDetailTab('question');
            setComments([]);
            api.getProblemVotes(id).then(v => setProblemVotes(v)).catch(() => setProblemVotes({ likes: 0, user_has_voted: false }));
            api.getCommentCount(id).then(({ count }) => setCommentCount(count)).catch(() => setCommentCount(0));


        } catch (err) {
            console.error("Failed to load datasets", err);
        }
    }, [problems, dailySet]);

    // ── Effects ──────────────────────────────────────────
    useEffect(() => {
        async function loadData() {
            try {
                let profileData = null;
                let isAuthed = false;
                try {
                    profileData = await api.getProfile();
                    setAuthStatus('authenticated');
                    setUserProfile(profileData);
                    isAuthed = true;
                } catch {
                    setAuthStatus('unauthenticated');
                }
                const [probs, daily, streakData, userStats] = await Promise.all([
                    api.getProblems(),
                    api.getDailyPractice().catch(() => null),
                    api.getProfile().then(() => api.getStreak()).catch(() => ({ current_streak: 0 })),
                    api.getStats().catch(() => null),
                ]);
                setProblems(probs);
                setDailySet(daily);
                setStreak(streakData?.current_streak || 0);
                setStats(userStats);

                // Initial sidebar tab selection based on URL or logic
                if (urlTab === 'today' || urlTab === 'list') {
                    setActiveSidebarTab(urlTab as 'today' | 'list');
                } else if (urlProblemId && daily) {
                    const isSql = [daily.easy, daily.medium, daily.advanced].includes(urlProblemId);
                    const isPython = [daily.python_easy, daily.python_medium, daily.python_advanced, daily.dsa_easy, daily.dsa_medium, daily.dsa_advanced].includes(urlProblemId);
                    const isPyspark = [daily.pyspark_easy, daily.pyspark_medium, daily.pyspark_advanced].includes(urlProblemId);
                    if (isSql || isPython || isPyspark) {
                        setActiveSidebarTab('today');
                        if (isSql) setActiveDisciplineTab('sql');
                        else if (isPython) setActiveDisciplineTab('python');
                        else if (isPyspark) setActiveDisciplineTab('pyspark');
                    } else {
                        setActiveSidebarTab('list');
                    }
                }
                // Fetch solved IDs only when authenticated
                if (isAuthed) {
                    api.getSolvedIds()
                        .then(({ solved_ids }) => setSolvedIds(new Set(solved_ids)))
                        .catch(() => { });
                }

                // Welcome Tour logic
                if (typeof window !== 'undefined') {
                    const search = window.location.search;
                    if (search.includes('welcome=true')) {
                        // Clean URL first
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                        // Start the walkthrough (only if not seen yet)
                        setTimeout(() => tryAutoStart(), 500);
                    }
                }
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    // Sync state when URL problemId changes or data finishes loading
    useEffect(() => {
        if (isLoading) return;
        if (urlProblemId) {
            loadProblemData(urlProblemId);
        }
    }, [urlProblemId, isLoading, loadProblemData]);

    // When on /practice/daily (no problemId selected in URL), auto-select first problem of active discipline
    useEffect(() => {
        if (isLoading || urlProblemId) return;
        if (activeSidebarTab === 'today' && dailySet) {
            let firstId: string | null | undefined = null;
            if (activeDisciplineTab === 'python') {
                firstId = dailySet.python_easy || dailySet.python_medium || dailySet.python_advanced || dailySet.dsa_easy || dailySet.dsa_medium || dailySet.dsa_advanced;
            } else if (activeDisciplineTab === 'pyspark') {
                firstId = dailySet.pyspark_easy || dailySet.pyspark_medium || dailySet.pyspark_advanced;
            } else {
                firstId = dailySet.easy || dailySet.medium || dailySet.advanced;
            }
            if (firstId) {
                router.replace(`/practice/daily/${firstId}?tab=today${sidebarCollapsed ? '&collapsed=true' : ''}`);
                return;
            }
        }
        setActiveProblemId(null);
        setViewingDetails(false);
    }, [urlProblemId, isLoading, activeSidebarTab, dailySet, router, activeDisciplineTab, sidebarCollapsed]);

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

    // Outside-click: share dropdown
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (shareDropdownRef.current && !shareDropdownRef.current.contains(e.target as Node))
                setShareDropdownOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // Outside-click: filter dropdown
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node))
                setShowFilterDropdown(false);
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

    // ── Sidebar & Filter Persistence ──────────────────────────────
    useEffect(() => {
        const saved = localStorage.getItem('sidebar_collapsed');
        if (saved !== null) {
            setSidebarCollapsed(saved === 'true');
        }

        const savedDifficulty = sessionStorage.getItem('difficulty_filter');
        if (savedDifficulty) {
            setDifficultyFilter(savedDifficulty);
        }

        const savedType = sessionStorage.getItem('type_filter');
        if (savedType) {
            setTypeFilter(savedType);
        }

        const savedStatus = sessionStorage.getItem('status_filter');
        if (savedStatus) {
            setStatusFilter(savedStatus);
        }

        const savedSearch = sessionStorage.getItem('search_query');
        if (savedSearch) {
            setSearchQuery(savedSearch);
        }

        setSidebarLoaded(true);
    }, []);

    useEffect(() => {
        if (sidebarLoaded) {
            localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));

            if (difficultyFilter === 'all') {
                sessionStorage.removeItem('difficulty_filter');
            } else {
                sessionStorage.setItem('difficulty_filter', difficultyFilter);
            }

            if (typeFilter === 'all') {
                sessionStorage.removeItem('type_filter');
            } else {
                sessionStorage.setItem('type_filter', typeFilter);
            }

            if (statusFilter === 'all') {
                sessionStorage.removeItem('status_filter');
            } else {
                sessionStorage.setItem('status_filter', statusFilter);
            }

            if (searchQuery.trim() === '') {
                sessionStorage.removeItem('search_query');
            } else {
                sessionStorage.setItem('search_query', searchQuery);
            }
        }
    }, [sidebarCollapsed, difficultyFilter, typeFilter, statusFilter, searchQuery, sidebarLoaded]);

    // Restore sidebar scroll position
    useEffect(() => {
        if (!isLoading && !sidebarCollapsed && sidebarScrollRef.current) {
            const savedScrollTop = sessionStorage.getItem('sidebar_scroll_top');
            if (savedScrollTop) {
                const scrollTop = parseFloat(savedScrollTop);
                if (!isNaN(scrollTop)) {
                    const timer = setTimeout(() => {
                        if (sidebarScrollRef.current) {
                            sidebarScrollRef.current.scrollTop = scrollTop;
                        }
                    }, 50);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [isLoading, sidebarCollapsed, activeSidebarTab, activeProblemId]);

    // ── Helpers ──────────────────────────────────────────
    /**
     * Extracts column names in declaration order from a CREATE TABLE ... SQL string.
     * Falls back to Object.keys(row) (which may be alphabetical due to JSONB) if parsing fails.
     */
    const getColumnOrder = (schemaSql: string, fallbackRow?: Record<string, any>, seedDataJson?: any): string[] => {
        if (seedDataJson?.columns && Array.isArray(seedDataJson.columns)) {
            return seedDataJson.columns.map((c: any) => typeof c === 'string' ? c : (c.name || ''));
        }
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
                        const isConstraint = /^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE[\s(]|CHECK\s*\(|INDEX\s|KEY\s|CONSTRAINT\s)/i.test(current);
                        if (!isConstraint) {
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
                const isConstraint = /^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE[\s(]|CHECK\s*\(|INDEX\s|KEY\s|CONSTRAINT\s)/i.test(current);
                if (!isConstraint) {
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
    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

        const pType = p.challenge_type || 'sql';
        const matchesType = typeFilter === 'all' || 
            (typeFilter === 'python' 
                ? (pType.toLowerCase() === 'python' || pType.toLowerCase() === 'python_dsa')
                : pType.toLowerCase() === typeFilter.toLowerCase());

        const isSolved = solvedIds.has(p.id);
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'solved' && isSolved) ||
            (statusFilter === 'unsolved' && !isSolved);

        return matchesSearch && matchesDifficulty && matchesType && matchesStatus;
    });
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
        h1: ({ node, ...props }: any) => <h1 className="text-lg font-bold text-white mt-4 mb-2.5" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-md font-bold text-white mt-4 mb-2" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-sm font-bold text-zinc-300 mt-3 mb-1.5" {...props} />,
        p: ({ node, ...props }: any) => <p className="mb-2.5 leading-relaxed" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2.5" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2.5" {...props} />,
        li: ({ node, ...props }: any) => <li className="mb-1 last:mb-0" {...props} />,
        table: ({ node, ...props }: any) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-[#202736] bg-[#0d121c] shadow-xl">
                <table className="w-full border-collapse text-sm text-left" {...props} />
            </div>
        ),
        thead: ({ node, ...props }: any) => <thead className="bg-[#131924] border-b border-[#202736]" {...props} />,
        tbody: ({ node, ...props }: any) => <tbody className="divide-y divide-[#202736]/30" {...props} />,
        tr: ({ node, ...props }: any) => <tr className="hover:bg-[#4DD4C4]/5 transition-colors group" {...props} />,
        th: ({ node, ...props }: any) => <th className="px-4 py-3 text-[10px] font-bold text-[#4DD4C4] uppercase tracking-widest font-mono" {...props} />,
        td: ({ node, ...props }: any) => <td className="px-4 py-3 text-xs text-zinc-300 font-mono group-hover:text-white transition-colors" {...props} />,
        strong: ({ node, ...props }: any) => <strong className="font-bold text-white shadow-[#4DD4C4]/20 text-shadow-sm" {...props} />,
        code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;
            return isInline ? (
                <code className="bg-[#202736] px-1.5 py-0.5 rounded text-[11px] text-[#4DD4C4] font-mono" {...props}>{children}</code>
            ) : (
                <div className="bg-[#131924] p-3 rounded border border-[#202736] overflow-x-auto text-[11px] my-3 font-mono">
                    <code className="text-[#4DD4C4]" {...props}>{children}</code>
                </div>
            );
        },
    };

    // Compact markdown components for discussion drawer (smaller fonts/spacing)
    const discussionMarkdownComponents = {
        p: ({ node, ...props }: any) => <p className="mb-1.5 last:mb-0" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-1.5 space-y-1 text-xs" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-1.5 space-y-1 text-xs" {...props} />,
        li: ({ node, ...props }: any) => <li className="text-xs mb-0.5 last:mb-0" {...props} />,
        pre: ({ node, children, ...props }: any) => <div className="my-2 first:mt-0 last:mb-0 rounded-md border border-[#202736] overflow-hidden" {...props}>{children}</div>,
        code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;
            if (isInline) {
                return <code className="bg-[#202736] px-1 py-0.5 rounded text-[11px] text-[#4DD4C4] font-mono" {...props}>{children}</code>;
            }
            const lang = match?.[1] || 'sql';
            const codeString = String(children).replace(/\n$/, '');
            return (
                <SyntaxHighlighter
                    language={lang}
                    style={sqlHighlightStyle}
                    customStyle={{ margin: 0 }}
                >
                    {codeString}
                </SyntaxHighlighter>
            );
        },
        strong: ({ node, ...props }: any) => <strong className="font-semibold text-zinc-200" {...props} />,
        em: ({ node, ...props }: any) => <em className="italic text-zinc-400" {...props} />,
    };



    // ── Today's Set ordered list for navigation ──────────────
    const todaysProblemIds = ([
        'easy', 'medium', 'advanced',
        'python_easy', 'python_medium', 'python_advanced',
        'pyspark_easy', 'pyspark_medium', 'pyspark_advanced',
        'dsa_easy', 'dsa_medium', 'dsa_advanced'
    ] as const)
        .map(level => dailySet?.[level] as string | undefined)
        .filter((id): id is string => !!id && problems.some(p => p.id === id));

    const navigationList = activeSidebarTab === 'today' ? todaysProblemIds : filteredProblems.map(p => p.id);
    const currentNavIndex = activeProblemId ? navigationList.indexOf(activeProblemId) : -1;

    const handlePrevProblem = () => {
        if (currentNavIndex > 0) handleProblemSelect(navigationList[currentNavIndex - 1]);
    };

    const handleNextProblem = () => {
        if (currentNavIndex < navigationList.length - 1) handleProblemSelect(navigationList[currentNavIndex + 1]);
    };

    const isDsaProblem = activeProblem?.challenge_type === 'python_dsa';
    const isSqlProblem  = activeProblem?.challenge_type === 'sql';

    // ── SQL Dialect State ─────────────────────────────────────────────
    // Reset to postgresql whenever the user switches to a different problem
    const [sqlDialect, setSqlDialect] = useState<'postgresql' | 'mysql'>('postgresql');
    const isDualDialect = isSqlProblem && (activeProblem?.supported_dialects?.includes('mysql') ?? false);

    // ── DSA Test Results Panel ─────────────────────────────────────────────
    const renderDsaPanel = () => {
        if (!isDsaProblem || !executionResult?.test_summary) return null;
        const summary = executionResult.test_summary!;
        const sampleTests = summary.results.filter(tc => !tc.is_hidden);
        const hiddenTests = summary.results.filter(tc => tc.is_hidden);
        const firstFailing = summary.results.find(tc => !tc.passed);

        const formatValue = (val: any): string => {
            if (val === undefined || val === null) return 'null';
            return JSON.stringify(val);
        };

        const formatInput = (input: any): string => {
            if (!input || typeof input !== 'object' || Array.isArray(input)) {
                return formatValue(input);
            }
            return Object.entries(input)
                .map(([k, v]) => `${k} = ${formatValue(v)}`)
                .join('\n');
        };

        const TestDataRow = ({ label, value, color }: { label: string; value: any; color: string }) => (
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">{label}</span>
                <pre className={`text-[11px] font-mono ${color} bg-[#080c16] border border-[#202736] rounded-md px-3 py-2 whitespace-pre-wrap break-all leading-relaxed`}>{typeof value === 'string' ? value : formatValue(value)}</pre>
            </div>
        );

        if (activeOutputTab === 'test') {
            return (
                <div className="space-y-4">
                    {/* ── Sample Pass / Fail count badge ── */}
                    <div className="flex items-center gap-3">
                        <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${sampleTests.every(r => r.passed) ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {sampleTests.filter(r => r.passed).length} / {sampleTests.length} sample cases passed
                        </div>
                        {executionResult.status === 'run_result' && (
                            <span className="text-[10px] text-zinc-500 italic">Sample tests only · Press Submit to run all tests</span>
                        )}
                    </div>

                    {/* ── Sample Test Cases (Tabbed) ── */}
                    {sampleTests.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-1.5 border-b border-[#202736]/40 pb-2">
                                {sampleTests.map((tc, idx) => {
                                    const isActive = activeSampleTab === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSampleTab(idx)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${isActive
                                                    ? 'bg-[#182235] text-[#4DD4C4] border-[#4DD4C4]/30 shadow-md shadow-[#4DD4C4]/5'
                                                    : 'bg-[#0d121c] text-zinc-400 hover:text-zinc-200 border-[#202736]/50 hover:bg-[#131924]'
                                                }`}
                                        >
                                            {tc.passed ? (
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                            ) : (
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                            )}
                                            {tc.label ? tc.label : `Case ${idx + 1}`}
                                        </button>
                                    );
                                })}
                            </div>

                            {(() => {
                                const tc = sampleTests[activeSampleTab] || sampleTests[0];
                                if (!tc) return null;
                                return (
                                    <div
                                        className={`rounded-xl border p-3.5 flex flex-col gap-3 ${tc.passed
                                                ? 'bg-green-500/5 border-green-500/20'
                                                : 'bg-red-500/5 border-red-500/20'
                                            }`}
                                    >
                                        {/* Input */}
                                        {tc.input_data !== undefined && tc.input_data !== null && (
                                            <TestDataRow label="Input" value={formatInput(tc.input_data)} color="text-zinc-300" />
                                        )}

                                        {/* Expected */}
                                        {tc.expected !== undefined && tc.expected !== 'hidden' && (
                                            <TestDataRow label="Expected Output" value={tc.expected} color="text-green-300" />
                                        )}

                                        {/* Actual (got) */}
                                        {tc.got !== undefined && (
                                            <TestDataRow
                                                label="Actual Output"
                                                value={tc.got}
                                                color={tc.passed ? 'text-green-300' : 'text-red-300'}
                                            />
                                        )}

                                        {/* Error */}
                                        {tc.error && (
                                            <TestDataRow label="Error" value={tc.error} color="text-red-400" />
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            );
        }

        // ── Submission Results Tab ──
        if (executionResult.status === 'run_result') {
            return (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/20 flex items-center justify-center border border-[#202736] text-zinc-500 mb-2">
                        <Sparkles size={22} className="opacity-80" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-300">No Submission Result</h3>
                    <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">You only executed Sample tests. Click the Submit button to run your solution against the complete validation suite.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {/* ── Summary Badge ── */}
                <div className="flex items-center gap-3">
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${executionResult.status === 'correct' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {summary.passed} / {summary.total} test cases passed
                    </div>
                </div>

                {firstFailing ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <XCircle size={13} className="text-red-400 shrink-0" />
                            <span className="text-xs font-bold text-red-400">
                                {firstFailing.is_hidden ? "Hidden Test Failed" : "Sample Test Failed"}
                            </span>
                            {firstFailing.is_hidden ? (
                                <span className="ml-auto text-[9px] text-zinc-600 uppercase tracking-wider border border-[#202736] rounded px-1.5 py-0.5">Hidden</span>
                            ) : (
                                <span className="ml-auto text-[9px] text-[#4DD4C4] uppercase tracking-wider border border-[#4DD4C4]/20 rounded px-1.5 py-0.5">{firstFailing.label || "Sample"}</span>
                            )}
                        </div>

                        {/* Input (only if not hidden) */}
                        {!firstFailing.is_hidden && firstFailing.input_data !== undefined && firstFailing.input_data !== null && (
                            <TestDataRow label="Input" value={formatInput(firstFailing.input_data)} color="text-zinc-300" />
                        )}

                        {/* Expected */}
                        {firstFailing.expected !== undefined && firstFailing.expected !== 'hidden' && (
                            <TestDataRow label="Expected Output" value={firstFailing.expected} color="text-green-300" />
                        )}

                        {/* Actual */}
                        {firstFailing.got !== undefined && (
                            <TestDataRow label="Actual Output" value={firstFailing.got} color="text-red-300" />
                        )}

                        {/* Error */}
                        {firstFailing.error && (
                            <TestDataRow label="Error" value={firstFailing.error} color="text-red-400" />
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex flex-col items-center justify-center text-center space-y-2">
                        <CheckCircle2 size={24} className="text-green-400" />
                        <h4 className="text-sm font-bold text-green-400">Submission Accepted!</h4>
                        <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">Your code successfully passes all standard validation checks and hidden edge-case testing constraints.</p>
                    </div>
                )}
            </div>
        );
    };

    const handleRun = async () => {
        if (!activeProblemId) return;
        if (authStatus === 'unauthenticated') { setError("LOGIN_REQUIRED"); return; }
        if (userProfile && !userProfile.exists) { setError("PROFILE_REQUIRED"); return; }
        setIsRunning(true);
        setError(null);
        setShowResult(true);
        setOutputHeight(isDsaProblem ? 340 : 280);
        try {
            // DSA uses 'run' mode (sample test cases only); others use 'submit' which evaluates correctness
            const mode = isDsaProblem ? 'run' : 'submit';
            const res = await api.execute(activeProblemId, code, mode, isSqlProblem ? sqlDialect : 'postgresql');
            setExecutionResult(res);
            if (isDsaProblem) {
                setActiveOutputTab('test');
            }
            if (res.status === 'error' && res.error === 'PROFILE_REQUIRED') { setError("PROFILE_REQUIRED"); return; }
            if (res.status === 'error' && res.error) setError(res.error);
        } catch (err: any) {
            setError(err.message || "Execution failed");
            setExecutionResult(null);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (authStatus === 'unauthenticated') { setError("LOGIN_REQUIRED"); return; }
        if (userProfile && !userProfile.exists) { setError("PROFILE_REQUIRED"); return; }

        if (isDsaProblem) {
            // For DSA: submit mode runs all test cases (including hidden) and saves the result
            if (!activeProblemId) return;
            setIsRunning(true);
            setError(null);
            setShowResult(true);
            setOutputHeight(340);
            try {
                const res = await api.execute(activeProblemId, code, 'submit', isSqlProblem ? sqlDialect : 'postgresql');
                setExecutionResult(res);
                if (isDsaProblem) {
                    setActiveOutputTab('submit');
                }
                if (res.status === 'error' && res.error === 'PROFILE_REQUIRED') { setError("PROFILE_REQUIRED"); return; }
                if (res.status === 'error' && res.error) { setError(res.error); return; }
                if (res.status === 'correct') {
                    setSolvedIds(prev => new Set(prev).add(activeProblemId));
                    const s = await api.getStreak().catch(() => null);
                    const newStreak = s?.current_streak ?? streak;
                    const prevStreak = streak;
                    setStreak(newStreak);
                    setToast({
                        message: `Solution Submitted!`,
                        subMessage: newStreak > prevStreak ? `Streak updated to ${newStreak} days! 🔥` : `All test cases passed! 🎉`,
                        visible: true
                    });
                    const newStats = await api.getStats().catch(() => null);
                    if (newStats) setStats(newStats);
                    setTimeout(() => setToast(null), 5000);
                }
            } catch (err: any) {
                setError(err.message || "Execution failed");
                setExecutionResult(null);
            } finally {
                setIsRunning(false);
            }
            return;
        }

        // Non-DSA: submit button is only enabled when run already returned 'correct'
        if (executionResult?.status === 'correct') {
            try {
                const s = await api.getStreak();
                const newStreak = s.current_streak;
                const prevStreak = streak;
                setStreak(newStreak);

                // Mark this problem as solved immediately in local state
                if (activeProblemId) {
                    setSolvedIds(prev => new Set(prev).add(activeProblemId));
                }

                setToast({
                    message: `Solution Submitted!`,
                    subMessage: newStreak > prevStreak ? `Streak updated to ${newStreak} days! 🔥` : `Problem solved successfully!`,
                    visible: true
                });

                // Update stats as well
                const newStats = await api.getStats().catch(() => null);
                if (newStats) setStats(newStats);

                setTimeout(() => setToast(null), 5000);
            } catch (err) {
                console.error(err);
            }
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

    const openFeedbackModal = (source: 'fab' | 'dislike', problemId?: string) => {
        setFeedbackSource(source);
        setFeedbackProblemId(problemId || null);
        setFeedbackRating(null);
        setFeedbackMessage('');
        setFeedbackSuccess(false);
        setFeedbackOpen(true);
    };

    const handleDislike = () => {
        if (authStatus === 'unauthenticated') {
            setError('LOGIN_REQUIRED');
            setShowResult(true);
            return;
        }
        openFeedbackModal('dislike', activeProblemId || undefined);
    };

    const handleVote = async () => {
        if (authStatus === 'unauthenticated') { setError('LOGIN_REQUIRED'); setShowResult(true); return; }
        if (!activeProblemId) return;
        setIsVoting(true);
        const prev = problemVotes;
        setProblemVotes(v => v ? { likes: v.user_has_voted ? v.likes - 1 : v.likes + 1, user_has_voted: !v.user_has_voted } : null);
        try {
            const result = await api.voteProblem(activeProblemId);
            setProblemVotes({ likes: result.likes, user_has_voted: result.user_has_voted });
        } catch { setProblemVotes(prev); }
        finally { setIsVoting(false); }
    };

    const handleOpenDiscussion = async () => {
        console.log("Opening discussion for problem:", activeProblemId);
        if (authStatus === 'unauthenticated') {
            console.log("Auth failed: unauthenticated");
            setError('LOGIN_REQUIRED');
            setShowResult(true);
            return;
        }
        setActiveDetailTab('discussion');
        if (!activeProblemId) {
            console.warn("No active problem ID for discussion");
            return;
        }
        if (comments.length > 0) {
            console.log("Comments already loaded, skipping fetch");
            return;
        }

        setIsLoadingComments(true);
        try {
            console.log("Fetching comments from API...");
            const data = await api.getComments(activeProblemId);
            console.log("Comments fetched successfully:", data.length);
            setComments(data);
        } catch (e) {
            console.error("Failed to fetch comments:", e);
        }
        finally { setIsLoadingComments(false); }
    };

    const handlePostComment = async () => {
        console.log("Posting comment. ActiveProblemId:", activeProblemId, "Comment length:", newComment.trim().length);
        if (!activeProblemId) {
            console.error("Cannot post comment: activeProblemId is null");
            return;
        }
        if (!newComment.trim()) {
            console.warn("Cannot post comment: body is empty");
            return;
        }

        try {
            console.log("Submitting comment to API...");
            const c = await api.postComment(activeProblemId, newComment.trim());
            console.log("Comment posted successfully:", c.id);
            setComments(prev => [...prev, c]);
            setCommentCount(n => n + 1);
            setNewComment(SQL_TEMPLATE);
            setIsCommentPreview(false);
        } catch (e) {
            console.error("Failed to post comment:", e);
        }
    };

    const handlePostReply = async (parentId: string) => {
        console.log("Posting reply to comment:", parentId, "ProblemId:", activeProblemId, "Reply length:", replyText.trim().length);
        if (!activeProblemId || !replyText.trim()) return;
        try {
            console.log("Submitting reply to API...");
            const c = await api.postComment(activeProblemId, replyText.trim(), parentId);
            console.log("Reply posted successfully:", c.id);
            setComments(prev => prev.map(com =>
                com.id === parentId ? { ...com, replies: [...(com.replies || []), c], reply_count: (com.reply_count || 0) + 1 } : com
            ));
            setReplyingTo(null);
            setReplyText(SQL_TEMPLATE);
            setIsReplyPreview(false);
        } catch (e) {
            console.error("Failed to post reply:", e);
        }
    };

    const handleDeleteComment = async (commentId: string, parentId?: string) => {
        try {
            await api.deleteComment(commentId);
            if (parentId) {
                setComments(prev => prev.map(com =>
                    com.id === parentId ? { ...com, replies: com.replies.filter((r: any) => r.id !== commentId), reply_count: Math.max(0, (com.reply_count || 1) - 1) } : com
                ));
            } else {
                setComments(prev => prev.filter(c => c.id !== commentId));
                setCommentCount(n => Math.max(0, n - 1));
            }
        } catch (e) { console.error(e); }
    };

    const handleCommentVote = async (commentId: string, voteType: number, parentId?: string) => {
        if (authStatus !== 'authenticated') return;
        try {
            const res = await api.voteComment(commentId, voteType);
            const updateItem = (item: any) => {
                if (item.id !== commentId) return item;

                let newLikes = item.likes || 0;
                let newDislikes = item.dislikes || 0;
                const oldVote = item.user_vote;

                // Remove old vote impact
                if (oldVote === 1) newLikes--;
                else if (oldVote === -1) newDislikes--;

                // Add new vote impact
                const newVote = res.status === 'removed' ? null : res.vote_type;
                if (newVote === 1) newLikes++;
                else if (newVote === -1) newDislikes++;

                return { ...item, likes: newLikes, dislikes: newDislikes, user_vote: newVote };
            };

            setComments(prev => prev.map(com => {
                if (com.id === commentId) return updateItem(com);
                if (com.id === parentId) {
                    return { ...com, replies: com.replies.map((r: any) => updateItem(r)) };
                }
                if (com.replies?.some((r: any) => r.id === commentId)) {
                    return { ...com, replies: com.replies.map((r: any) => updateItem(r)) };
                }
                return com;
            }));
        } catch (e) { console.error(e); }
    };

    const handleSubmitFeedback = async () => {
        setFeedbackSubmitting(true);
        try {
            await api.submitFeedback({
                rating: feedbackRating || undefined,
                message: feedbackMessage || undefined,
                source: feedbackSource,
                problem_id: feedbackProblemId || undefined,
            });
            setFeedbackSuccess(true);
            setTimeout(() => { setFeedbackOpen(false); setFeedbackSuccess(false); }, 2000);
        } catch (e) { console.error(e); }
        finally { setFeedbackSubmitting(false); }
    };

    const handleShare = (platform: 'twitter' | 'linkedin' | 'copy') => {
        if (!activeProblemId) return;
        const url = `${window.location.origin}/practice/daily/${activeProblemId}`;
        const text = `Just solved "${activeProblem?.title}" on @dailysqlin — daily SQL, Python & PySpark practice! 🔥`;

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        } else {
            navigator.clipboard.writeText(url);
            setToast({ message: "Link copied to clipboard!", visible: true });
            setTimeout(() => setToast(null), 3000);
        }
        setShareDropdownOpen(false);
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
        return <DailySetSkeleton />;
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
                    <Link href="/" className="text-base font-bold text-white hover:opacity-80 transition-opacity">
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
                                    onClick={() => { setActiveSidebarTab('today'); setSidebarDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeSidebarTab === 'today' ? 'text-[#4DD4C4] bg-[#4DD4C4]/5' : 'text-zinc-300 hover:text-white hover:bg-[#202736]'}`}
                                >Today&apos;s Set</button>
                                <button
                                    onClick={() => { setActiveSidebarTab('list'); setSidebarDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeSidebarTab === 'list' ? 'text-[#4DD4C4] bg-[#4DD4C4]/5' : 'text-zinc-300 hover:text-white hover:bg-[#202736]'}`}
                                >Problem List</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CENTER: Run + Submit (absolutely centered) ── */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                    {/* Run */}
                    <div className="relative group" id="tour-run-button">
                        <button
                            onClick={handleRun}
                            disabled={!activeProblemId}
                            className={`flex items-center gap-2 px-5 py-2 text-[#080C16] text-sm font-bold rounded transition-colors shadow-[0_0_10px_rgba(77,212,196,0.2)] ${activeProblemId ? 'bg-[#4DD4C4] hover:bg-[#3dbdb0]' : 'bg-zinc-700 cursor-not-allowed shadow-none text-zinc-500'}`}
                        >
                            {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
                            {isDsaProblem ? 'Test' : 'Run'}
                        </button>
                        {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to run queries" />}
                    </div>

                    {/* Submit */}
                    <div className="relative group">
                        <button
                            onClick={handleSubmit}
                            disabled={isDsaProblem ? (!activeProblemId || isRunning) : executionResult?.status !== 'correct'}
                            title={isDsaProblem ? 'Submit against all test cases' : 'Submit solution'}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-colors ${isDsaProblem
                                    ? (!activeProblemId || isRunning)
                                        ? 'bg-zinc-700 cursor-not-allowed text-zinc-500'
                                        : 'bg-[#4DD4C4]/15 border border-[#4DD4C4]/40 text-[#4DD4C4] hover:bg-[#4DD4C4]/25 shadow-[0_0_8px_rgba(77,212,196,0.15)]'
                                    : executionResult?.status === 'correct'
                                        ? 'bg-[#4DD4C4]/15 border border-[#4DD4C4]/40 text-[#4DD4C4] hover:bg-[#4DD4C4]/25 shadow-[0_0_8px_rgba(77,212,196,0.15)]'
                                        : 'text-zinc-600 border border-[#202736] cursor-not-allowed'
                                }`}
                        >
                            <UploadCloud size={14} />
                            Submit
                        </button>
                        {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to submit" />}
                    </div>
                </div>

                {/* ── RIGHT: Streak + Timer + Fullscreen + Profile ── */}
                <div className="ml-auto flex items-center gap-4">

                    {/* Tour Help Button */}
                    <button
                        onClick={startTour}
                        title="Take the Tour"
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-[#4DD4C4] transition-colors text-[11px] font-semibold"
                    >
                        <Info size={14} />
                        <span className="hidden sm:inline">Tour</span>
                    </button>

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
                                    <div className="h-[52px] flex items-center justify-between px-2 border-b border-[#202736] bg-[#0d121c]/50">
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
                                        <p className="text-xs font-semibold text-white truncate">
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

                {/* ── COLUMN 1: NAVIGATION & STREAK (plain div, CSS-transitioned) ── */}
                <div
                    style={{
                        width: sidebarCollapsed ? '52px' : '280px',
                        minWidth: sidebarCollapsed ? '52px' : '220px',
                        transition: 'width 250ms ease, min-width 250ms ease'
                    }}
                    className="flex flex-col bg-[#080c16] border-r border-[#202736] overflow-visible shrink-0"
                >
                    <div className={`flex-1 flex flex-col h-full ${sidebarCollapsed ? 'overflow-visible' : 'overflow-hidden'}`}>
                        {/* Header / Tabs */}
                        <div className={`h-[52px] border-b border-[#202736] bg-[#0d121c] flex ${sidebarCollapsed ? 'flex-col justify-center' : 'flex-row'} items-center px-3 shrink-0 transition-all gap-1.5`}>
                            {!sidebarCollapsed ? (
                                <>
                                    {/* Discipline tabs inline in header */}
                                    {activeSidebarTab === 'today' ? (
                                        <div className="flex gap-0.5 flex-1 overflow-hidden">
                                            {([{ id: 'sql', label: 'SQL', Icon: Database, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/40' }, { id: 'python', label: 'Python', Icon: Code2, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/40' }, { id: 'pyspark', label: 'PySpark', Icon: Server, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/40' }] as const).map(({ id, label, Icon, color, bg, border }) => (
                                                <button
                                                    key={id}
                                                    onClick={() => setActiveDisciplineTab(id)}
                                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold border transition-all ${
                                                        activeDisciplineTab === id
                                                            ? `${bg} ${color} ${border}`
                                                            : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] border-transparent'
                                                    }`}
                                                >
                                                    <Icon size={11} />
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex gap-0.5 flex-1 overflow-hidden">
                                            {([{ id: 'all', label: 'All' }, { id: 'sql', label: 'SQL' }, { id: 'python', label: 'Python' }, { id: 'pyspark', label: 'PySpark' }] as const).map(({ id, label }) => (
                                                <button
                                                    key={id}
                                                    onClick={() => setTypeFilter(id)}
                                                    className={`flex-1 flex items-center justify-center py-1.5 rounded text-[10px] font-bold border transition-all ${
                                                        typeFilter === id
                                                            ? 'bg-[#4DD4C4]/10 text-[#4DD4C4] border-[#4DD4C4]/40'
                                                            : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] border-transparent'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {/* Collapse button */}
                                    <button
                                        onClick={() => setSidebarCollapsed(true)}
                                        className="p-1.5 hover:bg-[#202736] rounded text-zinc-500 hover:text-white transition-colors shrink-0"
                                        title="Collapse Sidebar"
                                    >
                                        <ChevronLeft size={13} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setSidebarCollapsed(false)}
                                    className="p-2 hover:bg-[#202736] rounded text-zinc-500 hover:text-white transition-colors"
                                    title="Expand Sidebar"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>

                        {/* List Content */}
                        <div
                            id="tour-sidebar-today-tab"
                            ref={sidebarScrollRef}
                            onScroll={(e) => {
                                if (sidebarLoaded && !sidebarCollapsed) {
                                    const target = e.currentTarget;
                                    sessionStorage.setItem('sidebar_scroll_top', String(target.scrollTop));
                                }
                            }}
                            className={`flex-1 ${sidebarCollapsed ? 'py-6 overflow-visible' : 'overflow-y-auto p-3'} space-y-3`}
                        >
                            {activeSidebarTab === 'today' ? (
                                sidebarCollapsed ? (
                                    <div className="flex flex-col items-center gap-6 overflow-visible">
                                        {([
                                            'easy', 'medium', 'advanced',
                                            'python_easy', 'python_medium', 'python_advanced',
                                            'pyspark_easy', 'pyspark_medium', 'pyspark_advanced',
                                            'dsa_easy', 'dsa_medium', 'dsa_advanced'
                                        ] as const).map((dLevel) => {
                                            const pId = dailySet?.[dLevel];
                                            if (!pId) return null;
                                            const pInfo = problems.find(p => p.id === pId);
                                            if (!pInfo) return null;
                                            const dStyle = getDiffStyle(pInfo.difficulty);
                                            const isSolved = solvedIds.has(pId);
                                            const isActive = activeProblemId === pId;

                                            return (
                                                <div
                                                    key={dLevel}
                                                    onClick={() => handleProblemSelect(pId)}
                                                    className={`relative group cursor-pointer`}
                                                >
                                                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? 'ring-4 ring-offset-2 ring-offset-[#080c16] scale-125' : 'hover:scale-150'}`}
                                                        style={{
                                                            backgroundColor: dStyle.hex,
                                                            boxShadow: isActive ? `0 0 12px ${dStyle.hex}` : 'none',
                                                        }}
                                                    />
                                                    {isSolved && (
                                                        <div className="absolute -top-1.5 -right-1.5 bg-[#080c16] rounded-full p-0.5">
                                                            <CheckCircle2 size={10} className="text-[#4DD4C4]" />
                                                        </div>
                                                    )}
                                                    {/* Tooltip — rendered at fixed z-index to escape overflow clipping */}
                                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#131924] border border-[#4DD4C4]/20 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-2xl z-[9999]">
                                                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-0 border-4 border-transparent border-r-[#131924]" />
                                                        <span className="font-medium">{pInfo.title}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* ── Discipline Tab content (tabs are now in header) ── */}
                                        {(() => {
                                            const DISC_TABS = [
                                                { id: 'sql' as const, label: 'SQL', Icon: Database, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
                                                { id: 'python' as const, label: 'Python', Icon: Code2, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
                                                { id: 'pyspark' as const, label: 'PySpark', Icon: Server, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30' },
                                            ];
                                            const DISC_KEYS: Record<string, Array<keyof DailyPractice>> = {
                                                sql: ['easy', 'medium', 'advanced'],
                                                python: ['python_easy', 'python_medium', 'python_advanced', 'dsa_easy', 'dsa_medium', 'dsa_advanced'],
                                                pyspark: ['pyspark_easy', 'pyspark_medium', 'pyspark_advanced'],
                                            };
                                            const activeKeys = DISC_KEYS[activeDisciplineTab];
                                            const activeTabMeta = DISC_TABS.find(t => t.id === activeDisciplineTab)!;

                                            const catProblems = dailySet
                                                ? activeKeys
                                                    .map(k => ({ key: k, id: dailySet[k] as string | undefined }))
                                                    .filter(item => !!item.id && problems.some(p => p.id === item.id))
                                                : [];

                                            return (
                                                <>



                                                    {/* Problem cards for the active discipline */}
                                                    {catProblems.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {catProblems.map(({ id }, cardIdx) => {
                                                                const pInfo = problems.find(p => p.id === id);
                                                                if (!pInfo) return null;
                                                                const dStyle = getDiffStyle(pInfo.difficulty);
                                                                const isSolved = solvedIds.has(id!);
                                                                const isActive = activeProblemId === id;
                                                                return (
                                                                    <div
                                                                        id={cardIdx === 0 ? 'tour-problem-card' : undefined}
                                                                        key={`${key}-${id}`}
                                                                        onClick={() => handleProblemSelect(id!)}
                                                                        className={`p-3 rounded-lg cursor-pointer border transition-all flex flex-col gap-2 group ${isActive
                                                                                ? `${activeTabMeta.bg} ${activeTabMeta.border}`
                                                                                : 'bg-[#131924] border-[#202736] hover:border-[#4DD4C4]/30'
                                                                            }`}
                                                                    >
                                                                        <div className="flex justify-between items-center">
                                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${dStyle.color} ${dStyle.bg} ${dStyle.border}`}>
                                                                                {dStyle.label}
                                                                            </span>
                                                                            <CheckCircle2 size={14} className={isSolved ? 'text-[#4DD4C4]' : 'text-zinc-600'} />
                                                                        </div>
                                                                        <div className={`text-sm font-medium transition-colors line-clamp-2 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                                                                            }`}>
                                                                            {pInfo.title}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-zinc-500 italic p-4 text-center border border-[#202736] rounded bg-[#131924]">
                                                            {dailySet ? `No ${activeDisciplineTab.toUpperCase()} problems today.` : 'No daily set found.'}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                )
                            ) : (
                                <div className="space-y-3 flex flex-col h-full">
                                    {/* Search/Filter for List mode */}
                                    {!sidebarCollapsed && (
                                        <div className="flex gap-2 mb-2 shrink-0">
                                            <div className="flex-1 relative">
                                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    className="w-full bg-[#131924] border border-[#202736] rounded text-[11px] py-1.5 pl-8 pr-2 text-zinc-300 outline-none focus:border-[#4DD4C4]/50 transition-colors"
                                                />
                                            </div>
                                            <div className="relative" ref={filterDropdownRef}>
                                                <button
                                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                                    className={`p-1.5 border rounded transition-colors ${(difficultyFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') ? 'bg-[#4DD4C4]/10 border-[#4DD4C4]/30 text-[#4DD4C4]' : 'bg-[#131924] border-[#202736] text-[#4DD4C4] hover:bg-[#1a2230]'}`}
                                                    title="Filters"
                                                >
                                                    <Filter size={12} />
                                                </button>
                                                {showFilterDropdown && (
                                                    <div className="absolute top-full right-0 mt-1.5 w-48 bg-[#131924] border border-[#202736] rounded-lg overflow-hidden p-3 z-[300] shadow-xl space-y-3">
                                                        <div>
                                                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Difficulty</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {['all', 'easy', 'medium', 'advanced'].map((lvl) => (
                                                                    <button
                                                                        key={lvl}
                                                                        onClick={() => setDifficultyFilter(lvl)}
                                                                        className={`px-2 py-1 text-[9px] font-bold rounded uppercase transition-colors ${difficultyFilter === lvl ? 'text-[#080c16] bg-[#4DD4C4]' : 'text-zinc-400 bg-[#080c16] border border-[#202736] hover:text-white hover:bg-[#202736]'}`}
                                                                    >
                                                                        {lvl === 'advanced' ? 'hard' : lvl}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="border-t border-[#202736]/50 pt-2">
                                                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Category</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {[{ val: 'all', label: 'All' }, { val: 'sql', label: 'SQL' }, { val: 'python', label: 'Python' }, { val: 'pyspark', label: 'PySpark' }, { val: 'python_dsa', label: 'DSA' }].map((cat) => (
                                                                    <button
                                                                        key={cat.val}
                                                                        onClick={() => setTypeFilter(cat.val)}
                                                                        className={`px-2 py-1 text-[9px] font-bold rounded uppercase transition-colors ${typeFilter === cat.val ? 'text-[#080c16] bg-[#4DD4C4]' : 'text-zinc-400 bg-[#080c16] border border-[#202736] hover:text-white hover:bg-[#202736]'}`}
                                                                    >
                                                                        {cat.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="border-t border-[#202736]/50 pt-2">
                                                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Status</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {['all', 'solved', 'unsolved'].map((stat) => (
                                                                    <button
                                                                        key={stat}
                                                                        onClick={() => setStatusFilter(stat)}
                                                                        className={`px-2 py-1 text-[9px] font-bold rounded uppercase transition-colors ${statusFilter === stat ? 'text-[#080c16] bg-[#4DD4C4]' : 'text-zinc-400 bg-[#080c16] border border-[#202736] hover:text-white hover:bg-[#202736]'}`}
                                                                    >
                                                                        {stat}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {filteredProblems.map((p) => {
                                            const isActive = activeProblemId === p.id;
                                            const dStyle = getDiffStyle(p.difficulty);

                                            if (sidebarCollapsed) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => handleProblemSelect(p.id)}
                                                    className={`flex flex-col gap-2 p-3 rounded border cursor-pointer transition-all group ${isActive ? 'bg-[#4DD4C4]/10 border-[#4DD4C4]/40' : 'bg-[#131924] border-[#202736] hover:border-[#4DD4C4]/30'}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${dStyle.color} ${dStyle.bg} ${dStyle.border}`}>{dStyle.label}</span>
                                                        <CheckCircle2 size={14} className={solvedIds.has(p.id) ? 'text-[#4DD4C4]' : 'text-zinc-600'} />
                                                    </div>
                                                    <div className={`text-sm font-medium transition-colors line-clamp-2 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>{p.title}</div>
                                                </div>
                                            );
                                        })}
                                        {filteredProblems.length === 0 && !sidebarCollapsed && <div className="text-center text-xs text-zinc-500 mt-8">No problems found.</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Streak Footer */}
                        {!sidebarCollapsed && (
                            <div id="tour-streak" className="p-4 border-t border-[#202736] bg-[#0d121c] shrink-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Daily Streak</span>
                                    <span className="text-sm font-bold text-white flex items-center gap-1">
                                        {streak} <Flame size={14} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-[#080c16] rounded-full overflow-hidden border border-[#202736]">
                                    <div
                                        className="h-full bg-[#4DD4C4] shadow-[0_0_10px_rgba(77,212,196,0.5)] transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[9px] text-zinc-500 mt-2 text-center font-medium italic">
                                    {streak >= 30 ? "Monthly goal reached! You're a pro." : `${30 - streak} days until your monthly milestone!`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <Group orientation="horizontal" className="flex-1 h-full overflow-hidden">

                    {/* ── COLUMN 2: PROBLEM DETAILS ── */}
                    <Panel defaultSize="35" minSize="25" maxSize="50" className="flex flex-col bg-[#0d121c] border-r border-[#202736]">
                        {activeProblemId ? (
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                {/* Tab Bar */}
                                <div className="h-[52px] border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0 relative">
                                    <div className="flex items-center gap-2">
                                        {/* Prev / Next navigation */}
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                onClick={handlePrevProblem}
                                                disabled={currentNavIndex <= 0}
                                                title="Previous problem"
                                                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-[#202736] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft size={15} />
                                            </button>
                                            <button
                                                onClick={handleNextProblem}
                                                disabled={currentNavIndex >= navigationList.length - 1}
                                                title="Next problem"
                                                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-[#202736] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex items-center h-full">
                                        <button
                                            onClick={() => setActiveDetailTab('question')}
                                            className={`flex items-center gap-1.5 h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeDetailTab === 'question' ? 'text-white border-[#4DD4C4]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                                        >
                                            Question
                                        </button>
                                        <button
                                            onClick={handleOpenDiscussion}
                                            className={`flex items-center gap-1.5 h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeDetailTab === 'discussion' ? 'text-white border-[#4DD4C4]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                                        >
                                            Discussion
                                            {commentCount > 0 && <span className="ml-1 text-[10px] bg-[#4DD4C4]/15 text-[#4DD4C4] rounded-full px-1.5 font-mono leading-tight">{commentCount}</span>}
                                        </button>
                                    </div>

                                    {/* Action buttons (Share/Vote) */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="flex items-center bg-[#0d121c] border border-[#202736] rounded-md px-1.5 py-1 gap-3">
                                            <div className="relative group">
                                                <button
                                                    onClick={handleVote}
                                                    disabled={isVoting}
                                                    className={`flex items-center gap-1.5 text-xs transition-colors ${problemVotes?.user_has_voted ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-[#4DD4C4]'}`}
                                                >
                                                    <ThumbsUp size={14} fill={problemVotes?.user_has_voted ? 'currentColor' : 'none'} />
                                                    {problemVotes !== null && <span className="font-mono text-[11px] font-bold">{problemVotes.likes}</span>}
                                                </button>
                                                {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to like" />}
                                            </div>

                                            <div className="w-[1px] h-3 bg-[#202736]" />

                                            <div className="relative group">
                                                <button
                                                    onClick={handleDislike}
                                                    className="text-zinc-500 hover:text-red-400 transition-colors"
                                                    title="Dislike / Report Issue"
                                                >
                                                    <ThumbsDown size={14} />
                                                </button>
                                                {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to report" />}
                                            </div>
                                        </div>

                                        <div className="relative" ref={shareDropdownRef}>
                                            <button
                                                onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-[#4DD4C4]/5 border border-[#4DD4C4]/20 rounded-md text-[#4DD4C4] text-[11px] font-bold hover:bg-[#4DD4C4]/10 transition-all shadow-[0_0_15px_rgba(77,212,196,0.05)]"
                                            >
                                                <Share2 size={14} />
                                                <span>Share</span>
                                            </button>

                                            {shareDropdownOpen && (
                                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#131924] border border-[#202736] rounded-xl shadow-2xl overflow-hidden py-1 z-[300]">
                                                    <div className="px-4 py-2 border-b border-[#202736] bg-[#0b101c]">
                                                        <p className="text-[10px] font-bold text-[#4DD4C4] uppercase tracking-wider">Share Question</p>
                                                    </div>
                                                    <div className="p-1">
                                                        <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-[#202736] rounded-lg transition-colors">
                                                            <div className="w-6 h-6 rounded bg-[#1DA1F2]/10 flex items-center justify-center">
                                                                <Twitter size={13} className="text-[#1DA1F2]" />
                                                            </div>
                                                            Twitter
                                                        </button>
                                                        <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-[#202736] rounded-lg transition-colors">
                                                            <div className="w-6 h-6 rounded bg-[#0A66C2]/10 flex items-center justify-center">
                                                                <Linkedin size={13} className="text-[#0A66C2]" />
                                                            </div>
                                                            LinkedIn
                                                        </button>
                                                        <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-[#202736] rounded-lg transition-colors">
                                                            <div className="w-6 h-6 rounded bg-zinc-700/30 flex items-center justify-center">
                                                                <Copy size={13} className="text-zinc-400" />
                                                            </div>
                                                            Copy Link
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                {activeDetailTab === 'question' ? (
                                    <div id="tour-problem-description" className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin scrollbar-thumb-zinc-700">
                                        <div>
                                            {activeProblem && (
                                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-2 ${getDiffStyle(activeProblem.difficulty).color} ${getDiffStyle(activeProblem.difficulty).bg} ${getDiffStyle(activeProblem.difficulty).border}`}>
                                                    {getDiffStyle(activeProblem.difficulty).label}
                                                </span>
                                            )}
                                            <h1 className="text-xl font-bold text-white mb-1 tracking-tight">{activeProblem?.title}</h1>
                                            <div className="flex gap-3 text-xs text-zinc-500 mb-3 font-mono font-medium">
                                                <span className="flex items-center gap-1.5"><Timer size={11} /> {activeProblem?.estimated_time_minutes}m Avg</span>
                                            </div>
                                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Task</h3>
                                            <div className="h-px w-full bg-[#202736] mb-3" />
                                            <div className="text-zinc-400 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{mainDesc}</ReactMarkdown>
                                            </div>
                                        </div>

                                        {!isDsaProblem && (
                                            <div>
                                                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <Database size={11} /> Datasets
                                                </h3>
                                                <div className="h-px w-full bg-[#202736] mb-3" />
                                                {activeDatasets.map((ds, idx) => {
                                                    const colOrder = getColumnOrder(ds.schema_sql, ds.sample_rows[0], ds.seed_data_json);
                                                    return (
                                                        <div key={idx} className="mb-6 last:mb-0 space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-1 bg-[#4DD4C4] rounded-full" />
                                                                <span className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">{ds.table_name}</span>
                                                            </div>

                                                            {/* Schema */}
                                                            <div className="border border-[#202736] rounded-xl overflow-hidden max-w-sm bg-[#080c16] shadow-lg">
                                                                <table className="w-full text-[10px] text-left border-collapse">
                                                                    <thead className="bg-[#131924] text-zinc-400">
                                                                        <tr>
                                                                            <th className="px-4 py-2.5 border-b border-[#202736] font-bold uppercase tracking-wider text-[9px]">Column</th>
                                                                            <th className="px-4 py-2.5 border-b border-[#202736] font-bold uppercase tracking-wider text-[9px]">Type</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-[#202736]/30">
                                                                        {colOrder.map(col => (
                                                                            <tr key={col} className="hover:bg-white/[0.02] transition-colors group">
                                                                                <td className="px-4 py-2 font-mono font-medium text-zinc-300 group-hover:text-[#4DD4C4] transition-colors">{col}</td>
                                                                                <td className="px-4 py-2">
                                                                                    <span className="bg-[#4DD4C4]/5 text-[#4DD4C4]/80 px-1.5 py-0.5 rounded border border-[#4DD4C4]/20 text-[8px] font-bold font-mono uppercase">
                                                                                        {ds.column_types?.[col] || 'string'}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Sample Data */}
                                                            <div className="border border-[#202736] rounded-xl overflow-hidden shadow-2xl bg-[#080c16]">
                                                                <div className="bg-[#131924] px-4 py-2 text-[9px] font-bold text-[#4DD4C4] uppercase tracking-widest border-b border-[#202736] flex items-center justify-between">
                                                                    <span className="flex items-center gap-2">
                                                                        <div className="w-1 h-1 rounded-full bg-[#4DD4C4]" />
                                                                        Sample Rows
                                                                    </span>
                                                                    <span className="text-[8px] text-zinc-500 font-normal">Showing first {ds.sample_rows.length} rows</span>
                                                                </div>
                                                                <div className="overflow-x-auto custom-scrollbar">
                                                                    <table className="w-full text-[10px] text-left border-collapse">
                                                                        <thead className="bg-[#0b101c] text-zinc-500">
                                                                            <tr>
                                                                                {colOrder.map(h => (
                                                                                    <th key={h} className="px-4 py-2.5 border-b border-[#202736] font-mono font-bold text-[9px] uppercase tracking-wider">{h}</th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#202736]/20">
                                                                            {ds.sample_rows.map((row: any, i: number) => (
                                                                                <tr key={i} className="hover:bg-[#4DD4C4]/5 transition-colors group">
                                                                                    {colOrder.map((col: string) => (
                                                                                        <td key={col} className="px-4 py-2.5 text-zinc-400 font-mono group-hover:text-zinc-200 transition-colors">{row[col]?.toString() ?? ''}</td>
                                                                                    ))}
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {!isDsaProblem && (
                                            <div>
                                                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Expected Output</h3>
                                                <div className="h-px w-full bg-[#202736] mb-3" />
                                                {(() => {
                                                    const output = executionResult?.expected || expectedOutput;
                                                    if (output && output.columns.length > 0) {
                                                        return (
                                                            <div className="border border-[#202736] rounded-xl overflow-hidden shadow-lg bg-[#080c16]">
                                                                <div className="overflow-x-auto custom-scrollbar">
                                                                    <table className="w-full text-[10px] text-left border-collapse">
                                                                        <thead className="bg-[#131924] text-zinc-400">
                                                                            <tr>{output.columns.map(h => <th key={h} className="px-4 py-2.5 border-b border-[#202736] font-mono font-bold text-[9px] uppercase tracking-wider">{h}</th>)}</tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#202736]/20">
                                                                            {output.rows.map((row: any, i: number) => (
                                                                                <tr key={i} className="hover:bg-green-400/[0.03] transition-colors group">
                                                                                    {row.map((cell: any, j: number) => <td key={j} className="px-4 py-2.5 text-green-400/80 font-mono group-hover:text-green-400 transition-colors">{cell?.toString()}</td>)}
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return <div className="p-3 bg-[#131924] rounded-lg border border-[#202736] text-xs text-zinc-500 font-mono italic">Loading...</div>;
                                                })()}
                                            </div>
                                        )}

                                        {hintText && (
                                            <div>
                                                <h3
                                                    className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 cursor-pointer hover:text-white transition-colors flex justify-between items-center"
                                                    onClick={() => setShowHint(!showHint)}
                                                >
                                                    <span>Hints</span>
                                                    <span className={`text-[10px] transform transition-transform ${showHint ? 'rotate-180' : ''}`}>&darr;</span>
                                                </h3>
                                                <div className="h-px w-full bg-[#202736] mb-3" />
                                                {showHint && (
                                                    <div className="p-3 bg-[#131924] rounded-lg border border-[#202736] text-zinc-400 text-sm leading-relaxed">
                                                        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{hintText}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Discussion View */
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700">
                                            {isLoadingComments && <div className="flex justify-center pt-8"><Loader2 size={20} className="animate-spin text-[#4DD4C4]" /></div>}
                                            {!isLoadingComments && comments.length === 0 && (
                                                <div className="text-center text-xs text-zinc-500 pt-10 space-y-2">
                                                    <MessageCircle size={28} className="mx-auto text-zinc-700" />
                                                    <p>No comments yet.</p>
                                                </div>
                                            )}
                                            {comments.map(comment => (
                                                <div key={comment.id} className="space-y-2">
                                                    <div className="bg-[#131924] rounded-lg p-3 border border-[#202736]">
                                                        <div className="flex items-start justify-between mb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-[#4DD4C4]/20 flex items-center justify-center text-[10px] font-bold text-[#4DD4C4] shrink-0">{comment.user.initials}</div>
                                                                <div>
                                                                    <span className="text-xs font-semibold text-zinc-300">{comment.user.full_name}</span>
                                                                    <span className="text-[10px] text-zinc-600 ml-2">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            {comment.is_own && (
                                                                <button onClick={() => handleDeleteComment(comment.id)} className="text-zinc-600 hover:text-red-400 transition-colors ml-2 shrink-0"><Trash2 size={12} /></button>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-zinc-300 leading-relaxed prose prose-invert prose-xs">
                                                            <ReactMarkdown components={discussionMarkdownComponents} remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
                                                        </div>
                                                        {authStatus === 'authenticated' && (
                                                            <div className="mt-3 flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={() => handleCommentVote(comment.id, 1)} className={`flex items-center gap-1 text-[10px] transition-colors ${comment.user_vote === 1 ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-[#4DD4C4]'}`}>
                                                                        <ThumbsUp size={12} fill={comment.user_vote === 1 ? 'currentColor' : 'none'} />
                                                                        <span>{comment.likes || 0}</span>
                                                                    </button>
                                                                    <button onClick={() => handleCommentVote(comment.id, -1)} className={`flex items-center gap-1 text-[10px] transition-colors ${comment.user_vote === -1 ? 'text-red-400' : 'text-zinc-500 hover:text-red-400'}`}>
                                                                        <ThumbsDown size={12} fill={comment.user_vote === -1 ? 'currentColor' : 'none'} />
                                                                        <span>{comment.dislikes || 0}</span>
                                                                    </button>
                                                                </div>
                                                                <button onClick={() => setReplyingTo(replyingTo?.id === comment.id ? null : { id: comment.id, userName: comment.user.full_name })} className="text-[10px] text-zinc-500 hover:text-[#4DD4C4] transition-colors flex items-center gap-1"><Reply size={10} /> Reply</button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Reply Input */}
                                                    {replyingTo && replyingTo.id === comment.id && (
                                                        <div className="ml-5 bg-[#080c16] rounded-2xl border border-[#4DD4C4]/20 overflow-hidden mb-4">
                                                            <div
                                                                className="h-[52px] px-4 border-b border-[#202736] flex items-center justify-between bg-[#0d121c]/50 cursor-row-resize select-none"
                                                                onMouseDown={handleReplyResizeStart}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setIsReplyPreview(false); }}
                                                                        className={`text-[9px] font-bold uppercase tracking-widest transition-colors relative py-1 ${!isReplyPreview ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                                    >
                                                                        Write
                                                                        {!isReplyPreview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DD4C4]" />}
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setIsReplyPreview(true); }}
                                                                        className={`text-[9px] font-bold uppercase tracking-widest transition-colors relative py-1 ${isReplyPreview ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                                    >
                                                                        Preview
                                                                        {isReplyPreview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DD4C4]" />}
                                                                    </button>
                                                                </div>
                                                                <span className="text-[9px] font-bold text-zinc-500 uppercase">Reply to {replyingTo?.userName}</span>
                                                                <button onClick={(e) => { e.stopPropagation(); setReplyingTo(null); }} className="text-zinc-500 hover:text-white"><X size={12} /></button>
                                                            </div>
                                                            <div className="flex items-end gap-2 p-2">
                                                                <div className="flex-1 relative bg-[#080c16] rounded-2xl border border-[#4DD4C4]/20 overflow-hidden">
                                                                    {!isReplyPreview ? (
                                                                        <textarea
                                                                            value={replyText}
                                                                            onChange={e => setReplyText(e.target.value)}
                                                                            placeholder="Write a reply..."
                                                                            className="w-full bg-transparent p-4 text-[11px] text-zinc-300 outline-none resize-none font-sans"
                                                                            style={{ height: replyEditorHeight }}
                                                                            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePostReply(comment.id); }}
                                                                        />
                                                                    ) : (
                                                                        <div className="p-4 text-[11px] text-zinc-300 overflow-y-auto scrollbar-thin" style={{ height: replyEditorHeight }}>
                                                                            {replyText ? (
                                                                                <ReactMarkdown components={discussionMarkdownComponents} remarkPlugins={[remarkGfm]}>{replyText}</ReactMarkdown>
                                                                            ) : (
                                                                                <span className="text-zinc-600 italic">Nothing to preview</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => handlePostReply(comment.id)}
                                                                    className="text-zinc-600 hover:text-[#4DD4C4] transition-colors p-1.5 shrink-0 mb-1"
                                                                >
                                                                    <Send size={15} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {comment.replies?.map((reply: any) => (
                                                        <div key={reply.id} className="ml-5 bg-[#0b101c] rounded-lg p-3 border border-[#202736]/60">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-5 h-5 rounded-full bg-[#4DD4C4]/10 flex items-center justify-center text-[9px] font-bold text-[#4DD4C4] shrink-0">{reply.user.initials}</div>
                                                                    <span className="text-[11px] font-semibold text-zinc-400">{reply.user.full_name}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-[11px] text-zinc-400 leading-relaxed">
                                                                <ReactMarkdown components={discussionMarkdownComponents} remarkPlugins={[remarkGfm]}>{reply.body}</ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Resize Handle Separator */}
                                        <div
                                            className="h-[1px] w-full bg-[#202736] hover:bg-[#4DD4C4]/50 cursor-row-resize transition-colors relative shrink-0"
                                            onMouseDown={handleCommentResizeStart}
                                        >
                                            <div className="absolute -top-2 -bottom-2 left-0 right-0 z-10" />
                                        </div>
                                        <div className="p-4 bg-[#0d121c] shrink-0">
                                            {authStatus === 'authenticated' ? (
                                                <div className="flex flex-col">


                                                    {/* Tabs Bar */}
                                                    <div className="flex items-center gap-6 mb-3 px-1 select-none">
                                                        <button
                                                            onClick={() => setIsCommentPreview(false)}
                                                            className={`text-[10px] font-bold uppercase tracking-widest transition-colors relative py-1 ${!isCommentPreview ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            Write
                                                            {!isCommentPreview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DD4C4]" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setIsCommentPreview(true)}
                                                            className={`text-[10px] font-bold uppercase tracking-widest transition-colors relative py-1 ${isCommentPreview ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            Preview
                                                            {isCommentPreview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DD4C4]" />}
                                                        </button>
                                                    </div>

                                                    <div className="flex items-end gap-2">
                                                        <div className="flex-1 relative bg-[#080c16] rounded-2xl border border-[#202736] overflow-hidden group focus-within:border-[#4DD4C4]/30 transition-all">
                                                            {!isCommentPreview ? (
                                                                <textarea
                                                                    value={newComment}
                                                                    onChange={e => setNewComment(e.target.value)}
                                                                    placeholder="Add to discussion..."
                                                                    className="w-full bg-transparent p-5 text-[12px] text-zinc-300 outline-none resize-none font-sans"
                                                                    style={{ height: commentEditorHeight }}
                                                                    onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePostComment(); }}
                                                                />
                                                            ) : (
                                                                <div className="p-5 text-[12px] text-zinc-300 overflow-y-auto scrollbar-thin" style={{ height: commentEditorHeight }}>
                                                                    {newComment ? (
                                                                        <ReactMarkdown components={discussionMarkdownComponents} remarkPlugins={[remarkGfm]}>{newComment}</ReactMarkdown>
                                                                    ) : (
                                                                        <span className="text-zinc-600 italic">Nothing to preview</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={handlePostComment}
                                                            className="text-zinc-600 hover:text-[#4DD4C4] transition-colors p-1.5 shrink-0 mb-2"
                                                            title="Ctrl + Enter to send"
                                                        >
                                                            <Send size={18} />
                                                        </button>
                                                    </div>

                                                    <div className="mt-2 px-1">
                                                        <p className="text-[10px] text-zinc-500">
                                                            Supports markdown. <span className="font-bold">Ctrl + Enter</span> to send.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-2 flex flex-col justify-center h-full">
                                                    <p className="text-xs text-zinc-500">Sign in to join the discussion</p>
                                                    <div className="flex gap-2 justify-center">
                                                        <Link href="/login" className="px-4 py-1.5 bg-[#4DD4C4] text-[#080c16] rounded text-xs font-bold hover:bg-[#3dbdb0] transition-colors">Log In</Link>
                                                        <Link href="/signup" className="px-4 py-1.5 bg-[#131924] border border-[#202736] text-white rounded text-xs font-bold hover:bg-[#202736] transition-colors">Sign Up</Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#131924] border border-[#202736] flex items-center justify-center">
                                    <Database size={24} className="text-[#4DD4C4]/50" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">No Problem Selected</p>
                                    <p className="text-xs leading-relaxed max-w-[200px]">Choose a question from the sidebar to view details and start practice.</p>
                                </div>
                            </div>
                        )}
                    </Panel>

                    {/* Resize Handle */}
                    <Separator className="w-1.5 bg-[#080c16] hover:bg-[#4DD4C4]/20 transition-colors cursor-col-resize flex flex-col items-center justify-center relative">
                        <div className="h-8 w-0.5 bg-[#202736] rounded-full" />
                    </Separator>

                    {/* ── RIGHT PANE: Editor + Output ── */}
                    <Panel minSize="30" className="flex flex-col bg-[#0b101c]">
                        {/* Editor toolbar */}
                        <div className="h-[52px] border-b border-[#202736] bg-[#131924] flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Language / dialect label */}
                                {!isDualDialect && (
                                    <span className="text-xs font-mono font-medium text-[#4DD4C4] flex items-center gap-2">
                                        <span className="text-zinc-500">&gt;_</span>
                                        {activeProblem?.challenge_type === 'python' ? 'Python (Pandas)' : activeProblem?.challenge_type === 'pyspark' ? 'PySpark' : activeProblem?.challenge_type === 'sql' ? 'PostgreSQL' : 'SQL'}
                                    </span>
                                )}

                                {/* Dialect toggle — only shown for dual-dialect SQL problems */}
                                {isDualDialect && (
                                    <div className="flex items-center gap-1 bg-[#0b101c] border border-[#202736] rounded-lg p-0.5">
                                        {(['postgresql', 'mysql'] as const).map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setSqlDialect(d)}
                                                title={d === 'postgresql' ? 'Run with PostgreSQL' : 'Run with MySQL'}
                                                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all duration-150 ${
                                                    sqlDialect === d
                                                        ? 'bg-[#4DD4C4]/15 text-[#4DD4C4] border border-[#4DD4C4]/30'
                                                        : 'text-zinc-500 hover:text-zinc-300'
                                                }`}
                                            >
                                                {d === 'postgresql' ? 'PostgreSQL' : 'MySQL'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-zinc-400">
                                <button
                                    onClick={() => {
                                        setCode('');
                                        if (activeProblemId) {
                                            localStorage.removeItem(`draft_query_${activeProblemId}`);
                                        }
                                    }}
                                    className="hover:text-zinc-200 transition-colors"
                                    title="Clear Code"
                                >
                                    <Undo size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Monaco */}
                        <div id="tour-code-editor" className="flex-1 relative overflow-hidden bg-[#0b101c]">
                            <Editor
                                height="100%"
                                language={activeProblem?.challenge_type === 'sql' ? 'sql' : 'python'}
                                theme="dailySqlTheme"
                                value={code}
                                onChange={(val) => {
                                    const newCode = val || "";
                                    setCode(newCode);
                                    if (activeProblemId) {
                                        localStorage.setItem(`draft_query_${activeProblemId}`, newCode);
                                    }
                                }}
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
                            <div className="absolute right-16 bottom-3 text-[10px] text-zinc-500 font-mono pointer-events-none px-2 py-1 rounded">
                                Ln {cursorPos.lineNumber}, Col {cursorPos.column}
                            </div>

                            {/* ══ Relocated Feedback FAB ══ */}
                            <button
                                onClick={() => openFeedbackModal('fab')}
                                title="Send Feedback"
                                className="absolute bottom-3 right-6 z-[30] w-8 h-8 rounded-full bg-[#131924] border border-[#202736] text-zinc-400 hover:text-[#4DD4C4] hover:border-[#4DD4C4]/50 transition-all shadow-lg flex items-center justify-center group"
                            >
                                <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Output panel with resizable drag handle */}
                        {showResult && (
                            <>
                                {/* Drag handle for resizing output */}
                                <div
                                    className="h-1.5 bg-[#080c16] hover:bg-[#4DD4C4]/20 transition-colors cursor-row-resize flex items-center justify-center shrink-0 border-t border-[#202736]"
                                    onMouseDown={handleOutputResizeStart}
                                >
                                    <div className="w-8 h-0.5 bg-[#202736] rounded-full" />
                                </div>

                                <div className="flex flex-col bg-[#0d121c] shrink-0 overflow-hidden" style={{ height: outputHeight }}>
                                    <div className="h-10 border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0">
                                        {isDsaProblem ? (
                                            <div className="flex items-center h-full">
                                                <button
                                                    onClick={() => setActiveOutputTab('test')}
                                                    className={`h-full px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-all ${activeOutputTab === 'test'
                                                            ? 'border-[#4DD4C4] text-[#4DD4C4] bg-[#4DD4C4]/5'
                                                            : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                                        }`}
                                                >
                                                    <TerminalSquare size={13} /> Test Results
                                                </button>
                                                <button
                                                    onClick={() => setActiveOutputTab('submit')}
                                                    className={`h-full px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-all ${activeOutputTab === 'submit'
                                                            ? 'border-[#4DD4C4] text-[#4DD4C4] bg-[#4DD4C4]/5'
                                                            : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                                        }`}
                                                >
                                                    <Sparkles size={13} /> Submission
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                                                <TerminalSquare size={14} /> Query Output
                                            </span>
                                        )}
                                        <span className={`text-xs font-bold font-mono flex items-center gap-1.5 ${isDsaProblem ? (
                                                activeOutputTab === 'test' ? (
                                                    executionResult?.test_summary
                                                        ? (executionResult.test_summary.results.filter(r => !r.is_hidden).every(r => r.passed) ? 'text-green-400' : 'text-red-400')
                                                        : 'text-zinc-400'
                                                ) : (
                                                    executionResult && executionResult.status !== 'run_result'
                                                        ? (executionResult.status === 'correct' ? 'text-green-400' : 'text-red-400')
                                                        : 'text-zinc-400'
                                                )
                                            ) : (
                                                executionResult?.status === 'correct' ? 'text-green-400' :
                                                    executionResult?.status === 'incorrect' ? 'text-red-400' : 'text-zinc-400'
                                            )
                                            }`}>
                                            {isDsaProblem ? (
                                                activeOutputTab === 'test' ? (
                                                    executionResult?.test_summary ? (
                                                        executionResult.test_summary.results.filter(r => !r.is_hidden).every(r => r.passed)
                                                            ? <><CheckCircle2 size={14} /> All Samples Passed</>
                                                            : <><XCircle size={14} /> Samples Failed</>
                                                    ) : isRunning ? "Executing..." : "Ready"
                                                ) : (
                                                    executionResult && executionResult.status !== 'run_result' ? (
                                                        executionResult.status === 'correct'
                                                            ? <><CheckCircle2 size={14} /> Submission Accepted</>
                                                            : <><XCircle size={14} /> Submission Failed</>
                                                    ) : isRunning ? "Executing..." : "No Submission"
                                                )
                                            ) : (
                                                executionResult?.status === 'correct' ? <><CheckCircle2 size={14} /> Success ({executionResult.user?.execution_time_ms}ms)</> :
                                                    executionResult?.status === 'incorrect' ? <><XCircle size={14} /> Incorrect Result</> :
                                                        error ? <><AlertCircle size={14} /> Execution Error</> :
                                                            "Executing..."
                                            )}
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
                                        ) : isDsaProblem && executionResult?.test_summary ? (
                                            renderDsaPanel()
                                        ) : executionResult?.user ? (
                                            <div className="rounded-xl border border-[#202736] overflow-hidden bg-[#080c16] shadow-2xl">
                                                <div className="overflow-x-auto custom-scrollbar">
                                                    <table className="w-full text-left text-[10px] border-collapse">
                                                        <thead className="bg-[#131924] text-zinc-400">
                                                            <tr>
                                                                {executionResult.user.columns.map((k: string) => (
                                                                    <th key={k} className="px-4 py-2.5 border-b border-[#202736] font-mono font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">{k}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-[#202736]/20">
                                                            {executionResult.user.rows.map((row: any[], i: number) => (
                                                                <tr key={i} className="hover:bg-[#4DD4C4]/5 transition-colors group">
                                                                    {row.map((cell: any, j: number) => (
                                                                        <td key={j} className="px-4 py-2.5 text-zinc-300 font-mono group-hover:text-white transition-colors whitespace-nowrap">{cell?.toString()}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
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
                                            {!isDsaProblem && (
                                                <button
                                                    onClick={() => setShowHint(!showHint)}
                                                    className="cursor-pointer hover:text-zinc-300 transition-colors"
                                                >
                                                    Hint
                                                </button>
                                            )}
                                        </div>
                                        {isDsaProblem ? (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!activeProblemId || isRunning}
                                                className={`px-6 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${!activeProblemId || isRunning
                                                        ? 'bg-[#18212f] text-zinc-500 cursor-not-allowed border border-[#202736]'
                                                        : 'bg-[#4DD4C4] text-[#080C16] hover:bg-[#3dbdb0] shadow-[0_0_10px_rgba(77,212,196,0.2)]'
                                                    }`}
                                            >
                                                {isRunning ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                                                SUBMIT ALL
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={executionResult?.status !== 'correct'}
                                                className={`px-6 py-2 rounded text-xs font-bold transition-all ${executionResult?.status === 'correct' ? 'bg-[#4DD4C4] text-[#080C16] hover:bg-[#3dbdb0] shadow-[0_0_10px_rgba(77,212,196,0.2)]' : 'bg-[#18212f] text-zinc-500 cursor-not-allowed border border-[#202736]'}`}
                                            >
                                                SUBMIT
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </Panel>
                </Group>
            </div>




            {/* ══ Feedback Modal ══ */}
            {feedbackOpen && (
                <div className="absolute inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0d121c] border border-[#202736] rounded-xl p-6 w-80 shadow-2xl space-y-4">
                        {feedbackSuccess ? (
                            <div className="text-center py-4 space-y-3">
                                <CheckCircle2 size={36} className="text-[#4DD4C4] mx-auto" />
                                <p className="text-white font-semibold">Thanks for your feedback!</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white">Send Feedback</h3>
                                    <button onClick={() => setFeedbackOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 mb-2">How&apos;s your experience?</p>
                                    <div className="flex gap-2">
                                        {[{ v: 1, label: 'Bad' }, { v: 2, label: 'Okay' }, { v: 3, label: 'Great' }].map(({ v, label }) => (
                                            <button
                                                key={v}
                                                onClick={() => setFeedbackRating(feedbackRating === v ? null : v)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${feedbackRating === v ? 'bg-[#4DD4C4]/20 border-[#4DD4C4] text-[#4DD4C4]' : 'bg-[#131924] border-[#202736] text-zinc-400 hover:border-zinc-500'}`}
                                            >{label}</button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    value={feedbackMessage}
                                    onChange={e => setFeedbackMessage(e.target.value)}
                                    placeholder="Tell us more (optional)..."
                                    rows={3}
                                    className="w-full bg-[#0b101c] border border-[#202736] rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-[#4DD4C4]/50 resize-none"
                                />
                                <button
                                    onClick={handleSubmitFeedback}
                                    disabled={feedbackSubmitting || (!feedbackRating && !feedbackMessage.trim())}
                                    className="w-full py-2 bg-[#4DD4C4] text-[#080c16] rounded-lg text-xs font-bold hover:bg-[#3dbdb0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {feedbackSubmitting && <Loader2 size={13} className="animate-spin" />}
                                    Submit Feedback
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ══ Submission Toast ══ */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-[#0d121c] border-2 border-[#4DD4C4]/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(77,212,196,0.3)] flex items-center gap-4 min-w-[300px] backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="text-[#4DD4C4] animate-pulse" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-sm">{toast.message}</h3>
                            {toast.subMessage && <p className="text-[#4DD4C4] text-xs font-mono mt-0.5">{toast.subMessage}</p>}
                        </div>
                        <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Walkthrough Tour Overlay */}
            <WalkthroughTour
                steps={PRACTICE_TOUR_STEPS}
                isActive={tourActive}
                onComplete={completeTour}
                onSkip={skipTour}
            />
        </div>
    );
}
