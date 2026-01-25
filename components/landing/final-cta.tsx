import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-[#080c16] border-t border-[#202736]">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="space-y-6 mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Start building your <span className="text-[#4DD4C4]">daily SQL habit</span>
          </h2>
          <p className="text-xl text-[#7b8ca3] max-w-2xl mx-auto leading-relaxed">
            Join thousands of data professionals who practice SQL every day. 15 minutes. 3 questions. Consistent improvement.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button asChild size="lg" className="bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-bold px-8 py-6 text-lg shadow-[0_0_30px_rgba(77,212,196,0.2)] hover:shadow-[0_0_40px_rgba(77,212,196,0.3)] transition-all duration-300">
            <Link href="/login">Start your daily practice</Link>
          </Button>
          <span className="text-sm text-[#7b8ca3] opacity-80">
            Free during early access. No credit card required.
          </span>
        </div>
      </div>
    </section>
  );
}
