import { createClient } from '@/lib/supabase/client';
import { Attempt, DailyPractice, Dataset, ExecutionResponse, Problem, Streak } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders() {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }
    } catch {
        // Supabase not configured (local dev without env vars) — skip auth header
    }

    return headers;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.detail || `API Error: ${res.status}`);
    }

    return res.json();
}

export const api = {
    // Execution
    execute: (problem_id: string, query: string) =>
        fetchApi<ExecutionResponse>('/execute', {
            method: 'POST',
            body: JSON.stringify({ problem_id, query }),
        }),

    // Daily Practice
    getDailyPractice: () => fetchApi<DailyPractice>('/practice/today'),

    // Problems
    getProblems: () => fetchApi<Problem[]>('/problems'),
    getProblem: (id: string) => fetchApi<Problem>(`/problems/${id}`),
    getDatasets: (id: string) => fetchApi<Dataset[]>(`/problems/${id}/datasets`),
    getExpectedOutput: (id: string) => fetchApi<{ columns: string[]; rows: any[][] }>(`/problems/${id}/expected`),

    // User Progress
    getStreak: () => fetchApi<Streak>('/me/streak'),
    getTodayAttempts: () => fetchApi<Attempt[]>('/me/attempts/today'),

    // Profiles & Onboarding
    getProfile: () => fetchApi<any>('/me/profile'),
    updateProfile: (data: any) =>
        fetchApi<any>('/me/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Solutions
    getSavedSolution: (problemId: string) =>
        fetchApi<{ submitted_query: string | null }>(`/me/solutions/${problemId}`),
};
