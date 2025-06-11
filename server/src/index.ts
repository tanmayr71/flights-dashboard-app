import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getFlights } from "./controllers/flights";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/api/health", (_, res) => res.send("API is up!"));

app.get("/api/flights", getFlights);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Mongo connected"))
  .catch(console.error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on :${PORT}`));