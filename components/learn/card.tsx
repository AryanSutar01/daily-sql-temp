"use client"

import { Zap, Search, ArrowUpDown, BarChart3, GitMerge, Puzzle, AppWindow, Gauge, Lock, Building2 } from "lucide-react"
import Link from "next/link"
import { tutorials } from "@/tutorials/manifest"

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Search,
  ArrowUpDown,
  BarChart3,
  GitMerge,
  Puzzle,
  AppWindow,
  Gauge,
  Lock,
  Building2,
}

export function Card() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tutorials.map((t, index) => {
        const Icon = iconMap[t.icon]
        return (
          <Link
            key={t.id}
            href={`/practice/learn/${t.id}`}
            className="group relative p-5 rounded-xl border border-[#202736] bg-[#0f1623] hover:border-[#30B5A6]/50 hover:bg-[#131c2e] transition-all duration-200"
          >
            {/* Gradient accent on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#30B5A6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Number badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#30B5A6]/10 text-[#30B5A6] text-sm font-semibold">
                {index + 1}
              </span>
              {Icon && <Icon className="w-5 h-5 text-[#4DD4C4]" />}
            </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-white group-hover:text-[#4DD4C4] transition-colors mb-1">
            {t.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-500 leading-relaxed">
            {t.description}
          </p>
          </Link>
        )
      })}
    </div>
  )
}
