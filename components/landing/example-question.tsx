import { CodeBlock } from "@/components/landing/code-block";

export function ExampleQuestion() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-gradient-to-b from-background to-black/20 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none z-[-1] opacity-40" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Left Column: Context */}
          <div className="lg:col-span-2 space-y-6 pt-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Real-world scenarios, <br />
              <span className="text-[#30B5A6]">not abstract puzzles</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Practice with the exact type of ambiguity and complexity you face at work.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#30B5A6]" />
                Customer Retention Analysis
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#30B5A6]" />
                Moving Averages & Window Functions
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#30B5A6]" />
                Complex Funnel Conversions
              </div>
            </div>
          </div>

          {/* Right Column: Compact Problem Card */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="p-6 space-y-4 border-b border-border/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md bg-[#30B5A6]/10 text-[#30B5A6] text-xs font-semibold uppercase tracking-wider">
                      Advanced
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Business Analytics</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Cohort Retention Analysis
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Calculate monthly retention rates for each customer cohort grouped by first purchase month. Identify trends in user longevity.
                  </p>
                </div>
              </div>

              {/* Code Block Area */}
              <div className="bg-[#0D1117] p-1">
                <CodeBlock />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

