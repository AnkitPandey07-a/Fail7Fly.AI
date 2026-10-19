
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

// Render automatically provides PORT.
// Locally, the Gateway will use port 8000.
const PORT = process.env.PORT || 8000;

// Allowed frontend origins.
// FRONTEND_URL should be set to the deployed Vercel URL in Render.
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration.
// Credentials are enabled for cookie-based authentication.
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

// Parse JSON request bodies.
app.use(express.json());

// Log incoming HTTP requests.
app.use(morgan("dev"));

// Parse cookies from incoming requests.
app.use(cookieParser());

// Health-check endpoint.
// Open the Gateway URL in a browser to verify it is running.
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Fail7Fly.AI Gateway is running",
  });
});

// Initial deployment configuration:
// Only Auth is required right now.
// Other services will be configured after they are deployed.
const requiredServices = {
  Auth_SERVICE_URL: process.env.Auth_SERVICE_URL,
};

// Check whether the required Auth URL is configured.
const missingServices = Object.entries(requiredServices)
  .filter(([, url]) => !url)
  .map(([name]) => name);

// Stop startup only if the Auth URL is missing.
if (missingServices.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingServices.join(", ")
  );
  process.exit(1);
}

// AUTH SERVICE
// Requests to /api/auth are forwarded to the deployed Auth service.
// Example: /api/auth/login -> Auth service /login
app.use(
  "/api/auth",
  proxy(process.env.Auth_SERVICE_URL)
);

// INTERVIEW SERVICE
// This route will work after Interview_SERVICE_URL is configured
// and the Interview service is deployed.
if (process.env.Interview_SERVICE_URL) {
  app.use(
    "/api/interview",
    isAuth,
    proxyWithHeaders(process.env.Interview_SERVICE_URL)
  );
}

// RESUME SERVICE
// This route will work after Resume_SERVICE_URL is configured
// and the Resume service is deployed.
if (process.env.Resume_SERVICE_URL) {
  app.use(
    "/api/resume",
    isAuth,
    proxyWithHeaders(process.env.Resume_SERVICE_URL, {
      limit: "21mb",
    })
  );
}

// ROADMAP SERVICE
// This route will work after Roadmap_SERVICE_URL is configured
// and the Roadmap service is deployed.
if (process.env.Roadmap_SERVICE_URL) {
  app.use(
    "/api/roadmap",
    isAuth,
    proxyWithHeaders(process.env.Roadmap_SERVICE_URL)
  );
}

// RESOURCES SERVICE
// This route will work after Resources_SERVICE_URL is configured
// and the Resources service is deployed.
if (process.env.Resources_SERVICE_URL) {
  app.use(
    "/api/resources",
    isAuth,
    proxyWithHeaders(process.env.Resources_SERVICE_URL)
  );
}

// CURRENT USER
// Validates the current session and returns the user information.
app.get("/api/me", isAuth, getCurrentUser);

// Centralized error handler.
// Handles CORS and other Express middleware errors.
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

// Start the Gateway on the Render-provided port or local port 8000.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Fail7Fly.AI Gateway is running on port ${PORT}`);
});
