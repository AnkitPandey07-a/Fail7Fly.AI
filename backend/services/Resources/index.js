import "dotenv/config";
import express from "express";
import cors from "cors";
import resourcesRouter from "./routes/resources.route.js";

const app = express();
const PORT = process.env.PORT || 8010;

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
        message: "Technical resources service is running.",
    });
});

app.use("/api/resources", resourcesRouter);

app.use((err, _req, res, _next) => {
    console.error("Technical resources service error:", err);

    return res.status(500).json({
        success: false,
        message: "Unable to load technical learning resources.",
    });
});

app.listen(PORT, () => {
    console.log(`Technical resources service is running on port ${PORT}`);
});
