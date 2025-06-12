import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (newValue: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="p-2 border border-gray-300 rounded text-sm text-gray-800 bg-white"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;