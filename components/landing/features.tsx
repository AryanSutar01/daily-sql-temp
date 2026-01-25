import { Share2, Clock, Calendar, Database, CheckCircle, BarChart3 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Clock,
      title: "Never waste time deciding",
      description: "Exactly 3 questions daily—Easy, Medium, and Advanced. No browsing, no paralysis, just practice.",
    },
    {
      icon: Database,
      title: "Real work scenarios",
      description: "Customer analytics, revenue analysis, cohorts—the actual SQL problems you face, not abstract puzzles.",
    },
    {
      icon: Calendar,
      title: "Fresh challenges daily",
      description: "New questions every morning. No grinding through the same problems. Consistent variety, consistent growth.",
    },
    {
      icon: Share2,
      title: "The SQL you actually use",
      description: "Window functions, CTEs, complex aggregations—advanced concepts for work, not just syntax memorization.",
    },
    {
      icon: CheckCircle,
      title: "Fits your schedule",
      description: "15 minutes designed for busy professionals. Quick, focused practice that doesn't compete with your priorities.",
    },
    {
      icon: BarChart3,
      title: "Track progress",
      description: "Streaks, mastery tracking, and consistency metrics. No leaderboards—just you and your daily practice.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Features designed for <span className="text-[#30B5A6]">consistency</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Every feature serves one goal: making daily SQL practice sustainable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group p-6 rounded-xl border border-white/10 bg-[#0A0A0B]/50 backdrop-blur-sm hover:border-[#30B5A6]/30 hover:bg-[#30B5A6]/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-[#30B5A6]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-[#30B5A6]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

