// ================== app.js ==================
/**
 * Main Application Entry Point
 * 
 * MVC PATTERN EXPLANATION:
 * - Model: Data structure (not implemented here, but would contain database schemas)
 * - View: Response format (JSON in REST APIs)
 * - Controller: Business logic that processes requests and returns responses
 * 
 * This file is the "orchestrator" - it connects all pieces together:
 * - Middleware (logger, auth)
 * - Routes (products, users)
 * - Controllers (handle business logic)
 * 
 * WHY THIS ARCHITECTURE?
 * ✅ Scalability: Easy to add new features
 * ✅ Maintainability: Each file has ONE responsibility
 * ✅ Testability: Controllers can be tested independently
 * ✅ Clean Code: Separation of concerns
 */

const express = require('express');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3001;

// ========== BUILT-IN MIDDLEWARE ==========
// Parse incoming JSON requests (req.body)
app.use(express.json());

// ========== GLOBAL MIDDLEWARE ==========
// Logger runs on EVERY request before reaching routes
// Think of it as a "reception desk" that logs all visitors
app.use(logger);

// ========== ROUTE MOUNTING ==========
/**
 * WHY express.Router()?
 * Instead of writing all routes in app.js (messy!), we:
 * - Split routes into separate files (products.js, users.js)
 * - Keep app.js clean and focused
 * - Make the codebase modular and scalable
 * 
 * Example: Adding a new "orders" feature? Just create routes/orders.js!
 */
app.use('/products', productRoutes);

// Auth middleware applied ONLY to /users routes
// This protects all user endpoints with authentication
app.use('/users', auth, userRoutes);

// ========== 404 ERROR HANDLER ==========
// Catches all undefined routes
// Must be placed AFTER all route definitions
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Mini Online Store API running on http://localhost:${PORT}`);
  console.log(`📦 Products: GET http://localhost:${PORT}/products`);
  console.log(`👤 Users: GET http://localhost:${PORT}/users/:id (requires Authorization header)`);
});
