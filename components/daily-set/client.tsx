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
    Info
} from "lucide-react";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel, Group, Separator } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from "@/lib/api";
import { Problem, DailyPractice, Dataset, ExecutionResponse } from "@/types/api";

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
    const [stats, setStats] = useState<any>(null);
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
    const [toast, setToast] = useState<{ message: string; subMessage?: string; visible: boolean } | null>(null);

    // ── Drill-down State ─────────────────────────────────
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [viewingDetails, setViewingDetails] = useState<boolean>(false);
    const [activeDatasets, setActiveDatasets] = useState<Dataset[]>([]);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [expectedOutput, setExpectedOutput] = useState<{ columns: string[]; rows: any[][] } | null>(null);

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
    const [isFullscreen, setIsFullscreen] = useState(false);

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
    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
        return matchesSearch && matchesDifficulty;
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
            // Reset + lazy-load votes and comment count
            setProblemVotes(null);
            setProblemVotes(null);
            setCommentCount(0);
            setActiveDetailTab('question');
            setComments([]);
            api.getProblemVotes(id).then(v => setProblemVotes(v)).catch(() => setProblemVotes({ likes: 0, user_has_voted: false }));
            api.getCommentCount(id).then(({ count }) => setCommentCount(count)).catch(() => setCommentCount(0));
        } catch (err) {
            console.error("Failed to load datasets", err);
        }
    };

    const handleBackToList = () => setViewingDetails(false);

    // ── Today's Set ordered list for navigation ──────────────
    const todaysProblemIds = (['easy', 'medium', 'advanced'] as const)
        .map(level => dailySet?.[level as keyof DailyPractice] as string | undefined)
        .filter((id): id is string => !!id && problems.some(p => p.id === id));

    const navigationList = activeSidebarTab === 'today' ? todaysProblemIds : filteredProblems.map(p => p.id);
    const currentNavIndex = activeProblemId ? navigationList.indexOf(activeProblemId) : -1;

    const handlePrevProblem = () => {
        if (currentNavIndex > 0) handleProblemSelect(navigationList[currentNavIndex - 1]);
    };

    const handleNextProblem = () => {
        if (currentNavIndex < navigationList.length - 1) handleProblemSelect(navigationList[currentNavIndex + 1]);
    };

    const handleRun = async () => {
        if (!activeProblemId) return;
        if (authStatus === 'unauthenticated') { setError("LOGIN_REQUIRED"); return; }
        if (userProfile && !userProfile.exists) { setError("PROFILE_REQUIRED"); return; }
        setIsRunning(true);
        setError(null);
        setShowResult(true);
        setOutputHeight(280); // Reset to default height to ensure visibility
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

    const handleSubmit = async () => {
        if (authStatus === 'unauthenticated') { setError("LOGIN_REQUIRED"); return; }
        if (userProfile && !userProfile.exists) { setError("PROFILE_REQUIRED"); return; }
        if (executionResult?.status === 'correct') {
            try {
                const s = await api.getStreak();
                const newStreak = s.current_streak;
                const prevStreak = streak;
                setStreak(newStreak);
                
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
        if (authStatus === 'unauthenticated') { setError('LOGIN_REQUIRED'); setShowResult(true); return; }
        setActiveDetailTab('discussion');
        if (!activeProblemId || comments.length > 0) return;
        setIsLoadingComments(true);
        try {
            const data = await api.getComments(activeProblemId);
            setComments(data);
        } catch (e) { console.error(e); }
        finally { setIsLoadingComments(false); }
    };

    const handlePostComment = async () => {
        if (!activeProblemId || !newComment.trim() || newComment === SQL_TEMPLATE) return;
        try {
            const c = await api.postComment(activeProblemId, newComment.trim());
            setComments(prev => [...prev, c]);
            setCommentCount(n => n + 1);
            setNewComment(SQL_TEMPLATE);
        } catch (e) { console.error(e); }
    };

    const handlePostReply = async (parentId: string) => {
        if (!activeProblemId || !replyText.trim() || replyText === SQL_TEMPLATE) return;
        try {
            const c = await api.postComment(activeProblemId, replyText.trim(), parentId);
            setComments(prev => prev.map(com =>
                com.id === parentId ? { ...com, replies: [...(com.replies || []), c], reply_count: (com.reply_count || 0) + 1 } : com
            ));
            setReplyingTo(null);
            setReplyText(SQL_TEMPLATE);
        } catch (e) { console.error(e); }
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
                    <span className="text-base font-bold text-white">
                        DailySQL
                    </span>
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
                                            {(() => {
                                                const sEasy = stats?.easy?.solved || 0;
                                                const sMed = stats?.medium?.solved || 0;
                                                const sAdv = stats?.advanced?.solved || 0;
                                                const tEasy = stats?.easy?.total || 0;
                                                const tMed = stats?.medium?.total || 0;
                                                const tAdv = stats?.advanced?.total || 0;
                                                
                                                const totalSolved = sEasy + sMed + sAdv;
                                                const totalQuestions = tEasy + tMed + tAdv || 1;
                                                const percentage = Math.round((totalSolved / totalQuestions) * 100);
                                                const strokeDash = Math.round((percentage / 100) * 100); // 100 is the circumference for 15.9155 radius

                                                return (
                                                    <>
                                                        <div className="w-16 h-16 rounded-full border-2 border-[#202736] flex items-center justify-center relative shadow-[0_0_15px_rgba(77,212,196,0.1)]">
                                                            <svg className="w-16 h-16 absolute -rotate-90" viewBox="0 0 36 36">
                                                                <path className="text-[#202736]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                                <path 
                                                                    className="text-[#4DD4C4] transition-all duration-1000 ease-out" 
                                                                    strokeDasharray={`${strokeDash}, 100`} 
                                                                    strokeWidth="3" 
                                                                    strokeLinecap="round" 
                                                                    stroke="currentColor" 
                                                                    fill="none" 
                                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                                                />
                                                            </svg>
                                                            <span className="text-sm text-white font-bold">{percentage}%</span>
                                                        </div>
                                                        <span className="text-xs text-zinc-400 font-medium font-mono">{totalSolved}/{totalQuestions} Solved</span>
                                                    </>
                                                );
                                            })()}
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
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
                                                    className={`p-2 border rounded transition-colors ${difficultyFilter !== 'all' ? 'bg-[#4DD4C4]/10 border-[#4DD4C4]/30 text-[#4DD4C4]' : 'bg-[#131924] border-[#202736] text-[#4DD4C4] hover:bg-[#1a2230]'}`}
                                                >
                                                    <Filter size={14} />
                                                </button>
                                                {showDifficultyFilter && (
                                                    <div className="absolute top-full right-0 mt-1.5 w-32 bg-[#131924] border border-[#202736] rounded-lg overflow-hidden py-1 z-[300] shadow-xl">
                                                        {['all', 'easy', 'medium', 'advanced'].map((lvl) => (
                                                            <button
                                                                key={lvl}
                                                                onClick={() => { setDifficultyFilter(lvl); setShowDifficultyFilter(false); }}
                                                                className={`w-full text-left px-4 py-2 text-xs font-bold uppercase transition-colors ${difficultyFilter === lvl ? 'text-[#4DD4C4] bg-[#4DD4C4]/5' : 'text-zinc-400 hover:text-white hover:bg-[#202736]'}`}
                                                            >
                                                                {lvl}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
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
                                {/* ── Tab Bar ── */}
                                <div className="h-11 border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0 relative">
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleBackToList} className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors shrink-0">
                                            <ArrowLeft size={14} /> Back
                                        </button>
                                        {/* Prev / Next navigation */}
                                        <div className="flex items-center border-l border-[#202736] ml-1 pl-2 gap-0.5">
                                            <button
                                                onClick={handlePrevProblem}
                                                disabled={currentNavIndex <= 0}
                                                title="Previous problem"
                                                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-[#202736] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft size={15} />
                                            </button>
                                            <span className="text-[10px] font-mono text-zinc-600 tabular-nums px-1">
                                                {currentNavIndex >= 0 ? `${currentNavIndex + 1}/${navigationList.length}` : ''}
                                            </span>
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
                                    
                                    {/* Center tabs */}
                                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full">
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
                                            <MessageSquare size={12} />
                                            Discussion
                                            {commentCount > 0 && <span className="ml-1 text-[10px] bg-[#4DD4C4]/15 text-[#4DD4C4] rounded-full px-1.5 font-mono leading-tight">{commentCount}</span>}
                                        </button>
                                    </div>

                                    {/* Right: vote buttons */}
                                    <div className="flex items-center gap-2.5 shrink-0">
                                        <div className="relative group">
                                            <button 
                                                onClick={handleVote}
                                                disabled={isVoting}
                                                className={`flex items-center gap-1 text-xs transition-colors ${problemVotes?.user_has_voted ? 'text-[#4DD4C4]' : 'text-zinc-500 hover:text-[#4DD4C4]'}`}
                                            >
                                                <ThumbsUp size={13} fill={problemVotes?.user_has_voted ? 'currentColor' : 'none'} />
                                                {problemVotes !== null && <span className="font-mono text-[11px]">{problemVotes.likes}</span>}
                                            </button>
                                            {authStatus === 'unauthenticated' && <LoginTooltip text="Sign in to like" />}
                                        </div>
                                        <button 
                                            onClick={() => openFeedbackModal('dislike', activeProblemId || undefined)}
                                            title="Send feedback"
                                            className="text-zinc-500 hover:text-amber-400 transition-colors"
                                        >
                                            <ThumbsDown size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* ── Tab Content ── */}
                                {activeDetailTab === 'question' ? (
                                    <div className="flex-1 overflow-y-auto p-5 space-y-8">
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
                                            <div className="text-zinc-400 text-sm leading-relaxed">
                                                <ReactMarkdown components={markdownComponents}>{mainDesc}</ReactMarkdown>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <Database size={11} /> Datasets
                                            </h3>
                                            <div className="h-px w-full bg-[#202736] mb-3" />
                                            {activeDatasets.length === 0 && <span className="text-xs text-zinc-600 font-mono italic">No datasets available</span>}
                                            {activeDatasets.map((ds, idx) => {
                                                const colOrder = getColumnOrder(ds.schema_sql, ds.sample_rows[0]);
                                                return (
                                                <div key={idx} className="mb-6 last:mb-0 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-1 bg-[#4DD4C4] rounded-full" />
                                                        <span className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">{ds.table_name}</span>
                                                    </div>

                                                    {/* Schema Table */}
                                                    <div className="border border-[#202736] rounded-lg overflow-hidden max-w-sm">
                                                        <table className="w-full text-[11px] text-left">
                                                            <thead className="bg-[#131924] text-zinc-400">
                                                                <tr>
                                                                    <th className="px-3 py-1.5 border-b border-[#202736] font-semibold uppercase tracking-wider">Column Name</th>
                                                                    <th className="px-3 py-1.5 border-b border-[#202736] font-semibold uppercase tracking-wider">Type</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-[#0b101c]">
                                                                {colOrder.map(col => (
                                                                    <tr key={col} className="border-b border-[#202736]/50 last:border-0 text-zinc-400 font-mono hover:bg-white/[0.02]">
                                                                        <td className="px-3 py-1.5 font-medium">{col}</td>
                                                                        <td className="px-3 py-1.5 text-[#4DD4C4]/80">{ds.column_types?.[col] || 'string'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Sample Data Table */}
                                                    <div className="border border-[#202736] rounded-lg overflow-hidden shadow-xl">
                                                        <div className="bg-[#131924]/50 px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-[#202736]">
                                                            Sample Rows
                                                        </div>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-[11px] text-left">
                                                                <thead className="bg-[#0b101c] text-zinc-500">
                                                                    <tr>
                                                                        {colOrder.map(h => (
                                                                            <th key={h} className="px-3 py-1.5 border-b border-[#202736] font-mono">{h}</th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-[#0b101c]">
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
                                                </div>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Expected Output</h3>
                                            <div className="h-px w-full bg-[#202736] mb-3" />
                                            {(() => {
                                                const output = executionResult?.expected || expectedOutput;
                                                if (output && output.columns.length > 0) {
                                                    return (
                                                        <div className="border border-[#202736] rounded-lg overflow-hidden mb-3">
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
                                                return <div className="p-3 bg-[#131924] rounded-lg border border-[#202736] text-xs text-zinc-500 font-mono italic">Loading expected output...</div>;
                                            })()}
                                        </div>

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
                                                    <div className="p-3 bg-[#131924] rounded-lg border border-[#202736] text-zinc-400 text-sm leading-relaxed mb-3">
                                                        <ReactMarkdown components={markdownComponents}>{hintText}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* ── Discussion List View ── */
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                            {isLoadingComments && <div className="flex justify-center pt-8"><Loader2 size={20} className="animate-spin text-[#4DD4C4]" /></div>}
                                            {!isLoadingComments && comments.length === 0 && (
                                                <div className="text-center text-xs text-zinc-500 pt-10 space-y-2">
                                                    <MessageCircle size={28} className="mx-auto text-zinc-700" />
                                                    <p>No comments yet. Start the discussion!</p>
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
                                                        <div className="text-xs text-zinc-300 leading-relaxed">
                                                            <ReactMarkdown components={discussionMarkdownComponents}>{comment.body}</ReactMarkdown>
                                                        </div>
                                                        {authStatus === 'authenticated' && (
                                                            <button 
                                                                onClick={() => setReplyingTo(replyingTo?.id === comment.id ? null : { id: comment.id, userName: comment.user.full_name })}
                                                                className="mt-2 text-[10px] text-zinc-500 hover:text-[#4DD4C4] transition-colors flex items-center gap-1"
                                                            ><Reply size={10} /> Reply</button>
                                                        )}
                                                    </div>
                                                    
                                                    {comment.replies?.map((reply: any) => (
                                                        <div key={reply.id} className="ml-5 bg-[#0b101c] rounded-lg p-3 border border-[#202736]/60">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-5 h-5 rounded-full bg-[#4DD4C4]/10 flex items-center justify-center text-[9px] font-bold text-[#4DD4C4] shrink-0">{reply.user.initials}</div>
                                                                    <span className="text-[11px] font-semibold text-zinc-400">{reply.user.full_name}</span>
                                                                    <span className="text-[9px] text-zinc-600">{new Date(reply.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                                {reply.is_own && (
                                                                    <button onClick={() => handleDeleteComment(reply.id, comment.id)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"><Trash2 size={11} /></button>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-zinc-400 leading-relaxed">
                                                                <ReactMarkdown components={discussionMarkdownComponents}>{reply.body}</ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {replyingTo?.id === comment.id && (
                                                        <div className="ml-5 space-y-2">
                                                            <div className="flex items-center gap-4 px-1 border-b border-[#202736]/60">
                                                                <button onClick={() => setIsReplyPreview(false)} className={`text-[10px] pb-1 border-b font-medium transition-colors ${!isReplyPreview ? 'text-[#4DD4C4] border-[#4DD4C4]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>Write</button>
                                                                <button onClick={() => setIsReplyPreview(true)} className={`text-[10px] pb-1 border-b font-medium transition-colors ${isReplyPreview ? 'text-[#4DD4C4] border-[#4DD4C4]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>Preview</button>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {isReplyPreview ? (
                                                                    <div className="flex-1 bg-[#0b101c] border border-[#202736] rounded-xl p-3 min-h-[60px] text-zinc-300 text-[11px] overflow-auto">
                                                                        {replyText.trim() ? <ReactMarkdown components={discussionMarkdownComponents}>{replyText}</ReactMarkdown> : <span className="text-zinc-600 italic">Nothing to preview...</span>}
                                                                    </div>
                                                                ) : (
                                                                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={`Reply to ${replyingTo?.userName ?? ''}...`} rows={5} className="flex-1 bg-[#0b101c] border border-[#202736] rounded-xl px-3 py-2 text-[11px] text-zinc-300 outline-none focus:border-[#4DD4C4]/50 resize-none" onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handlePostReply(comment.id); } }} />
                                                                )}
                                                                <div className="flex flex-col justify-end">
                                                                    <button onClick={() => handlePostReply(comment.id)} className="text-[#4DD4C4] hover:text-white transition-colors px-2 pb-2"><Send size={15} /></button>
                                                                </div>
                                                            </div>
                                                            <p className="text-[9px] text-zinc-600 italic px-1">Supports markdown. <span className="text-zinc-500 font-medium font-sans">Ctrl+Enter</span></p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-[#202736] p-3 shrink-0 bg-[#0b101c]">
                                            {authStatus === 'authenticated' ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-4 px-1 border-b border-[#202736]/60">
                                                        <button onClick={() => setIsCommentPreview(false)} className={`text-[10px] pb-1 border-b font-medium uppercase tracking-wider transition-colors ${!isCommentPreview ? 'text-[#4DD4C4] border-[#4DD4C4]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>Write</button>
                                                        <button onClick={() => setIsCommentPreview(true)} className={`text-[10px] pb-1 border-b font-medium uppercase tracking-wider transition-colors ${isCommentPreview ? 'text-[#4DD4C4] border-[#4DD4C4]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>Preview</button>
                                                    </div>
                                                    <div className="flex gap-2 items-end">
                                                        {isCommentPreview ? (
                                                            <div className="flex-1 bg-[#131924] border border-[#202736] rounded-xl px-3 py-3 min-h-[72px] text-zinc-300 text-xs overflow-auto">
                                                                {newComment.trim() ? <ReactMarkdown components={discussionMarkdownComponents}>{newComment}</ReactMarkdown> : <span className="text-zinc-600 italic">Nothing to preview...</span>}
                                                            </div>
                                                        ) : (
                                                            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment... (use ```sql for code blocks)" rows={6} className="flex-1 bg-[#131924] border border-[#202736] rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#4DD4C4]/50 resize-none" onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handlePostComment(); } }} />
                                                        )}
                                                        <button onClick={handlePostComment} disabled={!newComment.trim() || newComment === SQL_TEMPLATE} className="text-[#4DD4C4] hover:text-white transition-colors disabled:text-zinc-800 px-2 pb-2" title={isCommentPreview ? "Post Comment" : "Ctrl+Enter to post"}>
                                                            <Send size={18} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-zinc-600 px-1">Supports markdown. <span className="text-zinc-500 font-medium">Ctrl+Enter</span> to send.</p>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-2">
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
                        )}
                    </Panel>

                    {/* Resize Handle */}
                    <Separator className="w-1.5 bg-[#080c16] hover:bg-[#4DD4C4]/20 transition-colors cursor-col-resize flex flex-col items-center justify-center relative">
                        <div className="h-8 w-0.5 bg-[#202736] rounded-full" />
                    </Separator>

                    {/* ── RIGHT PANE: Editor + Output ── */}
                    <Panel minSize="30" className="flex flex-col bg-[#0b101c]">
                        {/* Editor toolbar */}
                        <div className="h-11 border-b border-[#202736] bg-[#131924] flex items-center justify-between px-4 shrink-0">
                            <span className="text-xs font-mono font-medium text-[#4DD4C4] flex items-center gap-2">
                                <span className="text-zinc-500">&gt;_</span> PostgreSQL
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
                                            <button 
                                                onClick={() => setShowHint(!showHint)}
                                                className="cursor-pointer hover:text-zinc-300 transition-colors"
                                            >
                                                Hint
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={executionResult?.status !== 'correct'}
                                            className={`px-6 py-2 rounded text-xs font-bold transition-all ${executionResult?.status === 'correct' ? 'bg-[#4DD4C4] text-[#080C16] hover:bg-[#3dbdb0] shadow-[0_0_10px_rgba(77,212,196,0.2)]' : 'bg-[#18212f] text-zinc-500 cursor-not-allowed border border-[#202736]'}`}
                                        >
                                            SUBMIT
                                        </button>
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
                                    <p className="text-xs text-zinc-500 mb-2">How's your experience?</p>
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
        </div>
    );
}
