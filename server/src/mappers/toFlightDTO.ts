// server/src/mappers/toFlightDTO.ts
import type { IFlight } from "../models/Flight";
import type { Flight as FlightDTO, FlightWeather } from "@myproj/shared";

// The mapper now takes the flight document and weather data separately
export function toFlightDTO(
  flightDoc: IFlight, 
  weatherData: FlightWeather | null,
  weatherAlert: boolean
): FlightDTO {
  // Extract the plain object with virtuals included
  const plainObj = flightDoc.toObject({ virtuals: true });

  return {
    // Transform MongoDB _id to id
    id: plainObj._id.toString(),
    
    // Copy over fields that match directly
    flightId: plainObj.flightId,
    dayOfWeek: plainObj.dayOfWeek,
    departureAirport: plainObj.departureAirport,
    arrivalAirport: plainObj.arrivalAirport,
    timeOfDay: plainObj.timeOfDay,
    status: plainObj.status,
    
    // Convert Date objects to ISO strings
    departureTime: plainObj.departureTime.toISOString(),
    arrivalTime: plainObj.arrivalTime.toISOString(),
    
    // Virtual field should be available
    duration: plainObj.duration || { hours: 0, minutes: 0 },
    
    // Weather fields passed as parameters
    weather: weatherData || {
      temp: 0,
      precipprob: 0,
      preciptype: [],
      windspeed: 0
    },
    weatherAlert: weatherAlert
  };
}