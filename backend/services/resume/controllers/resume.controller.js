
import mongoose from "mongoose";
import fs from "fs/promises";

import { resumeAgent } from "../agents/resume.agent.js";
import extractText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import redis from "../../../sharedRedis/redis/redis.js";

async function getSessionUserId(req) {
    const sessionId = req.cookies?.session;

    if (!sessionId) return null;

    const rawSession = await redis.get(`session:${sessionId}`);
    if (!rawSession) return null;

    try {
        const session = JSON.parse(rawSession);
        const userId = session?.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return null;
        }

        return String(userId);
    } catch {
        return null;
    }
}

export const uploadResume = async (req, res) => {
    const filePath = req.file?.path;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required.",
            });
        }

        // Set by deductInterviewCoins after verifying the Redis session.
        const userId = req.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        const jobRole = String(
            req.body?.jobRole || "Full Stack Developer"
        ).trim();

        if (!jobRole || jobRole.length > 200) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid target job role.",
            });
        }

        const resumeText = await extractText(filePath);

        if (
            typeof resumeText !== "string" ||
            resumeText.trim().length < 50
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "The PDF contains too little readable text. Please upload a text-based PDF.",
            });
        }

        const resumeData = await resumeAgent(resumeText, jobRole);

        const score = Number(resumeData.score);

        if (!Number.isFinite(score) || score < 0 || score > 100) {
            throw new Error("AI returned an invalid resume score.");
        }

        const resumeFields = {
            ...resumeData,
            userId,
            jobRole,
            suggestedRole: resumeData.suggestedRole || jobRole,
            extractedText: resumeText,
            score,
        };

        let resume = await Resume.findOne({ userId });

        if (resume) {
            Object.assign(resume, resumeFields);
            await resume.save();
        } else {
            resume = await Resume.create(resumeFields);
        }

        // Cache failures do not invalidate the MongoDB save.
        try {
            await redis.set(
                `resume:${userId}`,
                JSON.stringify(resume)
            );
        } catch (error) {
            console.error("Resume cache update failed:", error.message);
        }

        return res.status(200).json({
            success: true,
            message: "Resume analyzed successfully.",
            interviewCoin: req.authUser?.interviewCoin,
            data: {
                ...resumeData,
                _id: resume._id,
                userId,
                jobRole,
                suggestedRole: resumeData.suggestedRole || jobRole,
                score,
            },
        });
    } catch (error) {
        console.error("Error analyzing resume:", error);

        return res.status(500).json({
            success: false,
            message: "Error analyzing resume.",
        });
    } finally {
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.error("Temporary PDF cleanup failed:", error.message);
                }
            }
        }
    }
};

export const getResume = async (req, res) => {
    try {
        const userId = await getSessionUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please login again.",
            });
        }

        const cacheKey = `resume:${userId}`;

        try {
            const cachedResume = await redis.get(cacheKey);

            if (cachedResume) {
                return res.status(200).json({
                    success: true,
                    source: "redis",
                    data: JSON.parse(cachedResume),
                });
            }
        } catch (error) {
            console.error("Resume cache read failed:", error.message);
        }

        const resume = await Resume.findOne({ userId });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found.",
            });
        }

        try {
            await redis.set(cacheKey, JSON.stringify(resume));
        } catch (error) {
            console.error("Resume cache refresh failed:", error.message);
        }

        return res.status(200).json({
            success: true,
            source: "mongoDB",
            data: resume,
        });
    } catch (error) {
        console.error("Error fetching resume:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching resume.",
        });
    }
};
