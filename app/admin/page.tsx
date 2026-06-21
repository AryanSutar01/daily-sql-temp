"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Database, Plus, Calendar, Lock, Search, CheckCircle2,
    AlertCircle, Loader2, ChevronRight, Edit3, Eye,
    Code, FileText, Clock, Trash2, MessageSquare, X, Save, ThumbsDown, Phone, Download, BarChart3, TrendingUp, Users, Activity, Target, Zap
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
    Card, 
    Text, 
    Metric, 
    AreaChart, 
    BarChart, 
    DonutChart,
    Table as TremorTable, 
    TableHead, 
    TableRow, 
    TableHeaderCell, 
    TableBody, 
    TableCell, 
    Title, 
    Flex, 
    Grid,
    Badge,
    CategoryBar
} from "@tremor/react";

SyntaxHighlighter.registerLanguage('sql', sql);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Custom Markdown components for consistency with Practice Page
const problemMarkdownComponents: any = {
    h1: ({ node, ...props }: any) => <h1 className="text-lg font-bold text-white mt-4 mb-2.5" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-md font-bold text-white mt-4 mb-2" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-sm font-bold text-zinc-300 mt-3 mb-1.5" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-2.5 leading-relaxed" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2.5" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2.5" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-1 last:mb-0" {...props} />,
    table: ({ node, ...props }: any) => <div className="overflow-x-auto my-3"><table className="w-full border-collapse text-sm" {...props} /></div>,
    thead: ({ node, ...props }: any) => <thead className="border-b border-[#202736]" {...props} />,
    tbody: ({ node, ...props }: any) => <tbody {...props} />,
    tr: ({ node, ...props }: any) => <tr className="border-b border-[#202736]/50" {...props} />,
    th: ({ node, ...props }: any) => <th className="text-left px-3 py-2 text-xs font-bold text-zinc-300 bg-[#131924]" {...props} />,
    td: ({ node, ...props }: any) => <td className="px-3 py-2 text-xs text-zinc-400 font-mono" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-semibold text-zinc-200" {...props} />,
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

// Types
interface Problem {
    id: string;
    title: string;
    difficulty: string;
    description: string;
    estimated_time_minutes: number;
    is_active: boolean;
    created_at?: string;
}

interface ScheduleEntry {
    date: string;
    easy: { id: string; title: string } | null;
    medium: { id: string; title: string } | null;
    advanced: { id: string; title: string } | null;
}

type Tab = 'problems' | 'create' | 'schedule' | 'feedback' | 'members' | 'analytics';
type CreateStep = 'problem' | 'datasets' | 'solution' | 'preview' | 'done';

export default function AdminDashboard() {
    const [secret, setSecret] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminOtp, setAdminOtp] = useState("");
    const [otpStep, setOtpStep] = useState<"email" | "otp">("email");
    const [stateId, setStateId] = useState("");
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('problems');
    const [membersSubTab, setMembersSubTab] = useState<'whitelist' | 'users' | 'wa-group'>('users');


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
    const [users, setUsers] = useState<any[]>([]);
    const [waGroupChecklist, setWaGroupChecklist] = useState<any[]>([]);
    const [waFilterOnlyPending, setWaFilterOnlyPending] = useState(true); // Default to pending
    const [waFilterOnlyNew, setWaFilterOnlyNew] = useState(true); // Default to new users only
    const [newMemberEmail, setNewMemberEmail] = useState("");

    const [isBulkMode, setIsBulkMode] = useState(false);
    const [bulkEmailsText, setBulkEmailsText] = useState("");
    const [loadingDetails, setLoadingDetails] = useState(false);


    // Analytics State
    const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
    const [problemStats, setProblemStats] = useState<any[]>([]);
    const [retentionData, setRetentionData] = useState<any>(null);
    const [demographics, setDemographics] = useState<any>(null);
    const [sentimentData, setSentimentData] = useState<any[]>([]);
    const [analyticsSearch, setAnalyticsSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState<"all" | "onboarded" | "pending">("all");

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
    const [wizardDatasets, setWizardDatasets] = useState<any[]>([]);
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

    const fetchWithAuth = async (url: string, options: RequestInit = {}, overrideToken?: string) => {
        const authHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const token = overrideToken ?? adminToken;
        if (secret) authHeaders['X-Admin-Secret'] = secret;
        if (token) authHeaders['Authorization'] = `Bearer ${token}`;

        const res = await fetch(url, {
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers
            }
        });
        return res;
    };

    const loadProblems = async (token?: string) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems`, {}, token);
            if (res.ok) {
                const data = await res.json();
                setProblems(data);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadSchedule = async (token?: string) => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/schedule`, {}, token);
            if (res.ok) {
                const data = await res.json();
                setSchedule(data);
            }
        } catch (e) { console.error(e); }
    };

    const loadFeedbacks = async (token?: string) => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/feedback`, {}, token);
            if (res.ok) {
                setFeedbacks(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const loadWhitelist = async (token?: string) => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/whitelist`, {}, token);
            if (res.ok) {
                setWhitelist(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const loadUsers = async (token?: string) => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/users`, {}, token);
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const loadWaGroupChecklist = async (token?: string) => {
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/wa-group`, {}, token);
            if (res.ok) {
                setWaGroupChecklist(await res.json());
            }
        } catch (e) { console.error(e); }
    };


    const loadAnalytics = async (token?: string) => {
        setLoading(true);
        try {
            const endpoints = [
                { url: '/summary', setter: setAnalyticsSummary },
                { url: '/problems', setter: setProblemStats },
                { url: '/retention', setter: setRetentionData },
                { url: '/demographics', setter: setDemographics },
                { url: '/sentiment', setter: setSentimentData }
            ];

            await Promise.all(endpoints.map(async ({ url, setter }) => {
                try {
                    const res = await fetchWithAuth(`${API_URL}/admin/analytics${url}`, {}, token);
                    if (res.ok) {
                        const data = await res.json();
                        setter(data);
                    }
                } catch (e) {
                    console.error(`Failed to load ${url}:`, e);
                }
            }));
        } catch (e) {
            console.error("General analytics loading error:", e);
        }
        setLoading(false);
    };

    const loadProblemDetails = async (id: string) => {
        setLoadingDetails(true);
        setSelectedProblem(null);
        setEditForm(null);
        setProblemComments([]);
        setProblemDatasets([]);
        setEditingDatasets([]);
        try {
            // Use admin endpoint to get full details including is_active
            const probRes = await fetchWithAuth(`${API_URL}/admin/problems/${id}`);
            if (probRes.ok) {
                const p = await probRes.json();
                setSelectedProblem(p);
                setEditForm({ ...p, solution: p.solution || { reference_query: '', order_sensitive: false, notes: '' } });
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

            // Load datasets from datasets endpoint (still needed for editingDatasets)
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

    const toggleWaGroupStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const method = currentStatus ? 'DELETE' : 'POST';
            const res = await fetchWithAuth(`${API_URL}/admin/wa-group/${userId}`, { method });
            if (res.ok) {
                showToast('success', currentStatus ? 'Removed from group' : 'Marked as added');
                loadWaGroupChecklist();
            } else {
                showToast('error', 'Failed to update status');
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

    const handleTogglePublish = async () => {
        if (!selectedProblem || !editForm) return;
        const newStatus = !editForm.is_active;
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${selectedProblem.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ is_active: newStatus })
            });
            if (res.ok) {
                showToast('success', newStatus ? '✓ Problem Published!' : 'Problem set to Draft');
                setEditForm({ ...editForm, is_active: newStatus });
                loadProblems();
            } else {
                showToast('error', 'Failed to update status');
            }
        } catch (e) { console.error(e); }
    };

    const handleUpdateSolution = async () => {
        if (!selectedProblem || !editForm?.solution) return;
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/problems/${selectedProblem.id}/solution`, {
                method: 'PATCH',
                body: JSON.stringify({
                    reference_query: editForm.solution.reference_query,
                    order_sensitive: editForm.solution.order_sensitive,
                    notes: editForm.solution.notes,
                })
            });
            if (res.ok) {
                showToast('success', 'Solution updated!');
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('error', err.detail || 'Failed to update solution');
            }
        } catch (e) { console.error(e); }
    };

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

    useEffect(() => {
        if (createStep === 'preview' && createdProblemId) {
            const fetchWizardData = async () => {
                try {
                    const dsRes = await fetch(`${API_URL}/problems/${createdProblemId}/datasets`);
                    if (dsRes.ok) {
                        const ds = await dsRes.json();
                        setWizardDatasets(ds.map((d: any) => ({
                            ...d,
                            sample_rows: typeof d.sample_rows === 'string' ? JSON.parse(d.sample_rows) : d.sample_rows,
                            column_types: typeof d.column_types === 'string' ? JSON.parse(d.column_types) : d.column_types
                        })));
                    }
                } catch (e) { console.error(e); }
            };
            fetchWizardData();
        }
    }, [createStep, createdProblemId]);

    useEffect(() => {
        if (activeTab === 'analytics' && isAuthenticated) {
            loadAnalytics();
        }
    }, [activeTab]);

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

    const handleRequestAdminOtp = async () => {
        if (!adminEmail.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/admin/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: adminEmail.trim() }),
            });
            if (res.ok) {
                const data = await res.json();
                setStateId(data.state_id);
                setOtpStep("otp");
                showToast("success", "OTP sent to your admin email");
            } else {
                const data = await res.json();
                showToast("error", data.detail || "Failed to send code");
            }
        } catch (e: any) { showToast("error", e.message); }
        setLoading(false);
    };

    const handleVerifyAdminOtp = async () => {
        if (!adminOtp.trim() || !stateId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/admin/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: adminEmail.trim(),
                    state_id: stateId,
                    otp: adminOtp.trim()
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setAdminToken(data.access_token);
                setIsAuthenticated(true);
                showToast("success", "Logged in as admin");

                // Load relevant data now that we are authenticated, passing the token directly
                // to avoid stale closure issues with the state variable
                loadProblems(data.access_token);
                loadSchedule(data.access_token);
                loadFeedbacks(data.access_token);
                loadWhitelist(data.access_token);
                loadUsers(data.access_token);
                loadAnalytics(data.access_token);
            } else {
                const data = await res.json();
                showToast("error", data.detail || "Invalid code");
            }
        } catch (e: any) { showToast("error", e.message); }
        setLoading(false);
    };

    const verifySecret = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/problems`, {
                headers: { 'X-Admin-Secret': secret }
            });
            if (res.ok) {
                setIsAuthenticated(true);
                showToast('success', 'Authenticated with secret');
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

    // CREATE OR UPDATE PROBLEM DRAFT
    const handleCreateProblem = async () => {
        setLoading(true);
        try {
            const isUpdate = !!createdProblemId;
            const url = isUpdate ? `${API_URL}/admin/problems/${createdProblemId}` : `${API_URL}/admin/problems`;
            const res = await fetchWithAuth(url, {
                method: isUpdate ? 'PATCH' : 'POST',
                body: JSON.stringify(problemForm)
            });
            const data = await res.json();
            if (res.ok) {
                if (!isUpdate) setCreatedProblemId(data.problem_id);
                setCreateStep('datasets');
                showToast('success', isUpdate ? 'Problem details updated!' : `Problem created! ID: ${data.problem_id.slice(0, 8)}...`);
                loadProblems();
            } else {
                showToast('error', data.detail || 'Failed to save problem');
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
                setCreateStep('preview');
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
        if (!confirm(`Are you sure you want to remove ${email} from the whitelist?`)) return;
        if (!confirm(`Before deletion, please confirm again: Are you absolutely sure you want to delete ${email}?`)) return;
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/admin/whitelist/${email}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showToast('success', `Member ${email} removed from whitelist successfully`);
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

    const downloadCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            showToast('error', 'No data to export');
            return;
        }

        // Ensure consistent headers across all rows
        const allKeys = new Set<string>();
        data.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
        const headers = Array.from(allKeys);

        const rows = data.map(obj => headers.map(header => {
            const val = obj[header];
            return `"${val !== null && val !== undefined ? String(val).replace(/"/g, '""') : ''}"`;
        }).join(',')).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getDiffStyle = (diff: string) => {
        const d = diff?.toLowerCase();
        if (d === 'easy') return { label: 'BASIC', color: 'text-[#4DD4C4]', bg: 'bg-[#4DD4C4]/10', border: 'border-[#4DD4C4]/30', hex: '#4DD4C4' };
        if (d === 'medium') return { label: 'INTERMEDIATE', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', hex: '#eab308' };
        return { label: 'ADVANCED', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', hex: '#f87171' };
    };

    // ================== AUTH GATE ==================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#080c16] flex items-center justify-center p-4">
                <div className="bg-[#121826] p-8 rounded-xl border border-[#202736] max-w-sm w-full space-y-6 shadow-2xl">
                    <h1 className="text-white text-xl font-bold flex items-center gap-2">
                        <Lock size={20} className="text-[#4DD4C4]" /> Admin Access
                    </h1>

                    {otpStep === 'email' ? (
                        <div className="space-y-4">
                            <p className="text-zinc-500 text-sm">Enter your registered admin email</p>
                            <input
                                type="email"
                                className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white focus:border-[#4DD4C4] focus:outline-none transition-colors"
                                placeholder="admin@dailysql.in"
                                value={adminEmail}
                                onChange={e => setAdminEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRequestAdminOtp()}
                            />
                            <Button
                                onClick={handleRequestAdminOtp}
                                disabled={loading}
                                className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-extrabold"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                Request Access Code
                            </Button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                                <div className="relative flex justify-center text-[10px] font-bold uppercase"><span className="bg-[#121826] px-2 text-zinc-600">or use secret key</span></div>
                            </div>

                            <input
                                type="password"
                                className="w-full bg-[#0b101c]/50 border border-[#202736] p-2 rounded-lg text-white text-sm focus:border-[#4DD4C4] focus:outline-none transition-colors"
                                placeholder="Static Secret Key"
                                value={secret}
                                onChange={e => setSecret(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && verifySecret()}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-[#4DD4C4]/5 p-4 rounded-lg border border-[#4DD4C4]/10">
                                <p className="text-zinc-400 text-xs">Code sent to:</p>
                                <p className="text-[#4DD4C4] font-medium text-sm">{adminEmail}</p>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg text-white text-center text-xl tracking-[0.5em] font-bold focus:border-[#4DD4C4] focus:outline-none transition-colors"
                                placeholder="0000"
                                value={adminOtp}
                                onChange={e => setAdminOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                onKeyDown={e => e.key === 'Enter' && handleVerifyAdminOtp()}
                            />
                            <Button
                                onClick={handleVerifyAdminOtp}
                                disabled={loading}
                                className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-extrabold"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                Verify & Access
                            </Button>
                            <button
                                onClick={() => setOtpStep('email')}
                                className="w-full text-xs text-zinc-500 hover:text-white transition-colors"
                            >
                                Back to email
                            </button>
                        </div>
                    )}
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
                        <Button
                            onClick={() => setActiveTab('analytics')}
                            variant="ghost"
                            className={`${activeTab === 'analytics' ? 'bg-[#4DD4C4]/10 text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <BarChart3 size={16} className="mr-2" /> Analytics
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
                                    <Button onClick={() => loadProblems()} variant="outline" size="sm" className="border-[#202736] text-zinc-400">
                                        {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : null} Refresh
                                    </Button>
                                </div>

                                <div className="grid gap-4">
                                    {problems.map(p => (
                                        <div key={p.id} onClick={() => loadProblemDetails(p.id)} className="bg-[#121826] border border-[#202736] rounded-lg p-5 hover:border-[#4DD4C4]/30 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getDiffStyle(p.difficulty).color} ${getDiffStyle(p.difficulty).bg} ${getDiffStyle(p.difficulty).border}`}>
                                                            {getDiffStyle(p.difficulty).label}
                                                        </span>
                                                        {!p.is_active && (
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-zinc-600 text-zinc-400 bg-zinc-800/50">
                                                                DRAFT
                                                            </span>
                                                        )}
                                                        {schedule.some(s => s.easy?.id === p.id || s.medium?.id === p.id || s.advanced?.id === p.id) && (
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-[#4DD4C4]/40 text-[#4DD4C4] bg-[#4DD4C4]/10">
                                                                SCHEDULED
                                                            </span>
                                                        )}
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
                                                {/* Publish/Draft toggle */}
                                                <button
                                                    onClick={handleTogglePublish}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${editForm.is_active
                                                            ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                                                            : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400'
                                                        }`}
                                                    title={editForm.is_active ? 'Click to set to Draft' : 'Click to Publish'}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${editForm.is_active ? 'bg-green-400' : 'bg-zinc-500'}`} />
                                                    {editForm.is_active ? 'Published' : 'Draft — Click to Publish'}
                                                </button>
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

                                        {/* Solution Editor */}
                                        <div className="bg-[#121826] border border-[#202736] rounded-xl p-6 space-y-4">
                                            <div className="flex items-center justify-between pb-4 border-b border-[#202736]">
                                                <h3 className="text-lg font-bold flex items-center gap-2"><Code size={18} className="text-[#4DD4C4]" /> Reference Solution</h3>
                                                {!editForm?.solution?.reference_query && (
                                                    <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded font-bold">NO SOLUTION YET</span>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs text-zinc-500 mb-1">Reference Query (SQL)</label>
                                                    <textarea
                                                        className="w-full bg-[#080c16] border border-[#202736] p-2 rounded h-32 font-mono text-xs text-white focus:border-[#4DD4C4] focus:outline-none"
                                                        placeholder="SELECT ... FROM ..."
                                                        value={editForm?.solution?.reference_query || ''}
                                                        onChange={e => setEditForm({ ...editForm, solution: { ...editForm.solution, reference_query: e.target.value } })}
                                                    />
                                                </div>
                                                <label className="flex items-center gap-3 text-xs text-zinc-400 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm?.solution?.order_sensitive || false}
                                                        onChange={e => setEditForm({ ...editForm, solution: { ...editForm.solution, order_sensitive: e.target.checked } })}
                                                        className="w-3.5 h-3.5 rounded accent-[#4DD4C4]"
                                                    />
                                                    Order Sensitive (row order must match exactly)
                                                </label>
                                                <div>
                                                    <label className="block text-xs text-zinc-500 mb-1">Notes (optional)</label>
                                                    <textarea
                                                        className="w-full bg-[#080c16] border border-[#202736] p-2 rounded h-16 text-xs text-white focus:border-[#4DD4C4] focus:outline-none"
                                                        placeholder="Edge cases, hints..."
                                                        value={editForm?.solution?.notes || ''}
                                                        onChange={e => setEditForm({ ...editForm, solution: { ...editForm.solution, notes: e.target.value } })}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={handleUpdateSolution}
                                                    disabled={!editForm?.solution?.reference_query}
                                                    className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold text-xs disabled:opacity-50"
                                                >
                                                    <Save size={14} className="mr-2" /> Save Solution
                                                </Button>
                                            </div>
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
                            {['problem', 'datasets', 'solution', 'preview', 'done'].map((step, i) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${createStep === step ? 'bg-[#4DD4C4] text-black' :
                                        ['problem', 'datasets', 'solution', 'preview', 'done'].indexOf(createStep) > i ? 'bg-green-500 text-white' :
                                            'bg-[#202736] text-zinc-500'
                                        }`}>
                                        {['problem', 'datasets', 'solution', 'preview', 'done'].indexOf(createStep) > i ? <CheckCircle2 size={16} /> : i + 1}
                                    </div>
                                    {i < 4 && <ChevronRight size={16} className="mx-2 text-zinc-600" />}
                                </div>
                            ))}
                        </div>
                        <div className="text-center text-sm text-zinc-500">
                            {createStep === 'problem' && 'Step 1: Define the problem'}
                            {createStep === 'datasets' && 'Step 2: Add table schemas'}
                            {createStep === 'solution' && 'Step 3: Set reference query'}
                            {createStep === 'preview' && 'Step 4: Preview & Verify'}
                            {createStep === 'done' && '✓ Problem published!'}
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
                                    {createdProblemId ? 'Update Problem & Continue' : 'Create Problem & Continue'}
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
                                <label className="flex items-center gap-3 text-zinc-400 cursor-pointer">
                                    <input type="checkbox" checked={solutionForm.order_sensitive} onChange={e => setSolutionForm({ ...solutionForm, order_sensitive: e.target.checked })} className="w-4 h-4 rounded" />
                                    Order Sensitive (row order must match exactly)
                                </label>
                                <textarea className="w-full bg-[#0b101c] border border-[#202736] p-3 rounded-lg h-20 text-white" placeholder="Notes (optional hints, edge cases...)" value={solutionForm.notes} onChange={e => setSolutionForm({ ...solutionForm, notes: e.target.value })} />
                                <div className="flex gap-3">
                                    <Button onClick={handleAddSolution} disabled={!solutionForm.reference_query || loading} className="flex-1 bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold">
                                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <ChevronRight size={16} className="mr-2" />}
                                        Preview Problem
                                    </Button>
                                    <Button onClick={() => setCreateStep('preview')} variant="ghost" className="text-zinc-500">
                                        Skip to Preview
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Preview */}
                        {createStep === 'preview' && (
                            <div className="space-y-6">
                                <div className="bg-[#121826] p-6 rounded-xl border border-[#202736] space-y-6">
                                    <div className="flex items-center justify-between border-b border-[#202736] pb-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2"><Eye size={20} className="text-[#4DD4C4]" /> Review Problem</h2>
                                        <div className="flex gap-2">
                                            <Button onClick={() => setCreateStep('problem')} variant="outline" size="sm" className="border-[#202736] text-zinc-400 hover:text-white h-8"><Edit3 size={14} className="mr-2" /> Edit Details</Button>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getDiffStyle(problemForm.difficulty).color} ${getDiffStyle(problemForm.difficulty).bg} ${getDiffStyle(problemForm.difficulty).border}`}>
                                                {getDiffStyle(problemForm.difficulty).label}
                                            </span>
                                            <div className="h-3 w-px bg-zinc-800" />
                                            <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5"><Clock size={12} className="text-zinc-600" /> {problemForm.estimated_time_minutes} min</span>
                                            <div className="h-3 w-px bg-zinc-800" />
                                            <span className="text-xs text-zinc-500 font-medium">PostgreSQL</span>
                                        </div>

                                        <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">{problemForm.title || "Untitled Problem"}</h1>

                                        {/* Task Section */}
                                        <div>
                                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-sans">Task</h3>
                                            <div className="h-px w-full bg-[#181f2b]" />
                                            <div className="pt-4 text-zinc-400 text-sm leading-relaxed font-sans">
                                                {problemForm.description ? (
                                                    <ReactMarkdown components={problemMarkdownComponents} remarkPlugins={[remarkGfm]}>
                                                        {problemForm.description.split('### Hint')[0]}
                                                    </ReactMarkdown>
                                                ) : <p className="text-zinc-600 italic">No description provided.</p>}
                                            </div>
                                        </div>

                                        {/* Hint Section */}
                                        {problemForm.description?.includes('### Hint') && (
                                            <div>
                                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-sans flex items-center gap-2">
                                                    Hints <span className="text-[10px] normal-case font-normal text-zinc-600">(toggle in practice)</span>
                                                </h3>
                                                <div className="h-px w-full bg-[#181f2b] mb-4" />
                                                <div className="p-4 bg-[#131924] rounded-lg border border-[#202736]/50 text-zinc-400 text-sm leading-relaxed font-sans">
                                                    <ReactMarkdown components={problemMarkdownComponents} remarkPlugins={[remarkGfm]}>
                                                        {problemForm.description.split('### Hint')[1].trim()}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sample Data Section */}
                                        {wizardDatasets.length > 0 && (
                                            <div className="space-y-4 pt-2">
                                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-sans flex items-center gap-1.5">
                                                    <Database size={11} /> Datasets
                                                </h3>
                                                <div className="h-px w-full bg-[#181f2b]" />
                                                {wizardDatasets.map((ds, idx) => {
                                                    const colOrder = getColumnOrder(ds.schema_sql, ds.sample_rows[0]);
                                                    return (
                                                        <div key={idx} className="mb-6 last:mb-0 space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-1 bg-[#4DD4C4] rounded-full" />
                                                                <span className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">{ds.table_name}</span>
                                                            </div>

                                                            {/* Schema Table */}
                                                            <div className="border border-[#202736] rounded-lg overflow-hidden max-w-sm bg-[#0d121c]">
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
                                                            <div className="border border-[#202736] rounded-lg overflow-hidden shadow-xl bg-[#0d121c]">
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
                                                                                <tr key={i} className="border-b border-[#202736]/50 last:border-0 text-zinc-300 font-mono hover:bg-white/[0.02]">
                                                                                    {colOrder.map((col) => (
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
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-[#202736] pb-2">
                                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Reference Solution</h3>
                                            <Button onClick={() => setCreateStep('solution')} variant="ghost" size="sm" className="text-zinc-500 hover:text-white h-7 text-[10px]"><Edit3 size={12} className="mr-2" /> EDIT</Button>
                                        </div>
                                        <div className="bg-[#0b101c] border border-[#202736] rounded-lg overflow-hidden">
                                            <SyntaxHighlighter style={vscDarkPlus as any} language="sql" customStyle={{ margin: 0, padding: '1rem', fontSize: '12px' }}>
                                                {solutionForm.reference_query || "-- No solution query provided"}
                                            </SyntaxHighlighter>
                                        </div>
                                        {solutionForm.order_sensitive && <div className="text-[10px] text-zinc-500 flex items-center gap-1"><CheckCircle2 size={10} /> Results must match order exactly</div>}
                                    </div>

                                    <Button onClick={() => setCreateStep('done')} className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-extrabold py-6 text-lg shadow-[0_0_20px_rgba(77,212,196,0.2)]">
                                        Confirm & Publish Problem
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Done */}
                        {createStep === 'done' && (
                            <div className="bg-[#121826] p-10 rounded-2xl border border-[#202736] text-center space-y-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#4DD4C4]"></div>
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">Problem Published</h2>
                                    <p className="text-zinc-500 text-sm max-w-sm mx-auto">Your problem has been successfully added to the database and is ready to be scheduled.</p>
                                </div>

                                <div className="bg-[#0b101c] p-3 rounded-lg border border-[#202736] inline-block mx-auto">
                                    <code className="text-[10px] text-[#4DD4C4] font-mono">PROBLEM_ID: {createdProblemId}</code>
                                </div>

                                <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
                                    <Button onClick={() => { setActiveTab('schedule'); setScheduleForm({ ...scheduleForm, [problemForm.difficulty === 'easy' ? 'easy_problem_id' : problemForm.difficulty === 'medium' ? 'medium_problem_id' : 'advanced_problem_id']: createdProblemId || '' }); }} className="bg-[#4DD4C4] hover:bg-[#3dbdb0] text-black font-bold h-11">
                                        <Calendar size={18} className="mr-2" /> Schedule for Practice
                                    </Button>
                                    <Button onClick={resetCreateWizard} variant="outline" className="border-[#202736] text-zinc-400 hover:text-white h-11 bg-white/5">
                                        <Plus size={18} className="mr-2" /> Create Another Problem
                                    </Button>
                                    <Button onClick={() => setActiveTab('problems')} variant="ghost" className="text-zinc-600 hover:text-zinc-400 text-xs">
                                        Return to Dashboard
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

                            {/* Problem Selectors — only show published problems */}
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
                                            <option key={p.id} value={p.id}>{p.title} {!p.is_active ? '(DRAFT)' : ''}</option>
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
                        <div className="bg-[#121826] border border-[#202736] rounded-xl overflow-hidden flex flex-col h-[500px]">
                            <div className="p-4 border-b border-[#202736] bg-[#0b101c] flex justify-between items-center shrink-0">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recent Schedule</span>
                            </div>
                            <div className="p-4 space-y-3 overflow-y-auto flex-1">
                                {schedule.map(s => (
                                    <div key={s.date} className="bg-[#0b101c] p-4 rounded-lg border border-[#202736] shrink-0">
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
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Lock size={24} className="text-[#10b981]" /> Members & Waitlist
                            </h2>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setMembersSubTab('whitelist')}
                                    variant="outline"
                                    size="sm"
                                    className={`${membersSubTab === 'whitelist' ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10' : 'border-[#202736] text-zinc-400'}`}
                                >
                                    Whitelist
                                </Button>
                                <Button
                                    onClick={() => setMembersSubTab('users')}
                                    variant="outline"
                                    size="sm"
                                    className={`${membersSubTab === 'users' ? 'border-[#4DD4C4] text-[#4DD4C4] bg-[#4DD4C4]/10' : 'border-[#202736] text-zinc-400'}`}
                                >
                                    All Users
                                </Button>
                                <Button
                                    onClick={() => { setMembersSubTab('wa-group'); loadWaGroupChecklist(); }}
                                    variant="outline"
                                    size="sm"
                                    className={`${membersSubTab === 'wa-group' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-[#202736] text-zinc-400'}`}
                                >
                                    WA Group {waGroupChecklist.filter(u => !u.is_added).length > 0 && <span className="ml-2 bg-green-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{waGroupChecklist.filter(u => !u.is_added).length}</span>}
                                </Button>
                                <Button onClick={() => { loadWhitelist(); loadUsers(); if (membersSubTab === 'wa-group') loadWaGroupChecklist(); }} variant="outline" size="sm" className="border-[#202736] text-zinc-400 ml-4">
                                    {loading && <Loader2 size={14} className="animate-spin mr-2" />} Refresh
                                </Button>
                            </div>
                        </div>


                        {membersSubTab === 'whitelist' && (
                            <>

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
                                <div className="bg-[#121826] border border-[#202736] rounded-xl overflow-hidden flex flex-col h-[500px]">
                                    <div className="p-4 border-b border-[#202736] bg-[#0b101c] flex justify-between items-center shrink-0">
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Whitelist ({whitelist.length})</span>
                                        <Button onClick={() => downloadCSV(whitelist, 'whitelist.csv')} variant="ghost" size="sm" className="text-[#4DD4C4] hover:text-[#3dbdb0] hover:bg-[#4DD4C4]/10 h-6">
                                            <Download size={12} className="mr-1" /> Export CSV
                                        </Button>
                                    </div>
                                    <div className="divide-y divide-[#202736] overflow-y-auto flex-1">
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
                            </>
                        )}

                        {membersSubTab === 'users' && (
                            <div className="bg-[#121826] border border-[#202736] rounded-xl overflow-hidden flex flex-col h-[600px]">
                                <div className="p-4 border-b border-[#202736] bg-[#0b101c] flex justify-between items-center shrink-0">
                                    <h3 className="text-xs font-bold text-[#4DD4C4] uppercase tracking-widest flex items-center gap-2">
                                        <Users size={14} /> Registered Users ({users.length})
                                    </h3>
                                    <div className="flex gap-2 items-center">
                                        <div className="relative mr-2">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                                            <input 
                                                type="text" 
                                                placeholder="Search users..." 
                                                className="bg-[#0b101c] border border-[#202736] pl-8 pr-3 py-1 rounded text-[10px] text-white focus:border-[#4DD4C4] outline-none w-40"
                                                value={userSearch}
                                                onChange={e => setUserSearch(e.target.value)}
                                            />
                                        </div>
                                        <select 
                                            className="bg-[#0b101c] border border-[#202736] text-[10px] text-zinc-400 px-2 py-1 rounded outline-none"
                                            value={userStatusFilter}
                                            onChange={e => setUserStatusFilter(e.target.value as any)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="onboarded">Onboarded</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                        <Button 
                                            onClick={() => {
                                                const nums = users
                                                    .filter(u => u.whatsapp_number)
                                                    .map(u => u.whatsapp_number)
                                                    .join('\n');
                                                navigator.clipboard.writeText(nums);
                                                showToast('success', 'WhatsApp numbers copied to clipboard!');
                                            }} 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-zinc-500 h-6 px-2"
                                            title="Copy all WhatsApp numbers"
                                        >
                                            <Phone size={12} className="mr-1" /> Copy Nums
                                        </Button>
                                        <Button onClick={() => downloadCSV(users, 'users.csv')} variant="ghost" size="sm" className="text-[#4DD4C4] hover:text-[#3dbdb0] hover:bg-[#4DD4C4]/10 h-6">
                                            <Download size={12} className="mr-1" /> Export CSV
                                        </Button>
                                        <Button onClick={() => loadUsers()} variant="ghost" size="sm" className="text-zinc-500 h-6">Refresh</Button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto overflow-y-auto flex-1">
                                    <table className="w-full text-left text-sm border-collapse relative">
                                        <thead className="sticky top-0 bg-[#0b101c] shadow-md z-10">
                                            <tr className="bg-black/20 text-[10px] uppercase text-zinc-500 border-b border-[#202736]">
                                                <th className="p-4 font-black">Full Name</th>
                                                <th className="p-4 font-black">Email</th>
                                                <th className="p-4 font-black">WhatsApp</th>
                                                <th className="p-4 font-black text-center">Solved</th>
                                                <th className="p-4 font-black">Role</th>
                                                <th className="p-4 font-black">Source</th>
                                                <th className="p-4 font-black">Status</th>
                                                <th className="p-4 font-black text-right">Last Active</th>
                                                <th className="p-4 font-black text-right">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#202736]">
                                            {users
                                                .filter(u => {
                                                    const matchesSearch = !userSearch || 
                                                        u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                                                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                        u.whatsapp_number?.includes(userSearch);
                                                    
                                                    const matchesStatus = userStatusFilter === 'all' || 
                                                        (userStatusFilter === 'onboarded' && u.onboarding_completed) ||
                                                        (userStatusFilter === 'pending' && !u.onboarding_completed);
                                                    
                                                    return matchesSearch && matchesStatus;
                                                })
                                                .map((u: any) => (
                                                <tr key={u.user_id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-4 font-medium text-white">{u.full_name || '—'}</td>
                                                    <td className="p-4 text-zinc-400">{u.email}</td>
                                                    <td className="p-4">
                                                        {u.whatsapp_number ? (
                                                            <a href={`https://wa.me/${u.whatsapp_number.replace(/\+/g, '')}`} target="_blank" className="text-[#4DD4C4] hover:underline flex items-center gap-1">
                                                                <Phone size={12} /> {u.whatsapp_number}
                                                            </a>
                                                        ) : '—'}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-2 py-0.5 rounded ${u.total_solved > 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-500/10 text-zinc-500'} text-[10px] font-bold`}>
                                                            {u.total_solved || 0}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-zinc-400">{u.job_role || u.occupation || '—'}</td>
                                                    <td className="p-4">
                                                        {u.source ? (
                                                            <span className="px-2 py-0.5 rounded bg-zinc-500/10 text-zinc-500 text-[10px] font-bold uppercase">{u.source}</span>
                                                        ) : '—'}
                                                    </td>
                                                    <td className="p-4">
                                                        {u.onboarding_completed ? (
                                                            <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-tight">Onboarded</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded bg-zinc-500/10 text-zinc-500 text-[10px] font-bold uppercase tracking-tight">Pending</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right text-zinc-500 tabular-nums text-[11px]">
                                                        {u.last_active_at ? new Date(u.last_active_at).toLocaleDateString() : 'Never'}
                                                    </td>
                                                    <td className="p-4 text-right text-zinc-500 tabular-nums">
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length === 0 && (
                                        <div className="p-12 text-center text-zinc-500 italic">No users found.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {membersSubTab === 'wa-group' && (
                            <div className="space-y-4">
                                <div className="bg-[#121826] border border-[#202736] rounded-xl p-4 flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                            WA Group Checklist ({waGroupChecklist.filter(u => u.is_added).length} / {waGroupChecklist.length})
                                        </div>
                                        <div className="h-4 w-px bg-[#202736]" />
                                        <label className="flex items-center gap-2 text-[10px] text-zinc-400 cursor-pointer select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={waFilterOnlyNew} 
                                                onChange={e => setWaFilterOnlyNew(e.target.checked)}
                                                className="w-3 h-3 rounded accent-[#4DD4C4]"
                                            />
                                            New users only
                                        </label>

                                        <label className="flex items-center gap-2 text-[10px] text-zinc-400 cursor-pointer select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={waFilterOnlyPending} 
                                                onChange={e => setWaFilterOnlyPending(e.target.checked)}
                                                className="w-3 h-3 rounded accent-[#4DD4C4]"
                                            />
                                            Show only pending
                                        </label>
                                    </div>
                                    <Button onClick={() => downloadCSV(waGroupChecklist, 'wa_group_checklist.csv')} variant="ghost" size="sm" className="text-[#4DD4C4] hover:text-[#3dbdb0] hover:bg-[#4DD4C4]/10 h-6">
                                        <Download size={12} className="mr-1" /> Export CSV
                                    </Button>
                                </div>

                                <div className="bg-[#121826] border border-[#202736] rounded-xl overflow-hidden flex flex-col h-[600px]">
                                    <div className="divide-y divide-[#202736] overflow-y-auto">
                                        {waGroupChecklist
                                            .filter(u => {
                                                const matchesPending = !waFilterOnlyPending || !u.is_added;
                                                const matchesNew = !waFilterOnlyNew || new Date(u.created_at) >= new Date('2026-05-04');
                                                return matchesPending && matchesNew;
                                            })
                                            .map((u: any) => (
                                                <div key={u.user_id} className={`p-4 flex justify-between items-center transition-colors hover:bg-white/[0.02] ${u.is_added ? 'opacity-50' : ''}`}>
                                                    <div className="flex gap-4 items-center">
                                                        <div 
                                                            onClick={() => toggleWaGroupStatus(u.user_id, u.is_added)}
                                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${u.is_added ? 'bg-green-500 border-green-500' : 'border-[#202736] hover:border-green-500/50'}`}
                                                        >
                                                            {u.is_added && <CheckCircle2 size={14} className="text-black" />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                                {u.full_name || 'Anonymous User'}
                                                                {u.is_added && <span className="text-[10px] text-green-500 font-normal">Added ✓</span>}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                                                <span className="flex items-center gap-1"><Phone size={10} /> {u.whatsapp_number}</span>
                                                                <span className="flex items-center gap-1">Joined: {new Date(u.created_at).toLocaleDateString()}</span>
                                                                {u.is_added && u.added_at && <span>Added at: {new Date(u.added_at).toLocaleDateString()}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a 
                                                            href={`https://wa.me/${u.whatsapp_number.replace(/\D/g, '')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] font-bold hover:bg-green-500/20 transition-colors"
                                                        >
                                                            Open WhatsApp
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        {waGroupChecklist.length === 0 && (
                                            <div className="p-12 text-center text-zinc-500 italic">No users with WhatsApp numbers found.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* ============ FEEDBACK TAB ============ */}
                {activeTab === 'feedback' && (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2"><MessageSquare size={24} className="text-[#4DD4C4]" /> User Feedback</h2>
                            <Button onClick={() => loadFeedbacks()} variant="outline" size="sm" className="border-[#202736] text-zinc-400">
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
                                                &quot;{f.message}&quot;
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
                {/* ============ ANALYTICS TAB ============ */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8 animate-premium-entry pb-12">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <TrendingUp size={28} className="text-[#4DD4C4]" /> 
                                Platform Analytics
                            </h2>
                            <Button onClick={() => loadAnalytics()} variant="outline" size="sm" className="border-[#202736] text-zinc-400 bg-white/5">
                                {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : null} Refresh Data
                            </Button>
                        </div>

                        {/* 1. Summary KPI Cards */}
                        <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Flex alignItems="start">
                                    <div className="truncate">
                                        <Text className="text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">Daily Active Users</Text>
                                        <Metric className="text-white font-light text-4xl mt-2">{analyticsSummary?.dau || 0}</Metric>
                                    </div>
                                </Flex>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Text className="text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">Monthly Active</Text>
                                <Metric className="text-white font-light text-4xl mt-2">{analyticsSummary?.mau || 0}</Metric>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Text className="text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">Total Registered</Text>
                                <Metric className="text-white font-light text-4xl mt-2">{analyticsSummary?.total_users || 0}</Metric>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Text className="text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">Onboarding Rate</Text>
                                <Metric className="text-[#4DD4C4] font-light text-4xl mt-2">{analyticsSummary?.onboarding_rate || 0}%</Metric>
                                <Text className="text-zinc-600 text-[10px] mt-1">{analyticsSummary?.onboarded_users || 0} of {analyticsSummary?.total_users || 0} users</Text>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Text className="text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">Legacy Waitlist</Text>
                                <Metric className="text-white font-light text-4xl mt-2">{analyticsSummary?.total_waitlist || 0}</Metric>
                            </Card>
                        </Grid>

                        {/* 2. Engagement & Retention Overviews */}
                        <Grid numItemsLg={2} className="gap-8">
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Title className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 border-l-2 border-[#4DD4C4] pl-4">
                                    User Acquisition
                                </Title>
                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(analyticsSummary?.signups_trend || []).slice(-30).reverse().map((s: any) => (
                                        <Flex key={s.date} className="border-b border-[#202736]/50 pb-4 last:border-0">
                                            <Text className="text-zinc-400 text-sm">{new Date(s.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                                            <Text className="text-[#4DD4C4] font-mono font-bold text-lg">+{s.count}</Text>
                                        </Flex>
                                    ))}
                                </div>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Title className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 border-l-2 border-[#4DD4C4] pl-4">
                                    Streak Retention
                                </Title>
                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(retentionData?.streaks || []).map((s: any) => (
                                        <div key={s.range} className="space-y-2">
                                            <Flex>
                                                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-[0.1em]">{s.range} Day Progression</Text>
                                                <Text className="text-white text-sm font-mono">{s.count} users</Text>
                                            </Flex>
                                            <CategoryBar
                                                values={[s.count]}
                                                colors={["teal"]}
                                                showLabels={false}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Grid>

                        {/* 3. Problem Performance Table */}
                        <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                <Title className="text-white text-sm font-bold uppercase tracking-[0.2em] border-l-2 border-[#4DD4C4] pl-4">
                                    Detailed Problem Performance
                                </Title>
                                <div className="relative max-w-xs w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                    <input 
                                        type="text"
                                        placeholder="Search problems..."
                                        className="w-full bg-[#0b101c] border border-[#202736] pl-9 pr-4 py-2 rounded-lg text-xs text-white focus:border-[#4DD4C4] focus:outline-none transition-colors"
                                        value={analyticsSearch}
                                        onChange={e => setAnalyticsSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                <TremorTable>
                                    <TableHead className="sticky top-0 bg-[#121826] z-10">
                                        <TableRow className="border-[#202736]">
                                            <TableHeaderCell className="text-zinc-500 text-[10px] uppercase bg-[#121826]">Problem</TableHeaderCell>
                                            <TableHeaderCell className="text-zinc-500 text-[10px] uppercase text-center bg-[#121826]">Total Runs</TableHeaderCell>
                                            <TableHeaderCell className="text-zinc-500 text-[10px] uppercase text-center bg-[#121826]">Success Rate</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {problemStats
                                            .filter(item => item.title.toLowerCase().includes(analyticsSearch.toLowerCase()))
                                            .map((item) => (
                                            <TableRow key={item.id} className="border-[#202736] hover:bg-white/[0.02]">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium text-sm">{item.title}</span>
                                                        <span className="text-[10px] text-zinc-500 uppercase font-bold">{item.difficulty}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-zinc-300 font-mono">{item.total_attempts}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-zinc-300 text-xs mb-1 font-mono">{item.success_rate}%</span>
                                                        <CategoryBar
                                                            values={[item.success_rate, 100 - item.success_rate]}
                                                            colors={["emerald", "red"]}
                                                            className="w-24"
                                                            showLabels={false}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </TremorTable>
                                {problemStats.filter(item => item.title.toLowerCase().includes(analyticsSearch.toLowerCase())).length === 0 && (
                                    <div className="text-center py-10 text-zinc-500 italic text-sm">No problems match your search.</div>
                                )}
                            </div>
                        </Card>

                        {/* 4. Audience Breakdown */}
                        <Grid numItemsSm={1} numItemsLg={3} className="gap-8">
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Title className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 border-l-2 border-[#4DD4C4] pl-4">Audience Roles</Title>
                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(demographics?.roles || []).map((r: any) => (
                                        <Flex key={r.name} className="border-b border-[#202736]/30 pb-3 last:border-0">
                                            <Text className="text-zinc-300 text-sm">{r.name}</Text>
                                            <Text className="text-[#4DD4C4] font-bold">{r.value}</Text>
                                        </Flex>
                                    ))}
                                    {(demographics?.roles || []).length === 0 && <Text className="text-zinc-600 italic text-xs">No user demographic data available.</Text>}
                                </div>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Title className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 border-l-2 border-[#4DD4C4] pl-4">Engagement Leaders</Title>
                                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(sentimentData || []).slice(0, 10).map((s: any) => (
                                        <div key={s.id} className="space-y-2">
                                            <Text className="text-white text-xs font-bold uppercase tracking-tight truncate">{s.title}</Text>
                                            <Flex justifyContent="start" className="gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Likes</span>
                                                    <span className="text-sm text-[#4DD4C4] font-mono">{s.likes}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Comments</span>
                                                    <span className="text-sm text-blue-400 font-mono">{s.comments}</span>
                                                </div>
                                            </Flex>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card className="bg-[#121826] border-[#202736] ring-0 p-8">
                                <Title className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 border-l-2 border-[#4DD4C4] pl-4">Seniority Spread</Title>
                                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(demographics?.experience || []).map((e: any) => (
                                        <div key={e.years} className="space-y-2">
                                            <Flex>
                                                <Text className="text-zinc-400 text-xs font-bold uppercase">{e.years} Year Exp</Text>
                                                <Text className="text-white text-xs font-mono">{e.count} users</Text>
                                            </Flex>
                                            <CategoryBar values={[e.count]} colors={["teal"]} className="h-1.5" showLabels={false} />
                                        </div>
                                    ))}
                                    {(demographics?.experience || []).length === 0 && <Text className="text-zinc-600 italic text-xs">No experience data available.</Text>}
                                </div>
                            </Card>
                        </Grid>
                    </div>
                )}
            </main>

        </div>
    );
}
// redeploy
