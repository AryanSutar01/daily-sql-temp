"use client";

// ---------------------------------------------------------------------------
// Logo-only company carousel — uses locally hosted logos (public/logos/).
// SVGs from Simple Icons CDN + PNG favicons from Google's favicon service.
// Two infinite-scroll rows (left & right) with CSS marquee + edge fades.
// ---------------------------------------------------------------------------

import { useState } from "react";

interface Company {
  name: string;       // tooltip + alt text
  file: string;       // filename inside /public/logos/
  color: string;      // hex WITHOUT # — used for hover glow
  darkBg?: boolean;   // true = use a slightly lighter pill bg for contrast
}

// Row 1 scrolls LEFT
const ROW_ONE: Company[] = [
  { name: "Google",     file: "google.svg",     color: "4285F4" },
  { name: "Microsoft",  file: "microsoft.png",  color: "00A4EF" },
  { name: "Amazon",     file: "amazon.png",     color: "FF9900" },
  { name: "Cognizant",  file: "cognizant.png",  color: "1778B9" },
  { name: "TCS",        file: "tcs.svg",        color: "0078C8" },
  { name: "Infosys",    file: "infosys.svg",    color: "007CC3" },
  { name: "Accenture",  file: "accenture.svg",  color: "A100FF" },
  { name: "Wipro",      file: "wipro.svg",      color: "9B4993" },
  { name: "IBM",        file: "ibm.png",        color: "1F70C1" },
  { name: "Capgemini",  file: "capgemini.png",  color: "0070AD" },
];

// Row 2 scrolls RIGHT
const ROW_TWO: Company[] = [
  { name: "Meta",        file: "meta.svg",        color: "0082FB" },
  { name: "Netflix",     file: "netflix.svg",      color: "E50914" },
  { name: "LinkedIn",    file: "linkedin.png",     color: "0A66C2" },
  { name: "Airbnb",      file: "airbnb.svg",       color: "FF385C" },
  { name: "Snowflake",   file: "snowflake.svg",    color: "29B5E8" },
  { name: "Databricks",  file: "databricks.svg",   color: "FF3621" },
  { name: "Deloitte",    file: "deloitte.png",     color: "86BC25" },
  { name: "Oracle",      file: "oracle.png",       color: "F80000" },
  { name: "SAP",         file: "sap.svg",          color: "0FAAFF" },
  { name: "Salesforce",  file: "salesforce.png",   color: "00A1E0" },
];

// Triple each row for seamless CSS marquee loop at any viewport width
const ROW_ONE_TRACK = [...ROW_ONE, ...ROW_ONE, ...ROW_ONE];
const ROW_TWO_TRACK = [...ROW_TWO, ...ROW_TWO, ...ROW_TWO];

function LogoPill({ company }: { company: Company }) {
  const [hovered, setHovered] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center mx-3 px-6 rounded-2xl border border-white/8 bg-[#111827]/80 backdrop-blur-sm transition-all duration-300 cursor-default select-none"
      style={{
        minWidth: 110,
        height: 72,
        boxShadow: hovered ? `0 0 20px 3px #${company.color}28` : "none",
        borderColor: hovered ? `#${company.color}50` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={company.name}
    >
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/logos/${company.file}`}
          alt={company.name}
          width={48}
          height={48}
          onError={() => setErrored(true)}
          className="object-contain transition-all duration-300"
          style={{
            maxWidth: 52,
            maxHeight: 44,
            opacity: hovered ? 1 : 0.85,
            filter: hovered ? "none" : "grayscale(60%)",
          }}
          loading="lazy"
        />
      ) : (
        /* Text fallback if file is missing */
        <span className="text-xs font-bold tracking-tight text-zinc-400 whitespace-nowrap">
          {company.name}
        </span>
      )}
    </div>
  );
}

export function CompanyCarousel() {
  return (
    <section className="py-20 bg-[#080c16] overflow-hidden">
      {/* Heading */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
          Trusted by professionals from
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          World-class companies &amp; consultancies
        </h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
          Our learners work at some of the most data-driven organisations on the planet.
        </p>
      </div>

      {/* ── Row 1 — scrolls left ── */}
      <div className="relative mb-5">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#080c16] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#080c16] to-transparent z-10 pointer-events-none" />
        <div
          className="flex"
          style={{ animation: "marquee-left 45s linear infinite" }}
        >
          {ROW_ONE_TRACK.map((company, i) => (
            <LogoPill key={`r1-${i}`} company={company} />
          ))}
        </div>
      </div>

      {/* ── Row 2 — scrolls right ── */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#080c16] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#080c16] to-transparent z-10 pointer-events-none" />
        <div
          className="flex"
          style={{ animation: "marquee-right 45s linear infinite" }}
        >
          {ROW_TWO_TRACK.map((company, i) => (
            <LogoPill key={`r2-${i}`} company={company} />
          ))}
        </div>
      </div>

      {/* CSS keyframes */}
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
