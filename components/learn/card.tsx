"use client"

import Link from "next/link"
import {Tutorial, tutorials} from "@/tutorials/manifest"

const tagStyles = {
  concept: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  practice: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  interview: "bg-orange-500/10 text-orange-400 border-orange-500/20",
}

interface CardProps {
  tutorials: Tutorial[]
}

export function Card({ tutorials }: CardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tutorials.map((t, index) => {
        return (
          <Link
            key={t.id}
            href={`/practice/learn/${t.id}`}
            className="group relative p-5 rounded-xl border border-[#202736] bg-[#0f1623] hover:border-[#30B5A6]/50 hover:bg-[#131c2e] transition-all duration-200"
          >
            {/* Gradient accent on hover */}
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-[#30B5A6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              {/* Number badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#30B5A6]/10 text-[#30B5A6] text-sm font-semibold">
                  {t.order}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white group-hover:text-[#4DD4C4] transition-colors mb-1">
                {t.title}
              </h3>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${tagStyles[tag]}`}
                    >
                      {tag}
                    </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-500 leading-relaxed">
                {t.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
