# Mini Online Store API

A complete Express.js lab project demonstrating **MVC Pattern**, **Middleware**, and **Scalable Architecture**.

## 📁 Project Structure

## 📱 Mobile View Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/6adee50e-55f7-4441-9d0b-77c55f5eb9d0" width="300"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/69e8c511-b242-4b43-996e-96d4d7ecddd5" width="300"/>
</p>
```
project-folder/
│
├── app.js                      # Main application entry point
├── routes/
│   ├── products.js             # Product routes
│   └── users.js                # User routes (protected)
├── controllers/
│   ├── productController.js    # Product business logic
│   └── userController.js       # User business logic
├── middleware/
│   ├── logger.js               # Global logging middleware
│   └── auth.js                 # Authentication middleware
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Server will run on: `http://localhost:3000`

## 🧪 Testing the API

### Test 1: Get All Products (Public Route)
```bash
curl http://localhost:3000/products
```

**Expected Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    { "id": 1, "name": "Laptop", "price": 999.99, "category": "Electronics" },
    { "id": 2, "name": "Coffee Mug", "price": 12.99, "category": "Home" },
    { "id": 3, "name": "Notebook", "price": 5.99, "category": "Stationery" },
    { "id": 4, "name": "Wireless Mouse", "price": 29.99, "category": "Electronics" }
  ]
}
```

### Test 2: Get User Without Auth (Should Fail)
```bash
curl http://localhost:3000/users/123
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Unauthorized: Missing Authorization header"
}
```

### Test 3: Get User With Auth (Should Succeed)
```bash
curl -H "Authorization: Bearer fake-token" http://localhost:3000/users/123
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Test 4: Create User With Auth
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer fake-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1234567890,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2026-02-26T..."
  }
}
```

### Test 5: Invalid Route (404 Handler)
```bash
curl http://localhost:3000/invalid-route
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Route GET /invalid-route not found"
}
```

## 📚 Key Concepts Demonstrated

### 1. MVC Pattern
- **Model**: Data structure (would contain database schemas in real apps)
- **View**: JSON responses
- **Controller**: Business logic in `controllers/` folder

### 2. Middleware
- **Global Middleware**: `logger.js` runs on every request
- **Router-level Middleware**: `auth.js` protects only `/users` routes

### 3. Express Router
- Routes organized in separate files (`routes/products.js`, `routes/users.js`)
- Keeps `app.js` clean and maintainable

### 4. Separation of Concerns
- Routes define endpoints
- Controllers handle business logic
- Middleware handles cross-cutting concerns

## 🎓 Learning Outcomes

After studying this project, you will understand:
- ✅ How to structure a scalable Express.js application
- ✅ How middleware works and when to use it
- ✅ How to implement MVC pattern in Node.js
- ✅ How to protect routes with authentication
- ✅ How to organize code for maintainability

## 🔧 Next Steps (Optional Enhancements)

1. Add a database (MongoDB, PostgreSQL)
2. Implement real JWT authentication
3. Add input validation (express-validator)
4. Add error handling middleware
5. Add unit tests (Jest, Mocha)
6. Add environment variables (.env)
