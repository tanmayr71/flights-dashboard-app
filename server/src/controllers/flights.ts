import { Request, Response } from "express";
import { loadWeather } from "../services/weatherCache";
import { needsWeatherAlert } from "../utils/weatherAlert";
import Flight from "../models/Flight";
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
  const flights = await Flight.find({
    departureAirport: airport,
    dayOfWeek,
    timeOfDay
  })
    .sort({ departureTime: 1 });
    // .lean({ virtuals: true });

  if (flights.length === 0) return res.json({ flights: [] });

  // fetch weather once per airport-day pair
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