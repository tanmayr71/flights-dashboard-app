import axios from "axios";
import pRetry from "p-retry";
import { AIRPORT_TO_LOCATION } from "../constants/app-constants";

/** Shape of a single hour block from Visual Crossing (subset) */
export interface HourSample {
  temp: number;                // °F
  precipprob?: number;         // 0-100
  preciptype?: string[];       // ['snow'] | null  → we store [] for null
  windspeed?: number;          // mph
}

export async function getHourlyWeather(airport: string, dateISO: string) {
  const location = AIRPORT_TO_LOCATION[airport];
  if (!location) throw new Error(`No VisualCrossing mapping for ${airport}`);

  const url =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/` +
    `${encodeURIComponent(location)}/${dateISO}` +
    `?unitGroup=us&include=hours&key=${process.env.VISUAL_CROSSING_KEY}`;

  const raw = await pRetry(
    () => axios.get(url, { timeout: 8000 }).then(r => r.data),
    { retries: 2 }
  );

  /** VC returns { days:[ { hours:[ ...24 objects ] } ] } */
  const hours = raw?.days?.[0]?.hours;
  if (!hours) throw new Error("No hourly data in VisualCrossing API response");

  /** Build O(1) lookup table keyed by hour 0-23 */
  const byHour: Record<number, HourSample> = {};
  for (const h of hours as Array<any>) {
    const hourNum = Number(h.datetime.split(":")[0]);     // '14:00:00' → 14
    byHour[hourNum] = {
      temp: h.temp,
      precipprob: h.precipprob,
      preciptype: h.preciptype ?? undefined,              // null → undefined
      windspeed: h.windspeed                              
    };
  }
  return byHour;
}