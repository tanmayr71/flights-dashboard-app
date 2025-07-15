// server/src/mappers/toFlightDTO.ts
import { HydratedDocument } from "mongoose";
import type { IFlight } from "../models/Flight";
import type { Flight as FlightDTO, FlightWeather } from "@myproj/shared";
import { needsWeatherAlert } from "../utils/weatherAlert";

/**
 * Convert a fully-hydrated Flight doc plus an optional weather sample
 * into the shape required by the shared Flight DTO.
 */
export function toFlightDTO(
  doc: HydratedDocument<IFlight>,
  weatherSample: FlightWeather
): FlightDTO {
  // Use a concrete object so `weather` is never `undefined`
  const weather: FlightWeather = weatherSample ?? {
    temp: 0,
    precipprob: 0,
    preciptype: [] as string[],
    windspeed: 0
  };

  return {
    /* Mongoose gives a string alias out of the box → no manual _id cast */
    id: doc.id,                                         

    /* Fields that map 1-to-1 */
    flightId: doc.flightId,
    dayOfWeek: doc.dayOfWeek,
    departureAirport: doc.departureAirport,
    arrivalAirport: doc.arrivalAirport,
    timeOfDay: doc.timeOfDay,
    status: doc.status,

    /* Ensure dates are ISO strings */
    departureTime: doc.departureTime.toISOString(),
    arrivalTime:   doc.arrivalTime.toISOString(),

    /* Virtual already present on the hydrated doc */
    duration: doc.duration ?? { hours: 0, minutes: 0 }, 

    /* Weather enrichment */
    weather,
    weatherAlert: needsWeatherAlert(weatherSample)
  };
}