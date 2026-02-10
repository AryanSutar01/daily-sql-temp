export interface SqlResult {
    columns: string[];
    rows: any[][];
    execution_time_ms: number;
}

export interface ExecutionResponse {
    status: 'correct' | 'incorrect' | 'error';
    user: SqlResult | null;      // Present if query ran
    expected: SqlResult | null;  // Present if solution ran (for comparison)
    error: string | null;        // Runtime/SQL error message
    diff_reason: string | null;  // Why it was incorrect
}

export interface Problem {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    estimated_time_minutes: number;
}

export interface Dataset {
    table_name: string;
    schema_sql: string;
    sample_rows: Record<string, any>[];
}

export interface DailyPractice {
    date: string;
    easy: string;
    medium: string;
    advanced: string;
}

export interface Streak {
    current_streak: number;
    last_active_date: string | null;
}

export interface Attempt {
    problem_id: string;
    status: 'correct' | 'incorrect' | 'error';
    execution_time_ms: number;
}
