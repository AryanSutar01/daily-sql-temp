"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { PracticeLink } from "@/components/landing/practice-link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-[#09090b]">
      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto text-center px-4 py-24 md:py-32">
        <div className="space-y-6 mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Start building your <span className="text-[#4DD4C4]">daily practice habit</span>
          </h2>
          <p className="text-xl text-[#7b8ca3] max-w-2xl mx-auto leading-relaxed">
            Join thousands of data professionals who practice SQL, Python, and PySpark every day. 15 minutes. 9 questions. Consistent improvement.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <PracticeLink
            label="Start your daily practice"
            className="inline-flex items-center justify-center gap-2 bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-bold px-8 py-4 text-lg shadow-[0_0_30px_rgba(77,212,196,0.2)] hover:shadow-[0_0_40px_rgba(77,212,196,0.3)] transition-all duration-300 rounded-lg"
          />
          <span className="text-sm text-[#7b8ca3] opacity-80">
            Start practicing for free. Upgrade anytime for advanced features.
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-[#30B5A6] to-[#4DD4C4] bg-clip-text text-transparent">
                Daily SQL
              </span>
            </Link>
            <p className="text-sm text-zinc-400">
              Stay sharp in SQL, Python, and PySpark with just 15 minutes a day.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#30B5A6] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#30B5A6] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/practice/learn/sql" className="hover:text-[#30B5A6] transition-colors">
                  SQL Tutorials
                </Link>
              </li>
              <li>
                <Link href="/practice/learn/python" className="hover:text-[#30B5A6] transition-colors">
                  Python Tutorials
                </Link>
              </li>
              <li>
                <Link href="/practice/learn/pyspark" className="hover:text-[#30B5A6] transition-colors">
                  PySpark Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/contact" className="hover:text-[#30B5A6] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-[#30B5A6] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#30B5A6] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#30B5A6] transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom bar with Made with Love */}
        <div className="pt-8 border-t border-border/50 flex flex-col items-center justify-center space-y-4">
          <p className="text-sm text-zinc-500 flex items-center gap-2">
            Made with <Heart size={14} className="text-[#30B5A6] fill-[#30B5A6]" /> by engineers, for engineers.
          </p>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Daily SQL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

