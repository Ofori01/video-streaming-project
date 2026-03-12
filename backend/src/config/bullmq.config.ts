import { ConnectionOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const connection: ConnectionOptions = redisUrl
  ? {
      url: redisUrl,
      // Required by BullMQ — without this, ioredis gives up after a fixed
      // number of retries instead of waiting indefinitely for reconnection.
      maxRetriesPerRequest: null,
      // Reconnect on drop: wait min 50ms, max 2000ms between attempts.
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
      // Send a TCP keepalive probe every 30 s to prevent idle disconnections.
      keepAlive: 30000,
      enableReadyCheck: false,
    }
  : {
      port: 6379,
      host: "127.0.0.1",
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

export default connection;
