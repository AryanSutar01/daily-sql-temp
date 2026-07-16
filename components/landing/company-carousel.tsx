"use client";

// ---------------------------------------------------------------------------
// Styled text-based company logos — no image downloads needed.
// Each entry has a display name, a subtle brand accent color, and an optional
// single-character icon rendered as a tiny bold monogram inside a colored dot.
// ---------------------------------------------------------------------------

interface Company {
  name: string;
  nameColor: string;   // Tailwind arbitrary or predefined text color
  dotColor: string;    // bg color for the tiny accent dot
  mono: string;        // 1-2 char monogram shown in the dot
  weight?: string;     // optional font-weight override
  italic?: boolean;
}

const ROW_ONE: Company[] = [
  { name: "Google",       nameColor: "text-white",          dotColor: "bg-[#4285F4]", mono: "G"  },
  { name: "Meta",         nameColor: "text-[#0082FB]",      dotColor: "bg-[#0082FB]", mono: "M"  },
  { name: "Amazon",       nameColor: "text-[#FF9900]",      dotColor: "bg-[#FF9900]", mono: "A"  },
  { name: "Microsoft",    nameColor: "text-[#00A4EF]",      dotColor: "bg-[#00A4EF]", mono: "Ms" },
  { name: "Netflix",      nameColor: "text-[#E50914]",      dotColor: "bg-[#E50914]", mono: "N"  },
  { name: "Uber",         nameColor: "text-white",          dotColor: "bg-zinc-700",  mono: "U"  },
  { name: "Snowflake",    nameColor: "text-[#29B5E8]",      dotColor: "bg-[#29B5E8]", mono: "❄"  },
  { name: "Databricks",   nameColor: "text-[#FF3621]",      dotColor: "bg-[#FF3621]", mono: "D"  },
  { name: "Accenture",    nameColor: "text-[#A100FF]",      dotColor: "bg-[#A100FF]", mono: "Ac" },
  { name: "Deloitte",     nameColor: "text-[#86BC25]",      dotColor: "bg-[#86BC25]", mono: "D"  },
  { name: "McKinsey",     nameColor: "text-[#0F4C96]",      dotColor: "bg-[#2C5F9E]", mono: "Mc" },
  { name: "Palantir",     nameColor: "text-white",          dotColor: "bg-zinc-600",  mono: "P"  },
];

const ROW_TWO: Company[] = [
  { name: "LinkedIn",     nameColor: "text-[#0A66C2]",      dotColor: "bg-[#0A66C2]", mono: "in" },
  { name: "Apple",        nameColor: "text-zinc-200",       dotColor: "bg-zinc-600",  mono: "🍎" },
  { name: "Airbnb",       nameColor: "text-[#FF385C]",      dotColor: "bg-[#FF385C]", mono: "Ab" },
  { name: "Cognizant",    nameColor: "text-[#1778B9]",      dotColor: "bg-[#1778B9]", mono: "C"  },
  { name: "TCS",          nameColor: "text-[#0078C8]",      dotColor: "bg-[#0078C8]", mono: "T"  },
  { name: "Infosys",      nameColor: "text-[#007CC3]",      dotColor: "bg-[#007CC3]", mono: "I"  },
  { name: "Wipro",        nameColor: "text-[#341C6B]",      dotColor: "bg-[#543089]", mono: "W"  },
  { name: "Capgemini",    nameColor: "text-[#0070AD]",      dotColor: "bg-[#0070AD]", mono: "C"  },
  { name: "IBM",          nameColor: "text-[#1F70C1]",      dotColor: "bg-[#1F70C1]", mono: "IBM"},
  { name: "Tableau",      nameColor: "text-[#E97627]",      dotColor: "bg-[#E97627]", mono: "T"  },
  { name: "dbt Labs",     nameColor: "text-[#FF6849]",      dotColor: "bg-[#FF6849]", mono: "dbt"},
  { name: "Confluent",    nameColor: "text-[#E31E3E]",      dotColor: "bg-[#E31E3E]", mono: "C"  },
];

function LogoChip({ company }: { company: Company }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 mx-3 rounded-xl border border-white/8 bg-[#111827]/80 backdrop-blur-sm hover:border-white/15 transition-colors duration-300 select-none">
      {/* Accent dot / monogram */}
      <div
        className={`w-7 h-7 rounded-lg ${company.dotColor} flex items-center justify-center text-white text-[9px] font-black leading-none shrink-0 opacity-90`}
      >
        {company.mono}
      </div>
      {/* Company name */}
      <span
        className={`text-sm font-semibold tracking-tight whitespace-nowrap ${company.nameColor} ${company.italic ? "italic" : ""}`}
      >
        {company.name}
      </span>
    </div>
  );
}

// Duplicate each row 3× to ensure seamless looping at all viewport sizes
const ROW_ONE_TRACK = [...ROW_ONE, ...ROW_ONE, ...ROW_ONE];
const ROW_TWO_TRACK = [...ROW_TWO, ...ROW_TWO, ...ROW_TWO];

export function CompanyCarousel() {
  return (
    <section className="py-20 bg-[#080c16] overflow-hidden">
      {/* Heading */}
      <div className="container mx-auto px-4 mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
          Trusted by professionals from
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          World-class companies & consultancies
        </h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
          Our learners work at some of the most data-driven organisations on the planet.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div className="flex" style={{ animation: "marquee-left 40s linear infinite" }}>
          {ROW_ONE_TRACK.map((company, i) => (
            <LogoChip key={i} company={company} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="flex" style={{ animation: "marquee-right 40s linear infinite" }}>
          {ROW_TWO_TRACK.map((company, i) => (
            <LogoChip key={i} company={company} />
          ))}
        </div>
      </div>

      {/* Keyframes injected via a style tag so we avoid a globals.css edit */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
