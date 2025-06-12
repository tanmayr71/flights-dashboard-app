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
export const AIRPORTS = Object.keys(AIRPORT_DATA) as Array<keyof typeof AIRPORT_DATA>;
export const AIRPORT_CODES = AIRPORTS;                                // alias
export const AIRPORT_TO_LOCATION: Record<string, string> = Object.fromEntries(
  Object.entries(AIRPORT_DATA).map(([c, d]) => [c, d.weatherLocation]),
);

/* ---------- compile-time unions ---------- */
export type AirportCode = typeof AIRPORT_CODES[number];
