"use client";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">How it works</h2>
          <p className="text-lg text-[#7b8ca3] text-center mb-16 max-w-2xl mx-auto">
            A simple daily flow designed for busy professionals
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#202736] -translate-x-4"></div>
              <div className="text-5xl font-bold text-[#4DD4C4]/20 mb-4">01</div>
              <h3 className="text-xl font-semibold text-white mb-3">Start your day</h3>
              <p className="text-[#7b8ca3]">
                Open DailySQL with your morning coffee. Three new questions are waiting—one easy, one medium, one advanced.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#202736] -translate-x-4"></div>
              <div className="text-5xl font-bold text-[#4DD4C4]/20 mb-4">02</div>
              <h3 className="text-xl font-semibold text-white mb-3">Solve real problems</h3>
              <p className="text-[#7b8ca3]">
                Work through business scenarios: revenue analysis, cohort calculations, funnel conversions. The SQL you actually use at work.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative">
              <div className="text-5xl font-bold text-[#4DD4C4]/20 mb-4">03</div>
              <h3 className="text-xl font-semibold text-white mb-3">Build your streak</h3>
              <p className="text-[#7b8ca3]">
                Track your consistency over time. No leaderboards, no competition—just you and your daily practice habit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
