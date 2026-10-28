// The app's "day" — must match the backend (app/timeutil.py): UTC time, flipping at 00:00 UTC (12:00 AM UTC),
// independent of the visitor's own timezone. All dates here are UTC-midnight Date objects whose
// UTC year/month/day are the calendar date in question, so arithmetic never drifts with local DST/timezone.

const DAY_MS = 24 * 60 * 60 * 1000;

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" key, the format the backend uses for heat-map / attempt dates. */
export function dateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** The current app-day (flips at 00:00 UTC / 12:00 AM UTC). */
export function appToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}
