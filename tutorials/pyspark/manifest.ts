import { Tutorial } from "../shared";

export const tutorials = ([
    {
        id: "what-is-apache-spark",
        filename: 't1.mdx',
        title: "What is Apache Spark & Why It Exists",
        description: "Understand why Apache Spark was built, what problems it solves over Hadoop MapReduce, and why it dominates large-scale data processing today.",
        category: "foundation",
        order: 1,
        tags: ["interview", "concept"]
    },
    {
        id: "spark-architecture",
        filename: 't2.mdx',
        title: "Spark Architecture (Driver, Executor, Cluster)",
        description: "Understand how Spark distributes work across a cluster - the roles of the Driver, Executors, Cluster Manager, and how they coordinate.",
        category: "foundation",
        order: 2,
        tags: ["interview", "concept"]
    },
    {
        id: "sparksession-and-sparkcontext",
        filename: 't3.mdx',
        title: "SparkSession & SparkContext",
        description: "Learn how to initialize a Spark application with SparkSession and SparkContext - the entry points to all Spark functionality.",
        category: "foundation",
        order: 3,
        tags: ["interview", "practice"]
    },
    {
        id: "rdd-what-it-is-and-when-to-use",
        filename: 't4.mdx',
        title: "RDD - What It Is & When to Use",
        description: "Understand Resilient Distributed Datasets (RDDs) - Spark's foundational data structure, how they work, and when you'd choose them over DataFrames.",
        category: "foundation",
        order: 4,
        tags: ["interview", "concept"]
    },
    {
        id: "dataframe-vs-rdd-vs-dataset",
        filename: 't5.mdx',
        title: "DataFrame vs RDD vs Dataset",
        description: "Understand the three core data abstractions in Spark - RDD, DataFrame, and Dataset - when to use each, and why DataFrames dominate modern PySpark.",
        category: "foundation",
        order: 5,
        tags: ["interview", "concept"]
    },
    {
        id: "reading-data-csv-json-parquet-orc",
        filename: 't6.mdx',
        title: "Reading Data (CSV, JSON, Parquet, ORC)",
        description: "Learn how to read data from all major file formats in PySpark - CSV, JSON, Parquet, ORC - with schema control, options, and best practices.",
        category: "foundation",
        order: 6,
        tags: ["practice"]
    },
    {
        id: "writing-and-saving-output",
        filename: 't7.mdx',
        title: "Writing & Saving Output",
        description: "Learn how to write PySpark DataFrames to disk in various formats - CSV, JSON, Parquet, ORC - with partitioning, save modes, and compression options.",
        category: "foundation",
        order: 7,
        tags: ["practice"]
    },
    {
        id: "transformations-vs-actions",
        filename: 't8.mdx',
        title: "Transformations vs Actions",
        description: "Understand the fundamental distinction between transformations (lazy) and actions (eager) in PySpark - and why this separation is the foundation of Spark's performance model.",
        category: "foundation",
        order: 8,
        tags: ["interview", "concept"]
    },
    {
        id: "lazy-evaluation",
        filename: 't9.mdx',
        title: "Lazy Evaluation",
        description: "Understand how Spark's lazy evaluation model defers computation until necessary - enabling query optimization, fault tolerance, and efficient execution.",
        category: "foundation",
        order: 9,
        tags: ["interview", "concept"]
    },
    {
        id: "select-filter-where-drop",
        filename: 't10.mdx',
        title: "select, filter, where, drop",
        description: "Master the most essential DataFrame operations in PySpark - selecting columns, filtering rows, and dropping unwanted columns with real examples.",
        category: "intermediate",
        order: 10,
        tags: ["interview", "practice"]
    },
    {
        id: "withcolumn-and-column-expressions",
        filename: 't11.mdx',
        title: "withColumn & Column Expressions",
        description: "Add, modify, rename, and transform columns in PySpark DataFrames using withColumn and the full range of column expression techniques.",
        category: "intermediate",
        order: 11,
        tags: ["interview", "practice"]
    },
    {
        id: "groupby-and-aggregate-functions",
        filename: 't12.mdx',
        title: "groupBy & Aggregate Functions",
        description: "Group and aggregate data in PySpark using groupBy with count, sum, avg, min, max, and advanced aggregations - the foundation of analytical queries.",
        category: "intermediate",
        order: 12,
        tags: ["interview", "practice"]
    },
    {
        id: "orderby-and-sort",
        filename: 't13.mdx',
        title: "orderBy & sort",
        description: "Sort PySpark DataFrames by one or more columns, ascending or descending, with null handling - and understand the performance implications.",
        category: "intermediate",
        order: 13,
        tags: ["practice"]
    },
    {
        id: "joins-inner-left-right-full-semi-anti",
        filename: 't14.mdx',
        title: "Joins (inner, left, right, full, semi, anti)",
        description: "Master all PySpark join types with clear examples, syntax, and when-to-use guidance for inner, left, right, full outer, semi, and anti joins.",
        category: "intermediate",
        order: 14,
        tags: ["interview", "practice"]
    },
    {
        id: "union-and-unionbyname",
        filename: 't15.mdx',
        title: "union & unionByName",
        description: "Combine multiple PySpark DataFrames vertically using union and unionByName, understanding the key differences and when to use each.",
        category: "intermediate",
        order: 15,
        tags: ["practice"]
    },
    {
        id: "handling-nulls-fillna-dropna-coalesce",
        filename: 't16.mdx',
        title: "Handling Nulls (fillna, dropna, coalesce)",
        description: "Handle missing data in PySpark DataFrames using fillna, dropna, coalesce, and null-safe comparisons - a critical skill for real-world data pipelines.",
        category: "intermediate",
        order: 16,
        tags: ["interview", "practice"]
    },
    {
        id: "built-in-functions",
        filename: 't17.mdx',
        title: "Built-in Functions (pyspark.sql.functions)",
        description: "Explore PySpark's extensive library of built-in functions for math, strings, arrays, aggregations, and more - the toolkit every PySpark developer must know.",
        category: "intermediate",
        order: 17,
        tags: ["interview", "practice"]
    },
    {
        id: "string-and-date-timestamp-functions",
        filename: 't18.mdx',
        title: "String & Date/Timestamp Functions",
        description: "Deep dive into PySpark's string manipulation and date/timestamp functions - parsing, formatting, arithmetic, extraction, and regex operations with real examples.",
        category: "intermediate",
        order: 18,
        tags: ["practice"]
    },
    {
        id: "when-otherwise-case-when",
        filename: 't19.mdx',
        title: "when / otherwise (CASE WHEN Equivalent)",
        description: "Use PySpark's when/otherwise to write conditional logic inline - the equivalent of SQL's CASE WHEN THEN ELSE END, with real-world examples.",
        category: "intermediate",
        order: 19,
        tags: ["interview", "practice"]
    },
    {
        id: "spark-sql-createorreplacetempview",
        filename: 't20.mdx',
        title: "Spark SQL (createOrReplaceTempView)",
        description: "Run full SQL queries on PySpark DataFrames using createOrReplaceTempView and spark.sql() - combining the power of SQL with Spark's distributed engine.",
        category: "intermediate",
        order: 20,
        tags: ["interview", "practice"]
    },
    {
        id: "dropduplicates-and-distinct",
        filename: 't21.mdx',
        title: "dropDuplicates & distinct",
        description: "Remove duplicate rows from PySpark DataFrames using distinct() and dropDuplicates() - understanding the difference, performance, and practical patterns.",
        category: "intermediate",
        order: 21,
        tags: ["practice"]
    },
    {
        id: "window-functions-rank-dense-rank-row-number",
        filename: 't22.mdx',
        title: "Window Functions (rank, dense_rank, row_number)",
        description: "Master PySpark window functions - rank, dense_rank, and row_number - to perform ranking operations over partitioned data without collapsing rows.",
        category: "advance",
        order: 22,
        tags: ["interview", "practice"]
    },
    {
        id: "lag-lead-ntile-over-windows",
        filename: 't23.mdx',
        title: "lag, lead, ntile over Windows",
        description: "Use PySpark window functions lag, lead, and ntile to access neighboring rows and divide data into equal buckets - essential for time-series and percentile analysis.",
        category: "advance",
        order: 23,
        tags: ["interview"]
    },
    {
        id: "partitionby-in-window-spec",
        filename: 't24.mdx',
        title: "partitionBy in Window Spec",
        description: "Understand how partitionBy in Window specifications controls the scope of window function calculations - and how to build complex window specs for real analytical queries.",
        category: "advance",
        order: 24,
        tags: ["interview", "concept"]
    },
    {
        id: "udfs-and-pandas-udfs",
        filename: 't25.mdx',
        title: "UDFs & Pandas UDFs (Vectorized)",
        description: "Write custom transformation logic in PySpark using regular UDFs and high-performance pandas UDFs (vectorized UDFs) - with performance tradeoffs and best practices.",
        category: "advance",
        order: 25,
        tags: ["interview", "practice"]
    },
    {
        id: "schema-definition-and-structtype",
        filename: 't26.mdx',
        title: "Schema Definition & StructType",
        description: "Define, enforce, and inspect DataFrame schemas using StructType and StructField - the foundation of type-safe, production-grade PySpark pipelines.",
        category: "advance",
        order: 26,
        tags: ["interview", "practice"]
    },
    {
        id: "arrays-and-maps",
        filename: 't27.mdx',
        title: "Arrays & Maps (explode, collect_list)",
        description: "Work with array and map columns in PySpark - explode nested collections into rows, collect rows into arrays, and apply array/map transformation functions.",
        category: "advance",
        order: 27,
        tags: ["interview", "practice"]
    },
    {
        id: "nested-and-complex-types",
        filename: 't28.mdx',
        title: "Nested & Complex Types (struct, array, map)",
        description: "Read, flatten, and transform nested JSON-style data with structs, arrays, and maps - a must-have skill for working with real-world semi-structured data sources.",
        category: "advance",
        order: 28,
        tags: ["practice"]
    },
    {
        id: "pivot-and-unpivot",
        filename: 't29.mdx',
        title: "Pivot & Unpivot in PySpark",
        description: "Reshape DataFrames between long and wide formats using pivot and unpivot (stack) - a critical skill for building reports, cross-tabs, and preparing data for analytics.",
        category: "advance",
        order: 29,
        tags: ["interview", "practice"]
    },
    {
        id: "broadcast-join-and-join-hints",
        filename: 't30.mdx',
        title: "Broadcast Join & Join Hints",
        description: "Understand how broadcast joins eliminate shuffle overhead for small-large table joins, how to apply join hints, and when each join strategy is optimal.",
        category: "advance",
        order: 30,
        tags: ["interview", "concept"]
    },
    {
        id: "accumulator-and-broadcast-variables",
        filename: 't31.mdx',
        title: "Accumulator & Broadcast Variables",
        description: "Use PySpark's shared variables - accumulators for distributed counters and broadcast variables for efficient read-only data sharing - to write smarter distributed programs.",
        category: "advance",
        order: 31,
        tags: ["interview", "concept"]
    },
    {
        id: "delta-lake-acid-merge-time-travel",
        filename: 't32.mdx',
        title: "Delta Lake - ACID on Spark, Merge, Time Travel",
        description: "Learn how Delta Lake adds ACID transactions, MERGE/upsert operations, and time travel to data lakes - the backbone of the modern Lakehouse architecture.",
        category: "advance",
        order: 32,
        tags: ["interview", "concept"]
    },
    {
        id: "structured-streaming-basics",
        filename: 't33.mdx',
        title: "Structured Streaming Basics",
        description: "Build real-time data pipelines using PySpark Structured Streaming - reading from Kafka and files, applying transformations, and writing to Delta Lake.",
        category: "advance",
        order: 33,
        tags: ["interview", "concept"]
    },
    {
        id: "pyspark-with-kafka",
        filename: 't34.mdx',
        title: "PySpark with Kafka",
        description: "Integrate PySpark with Apache Kafka to read, parse, process, and write streaming data - the standard real-time pipeline in modern data engineering.",
        category: "advance",
        order: 34,
        tags: ["interview", "practice"]
    },
    {
        id: "pyspark-on-databricks-emr-dataproc",
        filename: 't35.mdx',
        title: "PySpark on Databricks / EMR / GCP Dataproc",
        description: "Run PySpark in the cloud on Databricks, Amazon EMR, and GCP Dataproc - understanding the differences, tradeoffs, and how to submit and manage jobs.",
        category: "advance",
        order: 35,
        tags: ["interview", "concept"]
    },
    {
        id: "pyspark-mllib-basics",
        filename: 't36.mdx',
        title: "PySpark MLlib Basics",
        description: "Build distributed machine learning pipelines with PySpark MLlib - feature engineering, classification, regression, clustering, and Pipeline API.",
        category: "advance",
        order: 36,
        tags: ["interview", "practice"]
    },
    {
        id: "parquet-vs-orc-vs-avro",
        filename: 't37.mdx',
        title: "Parquet vs ORC vs Avro - When to Use What",
        description: "Compare Parquet, ORC, and Avro file formats for big data workloads - understanding their storage layouts, compression, schema evolution, and ideal use cases.",
        category: "advance",
        order: 37,
        tags: ["interview", "concept"]
    },
    {
        id: "partitioning-repartition-vs-coalesce",
        filename: 't38.mdx',
        title: "Partitioning, repartition vs coalesce",
        description: "Control data distribution in PySpark with repartition and coalesce - understanding when to use each for performance, output files, and parallelism.",
        category: "advance",
        order: 38,
        tags: ["interview", "concept"]
    },
    {
        id: "shuffling-and-performance-cost",
        filename: 't39.mdx',
        title: "Shuffling & Its Performance Cost",
        description: "Understand what triggers a shuffle in Spark, why it's expensive, and how to minimize shuffle cost with broadcast joins, early filtering, and partition tuning.",
        category: "advance",
        order: 39,
        tags: ["interview", "concept"]
    },
    {
        id: "caching-and-persistence-levels",
        filename: 't40.mdx',
        title: "Caching & Persistence Levels",
        description: "Cache and persist PySpark DataFrames across multiple storage levels - understanding when to cache, which level to choose, and how to avoid common pitfalls.",
        category: "advance",
        order: 40,
        tags: ["interview", "concept"]
    },
    {
        id: "execution-plan-with-explain",
        filename: 't41.mdx',
        title: "Execution Plan with explain()",
        description: "Read and interpret PySpark execution plans using explain() - identify shuffles, join strategies, filter pushdown, and optimization opportunities before running jobs.",
        category: "advance",
        order: 41,
        tags: ["interview", "concept"]
    },
    {
        id: "data-skew-and-salting",
        filename: 't42.mdx',
        title: "Data Skew & Salting Technique",
        description: "Detect and fix data skew in PySpark - using the salting technique, AQE skew join handling, and broadcast joins to eliminate straggler tasks.",
        category: "advance",
        order: 42,
        tags: ["interview", "concept"]
    },
    {
        id: "catalyst-optimizer-and-tungsten",
        filename: 't43.mdx',
        title: "Catalyst Optimizer & Tungsten Engine",
        description: "Understand how Spark's Catalyst optimizer rewrites query plans and how Tungsten's whole-stage code generation and off-heap memory management accelerate execution.",
        category: "advance",
        order: 43,
        tags: ["interview", "concept"]
    },
    {
        id: "spark-configs-and-tuning",
        filename: 't44.mdx',
        title: "Spark Configs & Tuning (Executor Memory, Cores)",
        description: "Tune PySpark jobs for production - configuring executor memory, cores, shuffle partitions, dynamic allocation, and AQE to maximize performance and stability.",
        category: "advance",
        order: 44,
        tags: ["interview", "concept"]
    },
    {
        id: "spark-ui-and-dag-visualization",
        filename: 't45.mdx',
        title: "Spark UI & DAG Visualization",
        description: "Navigate the Spark UI to debug and optimize jobs - reading DAGs, identifying slow stages, diagnosing data skew, memory pressure, and shuffle bottlenecks.",
        category: "advance",
        order: 45,
        tags: ["interview", "concept"]
    },
    {
        id: "checkpointing-in-pyspark",
        filename: 't46.mdx',
        title: "Checkpointing in PySpark",
        description: "Use PySpark checkpointing to truncate long lineage chains, enable fault recovery in iterative ML algorithms, and avoid StackOverflow in deep transformation pipelines.",
        category: "advance",
        order: 46,
        tags: ["interview", "concept"]
    }
] satisfies Tutorial[]).sort((a, b) => a.order - b.order)

export function getTutorialsByCategory() {
    return {
        beginner: tutorials.filter(t => t.category === "foundation"),
        intermediate: tutorials.filter(t => t.category === "intermediate"),
        advance: tutorials.filter(t => t.category === "advance")
    }
}