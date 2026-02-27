// ================== middleware/logger.js ==================
/**
 * LOGGER MIDDLEWARE
 * 
 * ANALOGY:
 * "Middleware is like a Restaurant Waiter checking the order before it reaches the kitchen."
 * 
 * The waiter (middleware):
 * 1. Takes your order (receives request)
 * 2. Writes it down (logs it)
 * 3. Passes it to the kitchen (calls next())
 * 
 * HOW MIDDLEWARE WORKS:
 * - Runs BEFORE the route handler
 * - Has access to req, res, and next()
 * - Must call next() to pass control to the next middleware/route
 * - If next() is not called, the request hangs!
 */

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Pass control to the next middleware or route handler
  next();
};

module.exports = logger;
