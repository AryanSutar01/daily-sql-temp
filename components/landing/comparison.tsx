import { X, Check } from "lucide-react";

export function Comparison() {
  return (
    <section className="py-24 md:py-32 bg-[#121826]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            Practice, not grinding
          </h2>
          <p className="text-lg text-[#7b8ca3] text-center mb-16 max-w-2xl mx-auto">
            We're not another LeetCode. We're the daily routine that keeps your SQL sharp.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Platforms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#7b8ca3] mb-6">Traditional platforms</h3>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#202736]/30">
                <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                <span className="text-[#7b8ca3]">500+ problems to grind through</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#202736]/30">
                <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                <span className="text-[#7b8ca3]">Algorithm puzzles disguised as SQL</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#202736]/30">
                <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                <span className="text-[#7b8ca3]">Leaderboards and competitive pressure</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#202736]/30">
                <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                <span className="text-[#7b8ca3]">Binge-learning before interviews</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#202736]/30">
                <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                <span className="text-[#7b8ca3]">Same static problem sets</span>
              </div>
            </div>

            {/* DailySQL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-6">DailySQL</h3>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20">
                <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                <span className="text-white">Exactly 3 questions per day</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20">
                <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                <span className="text-white">Real business scenarios you'll actually use</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20">
                <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                <span className="text-white">Personal streaks and mastery tracking</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20">
                <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                <span className="text-white">Consistent daily habit in 15 minutes</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20">
                <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                <span className="text-white">Fresh questions every single day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

