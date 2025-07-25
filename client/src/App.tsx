import React, { useState, useEffect } from "react";
import {
  AIRPORT_CODES,
  DAYS_OF_WEEK,
  TIME_PERIOD_LABELS,
} from "@myproj/shared";
import type { Flight, DayOfWeek, TimeOfDay } from "@myproj/shared";
import type { AirportCode } from "@myproj/shared";
import FilterControls from "./components/FilterControls";
import FlightCard from "./components/FlightCard";

const App: React.FC = () => {
  /* ---------- filter state ---------- */
  const todayName = DAYS_OF_WEEK[new Date().getDay()] as DayOfWeek;
  
  const [airport, setAirport] = useState<AirportCode>(AIRPORT_CODES[0]);
  const [day, setDay]         = useState<DayOfWeek>(todayName);
  const [period, setPeriod]   = useState<TimeOfDay>("Morning");

  /* ---------- data state ---------- */
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  /* ---------- fetch whenever a filter changes ---------- */
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        const API = import.meta.env.VITE_API_BASE ?? "";
        const q   = `?airport=${airport}&dayOfWeek=${day}&timeOfDay=${period}`;
        const r   = await fetch(`${API}/api/flights${q}`);

        if (!r.ok) throw new Error(`Server ${r.status}: ${r.statusText}`);
        const { flights: apiFlights } = await r.json();

        setFlights(apiFlights as Flight[]);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load flights");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();

    // Set up polling to fetch every 60 seconds (1 minute)
    const pollingInterval = setInterval(() => {
      console.log("Polling for updated flight data...");
      fetchFlights();
    }, 60000); // 60,000 milliseconds = 1 minute

    // Cleanup function: stop polling when component unmounts or filters change
    return () => {
      console.log("Cleaning up polling interval");
      clearInterval(pollingInterval);
    };
  }, [airport, day, period]);

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* top-of-page filters */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-6">
          <FilterControls
            selectedAirport={airport}
            selectedDay={day}
            selectedTime={period}
            onAirportChange={setAirport}
            onDayChange={setDay}
            onTimeChange={setPeriod}
          />
        </div>
      </header>

      {/* main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {period} Flights&nbsp;
          <span className="text-gray-500 font-normal">
            ({TIME_PERIOD_LABELS[period]})
          </span>
        </h2>

        {loading && <p className="text-gray-700">Loading flights…</p>}
        {error   && <p className="text-red-600">{error}</p>}

        {!loading && !error && flights.length === 0 && (
          <p className="text-gray-700">
            No flights scheduled for the selected criteria.
          </p>
        )}

        <div className="space-y-4">
          {flights.map((f) => (
            <FlightCard key={f.id} flight={f} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
