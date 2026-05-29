export interface Tutorial {
  id: string
  filename: string
  title: string
  description: string
  order: number
  category: 'beginner' | 'intermediate' | 'advance' | 'designAndPerformance' | 'bonus'
  tags: ('concept' | 'practice' | 'interview')[]
}

export const tutorials = ([
  
  {
    id: "what-is-sql-and-rdbms",
    filename: "t1.mdx",
    title: "What is SQL & RDBMS?",
    description: "Understand what SQL is, what a Relational Database Management System is, and how they work together.",
    order: 1,
    category: 'beginner',
    tags: ['concept']
  },
  {
    id: "data-types",
    filename: "t2.mdx",
    title: "Data types",
    description: "Learn all SQL data types - numeric, string, date, boolean, and JSON - and how to choose the right one for every column.",
    order: 2,
    category: 'beginner',
    tags: ['concept', 'interview']
  },
  {
    id: "create-alter-drop",
    filename: "t3.mdx",
    title: "CREATE, ALTER, DROP",
    description: "Master DDL commands to create database structures, modify existing tables, and safely remove objects.",
    order: 3,
    category: 'beginner',
    tags: ['practice']
  },
  {
    id: "insert-update-delete",
    filename: "t4.mdx",
    title: "INSERT, UPDATE, DELETE",
    description: "Add, modify, and remove data using DML commands with real-world patterns and safety practices.",
    order: 4,
    category: 'beginner',
    tags: ['practice', 'interview']
  },
  {
    id: "select-and-from",
    filename: "t5.mdx",
    title: "SELECT & FROM",
    description: "Master the foundation of every SQL query - selecting columns, filtering data, using aliases, and controlling what you retrieve.",
    order: 5,
    category: 'beginner',
    tags: ['practice']
  },
  {
    id: "where-clause-and-operators",
    filename: "t6.mdx",
    title: "WHERE clause & operators",
    description: "Filter rows precisely using WHERE with comparison operators, logical operators, BETWEEN, IN, LIKE, and NULL checks.",
    order: 6,
    category: 'beginner',
    tags: ['practice', 'interview']
  },
  {
    id: "orderby-and-limit",
    filename: "t7.mdx",
    title: "ORDER BY & LIMIT",
    description: "Sort query results and control how many rows are returned - essential for pagination, leaderboards, and top-N queries.",
    order: 7,
    category: 'beginner',
    tags: ['practice']
  },
  {
    id: "distinct-and-aliases",
    filename: "t8.mdx",
    title: "DISTINCT & aliases",
    description: "Remove duplicate rows with DISTINCT and make queries more readable using column and table aliases.",
    order: 8,
    category: 'beginner',
    tags: ['concept']
  },
  {
    id: "null-handling",
    filename: "t9.mdx",
    title: "NULL handling (IS NULL, COALESCE)",
    description: "Understand what NULL means in SQL, why it behaves unexpectedly, and how to handle it safely in queries.",
    order: 9,
    category: 'beginner',
    tags: ['interview']
  },
  {
    id: "comments-and-sql-formatting",
    filename: "t10.mdx",
    title: "Comments & SQL formatting",
    description: "Write readable, maintainable SQL using comments and consistent formatting conventions.",
    order: 10,
    category: 'beginner',
    tags: ['concept']
  },

  // INTERMEDIATE - Core Querying (14 topics)
  {
    id: "aggregate-functions",
    filename: "t11.mdx",
    title: "Aggregate Functions (SUM, COUNT, AVG...)",
    description: "Summarize data using COUNT, SUM, AVG, MIN, and MAX - the foundation of all reporting queries.",
    order: 11,
    category: 'intermediate',
    tags: ['interview', 'practice']
  },
  {
    id: "group-by-and-having",
    filename: "t12.mdx",
    title: "GROUP BY & HAVING",
    description: "Group rows and filter aggregated results - the engine behind every report, dashboard, and analytics query.",
    order: 12,
    category: 'intermediate',
    tags: ['interview', 'practice']
  },
  {
    id: "inner-join",
    filename: "t13.mdx",
    title: "INNER JOIN",
    description: "Combine rows from two tables when they have matching values - the most common JOIN type.",
    order: 13,
    category: 'intermediate',
    tags: ['interview', 'practice']
  },
  {
    id: "left-right-full-outer-join",
    filename: "t14.mdx",
    title: "LEFT, RIGHT & FULL OUTER JOIN",
    description: "Retrieve all rows from one or both tables regardless of whether a match exists - filling NULLs where there is no match.",
    order: 14,
    category: 'intermediate',
    tags: ['interview', 'practice']
  },
  {
    id: "self-join",
    filename: "t15.mdx",
    title: "SELF JOIN",
    description: "Join a table to itself to compare rows within the same dataset or navigate hierarchical data.",
    order: 15,
    category: 'intermediate',
    tags: ['interview']
  },
  {
    id: "cross-join",
    filename: "t16.mdx",
    title: "CROSS JOIN",
    description: "Generate every possible combination of rows from two tables - the cartesian product.",
    order: 16,
    category: 'intermediate',
    tags: ['concept']
  },
  {
    id: "union-intersect-except",
    filename: "t17.mdx",
    title: "UNION, UNION ALL, INTERSECT, EXCEPT",
    description: "Combine results of multiple queries using set operations - stack, intersect, or subtract result sets.",
    order: 17,
    category: 'intermediate',
    tags: ['interview']
  },
  {
    id: "subqueries",
    filename: "t18.mdx",
    title: "Subqueries (Scalar, Correlated)",
    description: "Nest queries inside other queries to filter, calculate, or derive data - and understand when to use each type.",
    order: 18,
    category: 'intermediate',
    tags: ['interview', 'practice']
  },
  {
    id: "in-exists-any-all",
    filename: "t19.mdx",
    title: "IN, EXISTS, ANY, ALL",
    description: "Use set membership and existence checks to write powerful, correct filter conditions - and understand the critical NULL traps.",
    order: 19,
    category: 'intermediate',
    tags: ['interview']
  },
  {
    id: "case-when-expressions",
    filename: "t20.mdx",
    title: "CASE WHEN Expressions",
    description: "Add conditional logic to SQL queries - SQL's powerful if-else that works in SELECT, WHERE, ORDER BY, and aggregations.",
    order: 20,
    category: 'intermediate',
    tags: ['interview', 'practice']
  },
  {
    id: "string-functions",
    filename: "t21.mdx",
    title: "String Functions (CONCAT, SUBSTRING, TRIM...)",
    description: "Manipulate, search, and transform text data using SQL's built-in string functions.",
    order: 21,
    category: 'intermediate',
    tags: ['practice']
  },
  {
    id: "date-time-functions",
    filename: "t22.mdx",
    title: "Date & Time Functions",
    description: "Work with dates and timestamps - extract parts, calculate differences, truncate, format, and handle timezones correctly.",
    order: 22,
    category: 'intermediate',
    tags: ['practice', 'interview']
  },
  {
    id: "math-numeric-functions",
    filename: "t23.mdx",
    title: "Math & Numeric Functions",
    description: "Perform rounding, absolute values, modulo, power, and other numeric calculations in SQL.",
    order: 23,
    category: 'intermediate',
    tags: ['practice']
  },
  {
    id: "like-wildcards-regexp",
    filename: "t24.mdx",
    title: "LIKE & Wildcards, REGEXP",
    description: "Search for patterns in text using LIKE wildcards and powerful regular expressions.",
    order: 24,
    category: 'intermediate',
    tags: ['practice']
  },

  // UPPER INTERMEDIATE - Advanced Querying (10 topics)
  {
    id: "window-functions-basics",
    filename: "t25.mdx",
    title: "Window Functions (ROW_NUMBER, RANK, DENSE_RANK)",
    description: "Perform calculations across related rows without collapsing the result - the most powerful feature in SQL.",
    order: 25,
    category: 'advance',
    tags: ['interview', 'practice']
  },
  {
    id: "window-functions-advanced",
    filename: "t26.mdx",
    title: "LAG, LEAD, FIRST_VALUE, LAST_VALUE",
    description: "Access values from other rows in the window - compare current values to previous or next rows without a self-join.",
    order: 26,
    category: 'advance',
    tags: ['interview']
  },
  {
    id: "partition-by-vs-group-by",
    filename: "t27.mdx",
    title: "PARTITION BY vs GROUP BY",
    description: "Understand the fundamental difference between GROUP BY and PARTITION BY - and when to use each.",
    order: 27,
    category: 'advance',
    tags: ['interview', 'concept']
  },
  {
    id: "ctes-with-clause",
    filename: "t28.mdx",
    title: "CTEs (WITH Clause)",
    description: "Write clean, readable, and reusable multi-step queries using Common Table Expressions.",
    order: 28,
    category: 'advance',
    tags: ['interview', 'practice']
  },
  {
    id: "recursive-ctes",
    filename: "t29.mdx",
    title: "Recursive CTEs",
    description: "Traverse hierarchical and graph data - org charts, category trees, and path-finding - using recursive SQL.",
    order: 29,
    category: 'advance',
    tags: ['concept', 'practice']
  },
  {
    id: "views",
    filename: "t30.mdx",
    title: "Views",
    description: "Create reusable virtual tables, simplify complex queries, implement security layers, and cache results with materialized views.",
    order: 30,
    category: 'advance',
    tags: ['interview', 'concept']
  },
  {
    id: "stored-procedures",
    filename: "t31.mdx",
    title: "Stored Procedures",
    description: "Encapsulate multi-step business logic in the database using stored procedures with transaction control.",
    order: 31,
    category: 'advance',
    tags: ['interview']
  },
  {
    id: "functions-udfs",
    filename: "t32.mdx",
    title: "Functions (UDFs)",
    description: "Create reusable custom functions to encapsulate calculations, transformations, and business logic.",
    order: 32,
    category: 'advance',
    tags: ['concept']
  },
  {
    id: "triggers",
    filename: "t33.mdx",
    title: "Triggers",
    description: "Automatically execute logic before or after INSERT, UPDATE, or DELETE events using triggers.",
    order: 33,
    category: 'advance',
    tags: ['interview', 'concept']
  },
  {
    id: "temporary-tables",
    filename: "t34.mdx",
    title: "Temporary Tables & Table Variables",
    description: "Use temporary tables to store intermediate results within a session for complex multi-step data processing.",
    order: 34,
    category: 'advance',
    tags: ['practice']
  },

  // ADVANCED - Design & Performance (12 topics)
  {
    id: "normalization",
    filename: "t35.mdx",
    title: "Normalization (1NF–3NF, BCNF)",
    description: "Design clean, redundancy-free databases using normalization rules - 1NF, 2NF, 3NF, and BCNF explained with examples.",
    order: 35,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },
  {
    id: "denormalization",
    filename: "t36.mdx",
    title: "Denormalization & Trade-offs",
    description: "Understand when and how to intentionally break normalization rules for performance, and the trade-offs involved.",
    order: 36,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },
  {
    id: "keys",
    filename: "t37.mdx",
    title: "Primary, Foreign & Composite Keys",
    description: "Understand how keys enforce uniqueness, create relationships, and maintain referential integrity across tables.",
    order: 37,
    category: 'designAndPerformance',
    tags: ['interview']
  },
  {
    id: "indexes",
    filename: "t38.mdx",
    title: "Indexes (Types, When to Use)",
    description: "Speed up queries with indexes - understand B-Tree, Hash, GIN, partial, and covering indexes, and when each applies.",
    order: 38,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },
  {
    id: "query-execution-plan",
    filename: "t39.mdx",
    title: "Query Execution Plan & EXPLAIN",
    description: "Read and interpret EXPLAIN output to understand how PostgreSQL executes your queries and identify performance bottlenecks.",
    order: 39,
    category: 'designAndPerformance',
    tags: ['interview', 'practice']
  },
  {
    id: "query-optimization",
    filename: "t40.mdx",
    title: "Query Optimization Techniques",
    description: "Systematic techniques to rewrite slow queries - filter early, avoid anti-patterns, and choose the right approach for each scenario.",
    order: 40,
    category: 'designAndPerformance',
    tags: ['interview']
  },
  {
    id: "acid-properties",
    filename: "t41.mdx",
    title: "ACID Properties",
    description: "Understand the four guarantees that make database transactions reliable - Atomicity, Consistency, Isolation, and Durability.",
    order: 41,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },
  {
    id: "transactions",
    filename: "t42.mdx",
    title: "Transactions & COMMIT, ROLLBACK",
    description: "Group SQL statements into atomic units, control them with COMMIT and ROLLBACK, and use SAVEPOINTs for partial rollbacks.",
    order: 42,
    category: 'designAndPerformance',
    tags: ['interview', 'practice']
  },
  {
    id: "locks-concurrency",
    filename: "t43.mdx",
    title: "Locks & Concurrency Control",
    description: "Understand how databases handle simultaneous access - row locks, table locks, deadlocks, and MVCC.",
    order: 43,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },
  {
    id: "isolation-levels",
    filename: "t44.mdx",
    title: "Isolation Levels (READ COMMITTED, SERIALIZABLE...)",
    description: "Control how much one transaction can see of another's work - understand the four isolation levels and their trade-offs.",
    order: 44,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },
  {
    id: "partitioning-sharding",
    filename: "t45.mdx",
    title: "Partitioning & Sharding",
    description: "Scale databases to handle billions of rows - understand range, list, and hash partitioning, and horizontal sharding strategies.",
    order: 45,
    category: 'designAndPerformance',
    tags: ['concept', 'interview']
  },
  {
    id: "sql-vs-nosql",
    filename: "t46.mdx",
    title: "SQL vs NoSQL",
    description: "Understand when to use relational SQL databases vs NoSQL alternatives - and how to make the right choice for your use case.",
    order: 46,
    category: 'designAndPerformance',
    tags: ['interview', 'concept']
  },

  // BONUS - Real-world & Analytics (6 topics)
  {
    id: "pivot-unpivot",
    filename: "t47.mdx",
    title: "Pivot & Unpivot Tables",
    description: "Transform rows into columns (pivot) and columns into rows (unpivot) for reporting and analytics.",
    order: 47,
    category: 'bonus',
    tags: ['practice', 'interview']
  },
  {
    id: "running-totals-moving-averages",
    filename: "t48.mdx",
    title: "Running Totals & Moving Averages",
    description: "Calculate cumulative sums, running averages, and moving windows - essential for time-series analysis and dashboards.",
    order: 48,
    category: 'bonus',
    tags: ['practice']
  },
  {
    id: "gap-island-problems",
    filename: "t49.mdx",
    title: "Gap & Island Problems",
    description: "Detect consecutive sequences, find missing values, and group continuous runs of data - a classic advanced SQL pattern.",
    order: 49,
    category: 'bonus',
    tags: ['interview', 'practice']
  },
  {
    id: "json-in-sql",
    filename: "t50.mdx",
    title: "JSON in SQL (PostgreSQL, MySQL)",
    description: "Store, query, index, and manipulate JSON data directly in SQL databases - making your schema more flexible.",
    order: 50,
    category: 'bonus',
    tags: ['practice']
  },
  {
    id: "sql-for-data-analysis",
    filename: "t51.mdx",
    title: "SQL for Data Analysis (Cohorts, Funnels, Retention)",
    description: "Build real-world analytics queries - cohort analysis, funnel analysis, and retention metrics used by data teams everywhere.",
    order: 51,
    category: 'bonus',
    tags: ['interview', 'practice']
  },
  {
    id: "sql-dialect-differences",
    filename: "t52.mdx",
    title: "SQL Dialect Differences (MySQL, PostgreSQL, SQLite, MSSQL)",
    description: "Navigate the key syntax differences between SQL databases - so you can adapt your skills across any system.",
    order: 52,
    category: 'bonus',
    tags: ['concept']
  },
] satisfies Tutorial[]).sort((a, b) => a.order - b.order)

// Helper function to group tutorials by category
export function getTutorialsByCategory(){
  return {
    beginner: tutorials.filter(t => t.category === 'beginner'),
    intermediate: tutorials.filter(t => t.category === 'intermediate'),
    advance: tutorials.filter(t => t.category === 'advance'),
    designAndPerformance: tutorials.filter(t => t.category === 'designAndPerformance'),
    bonus: tutorials.filter(t => t.category === 'bonus')
  }
}
