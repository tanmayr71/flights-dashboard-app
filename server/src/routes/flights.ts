import { Router } from "express";
import { getFlights } from "../controllers/flights";

const router = Router();

router.get("/", getFlights);          // GET /api/flights
// router.post("/", createFlight);    // add more endpoints here

export default router;