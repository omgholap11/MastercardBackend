import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

export async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_URL)
    console.log("MongoDB connected to server successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
