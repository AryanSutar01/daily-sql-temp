import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily SQL - Stay Sharp in SQL with Just 15 Minutes a Day",
  description: "A daily SQL practice platform for professionals who already know SQL and want to stay sharp. Exactly 3 SQL questions every day with real business-style problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
