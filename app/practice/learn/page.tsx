import { Card } from "@/components/learn/card"
import {getTutorialsByCategory} from "@/tutorials/manifest";

export default function LearnPage() {
  const tutorialsByCategory = getTutorialsByCategory()

  return (
    <main className="min-h-screen bg-[#0a0f1c]">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-[#202736] bg-[#0d1421]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(48,181,166,0.14),transparent_38%),linear-gradient(90deg,rgba(97,134,239,0.1),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#30B5A6]/60 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2b3548] bg-[#111a2a]/80 px-3 py-1 text-xs font-medium text-[#9aa8c7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#30B5A6]" />
                Interview-ready SQL theory
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#263247] bg-[#111b2d] shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
                  <div className="absolute h-7 w-7 translate-x-1 translate-y-1 rounded-md bg-[#6186EF]" />
                  <div className="absolute h-7 w-7 -translate-x-0.5 translate-y-0.5 rounded-md bg-[#F277A1]" />
                  <div className="absolute h-7 w-7 -translate-x-2 -translate-y-1 rounded-md border border-white/20 bg-[#30B5A6]" />
                  <div className="absolute bottom-3 h-0.5 w-8 rounded-full bg-white/70" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Learn SQL
                  </h1>
                  <p className="mt-1 text-sm text-[#8b96ad]">
                    Essential SQL theory for interviews
                  </p>
                </div>
              </div>

              <p className="text-base leading-7 text-[#b5bfd4]">
                Master core database concepts with focused explanations, practical examples,
                and interview-oriented topic coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*Content Section*/}
      <div className="mx-auto mx-w-6xl px-12 py-12 space-y-16">
        {tutorialsByCategory.beginner.length > 0 && (
            <section>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Foundation</h2>
                </div>
                <p className="text-sm text-[#8b96ad]">
                  Core SQL syntax and concepts every beginner must know before writing their first query.
                </p>
              </div>
              <Card tutorials={tutorialsByCategory.beginner} />
            </section>
        )}

        {tutorialsByCategory.intermediate.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">Core Querying</h2>
              </div>
              <p className="text-sm text-[#8b96ad]">
                The bread and butter of SQL interviews - aggregations, joins, and filtering logic.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.intermediate} />
          </section>
        )}

        {tutorialsByCategory.advance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">Advance Topics</h2>
              </div>
              <p className="text-sm text-[#8b96ad]">
                Topics that separate average candidates from strong ones in interviews.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.advance} />
          </section>
        )}

        {tutorialsByCategory.designAndPerformance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">Design & Performance</h2>
              </div>
              <p className="text-sm text-[#8b96ad]">
                Schema design, performance tuning, and database internals - critical for senior roles.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.designAndPerformance} />
          </section>
        )}

        {tutorialsByCategory.bonus.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 text-white">
                <h2 className="text-xl font-bold text-white">Real-World & Analytics</h2>
              </div>
              <p className="text-sm text-[#8b96ad]">
                Practical topics for data analysts, data engineers, and modern SQL users.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.bonus} />
          </section>
        )}
      </div>
    </main>
  )
}
