import React from "react";

interface WeatherInfo {
  temperature: number;
  icon: string;       // Could be an icon code or description (e.g. "rain", "clear-day")
  weatherAlert: boolean;
}

interface Flight {
  flightId: string;
  departureTime: string;    // ISO datetime string
  arrivalTime: string;      // ISO datetime string
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  weather: WeatherInfo;
}

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  // Format times for display (e.g. "7:30 AM")
  const depDate = new Date(flight.departureTime);
  const arrDate = new Date(flight.arrivalTime);
  const depTimeStr = depDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const arrTimeStr = arrDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  // Map flight status to Tailwind badge colors
  const statusColorMap: { [key: string]: string } = {
    "On Time": "bg-green-100 text-green-800",
    "Boarding": "bg-blue-100 text-blue-800",
    "Boarded": "bg-indigo-100 text-indigo-800",
    "Departed": "bg-gray-100 text-gray-800",
    "Delayed": "bg-orange-100 text-orange-800",
    "Late Departure": "bg-orange-100 text-orange-800",
    "Cancelled": "bg-red-100 text-red-800"
  };
  const statusClasses = statusColorMap[flight.status] || "bg-gray-100 text-gray-800";

  // Map weather icon code to an emoji or placeholder (for demo purposes)
  const weatherIconMap: { [key: string]: string } = {
    "clear-day": "☀️",
    "clear-night": "🌕",
    "partly-cloudy-day": "🌤️",
    "partly-cloudy-night": "☁️",
    "cloudy": "☁️",
    "rain": "🌧️",
    "snow": "❄️",
    "wind": "💨"
    // ... add other mappings as needed
  };
  const weatherIcon = weatherIconMap[flight.weather.icon] || "☁️";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      {/* Left side: Flight ID, status, and route info */}
      <div>
        <div className="flex items-center mb-2">
          <span className="font-medium text-gray-900 mr-2">{flight.flightId}</span>
          <span className={`${statusClasses} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {flight.status}
          </span>
        </div>
        <div className="text-sm text-gray-700">
          {depTimeStr} {flight.departureAirport} &rarr; {arrTimeStr} {flight.arrivalAirport}
        </div>
      </div>

      {/* Right side: Weather info and alert badge if applicable */}
      <div className="flex items-center text-sm text-gray-800">
        <span className="text-xl mr-1">{weatherIcon}</span>
        <span>{flight.weather.temperature}°</span>
        {flight.weather.weatherAlert && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-3">
            Weather Alert
          </span>
        )}
      </div>
    </div>
  );
};

export default FlightCard;