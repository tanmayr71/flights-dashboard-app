import { Request, Response } from "express";
import { getHourlyWeather } from "../utils/weather";
import { needsWeatherAlert } from "../utils/weatherAlert";
import Flight, { IFlight } from "../models/Flight";
import { TIMES_OF_DAY, TimeOfDay } from "../constants/app-constants";

/** GET /api/flights?airport=JFK&dayOfWeek=Monday&timeOfDay=morning */
export async function getFlights(req: Request, res: Response) {
  const { airport, dayOfWeek, timeOfDay } = req.query as {
    airport?: string;
    dayOfWeek?: string;
    timeOfDay?: TimeOfDay;
  };

  //validate: ALL three keys are mandatory
  if (!airport || !dayOfWeek || !timeOfDay) {
    return res
      .status(400)
      .json({ error: "airport, dayOfWeek, and timeOfDay are required" });
  }
  if (!TIMES_OF_DAY.includes(timeOfDay))
    return res.status(400).json({ error: "invalid timeOfDay value" });

  // single-index query (IXSCAN)
  const flights = await Flight.find({
    departureAirport: airport,
    dayOfWeek,
    timeOfDay
  })
    .sort({ departureTime: 1 });
    // .lean({ virtuals: true });

  if (flights.length === 0) return res.json({ flights: [] });

  // fetch weather once per airport-day
  const dateISO = new Date(flights[0].departureTime)
    .toISOString()
    .slice(0, 10);
  let hourly: Record<number, any> | null = null;
  try {
    hourly = await getHourlyWeather(airport, dateISO);
  } catch (err) {
    console.error("Weather API failed:", err instanceof Error ? err.message : err);
  }

  // enrich & flag alerts
  const enriched = flights.map(f => {
    const flightData = f.toObject({ virtuals: true });   // <- conversion
    const hour = new Date(flightData.departureTime).getHours();
    const sample = hourly?.[hour];
    return {
      ...flightData,
      weather: sample ?? null,
      weatherAlert: needsWeatherAlert(sample)
    };
  });

  res.json({ flights: enriched });
}