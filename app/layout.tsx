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
