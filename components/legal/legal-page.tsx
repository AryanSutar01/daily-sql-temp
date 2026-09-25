import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; tone?: "info" | "warn"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type Section = { id: string; title: string; blocks: Block[] };

export type LegalPageProps = {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: Section[];
  related: { label: string; href: string }[];
};

/**
 * Inline formatting for legal copy:
 *   **bold**              → <strong>
 *   {{/refund|Label}}     → internal link
 *   [placeholder text]    → highlighted placeholder the operator must replace
 *   name@domain.tld       → mailto link
 */
const TOKEN = /(\*\*[^*]+\*\*|\{\{[^|}]+\|[^}]+\}\}|\[[^\]]+\]|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g;

function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const [href, label] = part.slice(2, -2).split("|");
          return (
            <Link key={i} href={href} className="text-[#1f9e8e] font-semibold hover:underline">
              {label}
            </Link>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <mark
              key={i}
              className="rounded px-1 py-0.5 bg-yellow-200 text-zinc-900 dark:bg-yellow-500/30 dark:text-yellow-100"
              title="Placeholder — replace before publishing"
            >
              {part}
            </mark>
          );
        }
        if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(part)) {
          return (
            <a key={i} href={`mailto:${part}`} className="text-[#1f9e8e] font-semibold hover:underline">
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p><Inline text={block.text} /></p>;
    case "h3":
      return <h3 className="text-sm font-bold font-mono text-zinc-900 pt-2"><Inline text={block.text} /></h3>;
    case "ul":
      return (
        <ul className="list-disc pl-5 space-y-1.5">
          {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal pl-5 space-y-1.5">
          {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
        </ol>
      );
    case "note":
      return (
        <div
          className={
            block.tone === "warn"
              ? "rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-200"
              : "rounded-xl border border-[#1f9e8e]/25 bg-[#e6f7f5] p-4 text-[#135d54]"
          }
        >
          <Inline text={block.text} />
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-[#dedee2]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-white/5">
                {block.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2.5 font-mono font-bold text-zinc-900 border-b border-[#dedee2] align-top">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-[#dedee2] last:border-b-0">
                  {row.map((cell, c) => (
                    <td key={c} className={`px-3 py-2.5 align-top leading-relaxed ${c === 0 ? "font-semibold text-zinc-900" : ""}`}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function LegalPage({ eyebrow, icon, title, lastUpdated, intro, sections, related }: LegalPageProps) {
  return (
    <main className="landing-light min-h-screen pt-12 pb-24 bg-[#fafafa] text-zinc-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-[#1f9e8e] transition-colors mb-6"
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white border border-[#dedee2] rounded-2xl p-6 sm:p-10 shadow-xs">
          {/* Header */}
          <div className="border-b border-zinc-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/20 text-[#1f9e8e] text-xs font-mono font-bold mb-3">
              {icon}
              <span>{eyebrow}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900">{title}</h1>
            <p className="text-xs font-mono text-zinc-500 mt-2">Effective and last updated: {lastUpdated}</p>
            <div className="mt-5 space-y-3 text-sm text-zinc-600 leading-relaxed">
              {intro.map((p, i) => <p key={i}><Inline text={p} /></p>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-mono">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="px-3 py-1.5 rounded-full border border-[#dedee2] text-zinc-600 hover:text-[#1f9e8e] hover:border-[#1f9e8e]/40 transition-colors">
                  {r.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
            {/* Table of contents */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <details className="lg:open rounded-xl border border-[#dedee2] lg:border-0 p-3 lg:p-0" open>
                <summary className="cursor-pointer text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 lg:mb-3 lg:cursor-default">
                  Contents
                </summary>
                <nav aria-label="Table of contents" className="mt-2 lg:mt-0 max-h-[60vh] overflow-y-auto pr-1">
                  <ol className="space-y-1.5 text-xs text-zinc-600">
                    {sections.map((s, i) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="block leading-snug hover:text-[#1f9e8e] transition-colors">
                          <span className="font-mono text-zinc-400 mr-1.5">{i + 1}.</span>{s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </details>
            </aside>

            {/* Body */}
            <div className="space-y-10 text-sm text-zinc-600 leading-relaxed min-w-0">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
                  <h2 className="text-base sm:text-lg font-bold font-mono text-zinc-900">
                    {i + 1}. {s.title}
                  </h2>
                  {s.blocks.map((b, j) => <BlockView key={j} block={b} />)}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
