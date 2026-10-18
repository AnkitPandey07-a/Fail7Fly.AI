
import mongoose from "mongoose";
import User from "../models/user.model.js";
import redis from "../../../sharedRedis/redis/redis.js";

const COIN_COST = 25;
const SESSION_TTL = 7 * 24 * 60 * 60;

async function syncRedisSession(sessionId, user) {
    const key = `session:${sessionId}`;
    const existingSession = await redis.get(key);

    if (!existingSession) return;

    await redis.set(
        key,
        JSON.stringify({
            userId: String(user._id),
            name: user.name,
            email: user.email,
            interviewCoin: user.interviewCoin ?? 0,
        }),
        "EX",
        SESSION_TTL
    );
}

export const deductInterviewCoin = async (req, res, next) => {
    const sessionId = req.cookies?.session;

    let userId;
    let deducted = false;
    let refundPromise = null;

    const refund = async () => {
        if (!deducted) return;

        // Make refund idempotent within this request.
        if (refundPromise) return refundPromise;

        refundPromise = (async () => {
            const user = await User.findByIdAndUpdate(
                userId,
                { $inc: { interviewCoin: COIN_COST } },
                { new: true, runValidators: true }
            );

            if (!user) {
                throw new Error("User not found during coin refund.");
            }

            deducted = false;

            try {
                await syncRedisSession(sessionId, user);
            } catch (error) {
                console.error("Redis refund sync failed:", error.message);
            }
        })();

        return refundPromise;
    };

    try {
        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }

        const sessionKey = `session:${sessionId}`;
        const rawSession = await redis.get(sessionKey);

        if (!rawSession) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again.",
            });
        }

        let session;

        try {
            session = JSON.parse(rawSession);
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid session.",
            });
        }

        userId = session?.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({
                success: false,
                message: "Invalid user session.",
            });
        }

        // Atomically deduct only when the balance is sufficient.
        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                interviewCoin: { $gte: COIN_COST },
            },
            {
                $inc: { interviewCoin: -COIN_COST },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            const existingUser = await User.findById(userId)
                .select("interviewCoin")
                .lean();

            if (!existingUser) {
                return res.status(401).json({
                    success: false,
                    message: "User not found.",
                });
            }

            return res.status(403).json({
                success: false,
                message: "Not enough interview coins.",
                requiredCoins: COIN_COST,
                interviewCoin: existingUser.interviewCoin ?? 0,
            });
        }

        deducted = true;

        // Trusted identity for downstream controllers.
        req.userId = String(user._id);
        req.authUser = user;
        req.coinCost = COIN_COST;
        req.refundInterviewCoins = refund;

        // If the controller sends an HTTP error, refund before sending it.
        const originalJson = res.json.bind(res);

        res.json = function (body) {
            if (res.statusCode >= 400 && deducted) {
                return refund()
                    .catch((error) => {
                        console.error("Coin refund failed:", error.message);
                    })
                    .then(() => originalJson(body));
            }

            return originalJson(body);
        };

        try {
            await syncRedisSession(sessionId, user);
        } catch (error) {
            // MongoDB is the source of truth.
            // Continue; the session balance can be refreshed later.
            console.error("Redis balance sync failed:", error.message);
        }

        return next();
    } catch (error) {
        console.error("Coin middleware error:", error);

        if (deducted) {
            try {
                await refund();
            } catch (refundError) {
                console.error("Coin refund failed:", refundError);
            }
        }

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Unable to process interview coins.",
            });
        }
    }
};
