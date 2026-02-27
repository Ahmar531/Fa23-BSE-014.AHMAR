// ================== routes/users.js ==================
/**
 * USER ROUTES
 * 
 * NOTE: All routes here are protected by auth middleware (applied in app.js)
 * Users must send Authorization header to access these endpoints
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * GET /users/:id
 * Retrieve user by ID
 * Protected route (requires Authorization header)
 */
router.get('/:id', userController.getUserById);

/**
 * POST /users
 * Create a new user
 * Protected route (requires Authorization header)
 */
router.post('/', userController.createUser);

module.exports = router;
