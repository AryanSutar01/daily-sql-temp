"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Database, Plus, Calendar, Lock, Search, CheckCircle2,
    AlertCircle, Loader2, ChevronRight, Edit3, Eye,
    Code, FileText, Clock
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
interface Problem {
    id: string;
    title: string;
    difficulty: string;
    description: string;
    estimated_time_minutes: number;
    created_at?: string;
}

interface ScheduleEntry {
    date: string;
    easy: { id: string; title: string } | null;
    medium: { id: string; title: string } | null;
    advanced: { id: string; title: string } | null;
}

type Tab = 'problems' | 'create' | 'schedule';
type CreateStep = 'problem' | 'datasets' | 'solution' | 'done';

export default function AdminDashboard() {
    const [secret, setSecret] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('problems');

    // Data
    const [problems, setProblems] = useState<Problem[]>([]);
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Wizard State
    const [createStep, setCreateStep] = useState<CreateStep>('problem');
    const [createdProblemId, setCreatedProblemId] = useState<string | null>(null);

    // Form States
    const [problemForm, setProblemForm] = useState({
        title: "", difficulty: "easy", description: "", estimated_time_minutes: 15
    });
    const [datasetForm, setDatasetForm] = useState({
        table_name: "", schema_sql: "", seed_sql: "", sample_rows: "[]"
    });
    const [solutionForm, setSolutionForm] = useState({
        reference_query: "", order_sensitive: false, notes: ""
    });
    const [scheduleForm, setScheduleForm] = useState({
        date: new Date().toISOString().split('T')[0],
        easy_problem_id: "", medium_problem_id: "", advanced_problem_id: ""
    });

    // Feedback
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Secret': secret,
                ...options.headers
            }
        });
        return res;
    };

    const loadProblems = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems`);
            if (res.ok) {
                const data = await res.json();
                setProblems(data);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadSchedule = async () => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/schedule`);
            if (res.ok) {
                const data = await res.json();
                setSchedule(data);
            }
        } catch (e) { console.error(e); }
    };

    const verifySecret = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/problems`, {
                headers: { 'X-Admin-Secret': secret }
            });
            if (res.ok) {
                setIsAuthenticated(true);
                loadProblems();
                loadSchedule();
            } else {
                showToast('error', 'Invalid admin secret');
            }
        } catch (e) {
            showToast('error', 'Could not connect to API');
        }
    };

    // CREATE PROBLEM
    const handleCreateProblem = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems`, {
                method: 'POST',
                body: JSON.stringify(problemForm)
            });
            const data = await res.json();
            if (res.ok) {
                setCreatedProblemId(data.problem_id);
                setCreateStep('datasets');
                showToast('success', `Problem created! ID: ${data.problem_id.slice(0, 8)}...`);
                loadProblems();
            } else {
                showToast('error', data.detail || 'Failed to create problem');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
    };

    // ADD DATASET
    const handleAddDataset = async () => {
        if (!createdProblemId) return;
        setLoading(true);
        try {
            let rows = [];
            try { rows = JSON.parse(datasetForm.sample_rows); }
            catch { showToast('error', 'Invalid JSON for sample_rows'); setLoading(false); return; }

            const res = await fetchWithAuth(`${API_URL}/admin/problems/${createdProblemId}/datasets`, {
                method: 'POST',
                body: JSON.stringify({ ...datasetForm, sample_rows: rows })
            });
            if (res.ok) {
                showToast('success', `Dataset "${datasetForm.table_name}" added!`);
                setDatasetForm({ table_name: "", schema_sql: "", seed_sql: "", sample_rows: "[]" });
            } else {
                const data = await res.json();
                showToast('error', data.detail || 'Failed to add dataset');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
    };

    // ADD SOLUTION
    const handleAddSolution = async () => {
        if (!createdProblemId) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${createdProblemId}/solution`, {
                method: 'POST',
                body: JSON.stringify(solutionForm)
            });
            if (res.ok) {
                showToast('success', 'Solution saved!');
                setCreateStep('done');
            } else {
                const data = await res.json();
                showToast('error', data.detail || 'Failed to save solution');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
    };

    // SCHEDULE
    const handleSchedule = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/daily-practice`, {
                method: 'POST',
                body: JSON.stringify(scheduleForm)
            });
            if (res.ok) {
                showToast('success', `Schedule saved for ${scheduleForm.date}!`);
                loadSchedule();
            } else {
                const data = await res.json();
                showToast('error', data.detail || 'Failed to schedule');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
    };

    const resetCreateWizard = () => {
        setCreateStep('problem');
        setCreatedProblemId(null);
        setProblemForm({ title: "", difficulty: "easy", description: "", estimated_time_minutes: 15 });
        setDatasetForm({ table_name: "", schema_sql: "", seed_sql: "", sample_rows: "[]" });
        setSolutionForm({ reference_query: "", order_sensitive: false, notes: "" });
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'advanced': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-zinc-400 bg-zinc-400/10';
        }
    };

    // ================== AUTH GATE ==================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#080c16] flex items-center justify-center p-4">
                <div className="bg-[#121826] p-8 rounded-xl border border-[#202736] max-w-sm w-full space-y-4 shadow-2xl">
                    <h1 className="text-white text-xl font-bold flex items-center gap-2">
                        <Lock size={20} className="text-[#4DD4C4]" /> Admin Access
                    </h1>
                    <p className="text-zinc-500 text-sm">Enter your admin secret to continue</p>
                    <input
                        type="password"
                        className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white focus:border-[#4DD4C4] focus:outline-none transition-colors"
                        placeholder="Admin Secret"
                        value={secret}
                        onChange={e => setSecret(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && verifySecret()}
                    />
                    <Button onClick={verifySecret} className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold">
                        Enter Dashboard
                    </Button>
                </div>
                {toast && (
                    <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'} text-white`}>
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                )}
            </div>
        );
    }

    // ================== MAIN DASHBOARD ==================
    return (
        <div className="min-h-screen bg-[#080c16] text-white font-sans">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${toast.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'} text-white`}>
                    {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header className="border-b border-[#202736] bg-[#0b101c]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        <span className="text-[#4DD4C4]">DailySQL</span> Admin
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setActiveTab('problems')}
                            variant="ghost"
                            className={`${activeTab === 'problems' ? 'bg-[#4DD4C4]/10 text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Database size={16} className="mr-2" /> Problems
                        </Button>
                        <Button
                            onClick={() => { setActiveTab('create'); resetCreateWizard(); }}
                            variant="ghost"
                            className={`${activeTab === 'create' ? 'bg-[#4DD4C4]/10 text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Plus size={16} className="mr-2" /> Create New
                        </Button>
                        <Button
                            onClick={() => setActiveTab('schedule')}
                            variant="ghost"
                            className={`${activeTab === 'schedule' ? 'bg-[#4DD4C4]/10 text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Calendar size={16} className="mr-2" /> Schedule
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ============ PROBLEMS TAB ============ */}
                {activeTab === 'problems' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">All Problems</h2>
                            <Button onClick={loadProblems} variant="outline" size="sm" className="border-[#202736] text-zinc-400">
                                {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : null} Refresh
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {problems.map(p => (
                                <div key={p.id} className="bg-[#121826] border border-[#202736] rounded-lg p-5 hover:border-[#4DD4C4]/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getDifficultyColor(p.difficulty)}`}>
                                                    {p.difficulty}
                                                </span>
                                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Clock size={12} /> {p.estimated_time_minutes} min
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                                            <p className="text-sm text-zinc-500 max-w-2xl">{p.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <code className="text-[10px] text-zinc-600 font-mono">{p.id.slice(0, 8)}...</code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {problems.length === 0 && !loading && (
                                <div className="text-center py-12 text-zinc-500">
                                    No problems yet. Create your first one!
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ============ CREATE TAB (WIZARD) ============ */}
                {activeTab === 'create' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Stepper */}
                        <div className="flex items-center justify-center gap-2">
                            {['problem', 'datasets', 'solution', 'done'].map((step, i) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${createStep === step ? 'bg-[#4DD4C4] text-black' :
                                            ['problem', 'datasets', 'solution', 'done'].indexOf(createStep) > i ? 'bg-green-500 text-white' :
                                                'bg-[#202736] text-zinc-500'
                                        }`}>
                                        {['problem', 'datasets', 'solution', 'done'].indexOf(createStep) > i ? <CheckCircle2 size={16} /> : i + 1}
                                    </div>
                                    {i < 3 && <ChevronRight size={16} className="mx-2 text-zinc-600" />}
                                </div>
                            ))}
                        </div>
                        <div className="text-center text-sm text-zinc-500">
                            {createStep === 'problem' && 'Step 1: Define the problem'}
                            {createStep === 'datasets' && 'Step 2: Add table schemas (can add multiple)'}
                            {createStep === 'solution' && 'Step 3: Set the expected solution'}
                            {createStep === 'done' && '✓ Problem setup complete!'}
                        </div>

                        {/* Step 1: Problem */}
                        {createStep === 'problem' && (
                            <div className="bg-[#121826] p-6 rounded-xl border border-[#202736] space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2"><FileText size={20} className="text-[#4DD4C4]" /> Problem Details</h2>
                                <input className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white focus:border-[#4DD4C4] focus:outline-none" placeholder="Problem Title" value={problemForm.title} onChange={e => setProblemForm({ ...problemForm, title: e.target.value })} />
                                <select className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-zinc-300 focus:border-[#4DD4C4] focus:outline-none" value={problemForm.difficulty} onChange={e => setProblemForm({ ...problemForm, difficulty: e.target.value })}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-32 text-white focus:border-[#4DD4C4] focus:outline-none" placeholder="Problem description (supports Markdown)..." value={problemForm.description} onChange={e => setProblemForm({ ...problemForm, description: e.target.value })} />
                                <div className="flex gap-4">
                                    <input type="number" className="w-24 bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white" placeholder="Minutes" value={problemForm.estimated_time_minutes} onChange={e => setProblemForm({ ...problemForm, estimated_time_minutes: parseInt(e.target.value) || 0 })} />
                                    <span className="text-zinc-500 self-center">Estimated completion time</span>
                                </div>
                                <Button onClick={handleCreateProblem} disabled={!problemForm.title || loading} className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold disabled:opacity-50">
                                    {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                                    Create Problem & Continue
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Datasets */}
                        {createStep === 'datasets' && (
                            <div className="bg-[#121826] p-6 rounded-xl border border-[#202736] space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2"><Database size={20} className="text-[#4DD4C4]" /> Add Dataset</h2>
                                <p className="text-sm text-zinc-500">Add table schemas for this problem. You can add multiple tables.</p>
                                <input className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white" placeholder="Table Name (e.g. users, orders)" value={datasetForm.table_name} onChange={e => setDatasetForm({ ...datasetForm, table_name: e.target.value })} />
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-24 font-mono text-xs text-white" placeholder="CREATE TABLE SQL..." value={datasetForm.schema_sql} onChange={e => setDatasetForm({ ...datasetForm, schema_sql: e.target.value })} />
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-24 font-mono text-xs text-white" placeholder="INSERT INTO SQL (seed data)..." value={datasetForm.seed_sql} onChange={e => setDatasetForm({ ...datasetForm, seed_sql: e.target.value })} />
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-20 font-mono text-xs text-white" placeholder='Sample rows JSON: [{"id": 1, "name": "Alice"}]' value={datasetForm.sample_rows} onChange={e => setDatasetForm({ ...datasetForm, sample_rows: e.target.value })} />
                                <div className="flex gap-3">
                                    <Button onClick={handleAddDataset} disabled={!datasetForm.table_name || loading} className="flex-1 bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold">
                                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                                        Add This Table
                                    </Button>
                                    <Button onClick={() => setCreateStep('solution')} variant="outline" className="border-[#4DD4C4] text-[#4DD4C4]">
                                        Done Adding Tables →
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Solution */}
                        {createStep === 'solution' && (
                            <div className="bg-[#121826] p-6 rounded-xl border border-[#202736] space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2"><Code size={20} className="text-[#4DD4C4]" /> Expected Solution</h2>
                                <p className="text-sm text-zinc-500">Enter the reference SQL query that produces the correct result.</p>
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-40 font-mono text-sm text-white" placeholder="SELECT ... FROM ... WHERE ..." value={solutionForm.reference_query} onChange={e => setSolutionForm({ ...solutionForm, reference_query: e.target.value })} />
                                <label className="flex items-center gap-3 text-zinc-400">
                                    <input type="checkbox" checked={solutionForm.order_sensitive} onChange={e => setSolutionForm({ ...solutionForm, order_sensitive: e.target.checked })} className="w-4 h-4 rounded" />
                                    Order Sensitive (row order must match exactly)
                                </label>
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-20 text-white" placeholder="Notes (optional hints, edge cases...)" value={solutionForm.notes} onChange={e => setSolutionForm({ ...solutionForm, notes: e.target.value })} />
                                <div className="flex gap-3">
                                    <Button onClick={handleAddSolution} disabled={!solutionForm.reference_query || loading} className="flex-1 bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold">
                                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                                        Save Solution & Finish
                                    </Button>
                                    <Button onClick={() => setCreateStep('done')} variant="ghost" className="text-zinc-500">
                                        Skip for now
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Done */}
                        {createStep === 'done' && (
                            <div className="bg-[#121826] p-8 rounded-xl border border-[#202736] text-center space-y-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={32} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Problem Created!</h2>
                                <p className="text-zinc-500">Your problem is ready. You can now schedule it for a daily practice.</p>
                                <code className="block text-xs text-zinc-600 font-mono bg-[#0b101c] p-2 rounded">ID: {createdProblemId}</code>
                                <div className="flex gap-3 justify-center pt-4">
                                    <Button onClick={() => { setActiveTab('schedule'); setScheduleForm({ ...scheduleForm, [problemForm.difficulty === 'easy' ? 'easy_problem_id' : problemForm.difficulty === 'medium' ? 'medium_problem_id' : 'advanced_problem_id']: createdProblemId || '' }); }} className="bg-[#4DD4C4] text-black font-bold">
                                        <Calendar size={16} className="mr-2" /> Schedule This Problem
                                    </Button>
                                    <Button onClick={resetCreateWizard} variant="outline" className="border-[#202736] text-zinc-400">
                                        <Plus size={16} className="mr-2" /> Create Another
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============ SCHEDULE TAB ============ */}
                {activeTab === 'schedule' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Schedule Form */}
                        <div className="bg-[#121826] p-6 rounded-xl border border-[#202736] space-y-5">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Calendar size={20} className="text-[#4DD4C4]" /> Schedule Daily Practice</h2>

                            <div>
                                <label className="block text-sm text-zinc-500 mb-1">Date</label>
                                <input type="date" className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white" value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} />
                            </div>

                            {/* Problem Selectors */}
                            {(['easy', 'medium', 'advanced'] as const).map(diff => (
                                <div key={diff}>
                                    <label className="block text-sm text-zinc-500 mb-1 capitalize">{diff} Problem</label>
                                    <select
                                        className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white focus:border-[#4DD4C4] focus:outline-none"
                                        value={scheduleForm[`${diff}_problem_id`]}
                                        onChange={e => setScheduleForm({ ...scheduleForm, [`${diff}_problem_id`]: e.target.value })}
                                    >
                                        <option value="">Select a {diff} problem...</option>
                                        {problems.filter(p => p.difficulty === diff).map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <Button onClick={handleSchedule} disabled={loading || !scheduleForm.easy_problem_id || !scheduleForm.medium_problem_id || !scheduleForm.advanced_problem_id} className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold disabled:opacity-50">
                                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                                Publish Schedule
                            </Button>
                        </div>

                        {/* Schedule Calendar */}
                        <div className="bg-[#121826] p-6 rounded-xl border border-[#202736]">
                            <h3 className="text-lg font-bold mb-4">Recent Schedule</h3>
                            <div className="space-y-3">
                                {schedule.map(s => (
                                    <div key={s.date} className="bg-[#0b101c] p-4 rounded-lg border border-[#202736]">
                                        <div className="font-mono text-sm text-[#4DD4C4] mb-2">{s.date}</div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="text-green-400">Easy: <span className="text-zinc-400">{s.easy?.title || '—'}</span></div>
                                            <div className="text-yellow-400">Med: <span className="text-zinc-400">{s.medium?.title || '—'}</span></div>
                                            <div className="text-red-400">Adv: <span className="text-zinc-400">{s.advanced?.title || '—'}</span></div>
                                        </div>
                                    </div>
                                ))}
                                {schedule.length === 0 && (
                                    <div className="text-center py-8 text-zinc-500">No schedules yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
