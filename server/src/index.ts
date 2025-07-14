import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin";
import flightRoutes from "./routes/flights";
import { startStatusScheduler } from "./services/statusManager";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


app.get("/api/health", (_, res) => res.send("API is up!"));
app.use("/api/flights", flightRoutes);
app.use("/api/admin", adminRoutes);

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Mongo connected");
    startStatusScheduler(); // Start the status update scheduler
  } catch (error) {
    console.error(error);
  }
}

async function startServer() {
  await connectToDatabase(); 
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server on :${PORT}`));
}

startServer();