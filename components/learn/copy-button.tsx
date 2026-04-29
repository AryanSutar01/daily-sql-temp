"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-lg bg-[#202736] hover:bg-[#2a3447] transition-colors"
      aria-label="Copy code"
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} className="text-zinc-400" />
      )}
    </button>
  )
}
