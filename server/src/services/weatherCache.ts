import axios from "axios";
import WeatherData from "../models/WeatherData";
import { HourSample } from "../utils/weather";
import { AIRPORT_TO_LOCATION } from "../constants/app-constants"; 

// Helpers -> Map<string,hour> ➜ Record<number,hour> (0‒23 keys)
const mapToNumericHours = (
  map: Map<string, HourSample>
): Record<number, HourSample> => {
  const out: Record<number, HourSample> = {};
  for (const [h, v] of map.entries()) out[Number(h)] = v;
  return out;
};

/**
 * Main loader (cache-first)
 * Returns hourly forecast for airport+date.
 * Always numeric keys (0‒23) and HourSample values.
 */
export async function loadWeather(
  airportCode: string,
  dateISO: string              // "YYYY-MM-DD"
): Promise<Record<number, HourSample>> {
  // cache hit?
  const cached = await WeatherData.findOne({ airportCode, dateISO }).exec();
  if (cached) return mapToNumericHours(cached.hours as Map<string, HourSample>);

  // fetch Visual Crossing
  const apiKey = process.env.VISUAL_CROSSING_KEY;
  const place   = AIRPORT_TO_LOCATION[airportCode] ?? airportCode;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(place)}/${dateISO}/${dateISO}`;
  const { data } = await axios.get(url, {
    params: { unitGroup: "us", include: "hours", key: apiKey }
  });

  const day = data?.days?.[0];
  if (!day?.hours) throw new Error("VC response missing hours[]");

  const hoursMap = new Map<string, HourSample>();

  for (const h of day.hours as any[]) {
    const hourKey = String(
      typeof h.datetime === "string" && h.datetime.includes(":")
        ? h.datetime.split(":")[0]           // "14:00:00" → "14"
        : new Date(h.datetime).getUTCHours() // fallback
    );

    const precipArr =
      Array.isArray(h.preciptype)         ? h.preciptype :
      h.preciptype                        ? [h.preciptype] :
                                            [];

    hoursMap.set(hourKey, {
      temp:        h.temp,
      precipprob:  h.precipprob,
      preciptype:  precipArr,              // ALWAYS an array
      windspeed:   h.windspeed
    });
  }

  // upsert cache
  await WeatherData.updateOne(
    { airportCode, dateISO },
    { $set: { hours: hoursMap, fetchedAt: new Date() } },
    { upsert: true }
  );

  return mapToNumericHours(hoursMap);
}