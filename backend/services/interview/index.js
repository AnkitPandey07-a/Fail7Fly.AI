
import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import interviewRouter from "./routes/interview.route.js";

const app = express();
const PORT = process.env.PORT || 8006;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Interview service is running",
    });
});

// Read the user ID forwarded by the authenticated Gateway.
app.use("/api/interview", (req, res, next) => {
    const userId = req.get("x-user-id");

    if (userId) {
        req.userId = userId;
    }

    next();
});

// Mount interview routes only once.
app.use("/api/interview", interviewRouter);

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Interview service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(
            "Failed to start Interview Service:",
            error.message
        );
        process.exit(1);
    }
}

startServer();
