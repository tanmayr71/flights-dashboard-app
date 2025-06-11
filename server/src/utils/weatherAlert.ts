import { HourSample } from "./weather";

export function needsWeatherAlert(sample?: HourSample) {
  if (!sample) return false;
  const precipBad =
    (sample.precipprob ?? 0) >= 70 && (sample.preciptype?.length ?? 0) > 0;
  const windBad = (sample.windspeed ?? 0) > 20;   // mph (~32 km/h)
  return precipBad || windBad;
}