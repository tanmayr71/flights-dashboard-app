// server/src/models/WeatherData.ts
import { Schema, model, Document } from "mongoose";

// sub-type
export interface HourForecast {
  temp: number;
  precipprob: number;
  preciptype: string[];   // array form
  windspeed: number;
}

// root doc
export interface WeatherDataDoc extends Document {
  airportCode: string;         // "JFK"
  dateISO: string;             // "2025-06-12"
  hours: Map<string, HourForecast>;
  fetchedAt: Date;
}

// env-driven TTL
const TTL = parseInt(process.env.WEATHER_TTL_SECONDS ?? "3600", 10);

// sub-schema
const HourSchema = new Schema<HourForecast>(
  {
    temp: Number,
    precipprob: Number,
    preciptype: [String],     // []
    windspeed: Number
  },
  { _id: false }
);

// root schema
const WeatherSchema = new Schema<WeatherDataDoc>({
  airportCode: { type: String, required: true },
  dateISO:     { type: String, required: true },      // "YYYY-MM-DD"
  hours:       { type: Map, of: HourSchema, required: true },
  fetchedAt:   { type: Date,  default: Date.now, expires: TTL }
});

// one doc per airport+day
WeatherSchema.index({ airportCode: 1, dateISO: 1 }, { unique: true });

export default model<WeatherDataDoc>("WeatherData", WeatherSchema);