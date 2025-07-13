import React from "react";
import { AIRPORT_CODES, DAYS_OF_WEEK, TIMES_OF_DAY, type DayOfWeek, type TimeOfDay, type AirportCode } from "@myproj/shared";

interface Props {
  selectedAirport: string;
  selectedDay: DayOfWeek;
  selectedTime: TimeOfDay;
  onAirportChange: (a: AirportCode)     => void;
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
        onChange={(e) => onAirportChange(e.target.value as AirportCode)}
      >
        {AIRPORT_CODES.map((code: string) => (
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
        {TIMES_OF_DAY.map((timeOfDay) => (
          <option key={timeOfDay} value={timeOfDay}>
            {timeOfDay}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterControls;
