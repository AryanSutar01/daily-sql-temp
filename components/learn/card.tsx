"use client"

import Link from "next/link"
import { Tutorial } from "@/tutorials/sql/manifest"
import { useRef, useState } from "react"

const tagStyles = {
  concept: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  practice: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  interview: "bg-orange-500/10 text-orange-400 border-orange-500/20",
}

interface CardProps {
  tutorials: Tutorial[]
  basePath: string
}

function SpotlightCard({
  children,
  className = "",
  href,
}: {
  children: React.ReactNode
  className?: string
  href: string
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <Link href={href} className="flex h-full flex-col">
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(1)}
        onMouseLeave={() => setOpacity(0)}
        className={`group relative overflow-hidden rounded-xl border border-[#202736] bg-[#0f1623]/80 hover:border-[#4DD4C4]/30 transition-all duration-300 flex flex-col flex-1 h-full ${className}`}
      >
        {/* Spotlight glow */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
          style={{
            opacity,
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(77, 212, 196, 0.1), transparent 40%)`,
          }}
        />
        <div className="relative h-full flex flex-col flex-1">{children}</div>
      </div>
    </Link>
  )
}

export function Card({ tutorials, basePath }: CardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tutorials.map((t) => {
        return (
          <SpotlightCard
            key={t.id}
            href={`${basePath}/${t.id}`}
          >
            <div className="p-5 flex flex-col h-full flex-1">
              {/* Number badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#30B5A6]/10 text-[#4DD4C4] text-sm font-semibold border border-[#30B5A6]/20">
                  {t.order}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white group-hover:text-[#4DD4C4] transition-colors duration-200 mb-1.5">
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
              <p className="text-xs text-[#7b8ca3] leading-relaxed">
                {t.description}
              </p>
            </div>
          </SpotlightCard>
        )
      })}
    </div>
  )
}
