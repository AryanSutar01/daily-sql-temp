export function Features() {
  const features = [
    {
      title: "Never waste time deciding what to practice",
      description: "Exactly 3 questions daily—Easy, Medium, and Advanced. No browsing, no choice paralysis, just practice.",
    },
    {
      title: "Real problems you'll encounter at work",
      description: "Customer analytics, revenue analysis, cohort retention—the SQL scenarios you actually face, not abstract puzzles.",
    },
    {
      title: "Fresh challenges every day",
      description: "New questions daily. No grinding through the same problems repeatedly. Consistent variety, consistent growth.",
    },
    {
      title: "The SQL you actually write",
      description: "Window functions, CTEs, complex aggregations, subqueries—advanced concepts you use at work, not toy examples.",
    },
    {
      title: "Fits your schedule, not the other way around",
      description: "15 minutes designed for busy professionals. Quick, focused practice that doesn't compete with your priorities.",
    },
    {
      title: "Track progress, not competition",
      description: "Streaks, mastery tracking, and consistency metrics. No leaderboards—just you and your daily practice.",
    },
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Features designed for consistency
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature serves one goal: making daily SQL practice sustainable
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-[#2563EB]/20 hover:bg-card/70 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

