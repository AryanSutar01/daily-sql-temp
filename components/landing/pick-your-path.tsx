"use client";

/* ─────────────────────────────────────────────────────────────
   PickYourPath — Three tall cards redirecting to problem pages.
   Light-mode section that sits right after the CompanyCarousel.
───────────────────────────────────────────────────────────── */

import Link from "next/link";
import { Database, Zap, Code2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface PathCard {
  id: string;
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  topics: string[];
  accent: string;
  accentDark: string;
  cardBg: string;
  iconBgHex: string;
  href: string;
  tag?: string;
}

const PATHS: PathCard[] = [
  {
    id: "sql",
    icon: Database,
    eyebrow: "SQL PATH",
    title: "SQL\n(Postgres)",
    description:
      "Window functions, CTEs, retention queries, date maths, and query optimisation — everything a data pro needs daily.",
    topics: [
      "Window functions & CTEs",
      "Complex aggregations",
      "Cohort & retention queries",
      "Date & time calculations",
      "Query optimisation",
    ],
    accent: "#1f9e8e",
    accentDark: "#166e63",
    cardBg: "#e6f8f6",
    iconBgHex: "rgba(31,158,142,0.13)",
    href: "/problems/sql",
    tag: "Most popular",
  },
  {
    id: "pyspark",
    icon: Zap,
    eyebrow: "BIG DATA PATH",
    title: "PySpark",
    description:
      "Spark DataFrames, joins, partitioning, window functions, and performance tuning at scale.",
    topics: [
      "Spark DataFrames & SQL",
      "Window functions",
      "Partitioning & bucketing",
      "RDD transformations",
      "Performance tuning",
    ],
    accent: "#7c3aed",
    accentDark: "#5b21b6",
    cardBg: "#f0ecff",
    iconBgHex: "rgba(124,58,237,0.13)",
    href: "/problems/pyspark",
  },
  {
    id: "python",
    icon: Code2,
    eyebrow: "PYTHON PATH",
    title: "Python\nDSA / Pandas",
    description:
      "DataFrame operations, group-bys, merges, time-series, and algorithmic problem-solving with Python.",
    topics: [
      "DataFrame operations",
      "GroupBy & aggregations",
      "Merges & joins",
      "Time-series manipulation",
      "DSA fundamentals",
    ],
    accent: "#d97706",
    accentDark: "#92400e",
    cardBg: "#fef6e4",
    iconBgHex: "rgba(217,119,6,0.13)",
    href: "/problems/python",
  },
];

/* ── Individual card ── */
function PathCardItem({ card, index }: { card: PathCard; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${hovered ? card.accent + "55" : "var(--ls-outline, #e4e4e8)"}`,
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.11), 0 2px 0 ${card.accent}22 inset`
          : "var(--ls-shadow-md, 0 4px 18px rgba(0,0,0,0.06))",
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
        background: "var(--ls-surface, #fff)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {/* ── Coloured top panel with stacked icon illustration ── */}
      <div
        style={{
          background: card.accent + "1f",
          padding: "40px 28px 28px",
          position: "relative",
          minHeight: 230,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Decorative stacked squares — pure visual */}
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 76,
            height: 76,
          }}
        >
          {/* Back layer */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: -8,
              width: 76,
              height: 76,
              borderRadius: 14,
              background: card.accent + "44",
            }}
          />
          {/* Mid layer */}
          <div
            style={{
              position: "absolute",
              top: 7,
              right: -4,
              width: 76,
              height: 76,
              borderRadius: 14,
              background: card.accent + "88",
            }}
          />
          {/* Front layer with icon */}
          <div
            style={{
              position: "relative",
              width: 76,
              height: 76,
              borderRadius: 14,
              background: card.accent,
              boxShadow: `0 10px 28px ${card.accent}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon style={{ width: 32, height: 32, color: "#fff" }} />
          </div>
        </div>

        {/* Optional tag */}
        {card.tag && (
          <span
            style={{
              position: "absolute",
              top: 22,
              left: 24,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: card.accent,
              background: card.iconBgHex,
              border: `1px solid ${card.accent}33`,
              borderRadius: 100,
              padding: "3px 10px",
            }}
          >
            {card.tag}
          </span>
        )}

        {/* Text at bottom of panel */}
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: card.accent,
              marginBottom: 6,
              opacity: 0.65,
            }}
          >
            {card.eyebrow}
          </p>
          <h3
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(1.55rem, 2.4vw, 2.05rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ls-heading)",
              whiteSpace: "pre-line" as const,
            }}
          >
            {card.title}
          </h3>
        </div>
      </div>

      {/* ── Bottom info panel ── */}
      <div
        style={{
          padding: "22px 28px 28px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "var(--ls-surface, #fff)",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.65,
            color: "var(--ls-on-surface-muted)",
            marginBottom: 18,
          }}
        >
          {card.description}
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", flex: 1 }}>
          {card.topics.map((topic) => (
            <li
              key={topic}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontSize: "0.8125rem",
                color: "var(--ls-on-surface)",
                marginBottom: 9,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: card.accent,
                  flexShrink: 0,
                  display: "inline-block",
                }}
              />
              {topic}
            </li>
          ))}
        </ul>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.875rem",
            fontWeight: 600,
            color: card.accent,
          }}
        >
          View all problems
          <ArrowRight
            style={{
              width: 15,
              height: 15,
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.22s ease",
            }}
          />
        </div>
      </div>
    </Link>
  );
}

/* ── Section export ── */
export function PickYourPath() {
  return (
    <section
      style={{
        background: "var(--ls-bg)",
        paddingTop: 80,
        paddingBottom: 96,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        {/* Section header */}
        <div style={{ marginBottom: 52 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ls-primary)",
              marginBottom: 12,
            }}
          >
            Pick your path
          </p>
          <h2
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.55rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--ls-heading)",
              marginBottom: 14,
            }}
          >
            Choose where to start
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "var(--ls-on-surface-muted)",
              maxWidth: 460,
            }}
          >
            Three disciplines. Pick one, or master all three. Fresh problems drop every day.
          </p>
        </div>

        {/* Card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 20,
          }}
        >
          {PATHS.map((card, i) => (
            <PathCardItem key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
