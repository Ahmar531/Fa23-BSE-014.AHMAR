// ================== middleware/auth.js ==================
/**
 * AUTHENTICATION MIDDLEWARE
 * 
 * ANALOGY:
 * "Auth middleware is like a security guard checking ID before entering VIP area."
 * 
 * The security guard (auth middleware):
 * 1. Checks if you have an ID (Authorization header)
 * 2. If no ID → You can't enter (401 Unauthorized)
 * 3. If valid ID → You can proceed (calls next())
 * 
 * REAL-WORLD USE CASE:
 * - Protects sensitive routes (user profile, admin panel)
 * - Validates JWT tokens, API keys, or session cookies
 * - Prevents unauthorized access
 */

const auth = (req, res, next) => {
  // Check if Authorization header exists
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing Authorization header'
    });
  }
  
  // In a real app, you would verify the token here (JWT, API key, etc.)
  // For this demo, we just check if it exists
  console.log(`✅ Auth passed for ${req.method} ${req.url}`);
  
  // Token is valid, proceed to the route handler
  next();
};

module.exports = auth;
