import React from "react";
import { Plane } from "lucide-react";
import type { Flight, FlightStatus } from "@myproj/shared";

/** Tailwind badge colours for each status */
const statusBadge: Record<FlightStatus, string> = {
  "On Time":        "bg-green-100 text-green-800",
  Boarding:         "bg-blue-100 text-blue-800",
  Boarded:          "bg-indigo-100 text-indigo-800",
  Departed:         "bg-gray-200 text-gray-800",
  Delayed:          "bg-yellow-200 text-yellow-800",
  "Late Departure": "bg-orange-200 text-orange-800",
  Cancelled:        "bg-red-200 text-red-800",
};

interface Props { flight: Flight }

const FlightCard: React.FC<Props> = ({ flight }) => {
  /* formatted times */
  const dep = new Date(flight.departureTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const arr = new Date(flight.arrivalTime).toLocaleTimeString([],   { hour: "numeric", minute: "2-digit" });

  /* duration text */
  const { hours, minutes } = flight.duration;
  const dur = hours && minutes ? `${hours}h ${minutes}m`
           : hours            ? `${hours}h`
           : `${minutes}m`;

  /* UI */
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-start justify-between">
      {/* ===== 6-column grid: dep | icon | arr | flight-id | status | weather ===== */}
      <div className="grid grid-cols-[110px_60px_110px_110px_auto_150px] items-center gap-x-8 w-full">
        {/* Departure column */}
        <div className="flex flex-col">
          <span className="text-xs uppercase font-semibold text-gray-500">Departure</span>
          <span className="text-xl font-bold text-gray-800">{dep}</span>
          <span className="text-base font-medium text-gray-600">{flight.departureAirport}</span>
        </div>

        {/* Centre icon & duration */}
        <div className="flex flex-col items-center">
          <Plane size={20} className="text-gray-500" />
          <span className="text-sm text-gray-700">{dur}</span>
        </div>

        {/* Arrival column */}
        <div className="flex flex-col text-right">
          <span className="text-xs uppercase font-semibold text-gray-500">Arrival</span>
          <span className="text-xl font-bold text-gray-800">{arr}</span>
          <span className="text-base font-medium text-gray-600">{flight.arrivalAirport}</span>
        </div>

        {/* Flight-ID column */}
        <div className="flex flex-col">
          <span className="text-xs uppercase font-semibold text-gray-500">Flight</span>
          <span className="text-lg font-semibold text-gray-800 tracking-wide">{flight.flightId}</span>
        </div>

        {/* Status badge column */}
        <div className="flex justify-center">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusBadge[flight.status]}`}
          >
            {flight.status}
          </span>
        </div>

        {/* Weather column */}
        <div className="flex flex-col items-end text-right">
          {/* Alert badge – only when weatherAlert true */}
          {flight.weatherAlert && (
            <span className="mb-1 text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-800">
              Weather Alert
            </span>
          )}

          <span className="text-lg font-semibold text-gray-800">
            {flight.weather.temp}&deg;F
          </span>

          <span className="text-sm text-gray-600">
            Wind {flight.weather.windspeed} mph,&nbsp;
            {flight.weather.precipprob}%{flight.weather.preciptype[0] ? ` ${flight.weather.preciptype[0]}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
