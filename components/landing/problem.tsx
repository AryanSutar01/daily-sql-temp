export function Problem() {
  return (
    <section className="py-24 md:py-32 border-b border-[#202736]">
      {/* Background color managed by parent or global theme, forcing here for preview */}
      <div className="absolute inset-0 bg-[#080c16] pointer-events-none z-[-1]" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
            SQL skills decay without practice
          </h2>

          <div className="space-y-6 text-lg text-[#7588a3]">
            <p>
              You know SQL. You've written thousands of queries. But when that interview question comes up—or when you need a complex window function on a deadline—something feels off.
            </p>
            <p>
              Most professionals face the same problem: there's no time to grind through 500 practice problems. And when you do find time, the skills you built disappear within weeks.
            </p>
            <p className="text-white font-medium">
              The issue isn't learning SQL. It's maintaining it.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-[#0b101c] border border-[#202736]">
              <div className="text-3xl md:text-4xl font-bold text-[#30b5a6] mb-2">73%</div>
              <div className="text-sm text-[#7588a3]">
                of data professionals feel their SQL skills have gaps
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-[#0b101c] border border-[#202736]">
              <div className="text-3xl md:text-4xl font-bold text-[#30b5a6] mb-2">2-4 hrs</div>
              <div className="text-sm text-[#7588a3]">
                average prep time before technical interviews
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-[#0b101c] border border-[#202736]">
              <div className="text-3xl md:text-4xl font-bold text-[#30b5a6] mb-2">6 weeks</div>
              <div className="text-sm text-[#7588a3]">
                before complex SQL patterns start to fade
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
