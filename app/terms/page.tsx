import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal-config";
import { termsIntro, termsSections } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Terms of Service | Daily SQL",
  description:
    "The Daily SQL Terms of Service: eligibility, plans and payments, acceptable use, intellectual property, liability, dispute resolution and Indian legal compliance.",
  alternates: {
    canonical: "https://dailysql.in/terms",
  },
};

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Legal Agreement"
      icon={<FileText size={13} />}
      title="Terms of Service"
      lastUpdated={LEGAL.effectiveDate}
      intro={termsIntro}
      sections={termsSections}
      related={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Refund Policy", href: "/refund" },
      ]}
    />
  );
}
