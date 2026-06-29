import { Tutorial } from "../shared";

export const tutorials = ([
    {
        id: "python-setup-and-environment",
        filename: "t1.mdx",
        title: "Python Setup & Environment (pip, venv)",
        description: "Install Python, manage packages with pip, and isolate projects with virtual environments.",
        category: "foundation",
        order: 1,
        tags: ["concept"]
    },
    {
        id: "variables-and-data-types",
        filename: "t2.mdx",
        title: "Variables & Data Types",
        description: "Learn how Python stores data - the building blocks of every program.",
        category: "foundation",
        order: 2,
        tags: ["concept", "interview"]
    },
    {
        id: "strings-and-string-methods",
        filename: "t3.mdx",
        title: "Strings & String Methods",
        description: "Work with text in Python - the most common data type in real-world programming.",
        category: "foundation",
        order: 3,
        tags: ["practice", "interview"]
    },
    {
        id: "lists-tuples-sets-dicts",
        filename: "t4.mdx",
        title: "Lists, Tuples, Sets, Dicts",
        description: "Python's core collection types - know when to use which and how to work with each.",
        category: "foundation",
        order: 4,
        tags: ["interview", "practice"]
    },
    {
        id: "conditional-statements",
        filename: "t5.mdx",
        title: "Conditional Statements (if/elif/else)",
        description: "Control the flow of your program based on conditions.",
        category: "foundation",
        order: 5,
        tags: ["practice"]
    },
    {
        id: "loops-for-while-break-continue",
        filename: "t6.mdx",
        title: "Loops (for, while, break, continue)",
        description: "Repeat actions, iterate over collections, and control loop flow in Python.",
        category: "foundation",
        order: 6,
        tags: ["practice", "interview"]
    },
    {
        id: "functions-and-return-values",
        filename: "t7.mdx",
        title: "Functions & Return Values",
        description: "Organize code into reusable blocks - the foundation of clean, maintainable Python.",
        category: "foundation",
        order: 7,
        tags: ["interview", "practice"]
    },
    {
        id: "args-and-kwargs",
        filename: "t8.mdx",
        title: "*args & **kwargs",
        description: "Write flexible functions that accept any number of positional or keyword arguments.",
        category: "foundation",
        order: 8,
        tags: ["interview"]
    },
    {
        id: "exception-handling",
        filename: "t9.mdx",
        title: "Exception Handling (try/except/finally)",
        description: "Handle errors gracefully - write robust Python programs that don't crash unexpectedly.",
        category: "foundation",
        order: 9,
        tags: ["interview", "practice"]
    },
    {
        id: "file-io",
        filename: "t10.mdx",
        title: "File I/O (read, write, with statement)",
        description: "Read from and write to files - a fundamental skill for any Python developer.",
        category: "foundation",
        order: 10,
        tags: ["practice"]
    },
    {
        id: "modules-and-imports",
        filename: "t11.mdx",
        title: "Modules & Imports",
        description: "Organize Python code into reusable modules and packages - and import them correctly.",
        category: "foundation",
        order: 11,
        tags: ["concept"]
    },
    {
        id: "list-dict-set-comprehensions",
        filename: "t12.mdx",
        title: "List, Dict & Set Comprehensions",
        description: "Write concise, readable expressions to create collections - the most Pythonic pattern you'll use every day.",
        category: "intermediate",
        order: 12,
        tags: ["interview", "practice"]
    },
    {
        id: "lambda-map-filter-reduce",
        filename: "t13.mdx",
        title: "Lambda, map, filter, reduce",
        description: "Functional programming tools in Python - concise ways to transform and filter data.",
        category: "intermediate",
        order: 13,
        tags: ["interview"]
    },
    {
        id: "iterators-and-generators",
        filename: "t14.mdx",
        title: "Iterators & Generators",
        description: "Understand how Python's for loop works under the hood, and create memory-efficient data streams with generators.",
        category: "intermediate",
        order: 14,
        tags: ["interview", "concept"]
    },
    {
        id: "decorators",
        filename: "t15.mdx",
        title: "Decorators",
        description: "Add behaviour to functions without modifying them - the pattern behind @property, @staticmethod, and every framework you've used.",
        category: "intermediate",
        order: 15,
        tags: ["interview", "concept"]
    },
    {
        id: "classes-and-oop-basics",
        filename: "t16.mdx",
        title: "Classes & OOP Basics",
        description: "Organize code with objects - encapsulate data and behaviour into reusable, structured classes.",
        category: "intermediate",
        order: 16,
        tags: ["interview", "practice"]
    },
    {
        id: "inheritance-and-polymorphism",
        filename: "t17.mdx",
        title: "Inheritance & Polymorphism",
        description: "Reuse and extend classes, and write code that works with any object sharing the same interface.",
        category: "intermediate",
        order: 17,
        tags: ["interview", "concept"]
    },
    {
        id: "multithreading-and-multiprocessing",
        filename: "t18.mdx",
        title: "Multithreading & Multiprocessing",
        description: "Run multiple tasks concurrently or in parallel - and know when to use which approach in Python.",
        category: "advance",
        order: 25,
        tags: ["interview", "concept"]
    },
    {
        id: "async-await-and-asyncio",
        filename: "t19.mdx",
        title: "Async/Await & Asyncio",
        description: "Write concurrent I/O-bound code in a clean, readable style using Python's native async framework.",
        category: "advance",
        order: 26,
        tags: ["interview", "practice"]
    },
    {
        id: "context-managers",
        filename: "t20.mdx",
        title: "Context Managers",
        description: "Manage resources cleanly and safely using the with statement - files, locks, database connections, and more.",
        category: "advance",
        order: 27,
        tags: ["interview"]
    },
    {
        id: "dataclasses-and-namedtuple",
        filename: "t21.mdx",
        title: "Dataclasses & NamedTuple",
        description: "Create clean, structured data containers in Python without writing boilerplate class code.",
        category: "advance",
        order: 28,
        tags: ["practice"]
    },
    {
        id: "type-hints-and-mypy",
        filename: "t22.mdx",
        title: "Type Hints & Mypy",
        description: "Add static type annotations to Python code for better tooling, readability, and early error detection.",
        category: "advance",
        order: 29,
        tags: ["concept", "practice"]
    },
    {
        id: "abstract-classes-and-interfaces",
        filename: "t23.mdx",
        title: "Abstract Classes & Interfaces (ABC)",
        description: "Define contracts that subclasses must follow - enforce structure without implementing behaviour.",
        category: "advance",
        order: 30,
        tags: ["interview", "concept"]
    },
    {
        id: "design-patterns",
        filename: "t24.mdx",
        title: "Design Patterns (Singleton, Factory, Observer)",
        description: "Reusable solutions to common software design problems - the patterns every senior developer is expected to know.",
        category: "advance",
        order: 31,
        tags: ["interview", "concept"]
    },
    {
        id: "unit-testing",
        filename: "t25.mdx",
        title: "Unit Testing (unittest, pytest)",
        description: "Write automated tests to verify your code works correctly - and keeps working as it changes.",
        category: "advance",
        order: 32,
        tags: ["practice", "interview"]
    },
    {
        id: "logging-and-debugging",
        filename: "t26.mdx",
        title: "Logging & Debugging",
        description: "Record what your program does and find out why it breaks - essential skills for production Python.",
        category: "advance",
        order: 33,
        tags: ["practice"]
    },
    {
        id: "virtual-environments-and-packaging",
        filename: "t27.mdx",
        title: "Virtual Environments & Packaging",
        description: "Isolate project dependencies and share your Python code as a distributable package.",
        category: "advance",
        order: 34,
        tags: ["concept"]
    },
    {
        id: "numpy-arrays-and-vectorization",
        filename: "t28.mdx",
        title: "NumPy Arrays & Vectorization",
        description: "Perform fast numerical computations on large datasets using arrays and vectorized operations - no loops needed.",
        category: "dataAndPerformance",
        order: 37,
        tags: ["interview", "practice"]
    },
    {
        id: "pandas-series-and-dataframe",
        filename: "t29.mdx",
        title: "Pandas - Series & DataFrame",
        description: "Work with structured tabular data in Python - the most important library for data analysis and data engineering.",
        category: "dataAndPerformance",
        order: 38,
        tags: ["interview", "practice"]
    },
    {
        id: "pandas-groupby-merge-pivot",
        filename: "t30.mdx",
        title: "Pandas - groupby, merge, pivot",
        description: "Aggregate, combine, and reshape DataFrames - the core operations of data analysis and interview questions.",
        category: "dataAndPerformance",
        order: 39,
        tags: ["interview", "practice"]
    },
    {
        id: "pandas-apply-map-vectorized-ops",
        filename: "t31.mdx",
        title: "Pandas - apply, map, vectorized ops",
        description: "Transform DataFrame columns efficiently - and know which approach to use for speed.",
        category: "dataAndPerformance",
        order: 40,
        tags: ["interview"]
    },
    {
        id: "data-cleaning-and-missing-values",
        filename: "t32.mdx",
        title: "Data Cleaning & Missing Values",
        description: "Transform raw, messy data into clean, analysis-ready datasets - a core real-world skill.",
        category: "dataAndPerformance",
        order: 41,
        tags: ["practice"]
    },
    {
        id: "api-calls-with-requests-and-rest",
        filename: "t33.mdx",
        title: "API Calls with requests & REST",
        description: "Interact with web APIs from Python - fetch data, send payloads, handle auth, and deal with errors.",
        category: "dataAndPerformance",
        order: 42,
        tags: ["practice"]
    },
    {
        id: "web-scraping",
        filename: "t34.mdx",
        title: "Web Scraping (BeautifulSoup, Selenium)",
        description: "Extract data from websites programmatically - when there's no API available.",
        category: "dataAndPerformance",
        order: 43,
        tags: ["practice"]
    },
    {
        id: "performance-profiling-and-optimization",
        filename: "t35.mdx",
        title: "Performance Profiling & Optimization",
        description: "Find where your Python code is slow and fix it - measure first, optimize second.",
        category: "dataAndPerformance",
        order: 44,
        tags: ["interview"]
    },
    {
        id: "python-with-databases",
        filename: "t36.mdx",
        title: "Python with Databases (SQLAlchemy, psycopg2)",
        description: "Connect Python to relational databases - run queries, manage connections, and use ORMs effectively.",
        category: "dataAndPerformance",
        order: 45,
        tags: ["practice"]
    },
    {
        id: "is-vs-equality",
        filename: "t37.mdx",
        title: "is vs == (Identity vs Equality)",
        description: "One of Python's most common interview traps - understand the difference between object identity and value equality.",
        category: "bonus",
        order: 46,
        tags: ["interview"]
    },
    {
        id: "python-memory-model-and-id",
        filename: "t38.mdx",
        title: "Python Memory Model & id()",
        description: "Understand how Python stores objects in memory - names, references, and the heap.",
        category: "bonus",
        order: 47,
        tags: ["interview", "concept"]
    },
    {
        id: "closure-and-variable-scoping",
        filename: "t39.mdx",
        title: "Closure & Variable Scoping (LEGB)",
        description: "Understand how Python resolves variable names and how closures capture and remember enclosing scope.",
        category: "bonus",
        order: 48,
        tags: ["interview"]
    },
    {
        id: "pickling-and-serialization",
        filename: "t40.mdx",
        title: "Pickling & Serialization",
        description: "Convert Python objects to bytes or strings for storage and transmission - and know which format to use when.",
        category: "bonus",
        order: 49,
        tags: ["concept"]
    },
    {
        id: "python-2-vs-python-3",
        filename: "t41.mdx",
        title: "Python 2 vs Python 3 Differences",
        description: "Key differences between Python 2 and Python 3 - still asked in interviews and important for legacy codebases.",
        category: "bonus",
        order: 50,
        tags: ["interview", "concept"]
    },
    {
        id: "slots-and-memory-optimization",
        filename: "t42.mdx",
        title: "__slots__ & Memory Optimization",
        description: "Reduce per-instance memory usage dramatically when creating thousands or millions of objects.",
        category: "bonus",
        order: 51,
        tags: ["interview"]
    },
    {
        id: "common-pitfalls",
        filename: "t43.mdx",
        title: "Common Pitfalls (Mutable Defaults, Late Binding)",
        description: "The sneaky Python mistakes that trip up experienced developers - and how to avoid them.",
        category: "bonus",
        order: 52,
        tags: ["interview"]
    },
    {
        id: "dunder-magic-methods",
        filename: "t44.mdx",
        title: "Dunder/Magic Methods (__init__, __str__...)",
        description: "Make your objects behave like built-in Python types by implementing special double-underscore methods.",
        category: "intermediate",
        order: 18,
        tags: ["interview"]
    },
    {
        id: "staticmethod-vs-classmethod",
        filename: "t45.mdx",
        title: "@staticmethod vs @classmethod",
        description: "Understand the three types of methods in Python classes and when to use each.",
        category: "intermediate",
        order: 19,
        tags: ["interview"]
    },
    {
        id: "mutable-vs-immutable-types",
        filename: "t46.mdx",
        title: "Mutable vs Immutable Types",
        description: "Understand which Python objects can be changed in place and which cannot - critical for avoiding subtle bugs.",
        category: "intermediate",
        order: 20,
        tags: ["interview", "concept"]
    },
    {
        id: "shallow-vs-deep-copy",
        filename: "t47.mdx",
        title: "Shallow vs Deep Copy",
        description: "Understand the critical difference between copying a container and truly duplicating all its contents.",
        category: "intermediate",
        order: 21,
        tags: ["interview"]
    },
    {
        id: "regular-expressions",
        filename: "t48.mdx",
        title: "Regular Expressions (re module)",
        description: "Search, match, and manipulate text using powerful pattern-matching syntax.",
        category: "intermediate",
        order: 22,
        tags: ["practice"]
    },
    {
        id: "datetime-collections-itertools-functools",
        filename: "t49.mdx",
        title: "datetime, collections, itertools, functools",
        description: "Python's most useful standard library modules - the tools every developer reaches for daily.",
        category: "intermediate",
        order: 23,
        tags: ["practice", "interview"]
    },
    {
        id: "json-and-csv-handling",
        filename: "t50.mdx",
        title: "JSON & CSV Handling",
        description: "Read and write the two most common data interchange formats in Python.",
        category: "intermediate",
        order: 24,
        tags: ["practice"]
    },
    {
        id: "memory-management-and-garbage-collection",
        filename: "t51.mdx",
        title: "Memory Management & Garbage Collection",
        description: "Understand how Python allocates and frees memory - essential for writing efficient, leak-free programs.",
        category: "advance",
        order: 35,
        tags: ["interview", "concept"]
    },
    {
        id: "gil-global-interpreter-lock",
        filename: "t52.mdx",
        title: "GIL (Global Interpreter Lock)",
        description: "Understand Python's most discussed concurrency limitation - what it is, why it exists, and how to work around it.",
        category: "advance",
        order: 36,
        tags: ["interview", "concept"]
    }
] satisfies Tutorial[]).sort((a, b) => a.order - b.order)

export function getTutorialsByCategory() {
    return {
        beginner: tutorials.filter(t => t.category === 'foundation'),
        intermediate: tutorials.filter(t => t.category === "intermediate"),
        advance: tutorials.filter(t => t.category === "advance"),
        dataAndPerformance: tutorials.filter(t => t.category === "dataAndPerformance"),
        bonus: tutorials.filter(t => t.category === "bonus"),
    }
}