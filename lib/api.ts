import { getToken, clearToken } from '@/lib/auth';
import { Attempt, DailyPractice, Dataset, ExecutionResponse, Problem, Streak } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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
        headers: { ...headers, ...options.headers },
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        if (res.status === 401 && typeof errorBody.detail === 'string' && (errorBody.detail.includes('token') || errorBody.detail.includes('Signature'))) {
            clearToken();
        }
        throw new Error(errorBody.detail || `API Error: ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : ({} as T);
}

export const api = {
    // Execution
    execute: (problem_id: string, query: string, mode: 'run' | 'submit' = 'submit', sql_dialect: 'postgresql' | 'mysql' = 'postgresql') =>
        fetchApi<ExecutionResponse>('/execute', {
            method: 'POST',
            body: JSON.stringify({ problem_id, query, mode, sql_dialect }),
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
    getPublicProfile: (username: string) => fetchApi<any>(`/u/${username}`),
    updateProfile: (data: any) =>
        fetchApi<any>('/me/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getStats: () => fetchApi<any>('/me/stats'),
    getRecentSubmissions: () => fetchApi<any[]>('/me/submissions'),
    getHeatmap: () => fetchApi<Record<string, number>>('/me/heatmap'),
    getSolvedIds: () => fetchApi<{ solved_ids: string[] }>('/me/solved-ids'),
    getLeaderboard: (limit = 20, offset = 0) =>
        fetchApi<{ entries: any[]; total: number; limit: number; offset: number }>(
            `/leaderboard?limit=${limit}&offset=${offset}`
        ),
    getMyLeaderboardRank: () =>
        fetchApi<{ rank: number; total_solved: number; current_streak: number }>('/leaderboard/me'),
    getCloudinarySignature: () => fetchApi<{
        signature: string;
        timestamp: number;
        api_key: string;
        cloud_name: string;
        public_id: string;
        folder: string;
    }>('/me/cloudinary-signature'),

    // Solutions
    getSavedSolution: (problemId: string) =>
        fetchApi<{ submitted_query: string | null }>(`/me/solutions/${problemId}`),
    getPublicSavedSolution: (username: string, problemId: string) =>
        fetchApi<{ submitted_query: string | null }>(`/u/${username}/solutions/${problemId}`),

    // Votes (likes)
    getProblemVotes: (problemId: string) =>
        fetchApi<{ likes: number; user_has_voted: boolean }>(`/problems/${problemId}/votes`),
    voteProblem: (problemId: string) =>
        fetchApi<{ action: string; likes: number; user_has_voted: boolean }>(`/problems/${problemId}/votes`, {
            method: 'POST',
        }),

    // Comments / Discussion
    getCommentCount: (problemId: string) =>
        fetchApi<{ count: number }>(`/problems/${problemId}/comments?count_only=true`),
    getComments: (problemId: string, offset = 0) =>
        fetchApi<any[]>(`/problems/${problemId}/comments?limit=30&offset=${offset}`),
    postComment: (problemId: string, body: string, parentId?: string) =>
        fetchApi<any>(`/problems/${problemId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ body, parent_id: parentId ?? null }),
        }),
    deleteComment: (commentId: string) =>
        fetchApi<void>(`/comments/${commentId}`, { method: 'DELETE' }),
    voteComment: (commentId: string, voteType: number) =>
        fetchApi<any>(`/comments/${commentId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ vote_type: voteType }),
        }),

    // Feedback
    submitFeedback: (data: { rating?: number; message?: string; source: string; problem_id?: string; email?: string }) =>
        fetchApi<{ id: string; created_at: string }>('/feedback', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Subscriptions & Payments
    getMySubscription: () => fetchApi<any>('/api/payments/my-subscription'),
    cancelSubscription: () =>
        fetchApi<any>('/api/payments/cancel', {
            method: 'POST',
            body: JSON.stringify({ reason: 'User requested' }),
        }),
    createPaymentOrder: (plan_id: string) =>
        fetchApi<any>('/api/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ plan_id }),
        }),
    verifyPaymentOrder: (order_id: string) =>
        fetchApi<any>(`/api/payments/verify-order/${order_id}`),

    // Coupons & Launch Status
    redeemCoupon: (code: string) =>
        fetchApi<any>('/api/coupons/redeem', {
            method: 'POST',
            body: JSON.stringify({ code }),
        }),
    checkCoupon: (code: string) => fetchApi<any>(`/api/coupons/check/${code}`),
    getLaunchStatus: () => fetchApi<any>('/api/coupons/launch-status'),
};

