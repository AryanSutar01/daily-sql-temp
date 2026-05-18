import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Daily SQL",
  description: "Get in touch with the Daily SQL team for support, feature requests, or general inquiries.",
  alternates: {
    canonical: 'https://dailysql.in/contact',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
