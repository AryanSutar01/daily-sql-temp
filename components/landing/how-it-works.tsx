export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Receive your questions",
      description: "Every morning, get exactly 3 SQL questions delivered: Easy, Medium, and Advanced. No browsing, no decisions—just practice.",
    },
    {
      number: "2",
      title: "Practice in 15 minutes",
      description: "Work through real business-style problems using window functions, CTEs, and complex aggregations. The same SQL you write at work.",
    },
    {
      number: "3",
      title: "Track your progress",
      description: "Build streaks, track mastery, and maintain consistency. No leaderboards—just you and your daily practice.",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-dark/10 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to consistent SQL mastery
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="space-y-5 p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-brand-base/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-2">
                <div className="text-6xl font-bold text-brand-base leading-none">
                  {step.number}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-base/50 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-semibold">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

