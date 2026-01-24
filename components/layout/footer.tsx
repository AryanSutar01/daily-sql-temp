import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-[#09090b]">
      {/* Final CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-gradient-to-b from-background to-[#30B5A6]/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Stay sharp with SQL
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Join early access and start building your daily SQL practice habit today.
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#30B5A6] hover:bg-[#2A9D90] text-[#080C16] font-bold px-10 py-7 text-lg shadow-lg shadow-[#30B5A6]/20 hover:shadow-[#30B5A6]/30 transition-all duration-200">
            <Link href="/waitlist">Join Waitlist</Link>
          </Button>
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
              Stay sharp in SQL with just 15 minutes a day.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="#how-it-works" className="hover:text-[#30B5A6] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#30B5A6] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/waitlist" className="hover:text-[#30B5A6] transition-colors">
                  Join Waitlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/team" className="hover:text-[#30B5A6] transition-colors">
                  Team
                </Link>
              </li>
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

