export function StatCards() {
  const stats = [
    {
      value: "15",
      unit: "minutes",
      label: "per day",
      description: "Quick, focused practice that fits your schedule",
    },
    {
      value: "3",
      unit: "questions",
      label: "daily",
      description: "Easy, Medium, and Advanced—no decision fatigue",
    },
    {
      value: "New",
      unit: "questions",
      label: "every day",
      description: "Fresh challenges, no grinding through repeats",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-brand-dark/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-brand-base/10 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-brand-base">
                    {stat.value}
                  </span>
                  <span className="text-2xl text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{stat.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

