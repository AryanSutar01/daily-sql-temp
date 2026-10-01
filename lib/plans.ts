/**
 * Plan prices come from the backend (core.subscription_plans, editable in the CMS).
 * DEFAULT_PLANS is only a fallback so the pages still render if the API is unreachable;
 * the amount actually charged is always decided by the backend at order time.
 */
export type PlanKey = "monthly" | "yearly" | "lifetime";

export interface PlanInfo {
  id: PlanKey;
  name: string;
  price: number;
  original_price: number | null;
}

export type PlanMap = Record<PlanKey, PlanInfo>;

export const DEFAULT_PLANS: PlanMap = {
  monthly: { id: "monthly", name: "Monthly Plan", price: 899, original_price: 1299 },
  yearly: { id: "yearly", name: "Yearly Plan", price: 1499, original_price: 3499 },
  lifetime: { id: "lifetime", name: "Lifetime Plan", price: 4999, original_price: 9999 },
};

export const formatINR = (n: number) =>
  "\u20b9" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchPlans(init?: RequestInit): Promise<PlanMap> {
  try {
    const res = await fetch(`${API_BASE}/api/payments/plans`, init);
    if (!res.ok) return DEFAULT_PLANS;
    const data = await res.json();
    const merged: PlanMap = { ...DEFAULT_PLANS };
    for (const p of data?.plans ?? []) {
      if (p?.id in merged && typeof p.price === "number") {
        merged[p.id as PlanKey] = {
          id: p.id,
          name: p.name || merged[p.id as PlanKey].name,
          price: p.price,
          original_price: typeof p.original_price === "number" ? p.original_price : null,
        };
      }
    }
    return merged;
  } catch {
    return DEFAULT_PLANS;
  }
}
