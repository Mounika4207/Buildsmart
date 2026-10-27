const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication routes (login, register)
 * Prevents automated brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  skip: (req) => process.env.NODE_ENV === 'test', // Skip during automated test suites
});

module.exports = {
  authLimiter,
};
