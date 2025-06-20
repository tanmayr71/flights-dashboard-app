import { Request, Response } from "express";
import { loadWeather } from "../services/weatherCache";
import { needsWeatherAlert } from "../utils/weatherAlert";
import Flight from "../models/Flight";
import { TIMES_OF_DAY, type TimeOfDay } from "@myproj/shared";

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
  const hourly = await loadWeather(airport, dateISO);

  // enrich & flag alerts
  const enriched = flights.map(f => {
    const doc = f.toObject({ virtuals: true });
    const depHour = new Date(doc.departureTime).getUTCHours();         
    const sample  = hourly[depHour];

    return {
      ...doc,
      weather: sample ?? null,
      weatherAlert: needsWeatherAlert(sample)
    };
  });

  res.json({ flights: enriched });
}