import { Redis } from "@upstash/redis";

const url =
  process.env.UPSTASH_REDIS_URL || "https://coherent-crawdad-115720.upstash.io";
const token = process.env.UPSTASH_REDIS_TOKEN;

export const redis = token
  ? new Redis({
      url,
      token,
    })
  : null;
