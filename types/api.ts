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
    difficulty: 'easy' | 'medium' | 'advanced';
    description: string;
    estimated_time_minutes: number;
    challenge_type?: string;
}

export interface Dataset {
    table_name: string;
    schema_sql: string;
    sample_rows: Record<string, any>[];
    column_types?: Record<string, string>;
    seed_data_json?: any;
}

export interface DailyPractice {
    date: string;
    easy?: string | null;
    medium?: string | null;
    advanced?: string | null;
    python_easy?: string | null;
    python_medium?: string | null;
    python_advanced?: string | null;
    pyspark_easy?: string | null;
    pyspark_medium?: string | null;
    pyspark_advanced?: string | null;
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
