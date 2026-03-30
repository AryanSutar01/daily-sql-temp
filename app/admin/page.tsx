"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Database, Plus, Calendar, Lock, Search, CheckCircle2,
    AlertCircle, Loader2, ChevronRight, Edit3, Eye,
    Code, FileText, Clock, Trash2, MessageSquare, X, Save, ThumbsDown
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

type Tab = 'problems' | 'create' | 'schedule' | 'feedback' | 'members';
type CreateStep = 'problem' | 'datasets' | 'solution' | 'done';

export default function AdminDashboard() {
    const [secret, setSecret] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('problems');

    // Data
    const [problems, setProblems] = useState<Problem[]>([]);
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [loading, setLoading] = useState(false);

    // Drill-down & Feedback State
    const [selectedProblem, setSelectedProblem] = useState<any>(null);
    const [problemComments, setProblemComments] = useState<any[]>([]);
    const [problemDatasets, setProblemDatasets] = useState<any[]>([]);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [whitelist, setWhitelist] = useState<any[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [bulkEmailsText, setBulkEmailsText] = useState("");
    const [loadingDetails, setLoadingDetails] = useState(false);
    
    // Edit Form State for Drill-down
    const [editForm, setEditForm] = useState<any>(null);
    const [editingDatasets, setEditingDatasets] = useState<any[]>([]);

    // Create Wizard State
    const [createStep, setCreateStep] = useState<CreateStep>('problem');
    const [createdProblemId, setCreatedProblemId] = useState<string | null>(null);

    // Form States
    const [problemForm, setProblemForm] = useState({
        title: "", difficulty: "easy", description: "", estimated_time_minutes: 15
    });
    const [datasetForm, setDatasetForm] = useState({
        table_name: "", schema_sql: "", seed_sql: "", column_types: ""
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

    const loadFeedbacks = async () => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/feedback`);
            if (res.ok) {
                setFeedbacks(await res.json());
            }
        } catch (e) { console.error(e); }
    };
    
    const loadWhitelist = async () => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/whitelist`);
            if (res.ok) {
                setWhitelist(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const loadProblemDetails = async (id: string) => {
        setLoadingDetails(true);
        setSelectedProblem(null);
        setEditForm(null);
        setProblemComments([]);
        setProblemDatasets([]);
        setEditingDatasets([]);
        try {
            const probRes = await fetch(`${API_URL}/problems/${id}`);
            if (probRes.ok) {
                const p = await probRes.json();
                setSelectedProblem(p);
                setEditForm({ ...p });
            }
            
            const comRes = await fetchWithAuth(`${API_URL}/admin/problems/${id}/comments`);
            if (comRes.ok) {
                const allComments = await comRes.json();
                // Group into top-level + replies
                const topLevel = allComments.filter((c: any) => !c.parent_id);
                const replies = allComments.filter((c: any) => c.parent_id);
                const grouped = topLevel.map((c: any) => ({
                    ...c,
                    replies: replies.filter((r: any) => r.parent_id === c.id)
                }));
                setProblemComments(grouped);
            }

            // Load datasets
            const dsRes = await fetch(`${API_URL}/problems/${id}/datasets`);
            if (dsRes.ok) {
                const ds = await dsRes.json();
                setProblemDatasets(ds);
                setEditingDatasets(ds.map((d: any) => ({ ...d })));
            }
        } catch (e) { console.error(e); }
        setLoadingDetails(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Delete this comment completely?')) return;
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/comments/${commentId}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('success', 'Comment deleted');
                if (selectedProblem) loadProblemDetails(selectedProblem.id);
            } else {
                showToast('error', 'Failed to delete comment');
            }
        } catch (e) { console.error(e); }
    };

    const handleUpdateProblem = async () => {
        if (!selectedProblem) return;
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${selectedProblem.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: editForm.title,
                    difficulty: editForm.difficulty,
                    description: editForm.description,
                    estimated_time_minutes: editForm.estimated_time_minutes
                })
            });
            if (res.ok) {
                showToast('success', 'Problem updated!');
                loadProblems();
                loadProblemDetails(selectedProblem.id);
            } else {
                showToast('error', 'Failed to update problem');
            }
        } catch (e) { console.error(e); }
    };

    const handleUpdateDataset = async (ds: any) => {
        if (!selectedProblem) return;
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${selectedProblem.id}/datasets/${ds.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    table_name: ds.table_name,
                    schema_sql: ds.schema_sql,
                    seed_sql: ds.seed_sql,
                })
            });
            if (res.ok) {
                showToast('success', `Table "${ds.table_name}" updated!`);
                loadProblemDetails(selectedProblem.id);
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('error', err.detail || 'Failed to update dataset');
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteDataset = async (dsId: string) => {
        if (!selectedProblem || !confirm('Delete this dataset?')) return;
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${selectedProblem.id}/datasets/${dsId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showToast('success', 'Dataset deleted!');
                loadProblemDetails(selectedProblem.id);
            } else {
                showToast('error', 'Failed to delete dataset');
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
                loadFeedbacks();
                loadWhitelist();
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

    // DELETE PROBLEM
    const handleDeleteProblem = async (problemId: string) => {
        if (!confirm("Are you sure you want to delete this problem? This will cascade and delete its datasets, solution, and any associated historical records.")) return;

        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${problemId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showToast('success', 'Problem deleted successfully!');
                loadProblems();
                loadSchedule();
            } else {
                const data = await res.json();
                showToast('error', data.detail || 'Failed to delete problem');
            }
        } catch (e: any) {
            showToast('error', e.message);
        }
        setLoading(false);
    };

    // ADD DATASET
    const handleAddDataset = async () => {
        if (!createdProblemId) return;
        setLoading(true);
        try {
            // Parse column_types (e.g. "id: int \n name: varchar") into JSON object
            const colTypesObj: Record<string, string> = {};
            if (datasetForm.column_types.trim()) {
                const lines = datasetForm.column_types.split('\n');
                for (const line of lines) {
                    if (line.includes(':')) {
                        const [key, val] = line.split(':');
                        colTypesObj[key.trim()] = val.trim();
                    }
                }
            }

            const res = await fetchWithAuth(`${API_URL}/admin/problems/${createdProblemId}/datasets`, {
                method: 'POST',
                body: JSON.stringify({ ...datasetForm, column_types: colTypesObj })
            });
            if (res.ok) {
                showToast('success', `Dataset "${datasetForm.table_name}" added!`);
                setDatasetForm({ table_name: "", schema_sql: "", seed_sql: "", column_types: "" });
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
        setDatasetForm({ table_name: "", schema_sql: "", seed_sql: "", column_types: "" });
        setSolutionForm({ reference_query: "", order_sensitive: false, notes: "" });
    };

    const handleAddMember = async () => {
        if (!newMemberEmail.trim()) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/whitelist`, {
                method: 'POST',
                body: JSON.stringify({ email: newMemberEmail })
            });
            if (res.ok) {
                showToast('success', 'Member added to whitelist!');
                setNewMemberEmail("");
                loadWhitelist();
            } else {
                const data = await res.json();
                showToast('error', data.detail || 'Failed to add member');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
    };

    const handleDeleteMember = async (email: string) => {
        if (!confirm(`Remove ${email} from whitelist?`)) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/whitelist/${email}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showToast('success', 'Member removed from whitelist');
                loadWhitelist();
            } else {
                showToast('error', 'Failed to remove member');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
    };

    const handleBulkAddMember = async () => {
        // Regex to extract emails from text (comma, newline, space separated)
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const foundEmails = bulkEmailsText.match(emailRegex) || [];
        
        if (foundEmails.length === 0) {
            showToast('error', 'No valid emails found in text');
            return;
        }

        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/whitelist/bulk`, {
                method: 'POST',
                body: JSON.stringify({ emails: foundEmails })
            });
            if (res.ok) {
                const data = await res.json();
                showToast('success', `Successfully authorized ${data.count} emails!`);
                setBulkEmailsText("");
                setIsBulkMode(false);
                loadWhitelist();
            } else {
                showToast('error', 'Failed to bulk authorize emails');
            }
        } catch (e: any) { showToast('error', e.message); }
        setLoading(false);
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
                        <Button
                            onClick={() => setActiveTab('feedback')}
                            variant="ghost"
                            className={`${activeTab === 'feedback' ? 'bg-[#4DD4C4]/10 text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <MessageSquare size={16} className="mr-2" /> Feedback
                        </Button>
                        <Button
                            onClick={() => setActiveTab('members')}
                            variant="ghost"
                            className={`${activeTab === 'members' ? 'bg-[#10b981]/10 text-[#10b981]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Lock size={16} className="mr-2" /> Members
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ============ PROBLEMS TAB ============ */}
                {activeTab === 'problems' && (
                    <div className="space-y-6">
                        {!selectedProblem && !loadingDetails ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">All Problems</h2>
                                    <Button onClick={loadProblems} variant="outline" size="sm" className="border-[#202736] text-zinc-400">
                                        {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : null} Refresh
                                    </Button>
                                </div>

                                <div className="grid gap-4">
                                    {problems.map(p => (
                                        <div key={p.id} onClick={() => loadProblemDetails(p.id)} className="bg-[#121826] border border-[#202736] rounded-lg p-5 hover:border-[#4DD4C4]/30 transition-colors cursor-pointer group">
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
                                                    <h3 className="text-lg font-semibold text-white group-hover:text-[#4DD4C4] transition-colors">{p.title}</h3>
                                                    <p className="text-sm text-zinc-500 max-w-2xl">{p.description}</p>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-3">
                                                    <code className="text-[10px] text-zinc-600 font-mono">{p.id.slice(0, 8)}...</code>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteProblem(p.id); }}
                                                        className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                                                        title="Delete Problem"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
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
                            </>
                        ) : loadingDetails ? (
                            <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#4DD4C4]" /></div>
                        ) : selectedProblem && editForm && (
                            <div className="space-y-6">
                                <Button onClick={() => setSelectedProblem(null)} variant="ghost" className="text-zinc-400 hover:text-white p-0 h-auto flex items-center gap-2">
                                    ← Back to Problems
                                </Button>
                                <div className="grid grid-cols-3 gap-8">
                                    {/* Left: Problem Details + Datasets Form */}
                                    <div className="col-span-2 space-y-6">
                                        <div className="bg-[#121826] border border-[#202736] rounded-xl p-6 space-y-4">
                                            <div className="flex items-center justify-between pb-4 border-b border-[#202736]">
                                                <h3 className="text-lg font-bold flex items-center gap-2"><Edit3 size={18} className="text-[#4DD4C4]" /> Edit Details</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs text-zinc-500 mb-1">Title</label>
                                                    <input className="w-full bg-[#0b101c] border border-[#202736] p-2 rounded text-sm text-white focus:border-[#4DD4C4] focus:outline-none" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-zinc-500 mb-1">Difficulty</label>
                                                        <select className="w-full bg-[#0b101c] border border-[#202736] p-2 rounded text-sm text-zinc-300 focus:border-[#4DD4C4] focus:outline-none" value={editForm.difficulty} onChange={e => setEditForm({ ...editForm, difficulty: e.target.value })}>
                                                            <option value="easy">Easy</option><option value="medium">Medium</option><option value="advanced">Advanced</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-zinc-500 mb-1">Estimated Time (min)</label>
                                                        <input type="number" className="w-full bg-[#0b101c] border border-[#202736] p-2 rounded text-sm text-white focus:border-[#4DD4C4]" value={editForm.estimated_time_minutes} onChange={e => setEditForm({ ...editForm, estimated_time_minutes: parseInt(e.target.value) || 0 })} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-zinc-500 mb-1">Description (Markdown)</label>
                                                    <textarea className="w-full bg-[#0b101c] border border-[#202736] p-2 rounded h-32 text-sm text-white focus:border-[#4DD4C4] focus:outline-none" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                                                </div>
                                                <Button onClick={handleUpdateProblem} className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold">
                                                    <Save size={16} className="mr-2" /> Save Changes
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Datasets Editor */}
                                        <div className="bg-[#121826] border border-[#202736] rounded-xl p-6 space-y-4">
                                            <div className="flex items-center justify-between pb-4 border-b border-[#202736]">
                                                <h3 className="text-lg font-bold flex items-center gap-2"><Database size={18} className="text-[#4DD4C4]" /> Datasets ({editingDatasets.length})</h3>
                                            </div>
                                            {editingDatasets.length === 0 && <p className="text-xs text-zinc-500 text-center py-4">No datasets for this problem.</p>}
                                            {editingDatasets.map((ds: any, idx: number) => (
                                                <div key={ds.id} className="bg-[#0b101c] border border-[#202736] rounded-lg p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs text-zinc-500">Table Name</label>
                                                        <button onClick={() => handleDeleteDataset(ds.id)} className="text-zinc-600 hover:text-red-400 transition-colors" title="Delete Dataset"><Trash2 size={14} /></button>
                                                    </div>
                                                    <input className="w-full bg-[#080c16] border border-[#202736] p-2 rounded text-sm text-white font-mono focus:border-[#4DD4C4] focus:outline-none" value={ds.table_name} onChange={e => { const copy = [...editingDatasets]; copy[idx] = { ...copy[idx], table_name: e.target.value }; setEditingDatasets(copy); }} />
                                                    <div>
                                                        <label className="block text-xs text-zinc-500 mb-1">Schema SQL (CREATE TABLE)</label>
                                                        <textarea className="w-full bg-[#080c16] border border-[#202736] p-2 rounded h-24 font-mono text-xs text-white focus:border-[#4DD4C4] focus:outline-none" value={ds.schema_sql} onChange={e => { const copy = [...editingDatasets]; copy[idx] = { ...copy[idx], schema_sql: e.target.value }; setEditingDatasets(copy); }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-zinc-500 mb-1">Seed SQL (INSERT INTO)</label>
                                                        <textarea className="w-full bg-[#080c16] border border-[#202736] p-2 rounded h-24 font-mono text-xs text-white focus:border-[#4DD4C4] focus:outline-none" value={ds.seed_sql} onChange={e => { const copy = [...editingDatasets]; copy[idx] = { ...copy[idx], seed_sql: e.target.value }; setEditingDatasets(copy); }} />
                                                    </div>
                                                    <Button onClick={() => handleUpdateDataset(editingDatasets[idx])} className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold text-xs">
                                                        <Save size={14} className="mr-2" /> Save Table "{ds.table_name}"
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Right: Comments Moderation */}
                                    <div className="col-span-1 space-y-6">
                                        <div className="bg-[#121826] border border-[#202736] rounded-xl p-6">
                                            <div className="flex items-center justify-between pb-4 border-b border-[#202736] mb-4">
                                                <h3 className="text-lg font-bold flex items-center gap-2"><MessageSquare size={18} className="text-[#4DD4C4]" /> Comments ({problemComments.length})</h3>
                                            </div>
                                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                                {problemComments.length === 0 && <p className="text-xs text-zinc-500 text-center py-4">No comments on this problem.</p>}
                                                {problemComments.map((com: any) => (
                                                    <div key={com.id} className="bg-[#0b101c] border border-[#202736] rounded-lg p-3 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <span className="text-xs font-semibold text-white">{com.user.full_name}</span>
                                                                <span className="text-[10px] text-zinc-500 ml-2">{new Date(com.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <button onClick={() => handleDeleteComment(com.id)} title="Delete Comment" className="text-zinc-600 hover:text-red-400"><Trash2 size={14} /></button>
                                                        </div>
                                                        <p className="text-xs text-zinc-400">{com.body}</p>
                                                        {com.replies?.map((reply: any) => (
                                                            <div key={reply.id} className="ml-4 mt-2 bg-[#131924] border border-[#202736]/50 rounded p-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="text-[10px] font-semibold text-zinc-300">{reply.user.full_name}</div>
                                                                    <button onClick={() => handleDeleteComment(reply.id)} title="Delete Reply" className="text-zinc-600 hover:text-red-400"><Trash2 size={12} /></button>
                                                                </div>
                                                                <p className="text-[10px] text-zinc-400">{reply.body}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-20 font-mono text-xs text-white" placeholder="Column Types (e.g. id: int \n name: varchar)" value={datasetForm.column_types} onChange={e => setDatasetForm({ ...datasetForm, column_types: e.target.value })} />
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

                {/* ============ MEMBERS TAB ============ */}
                {activeTab === 'members' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Lock size={24} className="text-[#10b981]" /> Authorized Members
                            </h2>
                            <Button onClick={loadWhitelist} variant="outline" size="sm" className="border-[#202736] text-zinc-400">
                                {loading && <Loader2 size={14} className="animate-spin mr-2" />} Refresh
                            </Button>
                        </div>

                        {/* Add Member Form */}
                        <div className="bg-[#121826] border border-[#202736] rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Authorize Member</h3>
                                <button 
                                    onClick={() => setIsBulkMode(!isBulkMode)}
                                    className="text-[10px] font-bold text-[#4DD4C4] uppercase bg-[#4DD4C4]/10 px-2 py-1 rounded hover:bg-[#4DD4C4]/20 transition-colors"
                                >
                                    {isBulkMode ? "Switch to Single" : "Switch to Bulk"}
                                </button>
                            </div>

                            {!isBulkMode ? (
                                <div className="flex gap-3">
                                    <input 
                                        className="flex-1 bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white focus:border-[#4DD4C4] focus:outline-none transition-colors"
                                        placeholder="Enter email address..."
                                        value={newMemberEmail}
                                        onChange={e => setNewMemberEmail(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                                    />
                                    <Button onClick={handleAddMember} disabled={loading || !newMemberEmail.trim()} className="bg-[#10b981] hover:bg-[#059669] text-white font-bold px-8">
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Authorize Email'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <textarea 
                                        className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white focus:border-[#4DD4C4] focus:outline-none transition-colors h-32 font-mono text-sm"
                                        placeholder="Paste multiple emails here... (separated by commas or newlines)"
                                        value={bulkEmailsText}
                                        onChange={e => setBulkEmailsText(e.target.value)}
                                    />
                                    <Button onClick={handleBulkAddMember} disabled={loading || !bulkEmailsText.trim()} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold">
                                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Lock size={16} className="mr-2" />}
                                        Authorize All {bulkEmailsText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)?.length || 0} Emails
                                    </Button>
                                </div>
                            )}
                            <p className="text-[10px] text-zinc-500 mt-2 italic">
                                {isBulkMode 
                                    ? "We'll automatically extract valid emails from the text above and skip duplicates." 
                                    : "Only emails in this list will be allowed to sign up or log in."}
                            </p>
                        </div>

                        {/* Member List */}
                        <div className="bg-[#121826] border border-[#202736] rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-[#202736] bg-[#0b101c] flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Whitelist ({whitelist.length})</span>
                            </div>
                            <div className="divide-y divide-[#202736]">
                                {whitelist.map((m: any) => (
                                    <div key={m.email} className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{m.email}</span>
                                            <span className="text-[10px] text-zinc-500">Authorized on {new Date(m.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteMember(m.email)}
                                            className="p-2 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Revoke Access"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {whitelist.length === 0 && (
                                    <div className="p-12 text-center text-zinc-500 italic">The whitelist is currently empty.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ FEEDBACK TAB ============ */}
                {activeTab === 'feedback' && (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2"><MessageSquare size={24} className="text-[#4DD4C4]" /> User Feedback</h2>
                            <Button onClick={loadFeedbacks} variant="outline" size="sm" className="border-[#202736] text-zinc-400">
                                <Loader2 size={14} className={`mr-2 ${loading ? 'animate-spin' : 'hidden'}`} /> Refresh
                            </Button>
                        </div>
                        
                        <div className="grid gap-4">
                            {feedbacks.map((f: any) => (
                                <div key={f.id} className="bg-[#121826] border border-[#202736] rounded-xl p-5 flex gap-4 items-start">
                                    <div className={`p-3 rounded-lg shrink-0 ${f.rating === 1 ? 'bg-red-500/10 text-red-500' : f.rating === 3 ? 'bg-green-500/10 text-green-500' : f.rating === 2 ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                                        {f.source === 'dislike' ? <ThumbsDown size={24} /> : <MessageSquare size={24} />}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            {f.rating && (
                                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${f.rating === 1 ? 'border-red-500/20 text-red-500 bg-red-500/10' : f.rating === 3 ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-amber-500/20 text-amber-500 bg-amber-500/10'}`}>
                                                    {f.rating === 1 ? 'Bad' : f.rating === 2 ? 'Okay' : 'Great'}
                                                </span>
                                            )}
                                            <span className="text-xs text-zinc-500">Source: {f.source}</span>
                                            <span className="text-xs text-zinc-500">•</span>
                                            <span className="text-xs text-zinc-500">{new Date(f.created_at).toLocaleString()}</span>
                                            {f.user_email && (
                                                <>
                                                    <span className="text-xs text-zinc-500">•</span>
                                                    <span className="text-xs text-zinc-300">{f.user_email}</span>
                                                </>
                                            )}
                                        </div>
                                        {f.problem_title && (
                                            <div className="text-xs text-zinc-400 font-mono bg-[#0b101c] py-1 px-2 rounded border border-[#202736]/50 inline-block">
                                                Problem: {f.problem_title}
                                            </div>
                                        )}
                                        {f.message && (
                                            <p className="text-sm text-zinc-300 mt-2 bg-[#0b101c] p-3 rounded-lg border border-[#202736]/50">
                                                "{f.message}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {feedbacks.length === 0 && (
                                <div className="text-center py-20 bg-[#121826] border border-[#202736] rounded-xl text-zinc-500">
                                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                    No feedback received yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
// Fucked up
