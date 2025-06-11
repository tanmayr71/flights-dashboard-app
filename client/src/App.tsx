import React, { useState } from "react";

const AIRPORTS = ["JFK", "LAX", "SFO", "ORD"];
const DAYS     = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PERIODS  = ["Morning", "Afternoon", "Evening"];

export default function App() {
  const [airport, setAirport] = useState("JFK");
  const [day,     setDay]     = useState("Tuesday");
  const [period,  setPeriod]  = useState("Morning");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      {/* --- HEADER -------------------------------------------------------- */}
      <header className="bg-white shadow rounded-lg max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <span role="img" aria-label="plane">✈️</span>
          Flight Dashboard
        </h1>
        <span className="text-sm text-gray-600">Real-time Flight Status</span>
      </header>

      {/* --- FILTER BAR ---------------------------------------------------- */}
      <section className="bg-white shadow rounded-lg max-w-7xl mx-auto mt-8 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Airport */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Airport Code</span>
            <select
              value={airport}
              onChange={e => setAirport(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AIRPORTS.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>

          {/* Day of week */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Day of Week</span>
            <select
              value={day}
              onChange={e => setDay(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </label>

          {/* Time of day */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Time of Day</span>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </label>
        </div>

        {/* Period heading */}
        <h2 className="mt-6 text-lg font-semibold text-gray-800">
          {period} Flights (6:00&nbsp;AM&nbsp;–&nbsp;11:59&nbsp;PM)
        </h2>

        {/* --- SINGLE PLACEHOLDER FLIGHT CARD ----------------------------- */}
        <ul className="mt-4 space-y-4">
          <li className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg px-4 py-3">
            {/* Left block – times & airports */}
            <div className="flex-1 flex items-center gap-4">
              <div className="text-center">
                <p className="font-semibold">7:30 AM</p>
                <p className="text-xs text-gray-500">{airport}</p>
              </div>

              <div className="flex-1 border-t border-dashed border-gray-400 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">✈️</span>
                <p className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-gray-400">Xhr&nbsp;7 min</p>
              </div>

              <div className="text-center">
                <p className="font-semibold">10:45 AM</p>
                <p className="text-xs text-gray-500">LAX</p>
              </div>
            </div>

            {/* Middle block – flight no. & status */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="w-24 text-center">
                <p className="font-semibold">AA1234</p>
                <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">On Time</span>
              </div>

              {/* Right block – temp / weather / alert */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold">72 °F</p>
                  <p className="text-xs text-gray-500">Partly Cloudy</p>
                </div>
                {/* Weather alert badge (optional) */}
                <span className="hidden sm:inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  ⚠️ Weather Alert
                </span>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}