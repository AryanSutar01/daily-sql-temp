import { CodeBlock } from "@/components/landing/code-block";

export function ExampleQuestion() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Real-world SQL problems
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The kind of problems you'll solve daily—actual business scenarios, not abstract puzzles
          </p>
        </div>
        <div className="space-y-8">
          <div className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-[#2563EB]/20 text-[#2563EB] text-sm font-semibold">
                  Advanced
                </span>
                <span className="text-sm text-muted-foreground font-medium">Business Analytics</span>
              </div>
              <h3 className="text-2xl font-semibold">
                Customer Cohort Retention Analysis
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                You're analyzing user retention for a SaaS product. Given a transactions table with customer_id, 
                transaction_date, and amount, calculate the monthly retention rate for each cohort (grouped by 
                first purchase month). Show which cohorts have the highest retention and identify any trends.
              </p>
              <CodeBlock />
            </div>
          </div>
          <p className="text-center text-muted-foreground text-lg">
            This is the type of problem you'll solve daily—real business scenarios that mirror your actual work.
          </p>
        </div>
      </div>
    </section>
  );
}

