// ================== routes/products.js ==================
/**
 * PRODUCT ROUTES
 * 
 * WHY SEPARATE ROUTE FILES?
 * - Keeps app.js clean and focused
 * - Groups related endpoints together
 * - Easy to maintain and scale
 * 
 * RESPONSIBILITY:
 * - Define route paths and HTTP methods
 * - Delegate business logic to controllers
 * - Routes should be "thin" - just connect URL to controller function
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * GET /products
 * Retrieve all products
 * No authentication required (public route)
 */
router.get('/', productController.getAllProducts);

module.exports = router;
