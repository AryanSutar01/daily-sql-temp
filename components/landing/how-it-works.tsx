import { Mail, Clock, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Mail,
      title: "Receive questions",
      description: "3 daily problems delivered morning.",
    },
    {
      icon: Clock,
      title: "15 min practice",
      description: "Solve real business scenarios quickly.",
    },
    {
      icon: TrendingUp,
      title: "Track progress",
      description: "Build streaks and maintain skills.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-gradient-to-b from-background to-brand-dark/5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground text-base">
            Your daily routine for SQL mastery.
          </p>
        </div>

        {/* Horizontal Container Card */}
        <div className="relative p-8 md:p-12 rounded-3xl border border-white/10 bg-[#0C0E12]/50 backdrop-blur-sm overflow-hidden">

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#30B5A6]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Steps Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">

            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-[#30B5A6]/20 to-transparent z-0" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-full bg-[#09090B] border-2 border-[#30B5A6]/20 group-hover:border-[#30B5A6] flex items-center justify-center mb-5 transition-all duration-300 shadow-[0_0_15px_-3px_rgba(48,181,166,0.1)] group-hover:shadow-[0_0_20px_-3px_rgba(48,181,166,0.3)] group-hover:scale-110">
                    <Icon className="w-6 h-6 text-[#30B5A6]/70 group-hover:text-[#30B5A6] transition-colors" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-[240px] leading-relaxed mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

