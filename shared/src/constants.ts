/* shared/constants.ts */

/** Days */
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Time-of-day buckets – keep Title-Case because the UI shows them that way */
export const TIMES_OF_DAY = ["Morning", "Afternoon", "Evening"] as const;

/** Label that appears under the heading */
export const TIME_PERIOD_LABELS: Record<typeof TIMES_OF_DAY[number], string> = {
  Morning:   "6:00AM – 11:59AM",
  Afternoon: "12:00PM – 5:59PM",
  Evening:   "6:00PM – 11:59PM",
};

/** Flight status list */
export const FLIGHT_STATUSES = [
  "On Time",
  "Boarding",
  "Boarded",
  "Departed",
  "Delayed",
  "Late Departure",
  "Cancelled",
] as const;

/* ---------- compile-time unions ---------- */
export type DayOfWeek    = typeof DAYS_OF_WEEK[number];
export type TimeOfDay    = typeof TIMES_OF_DAY[number];
export type FlightStatus = typeof FLIGHT_STATUSES[number];
