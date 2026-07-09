import rateLimit from "express-rate-limit";

type RateLimitConfig = {
  windowMs?: number;
  max?: number;
  enabled?: boolean;
};

export function createRateLimiter(config: RateLimitConfig = {}) {
  if (config.enabled === false) {
    return (_req: unknown, _res: unknown, next: () => void) => next();
  }

  return rateLimit({
    windowMs: config.windowMs ?? 60_000, // 1 minute
    max: config.max ?? 100,              // 100 requests per IP per minute
    standardHeaders: true,               // RateLimit-* headers in response
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
  });
}