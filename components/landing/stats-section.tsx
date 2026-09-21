"use client";

export function StatsSection() {
  const stats = [
    {
      value: "73%",
      label: "of data professionals feel their query skills have gaps",
      highlight: false,
    },
    {
      value: "2–4 hrs",
      label: "average prep time scrambled before technical interviews",
      highlight: false,
    },
    {
      value: "6 weeks",
      label: "before complex data patterns start to fade without practice",
      highlight: false,
    },
  ];

  return (
    <section
      style={{
        padding: "80px 0",
        background: "var(--ls-surface)",
        borderBottom: "1px solid var(--ls-outline)",
      }}
    >
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="max-w-4xl mx-auto">

          {/* Headline */}
          <div className="text-center mb-14">
            <h2
              style={{
                fontFamily: "'Overused Grotesk', system-ui, sans-serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "var(--ls-on-surface)",
                marginBottom: 12,
              }}
            >
              Data skills decay without practice.
            </h2>
            <p
              className="text-base leading-relaxed mx-auto"
              style={{
                maxWidth: 560,
                color: "var(--ls-on-surface-muted)",
              }}
            >
              You know SQL, Python, and Spark — but without consistent repetition,
              even skilled practitioners drift. The issue isn't learning the tools.
              It's{" "}
              <span style={{ color: "var(--ls-on-surface)", fontWeight: 500 }}>
                maintaining them.
              </span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={value}
                className="text-center px-6 py-8 rounded-2xl transition-all duration-200"
                style={{
                  background: "var(--ls-surface-low)",
                  border: "1px solid var(--ls-outline)",
                  boxShadow: "var(--ls-shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--ls-shadow-md)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(31,158,142,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--ls-shadow-sm)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--ls-outline)";
                }}
              >
                <div
                  className="mb-2 font-light"
                  style={{
                    fontFamily: "'Overused Grotesk', system-ui, sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "var(--ls-primary)",
                  }}
                >
                  {value}
                </div>
                <div
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ls-on-surface-muted)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
