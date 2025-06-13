# Flight Dashboard Client (React + TypeScript + Vite)

Interactive React single-page application for viewing flight statuses and weather information. Built with Vite, TypeScript, and Tailwind CSS.

## ✨ Features

- **Filterable Flight List**: Select flights by Airport, Day of Week, and Time of Day
- **Live Data Display**: Real-time flight status updates with color-coded badges
- **Weather Integration**: Temperature, precipitation, and wind data with visual alerts
- **Responsive Design**: Mobile-friendly layout that adapts to any screen size

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── FlightCard.tsx        # Individual flight display
│   │   └── FilterControls.tsx    # Filter dropdown controls
│   ├── constants/
│   │   └── timeOptions.ts        # Time period definitions
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles (Tailwind)
├── public/
│   └── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Running backend API (default: http://localhost:4000)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Create `.env` file in the client directory:
   ```env
   VITE_API_BASE=http://localhost:4000
   ```
   
   For production deployment:
   ```env
   VITE_API_BASE=https://your-api-server.com
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Opens at http://localhost:5173 with hot module replacement.

## 🎮 Using the App

### Filter Controls

The dashboard provides three dropdown filters:

| Filter | Options | Default |
|--------|---------|---------|
| **Airport Code** | JFK, LAX | JFK |
| **Day of Week** | Monday - Sunday | Today's day |
| **Time of Day** | Morning (6AM-12PM)<br>Afternoon (12PM-6PM)<br>Evening (6PM-12AM) | Morning |

### Flight Card Display

Each flight card shows:

```
┌─────────────────────────────────────────────────────────┐
│ 🛫 6:30 PM      ✈️ 3h 45m      🛬 10:15 PM             │
│    JFK                              LAX                  │
│                                                          │
│ Flight: AA123   Status: [On Time]   ☀️ 75°F            │
│                                      💨 8 mph, 10%      │
└─────────────────────────────────────────────────────────┘
```

### Status Color Codes

| Status | Color | Description |
|--------|-------|-------------|
| 🟢 On Time | Green | Flight departing as scheduled |
| 🔵 Boarding | Blue | Passengers boarding |
| 🟣 Boarded | Indigo | Boarding complete |
| ⚪ Departed | Gray | Flight has left |
| 🟡 Delayed | Yellow | Departure postponed |
| 🟠 Late Departure | Orange | Delayed but departing soon |
| 🔴 Cancelled | Red | Flight cancelled |

### Weather Alerts

A "Weather Alert" badge appears when:
- Precipitation probability ≥ 70% with active precipitation
- Wind speed > 20 mph

## 🏗️ Building for Production

1. **Build the Application**
   ```bash
   npm run build
   ```
   
   Creates optimized assets in `dist/` directory.

2. **Preview Production Build**
   ```bash
   npm run preview
   ```
   
   Serves the production build locally on port 4173.

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Set `VITE_API_BASE` to your production API URL
2. Run `npm run build`
3. Deploy the `dist/` directory

### Express Static Serving

Add to your Express server:
```javascript
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});
```

## 🧩 Component Architecture

### App.tsx
- Manages global state (filters, flight data)
- Handles API communication
- Orchestrates data fetching on filter changes

### FilterControls.tsx
- Renders three select dropdowns
- Emits change events to parent
- Responsive grid layout

### FlightCard.tsx
- Displays individual flight information
- Calculates derived data (formatted times, duration)
- Applies status-based styling

## 🎨 Styling

Built with Tailwind CSS utility classes:

```jsx
// Example: Status badge styling
const statusBadge = {
  "On Time": "bg-green-100 text-green-800",
  "Boarding": "bg-blue-100 text-blue-800",
  "Cancelled": "bg-red-100 text-red-800",
  // ...
};
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.0.0 | UI library |
| `vite` | ^5.0.0 | Build tool & dev server |
| `typescript` | ^5.0.0 | Type safety |
| `tailwindcss` | ^3.0.0 | Utility-first CSS |
| `lucide-react` | ^0.0.0 | Icon components |

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔧 Configuration Files

### vite.config.ts
- React plugin configuration
- Path aliases setup
- Build optimizations

### tailwind.config.js
- Content paths for purging
- Theme customizations
- Plugin configurations

### tsconfig.json
- TypeScript compiler options
- Module resolution settings
- Type checking rules

## 💡 Extending the Application

### Add Auto-Refresh
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchFlights();
  }, 60000); // Refresh every minute
  
  return () => clearInterval(interval);
}, [airport, day, period]);
```

### Add Flight Details Modal
```typescript
const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

// In FlightCard
<div onClick={() => onSelect(flight)}>
  {/* existing content */}
</div>
```

### WebSocket Integration
```typescript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:4000');
  
  ws.on('flightUpdate', (update) => {
    updateFlightInState(update);
  });
  
  return () => ws.close();
}, []);
```

## 🐛 Troubleshooting

### API Connection Issues
```
Error: Failed to fetch
```
**Solution:** Verify:
- Backend server is running
- `VITE_API_BASE` is correct
- CORS is enabled on server

### Build Errors
```
Error: Cannot find module '@myproj/shared'
```
**Solution:** Run `npm install` from project root

### Styling Not Applied
```
Warning: Unknown Tailwind class
```
**Solution:** Ensure class names are complete and not dynamically constructed

## 🤝 Contributing

When modifying the client:

1. Follow the existing component structure
2. Maintain TypeScript type safety
3. Use Tailwind utility classes
4. Test on multiple screen sizes
5. Ensure accessibility standards

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)