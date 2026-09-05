import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter
 * @param windowMs Window duration in milliseconds
 * @param maxRequests Maximum allowed requests within window
 */
export function createRateLimiter(windowMs: number = 10000, maxRequests: number = 10) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const key = `${req.baseUrl || ''}${req.path}_${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key as string);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key as string, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Please wait ${retryAfterSec} seconds before trying again.`,
      });
    }

    record.count++;
    next();
  };
}
