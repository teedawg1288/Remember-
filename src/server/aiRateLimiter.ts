import type { RequestHandler } from 'express';

type AiLimitOptions = {
  perIpPerMinute: number;
  totalPerMinute: number;
  now?: () => number;
};

type WindowCount = { startsAt: number; count: number };

const MINUTE_MS = 60_000;
const MAX_TRACKED_IPS = 5_000;

/**
 * Basic per-instance protection for paid AI routes.
 * Not a substitute for Cloud Armor/API Gateway, an organization-wide budget,
 * or authenticated user quotas when REMEMBER grows.
 */
export function createAiRateLimiter(options: AiLimitOptions): RequestHandler {
  const now = options.now || Date.now;
  const perIpLimit = Math.max(1, Math.floor(options.perIpPerMinute));
  const globalLimit = Math.max(1, Math.floor(options.totalPerMinute));
  const ips = new Map<string, WindowCount>();
  let global: WindowCount = { startsAt: now(), count: 0 };

  return (req, res, next) => {
    const time = now();
    if (time - global.startsAt >= MINUTE_MS || time < global.startsAt) {
      global = { startsAt: time, count: 0 };
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    let personal = ips.get(ip);
    if (!personal || time - personal.startsAt >= MINUTE_MS || time < personal.startsAt) {
      personal = { startsAt: time, count: 0 };
    }

    if (personal.count >= perIpLimit || global.count >= globalLimit) {
      const personalDelay = personal.count >= perIpLimit ? personal.startsAt + MINUTE_MS - time : 0;
      const globalDelay = global.count >= globalLimit ? global.startsAt + MINUTE_MS - time : 0;
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil(Math.max(personalDelay, globalDelay) / 1_000))));
      res.setHeader('Cache-Control', 'no-store');
      res.status(429).json({
        success: false,
        code: 'REMEMBER_RATE_LIMIT',
        error: 'REMEMBER is handling too many requests right now. Please try again shortly.',
      });
      return;
    }

    personal.count += 1;
    global.count += 1;
    ips.set(ip, personal);

    // Bound memory even if many distinct callers arrive during one process lifetime.
    if (ips.size > MAX_TRACKED_IPS) {
      for (const [key, window] of ips) {
        if (time - window.startsAt >= MINUTE_MS) ips.delete(key);
      }
      while (ips.size > MAX_TRACKED_IPS) {
        const oldest = ips.keys().next().value;
        if (oldest === undefined) break;
        ips.delete(oldest);
      }
    }

    next();
  };
}
