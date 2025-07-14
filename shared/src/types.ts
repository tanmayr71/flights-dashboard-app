import type { FlightStatus, DayOfWeek, TimeOfDay } from "./constants.js";
import type { AirportCode } from "./airports.js";

export interface FlightWeather {
  temp: number;
  precipprob: number;
  preciptype: string[];
  windspeed: number;
}

export interface Flight {
  id: string;
  flightId: string;
  dayOfWeek: DayOfWeek;
  departureAirport: AirportCode;
  arrivalAirport: string;
  departureTime: string;  // ISO
  arrivalTime: string;    // ISO
  timeOfDay: TimeOfDay;
  status: FlightStatus;
  duration: { hours: number; minutes: number };
  weather: FlightWeather;
  weatherAlert: boolean;
}
