import { ConnectionOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const connection: ConnectionOptions = redisUrl
  ? {
      url: redisUrl,
      ...(redisUrl.startsWith("rediss://") ? { tls: {} } : {}),
    }
  : { port: 6379, host: "127.0.0.1" };

export default connection;
