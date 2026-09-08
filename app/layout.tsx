import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { OnboardingCheck } from "@/components/auth/onboarding-check";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const OG_IMAGE_URL = 'https://res.cloudinary.com/dfkbfv9op/image/upload/c_pad,w_1600,h_900,b_rgb:0a0f1e/v1788882180/dailysql/dailysql-og-image.jpg';

export const metadata: Metadata = {
  metadataBase: new URL('https://dailysql.in'),
  title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
  description: "9 curated problems every day — SQL, Python (Pandas), and PySpark. Built for working data professionals who want to stay sharp.",
  openGraph: {
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "9 curated problems every day — SQL, Python (Pandas), and PySpark. Built for working data professionals who want to stay sharp.",
    url: 'https://dailysql.in',
    siteName: 'Daily SQL',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "9 curated problems every day — SQL, Python (Pandas), and PySpark. Built for working data professionals who want to stay sharp.",
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-93XK08X7L0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-93XK08X7L0');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <OnboardingCheck />
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
