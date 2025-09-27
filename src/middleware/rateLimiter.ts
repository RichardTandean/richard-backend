import rateLimit from 'express-rate-limit';

// Login: 1 attempt per 1 minute
export const loginRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // limit each IP to 1 login attempt per minute
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 1 minute before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration: 1 attempt per 3 minutes
export const registerRateLimit = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 1, // limit each IP to 1 registration attempt per 3 minutes
  message: {
    success: false,
    message: 'Too many registration attempts. Please wait 3 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password Reset: 1 attempt per 2 minutes
export const resetPasswordRateLimit = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // limit each IP to 1 password reset attempt per 2 minutes
  message: {
    success: false,
    message: 'Too many password reset attempts. Please wait 2 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General auth rate limit (for other auth operations like refresh token, logout)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
