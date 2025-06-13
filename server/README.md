# Flights API (Express Server)

Express.js server that powers the flight dashboard API. Provides REST endpoints for flight data, simulates real-time status changes, and integrates weather forecasts.

## 📁 Project Structure

```
server/
├── src/
│   ├── index.ts              # Entry point
│   ├── controllers/
│   │   └── flights.ts        # Flight data controller
│   ├── routes/
│   │   └── admin.ts          # Admin endpoints router
│   ├── models/
│   │   ├── Flight.ts         # Flight Mongoose model
│   │   └── WeatherData.ts    # Weather cache model
│   ├── services/
│   │   ├── statusManager.ts  # Status update scheduler
│   │   └── weatherCache.ts   # Weather API integration
│   ├── utils/
│   │   ├── weather.ts        # Weather utilities
│   │   └── weatherAlert.ts   # Weather alert logic
│   └── scripts/
│       └── seedFlights.ts    # Database seeder
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠️ Installation & Setup

### 1. Install Dependencies

From the project root:
```bash
npm install
```

Or from the server directory:
```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the server directory:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/flightsdb

# Visual Crossing Weather API key (required)
VISUAL_CROSSING_KEY=your_api_key_here

# Weather cache duration in seconds (optional, default: 3600)
WEATHER_TTL_SECONDS=3600

# Server port (optional, default: 4000)
PORT=4000
```

### 3. Running the Server

#### Development Mode
```bash
npm run dev
```

Uses `tsx` for hot reloading TypeScript support.

#### Production Mode
```bash
npm run build  # Compile TypeScript
npm start      # Run compiled code
```

### 4. Seeding Flight Data

Generate sample flights:
```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing flights
- Generate flights for ±3 days from today
- Create 3 flights per time period per airport

## 🔌 API Endpoints

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{ "message": "API is up!" }
```

### `GET /api/flights`
Retrieve flights with filters.

**Query Parameters (all required):**
- `airport` - Airport code (e.g., `JFK`, `LAX`)
- `dayOfWeek` - Day name (e.g., `Monday`, `Tuesday`)
- `timeOfDay` - Time period (`morning`, `afternoon`, `evening`)

**Example Request:**
```bash
GET /api/flights?airport=JFK&dayOfWeek=Friday&timeOfDay=evening
```

**Response:**
```json
{
  "flights": [
    {
      "id": "507f1f77bcf86cd799439011",
      "flightId": "AA123",
      "dayOfWeek": "Friday",
      "departureAirport": "JFK",
      "arrivalAirport": "LAX",
      "departureTime": "2025-06-13T18:45:00.000Z",
      "arrivalTime": "2025-06-13T22:30:00.000Z",
      "timeOfDay": "evening",
      "status": "On Time",
      "lastStatusUpdate": "2025-06-13T00:05:00.000Z",
      "duration": { "hours": 3, "minutes": 45 },
      "weather": {
        "temp": 75.2,
        "precipprob": 10,
        "preciptype": [],
        "windspeed": 8
      },
      "weatherAlert": false
    }
  ]
}
```

## Admin Endpoints

> **All routes are `POST`** and return the number of flight documents affected.

| Path | What it does | Typical use |
|------|--------------|-------------|
| `/api/admin/reset-statuses` | **Soft reset** – sets every flight that is *not* `Departed` back to `"On Time"`. | Refresh the current-day board while keeping actual history for flights that already took off. |
| `/api/admin/reset-all` | **Hard reset** – sets *every* flight (including `Cancelled` and `Departed`) back to `"On Time"`. | Full “wipe” for demos or automated test cycles. |

### Response shape

```json
{
  "modified": <number_of_flights_updated>
}
```

## 🎯 Flight Status Simulation

The server runs a cron job every minute that simulates realistic flight operations:

### Status Progression Timeline

| Time to Departure | Status Change | Conditions |
|-------------------|---------------|------------|
| > 90 minutes | May become `Delayed` | 30% random chance or weather alert |
| > 45 minutes | May become `Cancelled` | 10% random chance |
| ≤ 45 minutes | `On Time` → `Boarding` | If not delayed |
| ≤ 15 minutes | `Boarding` → `Boarded` | If not delayed |
| ≤ 0 minutes | Any → `Departed` | Flight has left |

### Weather-Based Delays

Flights are delayed when weather conditions meet these criteria:
- Precipitation probability ≥ 70% with precipitation type
- Wind speed > 20 mph

## 🌤️ Weather Data Management

### Caching Strategy
- Weather data cached per airport/date combination
- Cache TTL configurable via `WEATHER_TTL_SECONDS`
- MongoDB TTL index auto-removes expired data

### API Integration
- Uses Visual Crossing Timeline API
- Fetches hourly forecasts for flight departure times
- Fallback to cached data when available

## 📊 Database Models

### Flight Model
```typescript
{
  flightId: String,           // e.g., "AA123"
  dayOfWeek: String,          // enum: DAYS_OF_WEEK
  departureAirport: String,   // enum: AIRPORTS
  arrivalAirport: String,     // any IATA code
  departureTime: Date,
  arrivalTime: Date,
  timeOfDay: String,          // enum: morning|afternoon|evening
  status: String,             // enum: FLIGHT_STATUSES
  lastStatusUpdate: Date
}
```

**Indexes:**
- Compound: `(departureAirport, dayOfWeek, timeOfDay, departureTime)`

**Virtual Fields:**
- `duration`: Calculated from departure/arrival times

### WeatherData Model
```typescript
{
  airportCode: String,
  dateISO: String,           // YYYY-MM-DD format
  hours: Map<String, {       // "0" through "23"
    temp: Number,
    precipprob: Number,
    preciptype: String[],
    windspeed: Number
  }>,
  fetchedAt: Date           // TTL index field
}
```

**Indexes:**
- Unique compound: `(airportCode, dateISO)`
- TTL: `fetchedAt` with configurable expiration

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `axios` | HTTP client for weather API |
| `node-cron` | Task scheduling |
| `date-fns` | Date utilities |
| `@faker-js/faker` | Test data generation |
| `cors` | Cross-origin support |
| `dotenv` | Environment configuration |

## 🔧 Development Tools

- **tsx**: TypeScript execution with hot reload
- **nodemon**: Auto-restart on file changes
- **ts-node**: TypeScript REPL and script runner
- **tsc-alias**: Path alias resolution after build

## 💡 Usage & Future Improvements

### Current Features
- Continuous status updates simulate real airport operations
- Weather integration affects flight delays
- RESTful API design for easy integration

### Potential Enhancements
- WebSocket support for real-time updates
- Integration with real flight data APIs
- Enhanced filtering (date ranges, airlines)
- Timezone-aware scheduling
- Authentication and authorization
- Comprehensive test suite
- API rate limiting
- Swagger/OpenAPI documentation

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: MongoServerError: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running on the specified URI

### Weather API Failures
```
Error: Request failed with status code 401
```
**Solution:** Verify your Visual Crossing API key is valid

### Missing Environment Variables
```
Error: Missing required environment variable: VISUAL_CROSSING_KEY
```
**Solution:** Create `.env` file with all required variables