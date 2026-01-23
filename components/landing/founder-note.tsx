import { Terminal } from "lucide-react";

export function FounderNote() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative p-10 rounded-2xl border border-[#30B5A6]/20 bg-[#0F1419] shadow-2xl shadow-[#30B5A6]/5 overflow-hidden group hover:border-[#30B5A6]/40 transition-colors duration-300">

          {/* Subtle Background Glow/Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#30B5A6]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative space-y-8">
            {/* Header */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-[#30B5A6]/10 flex items-center justify-center border border-[#30B5A6]/20 group-hover:border-[#30B5A6]/40 transition-colors">
                <Terminal className="h-7 w-7 text-[#30B5A6]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Built by engineers, for engineers</h3>
                <p className="text-sm text-[#30B5A6] font-medium tracking-wide">The team behind Daily SQL</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                We built Daily SQL because we faced the same problem you do: staying sharp in SQL
                without the grind. As engineers who work with SQL every day, we know what it takes
                to maintain skills while juggling a busy schedule.
              </p>
              <p>
                This isn't a side project. It's a tool we use ourselves. Every feature is designed
                around one principle: <span className="text-foreground font-semibold">consistency beats intensity</span>.
                We've tested it, refined it, and built it to last.
              </p>
              <p className="text-foreground font-semibold pt-2">
                Join us in building a better way to practice SQL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
