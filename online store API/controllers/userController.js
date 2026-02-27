// ================== controllers/userController.js ==================
/**
 * USER CONTROLLER
 * 
 * RESPONSIBILITY:
 * - Handles user-related business logic
 * - Validates input data
 * - Prepares responses
 */

/**
 * Get user by ID
 * @route GET /users/:id
 */
const getUserById = (req, res) => {
  // Extract ID from URL parameters
  const { id } = req.params;
  
  // In a real app, query database for user with this ID
  // For demo, return dummy user object
  const user = {
    id: id,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer'
  };
  
  res.status(200).json({
    success: true,
    data: user
  });
};

/**
 * Create new user
 * @route POST /users
 */
const createUser = (req, res) => {
  // Extract data from request body
  const { name, email } = req.body;
  
  // In a real app:
  // 1. Validate input
  // 2. Check if user exists
  // 3. Hash password
  // 4. Save to database
  
  // For demo, return created user
  const newUser = {
    id: Date.now(), // Simple ID generation for demo
    name: name || 'Anonymous',
    email: email || 'no-email@example.com',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
};

module.exports = {
  getUserById,
  createUser
};
