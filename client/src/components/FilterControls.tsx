import React from "react";
import {
  AIRPORTS,
  DAYS_OF_WEEK,
  TIME_PERIODS,
} from "@myproj/shared";
import type { DayOfWeek, TimeOfDay } from "@myproj/shared";

interface Props {
  selectedAirport: string;
  selectedDay: DayOfWeek;
  selectedTime: TimeOfDay;
  onAirportChange: (a: string)     => void;
  onDayChange:     (d: DayOfWeek)  => void;
  onTimeChange:    (t: TimeOfDay)  => void;
}

const FilterControls: React.FC<Props> = ({
  selectedAirport,
  selectedDay,
  selectedTime,
  onAirportChange,
  onDayChange,
  onTimeChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* Airport */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">
        Airport Code
      </label>
      <select
        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
        value={selectedAirport}
        onChange={(e) => onAirportChange(e.target.value)}
      >
        {AIRPORTS.map((code: string) => (
          <option key={code}>{code}</option>
        ))}
      </select>
    </div>

    {/* Day */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">
        Day of Week
      </label>
      <select
        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
        value={selectedDay}
        onChange={(e) => onDayChange(e.target.value as DayOfWeek)}
      >
        {DAYS_OF_WEEK.map((d: DayOfWeek) => (
          <option key={d}>{d}</option>
        ))}
      </select>
    </div>

    {/* Time-of-day */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">
        Time of Day
      </label>
      <select
        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
        value={selectedTime}
        onChange={(e) => onTimeChange(e.target.value as TimeOfDay)}
      >
        {TIME_PERIODS.map((p: TimeOfDay) => (
          <option key={p}>{p}</option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterControls;
