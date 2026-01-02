import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { envServer } from "@/data/env/server";

export const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL,
  token: envServer.UPSTASH_REDIS_REST_TOKEN,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "10s"),
});
