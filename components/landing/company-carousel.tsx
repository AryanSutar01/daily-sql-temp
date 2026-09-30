"use client";

/* ─────────────────────────────────────────────────────────────
   CompanyCarousel — Fanout-style flat logo strips
   • No pill borders / no card backgrounds
   • Logos full colour, small (24 px tall)
   • 3 rows scrolling at different speeds
   • Seamlessly blends with hero (same bg, no top border)
───────────────────────────────────────────────────────────── */

interface Company {
  name: string;
  file: string;
}

/* 20 real logos split evenly across 3 rows */
const ROW_ONE: Company[] = [
  { name: "Google",      file: "google.svg"     },
  { name: "Microsoft",   file: "microsoft.png"  },
  { name: "Amazon",      file: "amazon.png"     },
  { name: "Meta",        file: "meta.svg"       },
  { name: "Netflix",     file: "netflix.svg"    },
  { name: "LinkedIn",    file: "linkedin.png"   },
  { name: "Airbnb",      file: "airbnb.svg"     },
];

const ROW_TWO: Company[] = [
  { name: "Snowflake",   file: "snowflake.svg"  },
  { name: "Databricks",  file: "databricks.svg" },
  { name: "Salesforce",  file: "salesforce.png" },
  { name: "Oracle",      file: "oracle.png"     },
  { name: "SAP",         file: "sap.svg"        },
  { name: "IBM",         file: "ibm.png"        },
];

const ROW_THREE: Company[] = [
  { name: "TCS",         file: "tcs.svg"        },
  { name: "Infosys",     file: "infosys.svg"    },
  { name: "Cognizant",   file: "cognizant.png"  },
  { name: "Accenture",   file: "accenture.svg"  },
  { name: "Wipro",       file: "wipro.svg"      },
  { name: "Capgemini",   file: "capgemini.png"  },
  { name: "Deloitte",    file: "deloitte.png"   },
];

/* Triple each row so the seamless loop never gaps */
const TRACK_ONE   = [...ROW_ONE,   ...ROW_ONE,   ...ROW_ONE  ];
const TRACK_TWO   = [...ROW_TWO,   ...ROW_TWO,   ...ROW_TWO  ];
const TRACK_THREE = [...ROW_THREE, ...ROW_THREE, ...ROW_THREE ];

/* ── Single logo + name item ── */
function LogoItem({ company, priority }: { company: Company; priority?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2.5 select-none"
      style={{ padding: "0 32px", whiteSpace: "nowrap" }}
    >
      {/* Separator dot */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "var(--ls-outline-variant)",
          flexShrink: 0,
        }}
      />

      {/* Colourful logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/${company.file}`}
        alt=""
        aria-hidden="true"
        style={{
          width: "auto",
          height: 20,
          maxWidth: 32,
          objectFit: "contain",
          flexShrink: 0,
          /* no grayscale — full brand colour */
        }}
        loading={priority ? "eager" : "lazy"}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Company name */}
      <span
        style={{
          fontSize: "0.8125rem",   /* 13px */
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--ls-on-surface-muted)",
          lineHeight: 1,
        }}
      >
        {company.name}
      </span>
    </span>
  );
}

/* ── Single animated strip ── */
interface StripProps {
  track: Company[];
  direction: "left" | "right";
  duration?: number;
  priority?: boolean;
}

function Strip({ track, direction, duration = 52, priority }: StripProps) {
  const anim =
    direction === "left"
      ? `marquee-left  ${duration}s linear infinite`
      : `marquee-right ${duration}s linear infinite`;

  return (
    <div className="relative overflow-hidden" style={{ height: 34 }}>
      {/* Edge fades — same colour as section bg (#f7f7f8) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--ls-bg, #f7f7f8), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--ls-bg, #f7f7f8), transparent)" }}
      />

      <div
        className="flex items-center h-full will-change-transform"
        style={{ animation: anim, width: "max-content" }}
      >
        {track.map((c, i) => (
          <LogoItem key={i} company={c} priority={priority} />
        ))}
      </div>
    </div>
  );
}

/* ── Section ── */
export function CompanyCarousel() {
  return (
    <section
      style={{
        /* Match hero background exactly — no visible seam */
        background: "var(--ls-bg)",
        paddingTop: "64px",
        paddingBottom: "56px",
        /* No top border — hero fades into this */
      }}
    >
      {/* Label */}
      <p
        className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] mb-8"
        style={{ color: "var(--ls-on-surface-subtle)" }}
      >
        Trusted by professionals from
      </p>

      {/* Three strips */}
      <div className="flex flex-col gap-4">
        <Strip track={TRACK_ONE}   direction="left"  duration={55} priority />
        <Strip track={TRACK_TWO}   direction="right" duration={62} />
        <Strip track={TRACK_THREE} direction="left"  duration={48} />
      </div>
    </section>
  );
}
