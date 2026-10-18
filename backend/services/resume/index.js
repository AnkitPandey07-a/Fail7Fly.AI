
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import resumeRouter from "./routes/resume.route.js";

// File: backend/services/resume/index.js
// Purpose: Start the Resume Service.

const app = express();
const PORT = process.env.PORT || 8003;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-user-id",
        ],
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.status(200).send("Resume Service is running");
});

// Multer parses multipart/form-data in the upload route.
app.use("/api/resume", resumeRouter);

// Central error handler.
app.use((err, _req, res, _next) => {
    console.error("Resume service error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Resume service is running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start Resume Service:",
            error.message
        );
        process.exit(1);
    }
}

startServer();
