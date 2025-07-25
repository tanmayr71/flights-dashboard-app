// server/src/services/statusManager.ts
import cron from "node-cron";
import { HydratedDocument } from "mongoose";
import { startOfDay, endOfDay } from "date-fns";
import Flight, { IFlight } from "../models/Flight";
import { loadWeather } from "./weatherCache";           
import { needsWeatherAlert } from "../utils/weatherAlert";

// Evaluate / mutate a single flight according to rules
async function evaluateFlight(f: HydratedDocument<IFlight>, now: Date) {
  const minutesToDep = Math.floor(
    (f.departureTime.getTime() - now.getTime()) / 60_000
  );

  // Final states are immutable
  if (f.status === "Cancelled" || f.status === "Departed") return;

  // Flights that have taken off
  if (minutesToDep <= 0) {
    f.status = "Departed";
  }

  //Boarding / Boarded windows
  else if (minutesToDep <= 15) {
    // 0–15 min before departure
      if (f.status === "On Time" || f.status === "Boarding") {
        f.status = "Boarded";
      } else if (f.status === "Delayed") {
        f.status = "Late Departure"; 
      }
  } else if (minutesToDep <= 45) {
    // 15–45 min
    if (f.status === "On Time") {
      f.status = "Boarding";
    } else if (f.status === "Delayed") {
      f.status = "Late Departure"; 
    }
  }

  // >45 min out: decide Delay or Cancel
  else {
    // chance of Cancel while >45 min out
    if (Math.random() < 0.1 && f.status === "On Time") {
      f.status = "Cancelled";
    }

    // consider Delay / On-Time restore
    const dateISO = f.departureTime.toISOString().slice(0, 10);
    const wxHours = await loadWeather(f.departureAirport, dateISO);
    const depHour = new Date(f.departureTime).getUTCHours();
    const depHourForecast = wxHours[depHour];

    if (minutesToDep <= 90 && f.status === "On Time") {
      // inside 90-min window
      if (needsWeatherAlert(depHourForecast)) {
        f.status = "Delayed";                     // weather-forced
      } else if (Math.random() < 0.3) {
        f.status = "Delayed";                     // random delay
      }
    }

    // Revert Delayed → On Time if >90 min out and weather improved
    if (f.status === "Delayed" && minutesToDep > 90) {
      if (!needsWeatherAlert(depHourForecast) && Math.random() < 0.5) {
        f.status = "On Time";
      }
    }
  }

  // Persist only if changed
  if (f.isModified("status")) {
    f.lastStatusUpdate = new Date();
    await f.save();
  }
}

/**
 * Finalizes past flights to realistic end states.
 * Reasoning: Past flights shouldn't remain in transient states like "Boarding" or "Delayed".
 * They should either be "Departed" (if they flew) or "Cancelled" (if previously cancelled).
 */
async function finalizePastFlights() {
  try {
    const todayStart = startOfDay(new Date()); // Reuse date-fns for midnight today

    const result = await Flight.updateMany(
      {
        departureTime: { $lt: todayStart }, // < today (past)
        status: { $nin: ["Departed", "Cancelled"] } // Not final
      },
      {
        $set: { status: "Departed", lastStatusUpdate: new Date() } // Set Departed + timestamp
      }
    );

    console.log(`[startup] Finalized ${result.modifiedCount} past flights to Departed`);
  } catch (e) {
    console.error("[startup] Error finalizing past flights", e);
  }
}

// Scheduler: every minute evaluate today’s active flights
export function startStatusScheduler() {
  finalizePastFlights(); // runs once on startup

  const job = async () => {
    try {
      const todayStart = startOfDay(new Date());
      const todayEnd   = endOfDay(new Date());

      const active = await Flight.find({
        departureTime: { $gte: todayStart, $lte: todayEnd },
        status: { $nin: ["Departed", "Cancelled"] }
      });

      const now = new Date();
      for (const flight of active) {
        await evaluateFlight(flight, now);
      }
      console.log(`[scheduler] updated ${active.length} flights`);
    } catch (e) {
      console.error("[scheduler] error", e);
    }
  };

  // run at second 0 every minute
  cron.schedule("0 * * * * *", job);
  // plain JS:
  // setInterval(job, 60_000);
}