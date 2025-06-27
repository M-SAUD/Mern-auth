import rateLimit from 'express-rate-limit';

// 3 attempts per 10 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 4, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
