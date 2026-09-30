import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal-config";
import { privacyIntro, privacySections } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Daily SQL",
  description:
    "How Daily SQL collects, uses, shares and protects your personal data, and your rights under India's DPDP Act, 2023 and the IT Act, 2000.",
  alternates: {
    canonical: "https://dailysql.in/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Data Protection"
      icon={<Shield size={13} />}
      title="Privacy Policy"
      lastUpdated={LEGAL.effectiveDate}
      intro={privacyIntro}
      sections={privacySections}
      related={[
        { label: "Terms of Service", href: "/terms" },
        { label: "Refund Policy", href: "/refund" },
      ]}
    />
  );
}
