/**
 * Seed the flights collection with a rolling 7-day window.
 * Run via:  npm run seed
 */

import "dotenv/config";                             // loads MONGO_URI
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";            
import { addDays, set } from 'date-fns';

// Import from our centralized constants
import {
  AIRPORTS,
  DAYS_OF_WEEK,
  type TimeOfDay
} from "@myproj/shared";

// Import the Flight model
import Flight from "../models/Flight";

(async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);

  // wipe previous docs so we always have a clean 7-day slate
  await Flight.deleteMany({});

  // build a date array:  -3 … +3 days from “today”
  const today = new Date();
  const dayOffsets = [-3, -2, -1, 0, 1, 2, 3];

  // hours template for each period
  const HOURS: Record<TimeOfDay, number[]> = {
    morning:   [6, 8, 10],
    afternoon: [12, 14, 16],
    evening:   [18, 20, 22]
  };

  for (const offset of dayOffsets) {
    const baseDate = addDays(today, offset);

    for (const airport of AIRPORTS) {
      for (const [period, hours] of Object.entries(HOURS) as [TimeOfDay, number[]][]) {

        for (const hour of hours) {
          // random minute between 0-59 for realism
          const minute = faker.number.int({ min: 0, max: 59 });

          const departureTime = set(baseDate, {
            hours: hour,
            minutes: minute,
            seconds: 0,
            milliseconds: 0
          });

          // Random flight duration between 1-8 hours (more realistic range)
          const durationHours = faker.number.float({ min: 1, max: 8, multipleOf: 0.25 }); // 15-minute increments
          const arrivalTime = new Date(departureTime.getTime() + (durationHours * 60 * 60 * 1000));

          const flightId = `${faker.airline.airline().iataCode}${faker.airline.flightNumber()}`;

          await Flight.create({
            flightId,
            dayOfWeek: DAYS_OF_WEEK[(today.getDay() + offset + 7) % 7],
            departureAirport: airport,
            arrivalAirport: faker.airline.airport().iataCode,
            departureTime,
            arrivalTime,
            timeOfDay: period,
            status: "On Time",
            lastStatusUpdate: new Date()
          });
        }
      }
    }
  }

  console.log(`Seed complete – ${await Flight.countDocuments()} flights inserted`);
  await mongoose.disconnect();
})();