export function FounderNote() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="p-10 rounded-xl border-2 border-[#2563EB]/30 bg-gradient-to-br from-card to-[#2563EB]/5 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Built by engineers, for engineers</h3>
                <p className="text-sm text-muted-foreground">The team behind Daily SQL</p>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
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
              <p className="text-foreground font-medium">
                Join us in building a better way to practice SQL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

