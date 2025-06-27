import rateLimit from 'express-rate-limit';

// ⚠️ For login route: allow max 5 attempts per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});
