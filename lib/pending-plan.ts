/**
 * Remembers which plan a visitor picked on /pricing while they sign up or log in
 * (email, Google OAuth and onboarding all drop URL params), so checkout can resume
 * on /payment with that plan preselected.
 */
export type PlanId = "monthly" | "yearly" | "lifetime";

const KEY = "dsql_pending_plan";
const TTL_MS = 60 * 60 * 1000; // stale picks (e.g. a login days later) must not hijack navigation

export function isPlanId(value: unknown): value is PlanId {
  return value === "monthly" || value === "yearly" || value === "lifetime";
}

export function setPendingPlan(plan: PlanId): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ plan, ts: Date.now() }));
  } catch {
    /* storage unavailable (private mode) — the user just re-picks the plan */
  }
}

/** Returns the pending plan (if still fresh) and clears it. */
export function takePendingPlan(): PlanId | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    const { plan, ts } = JSON.parse(raw);
    return isPlanId(plan) && Date.now() - ts < TTL_MS ? plan : null;
  } catch {
    return null;
  }
}
