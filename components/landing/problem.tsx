export function Problem() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-border/50 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none z-[-1] opacity-50" />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Main Problem Statement */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            SQL skills decay without practice
          </h2>

          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              You know SQL. You've written thousands of queries. But when that interview
              question comes up—or when you need a complex window function on a deadline—something
              feels off.
            </p>

            <p>
              Most professionals face the same problem: there's no time to grind through 500
              practice problems. And when you do find time, the skills you built disappear
              within weeks.
            </p>

            <p className="text-xl font-semibold text-foreground pt-4">
              The issue isn't learning SQL. It's maintaining it.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {/* Stat 1 */}
          <div className="relative p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm text-center space-y-3 hover:border-[#30B5A6]/30 transition-all duration-300">
            <div className="text-5xl font-bold bg-gradient-to-br from-[#30B5A6] to-[#4DD4C4] bg-clip-text text-transparent">
              73%
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              of data professionals feel their SQL skills have gaps
            </p>
          </div>

          {/* Stat 2 */}
          <div className="relative p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm text-center space-y-3 hover:border-[#30B5A6]/30 transition-all duration-300">
            <div className="text-5xl font-bold bg-gradient-to-br from-[#30B5A6] to-[#4DD4C4] bg-clip-text text-transparent">
              2-4 hrs
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              average prep time before technical interviews
            </p>
          </div>

          {/* Stat 3 */}
          <div className="relative p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm text-center space-y-3 hover:border-[#30B5A6]/30 transition-all duration-300">
            <div className="text-5xl font-bold bg-gradient-to-br from-[#30B5A6] to-[#4DD4C4] bg-clip-text text-transparent">
              6 weeks
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              before complex SQL patterns start to fade
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
