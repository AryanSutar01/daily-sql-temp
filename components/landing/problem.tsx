import { Terminal, Heart } from "lucide-react";

export function Problem() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-border/50 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none z-[-1] opacity-50" />

      <div className="max-w-4xl mx-auto">

        {/* Unified Narrative Container */}
        <div className="text-center space-y-12">

          {/* Emotional Hook */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              The worst feeling isn't not knowing. <br className="hidden sm:block" />
              <span className="text-[#30B5A6]">It's forgetting what you mastered.</span>
            </h2>

            <div className="max-w-2xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                You remember the late nights? The "Aha!" moments when window functions finally clicked?
                You built that knowledge brick by brick. You earned it.
              </p>
              <p>
                But technical careers are unforgiving. You shift focus to architecture, management, or Python,
                and slowly, silently, that hard-earned muscle begins to atrophy.
                <br />
                <span className="text-foreground font-medium italic">Then comes the interview question you used to know by heart. And you freeze.</span>
              </p>
            </div>
          </div>

          {/* Validation Stats - Kept minimal but impactful */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-white/5 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">73%</div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">feel skills gap</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">2-4 hrs</div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">cramming time</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">6 weeks</div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">fade duration</p>
            </div>
          </div>

          {/* The Solution / Empathy Bridge */}
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                We felt that gap too. We tried the weekend sprints. The "grind 500 questions" marathons.
                They felt like punishment. We realized the industry had it wrong.
                <span className="text-white font-semibold"> Mastery isn't about intensity. It's about consistency.</span>
              </p>
              <p>
                Daily SQL wasn't built as a product; it was built as a lifeline for ourselves.
                A way to keep our tools sharp without the burnout. Just 15 minutes. Just enough to ensure
                that your skills belong to you, forever.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#30B5A6]/10 flex items-center justify-center mb-2 animate-pulse">
                <Heart className="w-5 h-5 text-[#30B5A6] fill-[#30B5A6]" />
              </div>
              <p className="text-[#30B5A6] font-medium tracking-wide text-sm uppercase">
                Made with love & lots of caffeine
              </p>
              <p className="text-zinc-500 text-sm">
                by engineers who refuse to rust.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
