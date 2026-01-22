import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-brand-dark/10">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Stay sharp with SQL
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join early access and start building your daily SQL practice habit today.
          </p>
        </div>
        <Button asChild size="lg" className="bg-brand-base hover:bg-brand-dark text-white font-semibold px-10 py-7 text-lg shadow-lg shadow-brand-base/20 hover:shadow-brand-base/30 transition-all duration-200">
          <Link href="/waitlist">Join early access</Link>
        </Button>
      </div>
    </section>
  );
}
