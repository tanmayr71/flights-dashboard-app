import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getFlights } from "./controllers/flights";
import adminRoutes from "./routes/admin";
import { startStatusScheduler } from "./services/statusManager";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_, res) => res.send("API is up!"));

app.get("/api/flights", getFlights);

app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Mongo connected");
    startStatusScheduler(); // Start the status update scheduler
  })
  .catch(console.error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on :${PORT}`));