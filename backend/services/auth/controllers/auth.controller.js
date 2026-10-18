
import { app } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto";
import redis from "../../../sharedRedis/redis/redis.js";
import User from "../models/user.model.js";

const INITIAL_INTERVIEW_COINS = 500;
const SESSION_TTL = 7 * 24 * 60 * 60;

export const GoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google authentication token is required.",
      });
    }

    // Verify Google/Firebase ID token.
    const decoded = await getAuth(app).verifyIdToken(token);

    // Find existing user.
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    let isNewUser = false;

    // Create a new user with initial coins.
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || "",
        email: decoded.email || "",
        interviewCoin: INITIAL_INTERVIEW_COINS,
      });

      isNewUser = true;
    }

    // Create a new session.
    const sessionId = crypto.randomUUID();

    const sessionData = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
      interviewCoin: user.interviewCoin ?? 0,
    };

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      "EX",
      SESSION_TTL
    );

    // Set HTTP-only session cookie.
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_TTL * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? "Account created successfully. Welcome bonus credited!"
        : "User authenticated successfully.",
      isNewUser,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        interviewCoin: user.interviewCoin ?? 0,
      },
    });
  } catch (error) {
    console.error("Google authentication failed:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};

// Logout controller.
export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Logout failed:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
};
