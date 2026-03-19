import { getToken } from '@/lib/auth';
import { Attempt, DailyPractice, Dataset, ExecutionResponse, Problem, Streak } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}


async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = getAuthHeaders();

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
    getStats: () => fetchApi<any>('/me/stats'),
    getRecentSubmissions: () => fetchApi<any[]>('/me/submissions'),
    getHeatmap: () => fetchApi<Record<string, number>>('/me/heatmap'),

    // Solutions
    getSavedSolution: (problemId: string) =>
        fetchApi<{ submitted_query: string | null }>(`/me/solutions/${problemId}`),
};
