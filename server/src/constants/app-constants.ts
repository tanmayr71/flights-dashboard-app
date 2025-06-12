// AIRPORTS (single source of truth)
export const AIRPORT_DATA = {
  JFK: {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    weatherLocation: "New York,NY",          // Visual Crossing string
    timezone: "America/New_York"
  },
  LAX: {
    code: "LAX",
    name: "Los Angeles International Airport",
    weatherLocation: "Los Angeles,CA",
    timezone: "America/Los_Angeles"
  }
} as const;

// auto-derived helpers
export const AIRPORTS = Object.keys(AIRPORT_DATA) as Array<keyof typeof AIRPORT_DATA>;
export const AIRPORT_TO_LOCATION: Record<string, string> = Object.fromEntries(
  Object.entries(AIRPORT_DATA).map(([c, d]) => [c, d.weatherLocation])
);

// global enums
export const DAYS_OF_WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
export const TIMES_OF_DAY = ["morning","afternoon","evening"] as const;
export const FLIGHT_STATUSES = [
  "On Time","Boarding","Boarded","Departed",
  "Delayed","Late Departure","Cancelled"
] as const;

// TS unions (compile-time)
export type AirportCode  = keyof typeof AIRPORT_DATA;
export type DayOfWeek    = typeof DAYS_OF_WEEK[number];
export type TimeOfDay    = typeof TIMES_OF_DAY[number];
export type FlightStatus = typeof FLIGHT_STATUSES[number];