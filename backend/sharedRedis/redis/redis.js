
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error(
        "REDIS_URL is missing. Please configure it in Render Environment."
    );
}

if (
    !redisUrl.startsWith("rediss://") &&
    !redisUrl.startsWith("redis://")
) {
    throw new Error(
        "Invalid REDIS_URL format. Use the Upstash TCP connection URL."
    );
}

const redis = new Redis(redisUrl, {
    lazyConnect: false,
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,

    retryStrategy(times) {
        const delay = Math.min(times * 1000, 5000);
        console.log(`Redis reconnect attempt ${times} in ${delay}ms`);
        return delay;
    },
});

redis.on("connect", () => {
    console.log("Redis TCP connection established");
});

redis.on("ready", () => {
    console.log("Redis is ready to accept commands");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

redis.on("close", () => {
    console.error("Redis connection closed");
});

redis.on("reconnecting", (delay) => {
    console.log(`Redis reconnecting in ${delay}ms`);
});

redis.on("end", () => {
    console.error("Redis connection ended; automatic reconnection stopped");
});

export default redis;
