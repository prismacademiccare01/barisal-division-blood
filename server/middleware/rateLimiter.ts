import { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, AttemptRecord>();

// Cleanup stale keys every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (record.resetAt <= now) {
      memoryStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function createRateLimiter(options: {
  windowMs: number;
  maxAttempts: number;
  keyGenerator?: (req: Request) => string;
  errorMessage?: string;
}) {
  const { windowMs, maxAttempts, keyGenerator, errorMessage } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator
      ? keyGenerator(req)
      : `${req.ip || 'unknown'}_${req.baseUrl}${req.path}`;
    const now = Date.now();
    const existing = memoryStore.get(key);

    if (!existing || existing.resetAt <= now) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (existing.count >= maxAttempts) {
      const waitSeconds = Math.ceil((existing.resetAt - now) / 1000);
      return res.status(429).json({
        success: false,
        message:
          errorMessage ||
          `অনেক বেশি অনুরোধ করা হয়েছে। অনুগ্রহ করে ${waitSeconds} সেকেন্ড পর পুনরায় চেষ্টা করুন।`,
        retryAfter: waitSeconds,
      });
    }

    existing.count += 1;
    next();
  };
}

export const otpRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxAttempts: 3,
  keyGenerator: (req) => `otp_${req.body?.phone || req.ip}`,
  errorMessage: 'OTP পাঠানোর সীমা অতিক্রম করেছে। ৫ মিনিট পর আবার চেষ্টা করুন।',
});

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 6,
  keyGenerator: (req) => `login_${req.body?.phone || req.ip}`,
  errorMessage: 'অতিরিক্ত ব্যর্থ প্রচেষ্টা! অনুগ্রহ করে ১৫ মিনিট পর পুনরায় চেষ্টা করুন।',
});
