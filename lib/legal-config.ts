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
  operatorName: "[Operator full legal name]",
  operatorType: "a sole proprietorship",
  operatorAddress: "[Postal address of the operator: street, city, state, PIN code]",
  operatorPhone: "[Customer-care phone number]",
  supportEmail: "support@dailysql.in",

  // ── Grievance Officer (IT Rules 2011 / 2021, DPDP Act 2023, Consumer Protection (E-Commerce) Rules 2020) ──
  grievanceName: "[Grievance Officer full name]",
  grievanceAddress: "[Grievance Officer postal address]",
  grievanceEmail: "[Grievance Officer email address]",
  grievanceHours: "[Working days and hours, e.g. Monday to Friday, 10:00 to 18:00 IST]",

  // ── Infrastructure ─────────────────────────────────────────────────────
  backendHost: "[Name of the VPS / cloud provider hosting the backend and database, and its data-centre country]",

  // ── Dispute resolution ─────────────────────────────────────────────────
  arbitrationSeat: "Pune, Maharashtra, India",
  courtsCity: "Pune",

  // ── Commercial terms used in several documents ─────────────────────────
  lifetimeRefundDays: 7,
  monthlyAccessDays: 30,
  yearlyAccessDays: 365,
  liabilityCapFreeUsersInr: "₹1,000",
} as const;
