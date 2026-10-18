
import express from "express";
import "dotenv/config";
import proxy from "express-http-proxy";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { isAuth } from "./middleware/isAuth.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as curl/Postman.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fail7Fly.AI Gateway is running",
  });
});

// Validate required service URLs before starting
const requiredServices = {
  Auth_SERVICE_URL: process.env.Auth_SERVICE_URL,
  Interview_SERVICE_URL: process.env.Interview_SERVICE_URL,
  Resume_SERVICE_URL: process.env.Resume_SERVICE_URL,
  Roadmap_SERVICE_URL: process.env.Roadmap_SERVICE_URL,
  Resources_SERVICE_URL: process.env.Resources_SERVICE_URL,
};

const missingServices = Object.entries(requiredServices)
  .filter(([, url]) => !url)
  .map(([name]) => name);

if (missingServices.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingServices.join(", ")
  );
  process.exit(1);
}

// Auth service: login, signup, logout, etc.
app.use(
  "/api/auth",
  proxy(process.env.Auth_SERVICE_URL)
);

// Interview service: protected routes
app.use(
  "/api/interview",
  isAuth,
  proxyWithHeaders(process.env.Interview_SERVICE_URL)
);

// Resume service: protected routes, larger payload support
app.use(
  "/api/resume",
  isAuth,
  proxyWithHeaders(process.env.Resume_SERVICE_URL, {
    limit: "21mb",
  })
);

// Roadmap service: protected routes
app.use(
  "/api/roadmap",
  isAuth,
  proxyWithHeaders(process.env.Roadmap_SERVICE_URL)
);

// Resources service: protected routes
app.use(
  "/api/resources",
  isAuth,
  proxyWithHeaders(process.env.Resources_SERVICE_URL)
);

// Current user/session validation
app.get("/api/me", isAuth, getCurrentUser);

// CORS and other error handling
app.use((err, req, res, next) => {
  console.error("Gateway error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed by CORS",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Fail7Fly.AI Gateway running on port ${PORT}`);
});
