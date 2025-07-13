/* shared/airports.ts */
export const AIRPORT_DATA = {
  JFK: {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    weatherLocation: "New York,NY",          // Visual Crossing query string
    timezone: "America/New_York",
  },
  LAX: {
    code: "LAX",
    name: "Los Angeles International Airport",
    weatherLocation: "Los Angeles,CA",
    timezone: "America/Los_Angeles",
  },
} as const;

/* ------------ helpers auto-derived from the object above ------------- */
export const AIRPORT_CODES = Object.values(AIRPORT_DATA).map(airport => airport.code);
export const AIRPORT_TO_LOCATION: Record<string, string> = Object.fromEntries(
  Object.values(AIRPORT_DATA).map(airport => [airport.code, airport.weatherLocation]),
);

/* ---------- compile-time unions ---------- */
export type AirportCode = typeof AIRPORT_CODES[number];
