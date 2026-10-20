
import Redis from "ioredis";

// Render environment se hosted Redis URL read karo.
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is missing");
}

// Hosted Redis se connection banao.
const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 7,
    retryStrategy(times) {
        return Math.min(times * 1000, 5000);
    },
});

// Connection status ke useful logs.
redis.on("connect", () => {
    console.log("Redis TCP connection established");
});

redis.on("ready", () => {
    console.log("Redis is ready to accept commands");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

export default redis;
