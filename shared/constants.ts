// shared/constants.ts  (no Node/DOM APIs – pure data)
export const AIRPORT_DATA = {
  JFK: { code: "JFK", name: "John F. Kennedy International", weatherLocation: "New York,NY" },
  LAX: { code: "LAX", name: "Los Angeles International",    weatherLocation: "Los Angeles,CA" }
} as const;

export const AIRPORTS       = Object.keys(AIRPORT_DATA) as Array<keyof typeof AIRPORT_DATA>;
export const AIRPORT_CODES  = AIRPORTS;               // alias
export const DAYS_OF_WEEK   = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
export const TIMES_OF_DAY   = ["morning","afternoon","evening"] as const;