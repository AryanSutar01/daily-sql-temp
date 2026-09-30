/**
 * Facts that appear across the Privacy Policy, Terms of Service and Refund Policy.
 * Anything in [square brackets] is a PLACEHOLDER: the legal pages highlight it in yellow
 * so it cannot be missed. Replace every bracketed value below before going live.
 */
export const LEGAL = {
  brand: "Daily SQL",
  website: "https://dailysql.in",
  domain: "dailysql.in",
  effectiveDate: "26 September 2026",

  // ── Operator (the contracting party / "we") ────────────────────────────
  // A sole proprietorship with no separate registered office or grievance officer:
  // the operator itself (contactable at supportEmail) is the sole point of contact
  // and also the Grievance Officer required by the IT Rules / DPDP Act / CPA E-Commerce Rules.
  operatorName: "DailySQL",
  operatorType: "",
  supportEmail: "support@dailysql.in",

  // ── Infrastructure ─────────────────────────────────────────────────────
  backendHost: "Hostinger VPS, Mumbai Server",

  // ── Dispute resolution ─────────────────────────────────────────────────
  arbitrationSeat: "Pune, Maharashtra, India",
  courtsCity: "Pune",

  // ── Commercial terms used in several documents ─────────────────────────
  lifetimeRefundDays: 7,
  monthlyAccessDays: 30,
  yearlyAccessDays: 365,
  liabilityCapFreeUsersInr: "₹1,000",
} as const;
