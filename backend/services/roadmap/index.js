import "dotenv/config";
import express from "express";
import cors from "cors";
import roadmapRouter from "./routes/roadmap.route.js";

const app = express();
const PORT = process.env.PORT || 8004;

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
    return res.status(200).json({
        success: true,
        message: "Career roadmap service is running.",
    });
});

app.use("/api/roadmap", roadmapRouter);

app.use((err, _req, res, _next) => {
    console.error("Career roadmap service error:", err);

    return res.status(500).json({
        success: false,
        message: "Unable to load career roadmap data.",
    });
});

app.listen(PORT, () => {
    console.log(`Career roadmap service is running on port ${PORT}`);
});
