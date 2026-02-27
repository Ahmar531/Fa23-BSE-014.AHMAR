# Food Ordering System - Node.js/Express

A complete MVC-based Food Ordering System built with Node.js, Express, and Bootstrap.

## Features

✅ **Phase 1: MVC Architecture**
- Models for MenuItem and Order
- CRUD operations for all resources
- RESTful routing

✅ **Phase 2: Bootstrap Integration**
- Responsive 12-column grid system
- Bootstrap Cards for menu items
- Responsive Navbar
- Styled forms and buttons
- Mobile-friendly design

✅ **Phase 3: REST API**
- RESTful API endpoints
- Proper HTTP methods (GET, POST, PUT, DELETE)
- JSON responses
- Filtering and querying support

✅ **Phase 4: URI Design**
- Resource-based URIs with plural nouns
- Clean URL structure
- Query parameters for filtering

## Installation

1. **Install Dependencies**
```bash
cd food-ordering-app
npm install
```

2. **Run the Application**
```bash
npm start
```

3. **Open in Browser**
```
http://localhost:3000
```

## Available Routes

### Web Interface
- `GET /` - Home page
- `GET /menu-items` - List all menu items
- `GET /menu-items/create` - Create menu item form
- `POST /menu-items` - Create new menu item
- `GET /menu-items/:id` - View single menu item
- `GET /menu-items/:id/edit` - Edit menu item form
- `PUT /menu-items/:id` - Update menu item
- `DELETE /menu-items/:id` - Delete menu item
- `GET /orders` - List all orders
- `GET /orders/create` - Create order form
- `POST /orders` - Create new order

### REST API
- `GET /api/menu-items` - Get all menu items (JSON)
- `GET /api/menu-items?category=main` - Filter by category
- `GET /api/menu-items?available=true` - Filter by availability
- `GET /api/menu-items/:id` - Get single menu item
- `POST /api/menu-items` - Create menu item
- `PUT /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item
- `GET /api/orders` - Get all orders

## Testing the API

### Using cURL

**Get all menu items:**
```bash
curl http://localhost:3000/api/menu-items
```

**Get filtered items:**
```bash
curl http://localhost:3000/api/menu-items?category=main
```

**Create new item:**
```bash
curl -X POST http://localhost:3000/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Burger",
    "description": "Delicious beef burger",
    "category": "main",
    "price": 9.99,
    "is_available": true
  }'
```

**Update item:**
```bash
curl -X PUT http://localhost:3000/api/menu-items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Pizza",
    "description": "Updated description",
    "category": "main",
    "price": 13.99,
    "is_available": true
  }'
```

**Delete item:**
```bash
curl -X DELETE http://localhost:3000/api/menu-items/1
```

## Project Structure

```
food-ordering-app/
├── server.js           # Main application file
├── package.json        # Dependencies
├── views/              # EJS templates
│   ├── layout.ejs      # Main layout
│   ├── index.ejs       # Home page
│   ├── menu-items/     # Menu item views
│   │   ├── index.ejs
│   │   ├── create.ejs
│   │   ├── edit.ejs
│   │   └── show.ejs
│   └── orders/         # Order views
│       ├── index.ejs
│       └── create.ejs
└── README.md           # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS
- **Frontend**: Bootstrap 5, Bootstrap Icons
- **Architecture**: MVC Pattern
- **API**: RESTful API

## Features Demonstrated

### MVC Architecture
- Separation of concerns
- Route handling
- View rendering

### Bootstrap Components
- Responsive Grid System (12 columns)
- Cards
- Navbar
- Forms
- Buttons
- Modals
- Badges
- Alerts

### REST Principles
- Resource-based URIs
- Proper HTTP methods
- JSON responses
- Stateless design
- Idempotent operations

### URI Design
- Plural nouns: `/menu-items`, `/orders`
- No verbs in URIs
- Hierarchical structure
- Query parameters for filtering

## Sample Data

The application comes with 4 pre-loaded menu items:
1. Margherita Pizza - $12.99
2. Caesar Salad - $8.99
3. Chocolate Cake - $6.99
4. Fresh Orange Juice - $4.99

## Development

To run in development mode with auto-restart:

```bash
npm install -g nodemon
npm run dev
```

## Notes

- This is an in-memory application (data resets on restart)
- For production, connect to a real database (MongoDB, PostgreSQL, etc.)
- Add authentication for protected routes
- Implement proper error handling
- Add input validation

## License

MIT License - Free to use for educational purposes

## Author

Web Development Course Project
