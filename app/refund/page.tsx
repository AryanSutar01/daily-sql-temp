import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal-config";
import { refundIntro, refundSections } from "@/lib/legal/refund";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Daily SQL",
  description:
    "When Daily SQL payments can be refunded, how to request a refund, timelines, and what happens to your access.",
  alternates: {
    canonical: "https://dailysql.in/refund",
  },
};

export default function RefundPolicy() {
  return (
    <LegalPage
      eyebrow="Billing & Guarantees"
      icon={<Receipt size={13} />}
      title="Refund & Cancellation Policy"
      lastUpdated={LEGAL.effectiveDate}
      intro={refundIntro}
      sections={refundSections}
      related={[
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ]}
    />
  );
}
