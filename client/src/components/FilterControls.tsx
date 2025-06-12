import React from "react";
import SelectInput from "./SelectInput";
import { DAYS_OF_WEEK } from "../../../shared/constants";

interface Option {
  label: string;
  value: string;
}

interface FilterControlsProps {
  selectedAirport: string;
  selectedDay: string;
  selectedTime: string;
  onAirportChange: (airport: string) => void;
  onDayChange: (day: string) => void;
  onTimeChange: (time: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  selectedAirport,
  selectedDay,
  selectedTime,
  onAirportChange,
  onDayChange,
  onTimeChange
}) => {
  // Generate day options only once (memoized) to avoid recalculation on every render
  const dayOptions: Option[] = DAYS_OF_WEEK.map(d => ({ label: d, value: d }));
  
  // Define static options for airports and times
  const airportOptions: Option[] = [
    { label: "JFK", value: "JFK" },
    { label: "LAX", value: "LAX" },
    // Add more airports if needed
  ];
  const timeOptions: Option[] = [
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" }
  ];

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50">
      <SelectInput 
        label="Airport" 
        options={airportOptions} 
        value={selectedAirport} 
        onChange={onAirportChange} 
      />
      <SelectInput 
        label="Day" 
        options={dayOptions} 
        value={selectedDay} 
        onChange={onDayChange} 
      />
      <SelectInput 
        label="Time of Day" 
        options={timeOptions} 
        value={selectedTime} 
        onChange={onTimeChange} 
      />
    </div>
  );
};

export default FilterControls;