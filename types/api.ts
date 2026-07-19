export interface SqlResult {
    columns: string[];
    rows: any[][];
    execution_time_ms: number;
}

export interface TestCaseResult {
    passed: boolean;
    label?: string | null;
    is_hidden: boolean;
    got?: any;
    expected: any | "hidden" | "✓ correct";
    error?: string | null;
}

export interface TestSummary {
    passed: number;
    total: number;
    results: TestCaseResult[];
}

export interface ExecutionResponse {
    status: 'correct' | 'incorrect' | 'error' | 'run_result';
    user: SqlResult | null;      // Present if query ran (SQL/Python/PySpark)
    expected: SqlResult | null;  // Present if solution ran (for comparison)
    error: string | null;        // Runtime/SQL error message
    diff_reason: string | null;  // Why it was incorrect
    test_summary?: TestSummary | null;  // Present for python_dsa problems
}

export interface Problem {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'advanced';
    description: string;
    estimated_time_minutes: number;
    challenge_type?: string;  // 'sql' | 'python' | 'pyspark' | 'python_dsa'
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
    dsa_easy?: string | null;
    dsa_medium?: string | null;
    dsa_advanced?: string | null;
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
