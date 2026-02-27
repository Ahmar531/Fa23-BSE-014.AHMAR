// ================== controllers/productController.js ==================
/**
 * PRODUCT CONTROLLER
 * 
 * RESPONSIBILITY:
 * - Contains business logic for product-related operations
 * - Processes data and prepares responses
 * - Interacts with models/database (in real apps)
 * 
 * MVC PATTERN - CONTROLLER LAYER:
 * - Routes receive requests → Controllers process them → Send responses
 * - Controllers are the "brain" of the application
 * - Keep routes thin, controllers fat (business logic here!)
 */

/**
 * Get all products
 * @route GET /products
 */
const getAllProducts = (req, res) => {
  // In a real app, this would query a database
  // For demo purposes, we return dummy data
  const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Coffee Mug', price: 12.99, category: 'Home' },
    { id: 3, name: 'Notebook', price: 5.99, category: 'Stationery' },
    { id: 4, name: 'Wireless Mouse', price: 29.99, category: 'Electronics' }
  ];
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
};

module.exports = {
  getAllProducts
};
