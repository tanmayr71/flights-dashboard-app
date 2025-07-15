import { Request, Response } from "express";
import { loadWeather } from "../services/weatherCache";
import { needsWeatherAlert } from "../utils/weatherAlert";
import FlightModel from "../models/Flight";
import { toFlightDTO } from "../mappers/toFlightDTO";
import type { Flight as FlightDTO } from "@myproj/shared";
import { type DayOfWeek, type TimeOfDay, type AirportCode } from "@myproj/shared";

/** GET /api/flights?airport=JFK&dayOfWeek=Monday&timeOfDay=Morning */
export async function getFlights(req: Request, res: Response) {
  const { airport, dayOfWeek, timeOfDay } = req.query as {
    airport?: AirportCode;
    dayOfWeek?: DayOfWeek;
    timeOfDay?: TimeOfDay;
  };

  //validate: ALL three keys are mandatory
  if (!airport || !dayOfWeek || !timeOfDay) {
    return res
      .status(400)
      .json({ error: "airport, dayOfWeek, and timeOfDay are required" });
  }

  // single-index query (IXSCAN)
  const flightDocs = await FlightModel.find({
    departureAirport: airport,
    dayOfWeek,
    timeOfDay
  }).sort({ departureTime: 1 });

  if (flightDocs.length === 0) return res.json({ flights: [] });

  // fetch weather once per airport-day pair
  const dateISO = new Date(flightDocs[0].departureTime)
    .toISOString()
    .slice(0, 10);
  const hourly = await loadWeather(airport, dateISO);

  // Transform each flight document to DTO with its weather data
  const flightDTOs: FlightDTO[] = flightDocs.map(doc => {
    // Get the hour for weather lookup
    const depHour = new Date(doc.departureTime).getUTCHours();
    const weatherSample = hourly[depHour] || null;

    // Pass the weather data directly to the mapper
    return toFlightDTO(
      doc, 
      weatherSample,
      needsWeatherAlert(weatherSample)
    );
  });

  res.json({ flights: flightDTOs });
}