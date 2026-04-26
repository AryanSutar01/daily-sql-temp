export interface Tutorial {
  id: string
  filename: string
  title: string
  description: string
  icon: string
  order: number
}

export const tutorials: Tutorial[] = [
  { id: "introduction-to-sql", filename: "t1.mdx", title: "Introduction to SQL", description: "Understand what SQL is, why it is used, and how it works at a high level.", icon: "Zap", order: 1 },
  { id: "select-and-filtering", filename: "t2.mdx", title: "SELECT & Filtering", description: "Learn how to query data using SELECT, and filter results using WHERE, LIKE, and IN.", icon: "Search", order: 2 },
  { id: "sorting-and-limiting", filename: "t3.mdx", title: "Sorting & Limiting", description: "Control the order and number of rows returned using ORDER BY and LIMIT.", icon: "ArrowUpDown", order: 3 },
  { id: "aggregations", filename: "t4.mdx", title: "Aggregations", description: "Summarize and group data using aggregate functions, GROUP BY, and HAVING.", icon: "BarChart3", order: 4 },
  { id: "joins", filename: "t5.mdx", title: "JOINs", description: "Learn how to combine data from multiple tables using JOIN operations.", icon: "GitMerge", order: 5 },
  { id: "subqueries-and-ctes", filename: "t6.mdx", title: "Subqueries & CTEs", description: "Write powerful nested queries using subqueries and clean reusable logic using Common Table Expressions.", icon: "Puzzle", order: 6 },
  { id: "window-functions", filename: "t7.mdx", title: "Window Functions", description: "Perform calculations across rows related to the current row without collapsing results using window functions.", icon: "AppWindow", order: 7 },
  { id: "indexes-and-query-optimization", filename: "t8.mdx", title: "Indexes & Query Optimization", description: "Speed up queries dramatically by understanding how indexes work and how to write efficient SQL.", icon: "Gauge", order: 8 },
  { id: "transactions-and-acid", filename: "t9.mdx", title: "Transactions & ACID", description: "Ensure data integrity and consistency using transactions and understand the ACID properties.", icon: "Lock", order: 9 },
  { id: "normalization-and-schema-design", filename: "t10.mdx", title: "Normalization & Schema Design", description: "Design clean, efficient, and scalable database schemas using normalization principles.", icon: "Building2", order: 10 },
].sort((a, b) => a.order - b.order)
