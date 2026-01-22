export function CodeBlock() {
  return (
    <div className="mt-6 rounded-xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden">
      {/* Mac-style window controls */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-zinc-500 font-mono">retention_analysis.sql</span>
        </div>
      </div>

      <div className="p-6 overflow-x-hidden">
        <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words text-zinc-300">
          <code>
            <span className="text-purple-400">WITH</span> <span className="text-yellow-100">cohorts</span> <span className="text-purple-400">AS</span> (
            {"\n  "}<span className="text-purple-400">SELECT</span> customer_id,
            {"\n    "}<span className="text-blue-400">DATE_TRUNC</span>(<span className="text-green-400">'month'</span>, <span className="text-blue-400">MIN</span>(transaction_date)) <span className="text-purple-400">AS</span> cohort_month
            {"\n  "}<span className="text-purple-400">FROM</span> transactions
            {"\n  "}<span className="text-purple-400">GROUP BY</span> customer_id
            {"\n"}),
            {"\n"}<span className="text-yellow-100">monthly_activity</span> <span className="text-purple-400">AS</span> (
            {"\n  "}<span className="text-purple-400">SELECT</span>
            {"\n    "}c.cohort_month,
            {"\n    "}<span className="text-blue-400">DATE_TRUNC</span>(<span className="text-green-400">'month'</span>, t.transaction_date) <span className="text-purple-400">AS</span> activity_month,
            {"\n    "}<span className="text-blue-400">COUNT</span>(<span className="text-purple-400">DISTINCT</span> t.customer_id) <span className="text-purple-400">AS</span> active_customers
            {"\n  "}<span className="text-purple-400">FROM</span> cohorts c
            {"\n  "}<span className="text-purple-400">JOIN</span> transactions t <span className="text-purple-400">ON</span> c.customer_id = t.customer_id
            {"\n  "}<span className="text-purple-400">GROUP BY</span> 1, 2
            {"\n"})
            {"\n"}<span className="text-purple-400">SELECT</span>
            {"\n  "}cohort_month,
            {"\n  "}<span className="text-blue-400">SUM</span>(<span className="text-purple-400">CASE WHEN</span> activity_month = cohort_month <span className="text-purple-400">THEN</span> active_customers <span className="text-purple-400">ELSE</span> <span className="text-orange-400">0</span> <span className="text-purple-400">END</span>) <span className="text-purple-400">AS</span> cohort_size,
            {"\n  "}<span className="text-blue-400">SUM</span>(active_customers) <span className="text-purple-400">AS</span> retained_customers
            {"\n"}<span className="text-purple-400">FROM</span> monthly_activity
            {"\n"}<span className="text-purple-400">GROUP BY</span> cohort_month
            {"\n"}<span className="text-purple-400">ORDER BY</span> 1;
          </code>
        </pre>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-base animate-pulse"></span>
            <span className="text-xs text-brand-base font-medium uppercase tracking-wider">Executed in 14ms</span>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            <span className="text-zinc-400">Key concepts:</span> CTEs, aggregations, windowing
          </p>
        </div>
      </div>
    </div>
  );
}

