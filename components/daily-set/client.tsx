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
    ArrowUpDown,
    Filter,
    Clock,
    Undo,
    Download,
    Maximize2,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    TerminalSquare,
    ChevronRight,
    ArrowLeft
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import Editor from "@monaco-editor/react";

// ==========================================
// ROBUST MOCK DATA (Replaces API Calls)
// ==========================================
type Difficulty = 'easy' | 'medium' | 'hard';

const MOCK_PROBLEMS = [
    { id: '1', title: 'Find Active Users', difficulty: 'easy' as Difficulty, tags: ['SELECT', 'WHERE'], success: '85%', time: '5m', desc: "Write a query to find all active users.\n\nAn active user is someone who has logged in within the last 30 days. You need to return their `user_id` and `email`." },
    { id: '2', title: 'Monthly Revenue', difficulty: 'easy' as Difficulty, tags: ['GROUP BY', 'SUM'], success: '72%', time: '10m', desc: "Calculate the total revenue generated each month.\n\nReturn `month` and `total_revenue`. Order the results chronologically." },
    { id: '3', title: 'Second Highest Salary', difficulty: 'medium' as Difficulty, tags: ['SUBQUERY', 'MAX'], success: '55%', time: '15m', desc: "Find the employee with the second highest salary.\n\nIf there is no second highest salary, return null." },
    { id: '4', title: 'Department Top Three Salaries', difficulty: 'hard' as Difficulty, tags: ['WINDOW FUNCTION', 'DENSE_RANK'], success: '32%', time: '25m', desc: "Find the employees who earn the top three salaries in each of the company's departments.\n\nA company's executives are interested in seeing who earns the most money in each of the company's departments." },
    { id: '5', title: 'Consecutive Numbers', difficulty: 'medium' as Difficulty, tags: ['JOIN', 'LEAD'], success: '48%', time: '20m', desc: "Find all numbers that appear at least three times consecutively in the `Logs` table." },
    { id: '6', title: 'Game Play Analysis', difficulty: 'medium' as Difficulty, tags: ['MIN', 'GROUP BY'], success: '61%', time: '12m', desc: "Report the first login date for each player." },
];

const MOCK_DAILY_SET = {
    easy: '1',
    medium: '3',
    hard: '4'
};

const MOCK_DATASETS: Record<string, any> = {
    '1': [
        {
            table_name: 'Users',
            sample_rows: [
                { user_id: 101, email: 'john@example.com', last_login: '2023-10-15' },
                { user_id: 102, email: 'jane@example.com', last_login: '2022-01-05' },
                { user_id: 103, email: 'bob@example.com', last_login: '2023-11-01' }
            ]
        }
    ],
    '3': [
        {
            table_name: 'Employee',
            sample_rows: [
                { id: 1, salary: 100 },
                { id: 2, salary: 200 },
                { id: 3, salary: 300 }
            ]
        }
    ],
    '4': [
        {
            table_name: 'Employee',
            sample_rows: [
                { id: 1, name: 'Joe', salary: 85000, departmentId: 1 },
                { id: 2, name: 'Henry', salary: 80000, departmentId: 2 },
                { id: 3, name: 'Sam', salary: 60000, departmentId: 2 },
                { id: 4, name: 'Max', salary: 90000, departmentId: 1 }
            ]
        },
        {
            table_name: 'Department',
            sample_rows: [
                { id: 1, name: 'IT' },
                { id: 2, name: 'Sales' }
            ]
        }
    ]
};

const MOCK_EXPECTED: Record<string, any> = {
    '1': [{ user_id: 101, email: 'john@example.com' }, { user_id: 103, email: 'bob@example.com' }],
    '3': [{ SecondHighestSalary: 200 }],
    '4': [{ Department: 'IT', Employee: 'Max', Salary: 90000 }, { Department: 'IT', Employee: 'Joe', Salary: 85000 }]
};

// ==========================================

export function DailySetClient() {
    // Top-Level State
    const [streak, setStreak] = useState<number>(47); // Mock streak
    const [activeSidebarTab, setActiveSidebarTab] = useState<'today' | 'list'>('today');
    const [searchQuery, setSearchQuery] = useState('');

    // Drill-down State
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [viewingDetails, setViewingDetails] = useState<boolean>(false);

    // Editor & Results State
    const [code, setCode] = useState("-- Select a problem to begin\n");
    const [isRunning, setIsRunning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Monaco Location State
    const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });

    // Computed Variables
    const todayStr = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();

    const activeProblem = MOCK_PROBLEMS.find(p => p.id === activeProblemId);
    const activeDatasets = activeProblemId ? MOCK_DATASETS[activeProblemId] || [] : [];
    const filteredProblems = MOCK_PROBLEMS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Handlers
    const handleProblemSelect = (id: string) => {
        setActiveProblemId(id);
        setViewingDetails(true);
        setShowResult(false);
        setError(null);
        setExecutionResult(null);

        const p = MOCK_PROBLEMS.find(x => x.id === id);
        const ds = MOCK_DATASETS[id]?.[0]?.table_name || 'table_name';
        setCode(`-- Write your query for: ${p?.title}\nSELECT * FROM ${ds};\n`);
    };

    const handleBackToList = () => {
        setViewingDetails(false);
        // We keep the activeProblemId so the editor doesn't wipe, 
        // but we navigate the left pane back to the list.
    };

    const handleRun = () => {
        if (!activeProblemId) return;
        setIsRunning(true);
        setError(null);
        setShowResult(true);

        // Simulate network delay for Mock execution
        setTimeout(() => {
            setIsRunning(false);
            if (code.trim().toUpperCase().includes('DROP')) {
                setError("Execution Error: DROP permissions denied.");
                setExecutionResult(null);
            } else {
                const isCorrect = MOCK_EXPECTED[activeProblemId] !== undefined;
                setExecutionResult({
                    status: isCorrect ? 'correct' : 'incorrect',
                    time_ms: Math.floor(Math.random() * 20) + 5,
                    columns: isCorrect ? Object.keys(MOCK_EXPECTED[activeProblemId][0]) : ['output'],
                    rows: isCorrect ? MOCK_EXPECTED[activeProblemId].map((r: any) => Object.values(r)) : [['Empty or incorrect result set']]
                });
            }
        }, 600);
    };

    const handleSubmit = () => {
        alert(`Solution Submitted for ${activeProblem?.title}! Streak +1`);
        if (executionResult?.status === 'correct') {
            setStreak(prev => prev + 1);
        }
    };

    const getDiffStyle = (diff: string) => {
        if (diff === 'easy') return { label: 'BASIC', color: 'text-[#4DD4C4]', bg: 'bg-[#4DD4C4]/10', border: 'border-[#4DD4C4]/30', hex: '#4DD4C4' };
        if (diff === 'medium') return { label: 'INTERMEDIATE', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', hex: '#eab308' };
        return { label: 'ADVANCED', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', hex: '#f87171' };
    };

    // Monaco setup
    const handleEditorWillMount = (monaco: any) => {
        monaco.editor.defineTheme('dailySqlTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0b101c', // Exact theme match instead of transparent
                'editor.lineHighlightBackground': '#ffffff0a', // very subtle line highlight
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

    return (
        <div className="h-[calc(100vh-64px)] bg-[#080c16] text-white flex flex-col font-sans overflow-hidden [&_*::-webkit-scrollbar]:w-1.5 [&_*::-webkit-scrollbar-track]:bg-transparent [&_*::-webkit-scrollbar-thumb]:bg-[#202736] [&_*::-webkit-scrollbar-thumb]:rounded-full hover:[&_*::-webkit-scrollbar-thumb]:bg-zinc-600">
            {/* Split Workspace Layer 2 */}
            <div className="flex-1 flex overflow-hidden">
                <Group orientation="horizontal" className="flex-1 w-full h-full">

                    {/* LEFT PANE (Navigation OR Details) */}
                    <Panel defaultSize="40" minSize="25" maxSize="60" className="flex flex-col bg-[#080c16] border-r border-[#202736]">

                        {!viewingDetails ? (
                            // ==========================================
                            // STATE 1: List Navigation
                            // ==========================================
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                <div className="flex h-14 bg-[#131924] border-b border-[#202736] shrink-0">
                                    <button
                                        className={`flex-1 h-full flex items-center justify-center text-sm font-semibold tracking-wide border-b-2 transition-colors ${activeSidebarTab === 'list' ? 'border-[#4DD4C4] text-[#4DD4C4]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                        onClick={() => setActiveSidebarTab('list')}
                                    >Problem List</button>
                                    <button
                                        className={`flex-1 h-full flex items-center justify-center text-sm font-semibold tracking-wide border-b-2 transition-colors ${activeSidebarTab === 'today' ? 'border-[#4DD4C4] text-[#4DD4C4]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                        onClick={() => setActiveSidebarTab('today')}
                                    >Today's Set</button>
                                </div>

                                {activeSidebarTab === 'today' ? (
                                    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                                        <div className="flex flex-col bg-[#131924] p-4 rounded-lg border border-[#202736]">
                                            <span className="text-[10px] text-[#4DD4C4] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Flame size={12} className="fill-[#4DD4C4]" /> Today's Practice
                                            </span>
                                            <div className="flex justify-between items-end">
                                                <span className="font-semibold text-xl text-zinc-100">{todayStr}</span>
                                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#202736] bg-[#0b101c] hover:bg-[#131924] transition-colors cursor-pointer active:scale-95">
                                                    <Flame size={14} className="fill-[#4DD4C4] text-[#4DD4C4]" />
                                                    <span className="text-sm text-zinc-300 font-bold tracking-wide">{streak} Days</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {['easy', 'medium', 'hard'].map((dLevel, idx) => {
                                                const pId = MOCK_DAILY_SET[dLevel as Difficulty];
                                                if (!pId) return null;
                                                const pInfo = MOCK_PROBLEMS.find(p => p.id === pId);
                                                if (!pInfo) return null;
                                                const dStyle = getDiffStyle(dLevel);
                                                const isCompleted = streak > 47 && executionResult?.status === 'correct' && activeProblemId === pId;

                                                return (
                                                    <div key={dLevel}
                                                        onClick={() => handleProblemSelect(pId)}
                                                        className="p-3 bg-[#131924] rounded-lg cursor-pointer border border-[#202736] hover:border-[#4DD4C4]/50 transition-all flex items-center justify-between group"
                                                    >
                                                        <div className="text-sm font-medium text-white group-hover:text-[#4DD4C4] transition-colors line-clamp-1 pr-4">{pInfo.title}</div>
                                                        <div className="flex items-center gap-4 shrink-0">
                                                            <div className="w-[100px] flex justify-center shrink-0">
                                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${dStyle.color} ${dStyle.bg} ${dStyle.border}`}>
                                                                    {dStyle.label}
                                                                </span>
                                                            </div>
                                                            <CheckCircle2 size={16} className={isCompleted ? 'text-[#4DD4C4]' : 'text-zinc-600'} />
                                                        </div>
                                                    </div>
                                                )
                                            })}
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
                                            {filteredProblems.map(p => (
                                                <div key={p.id} onClick={() => handleProblemSelect(p.id)} className="flex items-center justify-between p-3 rounded bg-[#131924] border border-[#202736] hover:border-[#4DD4C4]/30 cursor-pointer transition-colors group">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white shrink-0 w-[20px]">{p.id}.</span>
                                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">{p.title}</span>
                                                    </div>
                                                    <div className="w-[100px] flex justify-center shrink-0">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getDiffStyle(p.difficulty).color} ${getDiffStyle(p.difficulty).bg} ${getDiffStyle(p.difficulty).border}`}>
                                                            {getDiffStyle(p.difficulty).label}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {filteredProblems.length === 0 && <div className="text-center text-xs text-zinc-500 mt-8">No problems match your search.</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // ==========================================
                            // STATE 2: Drill-down Problem Details
                            // ==========================================
                            <div className="flex-1 flex flex-col h-full bg-[#0d121c] overflow-hidden">
                                <div className="h-14 border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0">
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
                                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Success rate: {activeProblem?.success}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} /> {activeProblem?.time} Avg</span>
                                        </div>
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Task</h3>
                                        <div className="h-px w-full bg-[#202736] mb-4"></div>
                                        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                                            {activeProblem?.desc}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Database size={12} /> Sample Data
                                        </h3>
                                        <div className="h-px w-full bg-[#202736] mb-4"></div>

                                        {activeDatasets.length === 0 && <span className="text-xs text-zinc-600 font-mono italic">No datasets available</span>}
                                        {activeDatasets.map((ds: any, idx: number) => (
                                            <div key={idx} className="border border-[#202736] rounded-lg overflow-hidden mb-4">
                                                <div className="bg-[#131924] px-4 py-2 border-b border-[#202736] flex justify-between items-center">
                                                    <span className="text-xs font-bold text-zinc-400 font-mono">
                                                        {ds.table_name}
                                                    </span>
                                                </div>
                                                <div className="p-0 overflow-x-auto">
                                                    <table className="w-full text-[11px] text-left">
                                                        <thead className="bg-[#0b101c] text-zinc-500">
                                                            <tr>
                                                                {ds.sample_rows.length > 0 && Object.keys(ds.sample_rows[0]).map(h => (
                                                                    <th key={h} className="px-3 py-1.5 border-b border-[#202736] font-mono">{h}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ds.sample_rows.map((row: any, i: number) => (
                                                                <tr key={i} className="border-b border-[#202736]/50 last:border-0 text-zinc-400 font-mono hover:bg-white/[0.02]">
                                                                    {Object.values(row).map((cell: any, j: number) => <td key={j} className="px-3 py-1.5">{cell}</td>)}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Expected Output</h3>
                                        <div className="h-px w-full bg-[#202736] mb-4"></div>
                                        {activeProblemId && MOCK_EXPECTED[activeProblemId] ? (
                                            <div className="border border-[#202736] rounded-lg overflow-hidden mb-4">
                                                <table className="w-full text-[11px] text-left">
                                                    <thead className="bg-[#131924] text-zinc-400">
                                                        <tr>
                                                            {Object.keys(MOCK_EXPECTED[activeProblemId][0]).map(h => (
                                                                <th key={h} className="px-3 py-1.5 border-b border-[#202736] font-mono">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-[#0b101c]">
                                                        {MOCK_EXPECTED[activeProblemId].map((row: any, i: number) => (
                                                            <tr key={i} className="border-b border-[#202736]/50 last:border-0 text-green-400/80 font-mono hover:bg-white/[0.02]">
                                                                {Object.values(row).map((cell: any, j: number) => <td key={j} className="px-3 py-1.5">{cell}</td>)}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-[#131924] rounded-lg border border-[#202736] text-xs text-zinc-500 font-mono italic">Expected Output hidden</div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2 cursor-pointer hover:text-white transition-colors flex justify-between items-center">
                                            <span>Hints</span>
                                            <span className="text-[10px]">&darr;</span>
                                        </h3>
                                        <div className="h-px w-full bg-[#202736] mb-4"></div>
                                    </div>
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
                        {/* Make the actual hoverable handle wider for easier grabbing */}
                        <div className="absolute inset-y-0 -left-2 -right-2 z-10"></div>
                        <div className="h-8 w-0.5 bg-[#202736] rounded-full z-0"></div>
                    </Separator>

                    {/* RIGHT PANE (SQL Editor & Output) */}
                    <Panel minSize="30" className="flex flex-col bg-[#0b101c]">
                        <div className="h-14 border-b border-[#202736] bg-[#131924] flex items-center justify-between px-4 shrink-0">
                            <span className="text-xs font-mono font-medium text-[#4DD4C4] flex items-center gap-2">
                                <span className="text-zinc-500">&gt;_</span> solution.sql
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4 text-zinc-400 border-r border-[#202736] pr-4">
                                    <button className="hover:text-zinc-200 transition-colors" title="Timer"><Clock size={14} /></button>
                                    <button onClick={() => setCode('')} className="hover:text-zinc-200 transition-colors" title="Clear Code"><Undo size={14} /></button>
                                    <button className="hover:text-zinc-200 transition-colors" title="Download Code"><Download size={14} /></button>
                                    <button className="hover:text-zinc-200 transition-colors" title="Fullscreen"><Maximize2 size={14} /></button>
                                </div>
                                <button
                                    onClick={handleRun}
                                    disabled={!activeProblemId}
                                    className={`flex items-center gap-2 px-5 py-1.5 text-[#080C16] text-xs font-bold rounded transition-colors shadow-[0_0_10px_rgba(77,212,196,0.2)] ${activeProblemId ? 'bg-[#4DD4C4] hover:bg-[#3dbdb0]' : 'bg-zinc-600 cursor-not-allowed shadow-none'}`}
                                >
                                    {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                                    Run
                                </button>
                            </div>
                        </div>

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
                            {/* Cursor position indicator */}
                            <div className="absolute right-6 bottom-4 text-[10px] text-zinc-500 font-mono pointer-events-none bg-transparent px-2 py-1 rounded">
                                Ln {cursorPos.lineNumber}, Col {cursorPos.column}
                            </div>
                        </div>

                        {/* Execute Layer 3 Details */}
                        <div className={`border-t border-[#202736] bg-[#0d121c] flex flex-col transition-all duration-300 shrink-0 ${showResult ? 'h-[280px]' : 'h-0 border-t-0'}`}>
                            {showResult && (
                                <>
                                    <div className="h-10 border-b border-[#202736] bg-[#131924] px-4 flex items-center justify-between shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                                            <TerminalSquare size={14} /> Query Output
                                        </span>
                                        <span className={`text-xs font-bold font-mono flex items-center gap-1.5 ${executionResult?.status === 'correct' ? 'text-green-400' : executionResult?.status === 'incorrect' ? 'text-red-400' : 'text-zinc-400'}`}>
                                            {executionResult?.status === 'correct' ? <><CheckCircle2 size={14} /> Success ({executionResult.time_ms}ms)</> :
                                                executionResult?.status === 'incorrect' ? <><XCircle size={14} /> Incorrect Result</> :
                                                    error ? <><AlertCircle size={14} /> Execution Error</> :
                                                        "Executing..."}
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4 bg-[#0d121c]">
                                        {error ? (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-mono text-sm whitespace-pre-wrap flex items-start gap-3">
                                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                                {error}
                                            </div>
                                        ) : executionResult ? (
                                            <div className="rounded-lg border border-[#202736] overflow-hidden bg-[#131924]">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-[#0b101c] text-zinc-400">
                                                        <tr>
                                                            {executionResult.columns.map((k: string) => (
                                                                <th key={k} className="px-4 py-2 border-b border-[#202736] font-mono whitespace-nowrap">{k}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#202736]/50">
                                                        {executionResult.rows.map((row: any[], i: number) => (
                                                            <tr key={i} className="hover:bg-white/[0.02]">
                                                                {row.map((cell: any, j: number) => (
                                                                    <td key={j} className="px-4 py-2 text-zinc-300 font-mono whitespace-nowrap">{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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
                                            className={`px-6 py-2 rounded text-xs font-bold transition-all shadow-[0_0_10px_rgba(77,212,196,0.2)] ${executionResult?.status === 'correct' ? 'bg-[#4DD4C4] text-[#080C16] hover:bg-[#3dbdb0]' : 'bg-[#18212f] text-zinc-500 cursor-not-allowed border border-[#202736] shadow-none'}`}
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
