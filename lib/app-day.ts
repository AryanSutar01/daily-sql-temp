// The app's "day" — must match the backend (app/timeutil.py): India time, flipping at 01:00 IST,
// independent of the visitor's own timezone. All dates here are UTC-midnight Date objects whose
// UTC year/month/day are the calendar date in question, so arithmetic never drifts with local DST/timezone.

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_FLIP_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" key, the format the backend uses for heat-map / attempt dates. */
export function dateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** The current app-day. */
export function appToday(): Date {
  const shifted = new Date(Date.now() + IST_OFFSET_MS - DAY_FLIP_MS);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}
