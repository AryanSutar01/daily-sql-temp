// Shared consent state for non-essential (analytics) cookies, read by both the banner
// and the Google Analytics loader so accepting/declining takes effect without a page reload.

const KEY = "ds_cookie_consent";
const EVENT = "ds:cookie-consent";

export type CookieConsent = "accepted" | "declined";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function setCookieConsent(value: CookieConsent) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* private browsing / storage blocked — the banner still won't re-show mid-session */
  }
  window.dispatchEvent(new CustomEvent<CookieConsent>(EVENT, { detail: value }));
}

export function onCookieConsentChange(handler: (value: CookieConsent) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<CookieConsent>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
