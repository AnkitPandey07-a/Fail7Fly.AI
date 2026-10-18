
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { connectDB } from "./configs/db.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fail7Fly.AI Auth Service is running",
  });
});

// Authentication routes
app.use("/", authRouter);

// Start server after connecting to MongoDB
async function startServer() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Auth service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Auth Service:", error.message);
    process.exit(1);
  }
}

startServer();
