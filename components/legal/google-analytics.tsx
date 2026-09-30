"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { getCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";

const GA_ID = "G-93XK08X7L0";

/**
 * Loads Google Analytics only after the visitor has accepted non-essential cookies.
 * Google's EU User Consent Policy requires consent before GA runs for EU/UK/EEA/CH
 * visitors, and this also matches what the Privacy Policy's cookie table promises.
 *
 * useSyncExternalStore (not useState+useEffect) is the correct tool here: the value
 * lives in localStorage, an external store outside React, and this hook lets the
 * server snapshot stay "disabled" while the client re-syncs after mount with no
 * hydration mismatch and no setState-in-effect cascade.
 */
export function GoogleAnalytics() {
  const enabled = useSyncExternalStore(
    onCookieConsentChange,
    () => getCookieConsent() === "accepted",
    () => false
  );

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
