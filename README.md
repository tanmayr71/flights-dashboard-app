# Flights Dashboard App

Full-stack flight dashboard with real-time status updates and weather integration. This monorepo contains a React front-end, an Express.js + MongoDB back-end API, and a shared library of TypeScript types/constants. The app provides a 7-day rolling schedule of flights with live status simulation and weather forecasts using the Visual Crossing Weather API.

## 🚀 Features

- **Interactive Flight Dashboard**: Filter flights by Airport, Day of Week, and Time of Day
- **Real-Time Status Updates**: Flight statuses automatically update in the background to simulate real-world conditions
- **Weather Integration**: Weather forecasts for each flight's departure hour with visual alerts for severe conditions
- **Shared Types & Constants**: Client and server share a single source of truth for domain constants and TypeScript interfaces
- **Tech Stack**: MongoDB, Express.js, React, Node.js (MERN) with TypeScript throughout

## 📁 Monorepo Structure

```
flights-dashboard-app/
├── client/          # React + Vite single-page app (TypeScript, Tailwind CSS)
├── server/          # Node/Express REST API server (TypeScript)
├── shared/          # Common TypeScript library (@myproj/shared)
└── package.json     # Root workspace configuration
```

Each package has its own `package.json` and can be developed independently. The root workspace provides combined scripts to install and run everything together.

## 🛠️ Prerequisites

- **Node.js** (v18+ recommended) and npm
- **MongoDB** - Running instance or cluster (local or cloud service like MongoDB Atlas)
- **Visual Crossing Weather API Key** - [Sign up for free](https://www.visualcrossing.com/) (1000 calls/day)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-user/flights-dashboard-app.git
cd flights-dashboard-app
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies in the workspaces (client, server, and shared).

### 3. Configure Environment Variables

#### Server API (`/server/.env`)

Create `server/.env` file:

```env
MONGO_URI=mongodb://localhost:27017/flightsdb
VISUAL_CROSSING_KEY=your_api_key_here
WEATHER_TTL_SECONDS=3600
PORT=4000
```

#### Client App (`/client/.env`)

Create `client/.env` file:

```env
VITE_API_BASE=http://localhost:4000
```

### 4. Seed the Database

Generate sample flight data:

```bash
npm run seed -w server
```

This populates the database with a 7-day schedule of flights (±3 days from today).

### 5. Run the App (Development Mode)

Start both server and client concurrently:

```bash
npm run dev
```

- **Server**: http://localhost:4000
- **Client**: http://localhost:5173

Alternatively, run them separately:
```bash
npm run dev -w server  # Server only
npm run dev -w client  # Client only
```

## 💻 Using the App

1. Open http://localhost:5173 in your browser
2. Use the dropdown controls to filter flights:
   - **Airport Code**: JFK or LAX
   - **Day of Week**: Monday through Sunday
   - **Time of Day**: Morning, Afternoon, or Evening
3. View real-time flight statuses and weather information
4. Statuses update automatically every minute (refresh to see changes)

## 🏗️ Architecture Overview

```
┌─────────────┐     HTTP/REST      ┌─────────────────┐
│   Client    │ ◄─────────────────► │     Server      │
│   (React)   │                     │ (Express/Node)  │
└─────────────┘                     └────────┬────────┘
                                             │
                                    ┌────────┴────────┐
                                    │                 │
                              ┌─────▼──────┐  ┌──────▼──────┐
                              │  MongoDB   │  │   Visual    │
                              │            │  │  Crossing   │
                              │ • Flights  │  │   Weather   │
                              │ • Weather  │  │     API     │
                              │   Cache    │  └─────────────┘
                              └────────────┘
```

### Background Scheduler

The server includes a cron job that runs every minute to simulate flight status changes:
- Updates statuses based on time to departure
- Introduces random delays and cancellations
- Considers weather conditions for delays

## 🚀 Production Build

```bash
npm run build
```

This compiles all packages for production. To run the production build:

```bash
npm run start -w server
```

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/flights` | GET | Get flights with filters |
| `/api/admin/reset-statuses` | POST | Reset flight statuses to "On Time" |

### Example API Call

```bash
curl "http://localhost:4000/api/flights?airport=JFK&dayOfWeek=Monday&timeOfDay=morning"
```

## 🔍 Additional Notes

### Data Volume
- Generates ~126 flights (2 airports × 7 days × 3 time periods × 3 flights each)
- Old flights remain in database until reseeded

### Time Zones
- Times displayed in browser's local timezone
- Airport timezone data included but not actively used

### Extending Airports
Edit `shared/src/airports.ts` to add new airports with proper weather location strings.

### Error Handling
- Basic error feedback in UI
- Server returns HTTP 400 for invalid parameters
- Weather API errors logged server-side

### Security
- Admin endpoints are unsecured (demo only)
- CORS is wide-open (development setup)
- Visual Crossing API key kept server-side

## 🤝 Contributing

This is a demonstration project. Feel free to fork and build upon it!

## 📄 License

[Your License Here]