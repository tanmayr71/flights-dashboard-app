import { Router } from "express";
import Flight from "../models/Flight";

const router = Router();

router.post("/reset-statuses", async (_req, res) => {
  await Flight.updateMany(
    { status: { $nin: ["Departed", "Cancelled"] } },
    { status: "On Time", lastStatusUpdate: new Date() }
  );
  res.json({ ok: true });
});

export default router;