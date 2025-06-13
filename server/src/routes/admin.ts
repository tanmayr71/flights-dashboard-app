import { Router } from "express";
import Flight from "../models/Flight";

const router = Router();

/**
 * Soft reset – revert any *in-progress* flight to "On Time".
 * Leaves Departed flights intact so history remains realistic.
 */
router.post("/reset-statuses", async (_req, res) => {
  const result = await Flight.updateMany(
    { status: { $ne: "Departed" } },                   // everything except Departed
    { status: "On Time", lastStatusUpdate: new Date() }
  );
  res.json({ modified: result.modifiedCount });
});

/**
 * Hard reset – wipe the board completely.
 * Every flight gets "On Time", regardless of its previous state.
 */
router.post("/reset-all", async (_req, res) => {
  const result = await Flight.updateMany(
    {},                                               // no filter → all docs
    { status: "On Time", lastStatusUpdate: new Date() }
  );
  res.json({ modified: result.modifiedCount });
});

export default router;