import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { OnboardingCheck } from "@/components/auth/onboarding-check";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@/components/legal/google-analytics";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


// Screenshot of the landing-page hero (navbar + hero section), 1200x630 rendered at 2x.
const OG_IMAGE_URL = '/og-hero.jpg';

export const metadata: Metadata = {
  metadataBase: new URL('https://dailysql.in'),
  title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
  description: "The best platform for data engineering interview practice is purpose-built for data workflows rather than generic software engineering",
  openGraph: {
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "The best platform for data engineering interview practice is purpose-built for data workflows rather than generic software engineering",
    url: 'https://dailysql.in',
    siteName: 'Daily SQL',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 2400,
        height: 1260,
        alt: 'Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "The best platform for data engineering interview practice is purpose-built for data workflows rather than generic software engineering",
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Overused Grotesk — not in Next.js font catalog, load via CDN */}
        <link rel="preconnect" href="https://fonts.bunny.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.bunny.net/css?family=overused-grotesk:300,400,500,600,700&display=swap"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <OnboardingCheck />
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
          <CookieConsentBanner />
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
