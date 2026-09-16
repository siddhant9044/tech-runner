import rateLimit from 'express-rate-limit';
export const apiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 180, standardHeaders: 'draft-8', legacyHeaders: false, message: { ok: false, error: 'Too many requests. Please slow down.' } });
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 25, standardHeaders: 'draft-8', legacyHeaders: false, message: { ok: false, error: 'Too many authentication attempts. Try again later.' } });
