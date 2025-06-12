/**
 * Flight schema ‒ Mongoose
 *  This file defines the Flight model for MongoDB using Mongoose.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Import constants from our single source of truth
import {
  AIRPORTS,
  DAYS_OF_WEEK,
  TIMES_OF_DAY,
  FLIGHT_STATUSES,
  type AirportCode,
  type DayOfWeek,
  type TimeOfDay,
  type FlightStatus
} from "@myproj/shared";

//  Flight interface  
export interface IFlight extends Document {
  flightId: string;
  dayOfWeek: DayOfWeek;
  departureAirport: AirportCode;
  arrivalAirport: string;        // keep string – non-US airports aren’t in enum (yet)
  departureTime: Date;
  arrivalTime: Date;
  timeOfDay: TimeOfDay;
  status: FlightStatus;
  lastStatusUpdate: Date;
  // virtuals   
  duration?: { hours: number; minutes: number };
}

// Mongoose schema definition
const flightSchema = new Schema<IFlight>(
  {
    flightId:         { type: String, required: true,  index: true },
    dayOfWeek:        { type: String, enum: DAYS_OF_WEEK, required: true },
    departureAirport: { type: String, enum: AIRPORTS,     required: true },
    arrivalAirport:   { type: String,                      required: true },
    departureTime:    { type: Date,   required: true,  index: true },
    arrivalTime:      { type: Date,   required: true },
    timeOfDay:        { type: String, enum: TIMES_OF_DAY,  required: true },
    status:           { type: String, enum: FLIGHT_STATUSES, default: 'On Time' },
    lastStatusUpdate: { type: Date,   default: Date.now },
  },
  {
    timestamps: true,                   // createdAt / updatedAt
    toJSON:    { virtuals: true },      // expose duration in API
    toObject:  { virtuals: true },
  },
);

/* Compound index mirrors the UI filter order
 * (airport → weekday → TOD → departureTime)
 * Keeps query planner happy when users drill down step-by-step.
 */
flightSchema.index({
  departureAirport: 1,
  dayOfWeek:        1,
  timeOfDay:        1,
  departureTime:    1,
});

/** Flight duration (HH:MM) */
flightSchema.virtual('duration').get(function (this: IFlight) {
  if (!this.arrivalTime || !this.departureTime) return null;

  const diffMs = this.arrivalTime.getTime() - this.departureTime.getTime();
  const hours  = Math.floor(diffMs / 3_600_000);
  const mins   = Math.floor((diffMs % 3_600_000) / 60_000);

  return { hours, minutes: mins };
});

export default mongoose.model<IFlight>('Flight', flightSchema);
