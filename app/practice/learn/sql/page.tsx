import { Card } from "@/components/learn/card"
import { getTutorialsByCategory } from "@/tutorials/sql/manifest";

export default function LearnPage() {
  const tutorialsByCategory = getTutorialsByCategory()

  return (
    <main className="min-h-screen bg-[#080c16]">
      {/* Hero Header - matching landing page theme */}
      <section className="relative overflow-hidden pt-8 -mt-16 pb-16">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Strong top-left glow */}
        <div className="absolute top-0 left-0 w-[700px] h-[500px] bg-[#4DD4C4]/25 blur-[120px] rounded-full pointer-events-none z-0 -translate-x-1/4 -translate-y-1/4" />

        {/* Secondary ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-[#30B5A6]/8 rounded-full blur-[100px]" />
        </div>

        {/* Bottom fade line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#30B5A6]/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24">
          {/* Badge */}
          <div className="flex justify-center md:justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#30B5A6]/20 bg-[#30B5A6]/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[#4DD4C4] animate-pulse" />
              <span className="text-sm text-zinc-400">Interview-ready SQL theory</span>
            </div>
          </div>

          {/* Icon + Title */}
          <div className="mb-5 flex items-center gap-5">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#263247] bg-[#111b2d] shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute h-7 w-7 translate-x-1 translate-y-1 rounded-md bg-[#6186EF]" />
              <div className="absolute h-7 w-7 -translate-x-0.5 translate-y-0.5 rounded-md bg-[#F277A1]" />
              <div className="absolute h-7 w-7 -translate-x-2 -translate-y-1 rounded-md border border-white/20 bg-[#30B5A6]" />
              <div className="absolute bottom-3 h-0.5 w-8 rounded-full bg-white/70" />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Learn SQL
              </h1>
              <p className="mt-1.5 text-base text-zinc-400">
                Essential SQL theory for interviews
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-lg leading-relaxed text-[#b5bfd4]">
            Master core database concepts with focused explanations, practical examples,
            and interview-oriented topic coverage.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto  px-6 py-12 space-y-20">
        {tutorialsByCategory.beginner.length > 0 && (
          <section>
            <div className="mb-8 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#4DD4C4] to-[#30B5A6]" />
                <h2 className="text-2xl font-bold text-white">Foundation</h2>
              </div>
              <p className="text-sm text-[#7b8ca3] ml-4 pl-px">
                Core SQL syntax and concepts every beginner must know before writing their first query.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.beginner} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.intermediate.length > 0 && (
          <section>
            <div className="mb-8 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#4DD4C4] to-[#30B5A6]" />
                <h2 className="text-2xl font-bold text-white">Core Querying</h2>
              </div>
              <p className="text-sm text-[#7b8ca3] ml-4 pl-px">
                The bread and butter of SQL interviews - aggregations, joins, and filtering logic.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.intermediate} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.advance.length > 0 && (
          <section>
            <div className="mb-8 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#4DD4C4] to-[#30B5A6]" />
                <h2 className="text-2xl font-bold text-white">Advanced Topics</h2>
              </div>
              <p className="text-sm text-[#7b8ca3] ml-4 pl-px">
                Topics that separate average candidates from strong ones in interviews.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.advance} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.designAndPerformance.length > 0 && (
          <section>
            <div className="mb-8 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#4DD4C4] to-[#30B5A6]" />
                <h2 className="text-2xl font-bold text-white">Design & Performance</h2>
              </div>
              <p className="text-sm text-[#7b8ca3] ml-4 pl-px">
                Schema design, performance tuning, and database internals - critical for senior roles.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.designAndPerformance} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.bonus.length > 0 && (
          <section>
            <div className="mb-8 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#4DD4C4] to-[#30B5A6]" />
                <h2 className="text-2xl font-bold text-white">Real-World & Analytics</h2>
              </div>
              <p className="text-sm text-[#7b8ca3] ml-4 pl-px">
                Practical topics for data analysts, data engineers, and modern SQL users.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.bonus} basePath="sql" />
          </section>
        )}
      </div>
    </main>
  )
}
