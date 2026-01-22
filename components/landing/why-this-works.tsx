export function WhyThisWorks() {
  const principles = [
    {
      title: "Small daily commitment",
      description: "15 minutes is sustainable. It fits into your schedule without overwhelming your day or competing with work priorities.",
    },
    {
      title: "No decisions",
      description: "Three questions, delivered daily. No choice paralysis, no browsing, no 'what should I practice today?' moments.",
    },
    {
      title: "Real-world relevance",
      description: "Every problem mirrors actual business scenarios. You're practicing the SQL you'll write at work, not abstract puzzles.",
    },
    {
      title: "Fresh problems daily",
      description: "New questions every day keep practice engaging. No grinding through the same problems repeatedly—just consistent, varied challenge.",
    },
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Why this works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Daily SQL is built around one idea: <span className="text-foreground font-semibold">consistency beats intensity</span>.
          </p>
        </div>

        <div className="space-y-8">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-brand-base/20 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-base/20 flex items-center justify-center">
                  <span className="text-brand-base font-bold text-xl">{index + 1}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="p-8 rounded-xl border-2 border-brand-base/30 bg-gradient-to-br from-card to-brand-base/5 shadow-lg">
            <p className="text-center text-lg leading-relaxed">
              <span className="font-semibold text-foreground">The result?</span>{" "}
              <span className="text-muted-foreground">
                A sustainable practice habit that keeps your SQL skills sharp without the burnout,
                decision fatigue, or time commitment of traditional platforms.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

