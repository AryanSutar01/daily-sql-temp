"use client";

import Link from "next/link";
import { Tutorial } from "@/tutorials/sql/manifest";

const tagStyles: Record<string, string> = {
  concept: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30",
  practice: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
  interview: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
};

interface CardProps {
  tutorials: Tutorial[];
  basePath: string;
}

export function Card({ tutorials, basePath }: CardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tutorials.map((t) => {
        return (
          <Link
            key={t.id}
            href={`/practice/learn/${basePath}/${t.id}`}
            className="group flex flex-col h-full bg-white border border-[#dedee2] hover:border-zinc-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#e6f7f5] text-[#1f9e8e] text-xs font-bold font-mono border border-[#1f9e8e]/25">
                {t.order}
              </span>
              <div className="flex flex-wrap gap-1">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border capitalize ${
                      tagStyles[tag] || "bg-zinc-100 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-bold font-mono text-zinc-900 group-hover:text-[#1f9e8e] transition-colors mb-1.5 leading-snug">
              {t.title}
            </h3>

            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mt-auto pt-1">
              {t.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
