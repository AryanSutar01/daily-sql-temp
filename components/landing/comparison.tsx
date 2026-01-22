export function Comparison() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Grind vs. Maintenance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two different approaches to staying sharp. One designed for consistency.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 p-10 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-muted-foreground">
              Traditional Platforms
            </h3>
            <ul className="space-y-5 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-destructive mt-1 text-xl">×</span>
                <span className="leading-relaxed">Hundreds of problems to choose from—decision paralysis guaranteed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive mt-1 text-xl">×</span>
                <span className="leading-relaxed">Puzzle-style problems that don't reflect real work scenarios</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive mt-1 text-xl">×</span>
                <span className="leading-relaxed">Requires hours of dedicated practice time you don't have</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive mt-1 text-xl">×</span>
                <span className="leading-relaxed">Leaderboards and competition-focused, not consistency-focused</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive mt-1 text-xl">×</span>
                <span className="leading-relaxed">Easy to lose momentum and give up when life gets busy</span>
              </li>
            </ul>
          </div>
          <div className="space-y-6 p-10 rounded-xl border-2 border-brand-base/30 bg-gradient-to-br from-card to-brand-base/5 shadow-lg shadow-brand-base/10 hover:shadow-brand-base/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-semibold text-brand-base">
                Daily SQL
              </h3>
              <span className="px-3 py-1 rounded-full bg-brand-base/20 text-brand-base text-xs font-medium">Recommended</span>
            </div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="text-brand-base mt-1 text-xl font-bold">✓</span>
                <span className="leading-relaxed">Exactly 3 questions every day—no choice paralysis, just practice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-base mt-1 text-xl font-bold">✓</span>
                <span className="leading-relaxed">Real business-style problems you'd encounter in actual data work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-base mt-1 text-xl font-bold">✓</span>
                <span className="leading-relaxed">Designed for 15-minute daily sessions that fit your schedule</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-base mt-1 text-xl font-bold">✓</span>
                <span className="leading-relaxed">Habit-based learning with streaks and mastery tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-base mt-1 text-xl font-bold">✓</span>
                <span className="leading-relaxed">New questions daily—no grinding, no overload, just consistency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

