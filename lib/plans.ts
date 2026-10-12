/**
 * Plan prices come from the backend (core.subscription_plans, editable in the CMS), in INR and USD.
 * DEFAULT_PLANS is only a fallback so the pages still render if the API is unreachable;
 * the amount actually charged is always decided by the backend at order time.
 */
export type PlanKey = "monthly" | "yearly" | "lifetime";
export type Currency = "INR" | "USD";

export interface PlanInfo {
  id: PlanKey;
  name: string;
  price: number;                    // INR
  original_price: number | null;    // INR strike-through
  price_usd: number | null;
  original_price_usd: number | null;
}

export type PlanMap = Record<PlanKey, PlanInfo>;

export const DEFAULT_PLANS: PlanMap = {
  monthly: { id: "monthly", name: "Monthly Plan", price: 899, original_price: 1299, price_usd: 12.99, original_price_usd: 19 },
  yearly: { id: "yearly", name: "Yearly Plan", price: 1499, original_price: 3499, price_usd: 29, original_price_usd: 59 },
  lifetime: { id: "lifetime", name: "Lifetime Plan", price: 4999, original_price: 9999, price_usd: 79, original_price_usd: 149 },
};

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

export const formatUSD = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });

export const formatPrice = (n: number, currency: Currency) => (currency === "USD" ? formatUSD(n) : formatINR(n));

/** The plan's price / strike-through price in the given currency (USD may be missing → null). */
export function planPrice(plan: PlanInfo, currency: Currency): number | null {
  return currency === "USD" ? plan.price_usd : plan.price;
}

export function planOriginalPrice(plan: PlanInfo, currency: Currency): number | null {
  return currency === "USD" ? plan.original_price_usd : plan.original_price;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PlanCatalog {
  plans: PlanMap;
  /** "test" when the backend runs Razorpay test keys; pages show a test-mode notice then. */
  paymentMode: "test" | "live";
}

export async function fetchPlanCatalog(init?: RequestInit): Promise<PlanCatalog> {
  try {
    const res = await fetch(`${API_BASE}/api/payments/plans`, init);
    if (!res.ok) return { plans: DEFAULT_PLANS, paymentMode: "live" };
    const data = await res.json();
    const merged: PlanMap = { ...DEFAULT_PLANS };
    for (const p of data?.plans ?? []) {
      if (p?.id in merged && typeof p.price === "number") {
        merged[p.id as PlanKey] = {
          id: p.id,
          name: p.name || merged[p.id as PlanKey].name,
          price: p.price,
          original_price: typeof p.original_price === "number" ? p.original_price : null,
          price_usd: typeof p.price_usd === "number" ? p.price_usd : null,
          original_price_usd: typeof p.original_price_usd === "number" ? p.original_price_usd : null,
        };
      }
    }
    return { plans: merged, paymentMode: data?.payment_mode === "test" ? "test" : "live" };
  } catch {
    return { plans: DEFAULT_PLANS, paymentMode: "live" };
  }
}

export async function fetchPlans(init?: RequestInit): Promise<PlanMap> {
  return (await fetchPlanCatalog(init)).plans;
}

// ─── Remembered currency choice ──────────────────────────────────────────────
// middleware.ts sets this once from the visitor's country (India → INR, elsewhere → USD) when the host
// provides one; after that it only changes when the visitor flips the toggle on /pricing or /payment.
export const CURRENCY_COOKIE = "dsql_currency";

export function isCurrency(value: unknown): value is Currency {
  return value === "INR" || value === "USD";
}

export function readCurrencyCookie(): Currency | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)dsql_currency=(INR|USD)/);
    return match ? (match[1] as Currency) : null;
  } catch {
    return null;
  }
}

export function saveCurrencyCookie(currency: Currency): void {
  try {
    document.cookie = `${CURRENCY_COOKIE}=${currency}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  } catch {
    /* cookies blocked — the in-page toggle still works for this visit */
  }
}
