
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is missing from environment variables");
}

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 1000, 5000);
    },
    connectTimeout: 10000,
});

redis.on("ready", () => {
    console.log("Redis is ready");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

redis.on("close", () => {
    console.error("Redis connection closed");
});

export default redis;
