import React, { useState, useEffect } from "react";
import FilterControls from "./components/FilterControls";
import FlightCard from "./components/FlightCard";

interface Flight {
  flightId: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  weather: {
    temperature: number;
    icon: string;
    weatherAlert: boolean;
  };
}

const App: React.FC = () => {
  // State for filters
  const [selectedAirport, setSelectedAirport] = useState<string>("JFK");
  const [selectedDay, setSelectedDay] = useState<string>(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  const [selectedTime, setSelectedTime] = useState<string>("afternoon"); // Default to afternoon to match API response

  // State for flight data and loading/error
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch flights from API whenever any filter changes
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        setFlights(null);

        // Construct query params from state
        const query = `?airport=${selectedAirport}&dayOfWeek=${selectedDay}&timeOfDay=${selectedTime}`;
        const API_BASE = import.meta.env.VITE_API_BASE || "";
        
        const res = await fetch(`${API_BASE}/api/flights${query}`);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        
        // FIX: Access the .flights property from the JSON response
        const responseData = await res.json();
        const apiFlights = responseData.flights;

        // FIX: Transform the API data to match the frontend's 'Flight' interface
        if (apiFlights && Array.isArray(apiFlights)) {
          const transformedFlights: Flight[] = apiFlights.map((flight: any) => ({
            flightId: flight.flightId,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            departureAirport: flight.departureAirport,
            arrivalAirport: flight.arrivalAirport,
            status: flight.status,
            weather: {
              temperature: flight.weather.temp, // Map 'temp' to 'temperature'
              icon: 'cloudy', // API response lacks an icon, provide a default
              weatherAlert: flight.weatherAlert // Map from root object to nested weather object
            }
          }));
          setFlights(transformedFlights);
        } else {
          setFlights([]); // Set to empty if flights are not in the response
        }

      } catch (err: any) {
        console.error("Failed to fetch flights:", err);
        setError("Could not load flight data. Please try again.");
        setFlights([]);  // set to empty to indicate no data
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [selectedAirport, selectedDay, selectedTime]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Filter controls */}
      <FilterControls 
        selectedAirport={selectedAirport}
        selectedDay={selectedDay}
        selectedTime={selectedTime}
        onAirportChange={setSelectedAirport}
        onDayChange={setSelectedDay}
        onTimeChange={setSelectedTime}
      />

      {/* Main content */}
      <div className="flex-1 p-4">
        {loading ? (
          <p className="text-gray-700">Loading flights...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (flights && flights.length > 0) ? (
          <div className="flex flex-col gap-4">
            {flights.map(flight => (
              <FlightCard key={flight.flightId} flight={flight} />
            ))}
          </div>
        ) : (
          // When not loading and no error, but no flights returned:
          <p className="text-gray-600">No flights scheduled for the selected criteria.</p>
        )}
      </div>
    </div>
  );
};

export default App;