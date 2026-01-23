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
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-border/50">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Why this works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on one core idea: <span className="text-foreground font-semibold">consistency beats intensity</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-[#30B5A6]/5 hover:border-[#30B5A6]/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#30B5A6]/10 text-[#30B5A6] font-bold text-sm flex items-center justify-center border border-[#30B5A6]/20 group-hover:bg-[#30B5A6] group-hover:text-black transition-colors">
                  {index + 1}
                </span>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-lg">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-muted-foreground italic">
            <span className="font-semibold text-[#30B5A6] not-italic">The result?</span> A sustainable practice habit without the burnout, decision fatigue, or time commitment.
          </p>
        </div>
      </div>
    </section>
  );
}

