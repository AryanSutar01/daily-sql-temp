export function TrustStrip() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-brand-base font-semibold">500+</span>
            <span>data professionals practicing daily</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-brand-base font-semibold">Built by</span>
            <span>engineers who work with SQL every day</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-brand-base font-semibold">Used by</span>
            <span>teams from startups to enterprise</span>
          </div>
        </div>
      </div>
    </section>
  );
}

