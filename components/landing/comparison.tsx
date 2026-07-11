import { X, Check } from "lucide-react";

export function Comparison() {
  return (
    <section className="py-24 md:py-32 bg-[#121826]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center text-white">
            Practice, not grinding
          </h2>
          <p className="text-base md:text-lg text-[#7b8ca3] text-center mb-10 md:mb-16 max-w-2xl mx-auto">
            We're not another LeetCode. We're the daily routine that keeps SQL, Python, and PySpark skills sharp.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Platforms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#7b8ca3] mb-6">Traditional platforms</h3>

              {[
                "500+ problems to grind through",
                "Algorithm puzzles disguised as SQL",
                "Only SQL — no Python or PySpark",
                "Binge-learning before interviews",
                "Same static problem sets forever",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-lg bg-[#202736]/30">
                  <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                  <span className="text-[#7b8ca3]">{item}</span>
                </div>
              ))}
            </div>

            {/* DailySQL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-6">Daily SQL</h3>

              {[
                "9 curated problems per day — no overwhelm",
                "Real business scenarios: revenue, retention, funnels",
                "SQL + Python (Pandas) + PySpark in one place",
                "Consistent daily habit in 15 minutes",
                "Fresh questions every single day",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20">
                  <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
