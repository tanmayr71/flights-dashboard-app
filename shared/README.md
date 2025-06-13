# @myproj/shared - Shared Types and Constants

TypeScript library containing shared constants, types, and utilities used by both the client and server. Ensures consistency across the full-stack application.

## 📋 Overview

This package provides:

- **Domain Constants**: Airport codes, days of week, time periods, flight statuses
- **TypeScript Types/Interfaces**: Type definitions for flights, weather data, etc.
- **Utility Mappings**: Airport-to-location mappings for weather API integration

## 📁 Project Structure

```
shared/
├── src/
│   ├── airports.ts      # Airport definitions and mappings
│   ├── constants.ts     # Domain constants (days, times, statuses)
│   ├── types.ts         # TypeScript interfaces
│   └── index.ts         # Barrel export file
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

### Within the Monorepo

The package is automatically linked via npm workspaces. From the project root:

```bash
npm install
```

### Standalone Usage

```bash
cd shared
npm install
npm run build
```

## 📦 Exports

### Airports (`airports.ts`)

```typescript
// Airport data structure
const AIRPORT_DATA = {
  JFK: {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    weatherLocation: "New York,NY",
    timezone: "America/New_York"
  },
  LAX: {
    code: "LAX",
    name: "Los Angeles International Airport",
    weatherLocation: "Los Angeles,CA",
    timezone: "America/Los_Angeles"
  }
};

// Exported constants
export const AIRPORTS: string[]              // ["JFK", "LAX"]
export const AIRPORT_TO_LOCATION: Record     // { JFK: "New York,NY", ... }
export type AirportCode = "JFK" | "LAX"
```

### Constants (`constants.ts`)

```typescript
// Days of the week (Monday = index 0)
export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday"
];

// Time periods
export const TIMES_OF_DAY = ["morning", "afternoon", "evening"];

// Time period display labels
export const TIME_PERIOD_LABELS = {
  morning: "6:00AM – 11:59AM",
  afternoon: "12:00PM – 5:59PM",
  evening: "6:00PM – 11:59PM"
};

// Flight statuses
export const FLIGHT_STATUSES = [
  "On Time", "Boarding", "Boarded", "Departed",
  "Delayed", "Late Departure", "Cancelled"
];

// Type exports
export type DayOfWeek = "Monday" | "Tuesday" | ... | "Sunday"
export type TimeOfDay = "morning" | "afternoon" | "evening"
export type FlightStatus = "On Time" | "Boarding" | ... | "Cancelled"
```

### Types (`types.ts`)

```typescript
// Weather data for a flight
export interface FlightWeather {
  temp: number;          // Temperature in °F
  precipprob: number;    // Precipitation probability (0-100)
  preciptype: string[];  // Types of precipitation
  windspeed: number;     // Wind speed in mph
}

// Flight data structure (as sent to client)
export interface Flight {
  id: string;
  flightId: string;
  dayOfWeek: DayOfWeek;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;    // ISO timestamp
  arrivalTime: string;      // ISO timestamp
  timeOfDay: TimeOfDay;
  status: FlightStatus;
  duration: {
    hours: number;
    minutes: number;
  };
  weather: FlightWeather;
  weatherAlert: boolean;
}
```

## 💻 Usage Examples

### Server Usage

```typescript
import {
  AIRPORTS,
  DAYS_OF_WEEK,
  FLIGHT_STATUSES,
  AirportCode,
  DayOfWeek,
  FlightStatus
} from "@myproj/shared";

// Mongoose schema with enum validation
const flightSchema = new Schema({
  departureAirport: {
    type: String,
    enum: AIRPORTS,  // Only allows valid airport codes
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: DAYS_OF_WEEK,  // Only allows valid day names
    required: true
  },
  status: {
    type: String,
    enum: FLIGHT_STATUSES,  // Only allows valid statuses
    default: "On Time"
  }
});
```

### Client Usage

```typescript
import {
  AIRPORTS,
  DAYS_OF_WEEK,
  TIME_PERIOD_LABELS,
  Flight,
  DayOfWeek,
  TimeOfDay
} from "@myproj/shared";

// TypeScript ensures type safety
const [flights, setFlights] = useState<Flight[]>([]);
const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DAYS_OF_WEEK[0]);

// Populate dropdowns
<select>
  {AIRPORTS.map(code => (
    <option key={code} value={code}>{code}</option>
  ))}
</select>

// Display time period label
<h2>{TIME_PERIOD_LABELS[selectedPeriod]}</h2>
```

## 🔧 Development

### Building the Package

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory with:
- ES modules output
- Type declaration files (`.d.ts`)
- Source maps for debugging

### Making Changes

1. **Modify source files** in `src/`
2. **Build the package**: `npm run build`
3. **Restart consumers**: Restart client/server dev servers to pick up changes

## 📝 Extending the Package

### Adding a New Airport

1. Update `airports.ts`:
```typescript
const AIRPORT_DATA = {
  // ... existing airports
  ORD: {
    code: "ORD",
    name: "Chicago O'Hare International Airport",
    weatherLocation: "Chicago,IL",
    timezone: "America/Chicago"
  }
};
```

2. Rebuild: `npm run build`
3. The new airport automatically appears in:
   - Server validation
   - Client dropdowns
   - Seed script

### Adding a New Flight Status

1. Update `constants.ts`:
```typescript
export const FLIGHT_STATUSES = [
  // ... existing statuses
  "Maintenance"
];
```

2. Update server logic to handle the new status
3. Add styling in client's `FlightCard.tsx`

### Adding a New Time Period

1. Update `constants.ts`:
```typescript
export const TIMES_OF_DAY = ["morning", "afternoon", "evening", "night"];

export const TIME_PERIOD_LABELS = {
  // ... existing labels
  night: "12:00AM – 5:59AM"
};
```

2. Update seed script to generate night flights
3. Adjust UI to handle four time periods

## 🏗️ Build Configuration

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "declaration": true,
    "outDir": "./dist"
  }
}
```

### Package.json Configuration

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## 🧪 Testing Changes

After modifying the shared package:

1. **Type Checking**: TypeScript compiler will catch type errors
2. **Server Validation**: Mongoose will validate against new enums
3. **Client Compilation**: Build errors if types don't match
4. **Runtime Testing**: Test both client and server functionality

## 📚 Best Practices

### DO ✅

- Keep constants in alphabetical/logical order
- Export both constants and their TypeScript types
- Use `as const` for object literals to preserve literal types
- Document any business logic in comments
- Maintain backwards compatibility when possible

### DON'T ❌

- Add business logic (keep it pure data/types)
- Include environment-specific values
- Create circular dependencies
- Use dynamic values that change at runtime
- Break existing type contracts without versioning

## 🔍 Troubleshooting

### Import Errors

```
Cannot find module '@myproj/shared'
```
**Solution:** Run `npm install` from project root

### Type Mismatches

```
Type '"invalid"' is not assignable to type 'FlightStatus'
```
**Solution:** Ensure value is one of the defined constants

### Build Issues

```
Error: Cannot find namespace 'NodeJS'
```
**Solution:** Install `@types/node` as dev dependency

## 🤝 Contributing

When modifying this package:

1. Consider impact on both client and server
2. Update types and constants together
3. Document any new exports
4. Test changes in both consuming packages
5. Maintain backwards compatibility

## 📈 Future Enhancements

- Add airline codes and mappings
- Include gate information structure
- Define delay reason categories
- Add international airport support
- Create utility functions for common operations