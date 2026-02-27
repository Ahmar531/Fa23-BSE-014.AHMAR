const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// In-memory database (for demo purposes)
let menuItems = [
    { id: 1, name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil', category: 'main', price: 12.99, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', is_available: true },
    { id: 2, name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing', category: 'appetizer', price: 8.99, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', is_available: true },
    { id: 3, name: 'Chocolate Cake', description: 'Rich chocolate cake with ganache', category: 'dessert', price: 6.99, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', is_available: true },
    { id: 4, name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', category: 'beverage', price: 4.99, image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', is_available: true }
];

let orders = [
    { id: 1, customer_name: 'John Doe', customer_email: 'john@example.com', customer_phone: '(555) 123-4567', delivery_address: '123 Main St, New York, NY 10001', total_amount: 45.99, status: 'pending', created_at: new Date() }
];

let nextMenuItemId = 5;
let nextOrderId = 2;

// Routes - Web Interface
app.get('/', (req, res) => {
    res.render('index', { menuItems });
});

// Test route for CSS verification
app.get('/test-css', (req, res) => {
    res.render('test');
});

// Menu Items Routes
app.get('/menu-items', (req, res) => {
    res.render('menu-items/index-standalone', { menuItems });
});

app.get('/menu-items/create', (req, res) => {
    res.render('menu-items/create-standalone');
});

app.post('/menu-items', (req, res) => {
    const newItem = {
        id: nextMenuItemId++,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: parseFloat(req.body.price),
        image_url: req.body.image_url || 'https://via.placeholder.com/400',
        is_available: req.body.is_available === 'on'
    };
    menuItems.push(newItem);
    res.redirect('/menu-items');
});

app.get('/menu-items/:id', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Menu item not found');
    res.render('menu-items/show-standalone', { item });
});

app.get('/menu-items/:id/edit', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Menu item not found');
    res.render('menu-items/edit-standalone', { item });
});

app.put('/menu-items/:id', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Menu item not found');
    
    item.name = req.body.name;
    item.description = req.body.description;
    item.category = req.body.category;
    item.price = parseFloat(req.body.price);
    item.image_url = req.body.image_url;
    item.is_available = req.body.is_available === 'on';
    
    res.redirect('/menu-items');
});

app.delete('/menu-items/:id', (req, res) => {
    menuItems = menuItems.filter(i => i.id !== parseInt(req.params.id));
    res.redirect('/menu-items');
});

// Orders Routes
app.get('/orders', (req, res) => {
    res.render('orders/index-standalone', { orders });
});

app.get('/orders/create', (req, res) => {
    const itemId = req.query.item ? parseInt(req.query.item) : null;
    const selectedItem = itemId ? menuItems.find(i => i.id === itemId) : null;
    res.render('orders/create-standalone', { menuItems, selectedItem });
});

app.post('/orders', (req, res) => {
    const newOrder = {
        id: nextOrderId++,
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        delivery_address: req.body.delivery_address,
        total_amount: parseFloat(req.body.total_amount || 0),
        status: 'pending',
        created_at: new Date()
    };
    orders.push(newOrder);
    res.redirect('/orders');
});

// REST API Routes
app.get('/api/menu-items', (req, res) => {
    let filtered = [...menuItems];
    
    if (req.query.category) {
        filtered = filtered.filter(i => i.category === req.query.category);
    }
    
    if (req.query.available) {
        const isAvailable = req.query.available === 'true';
        filtered = filtered.filter(i => i.is_available === isAvailable);
    }
    
    res.json({
        success: true,
        data: filtered
    });
});

app.get('/api/menu-items/:id', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
});

app.post('/api/menu-items', (req, res) => {
    const newItem = {
        id: nextMenuItemId++,
        ...req.body,
        price: parseFloat(req.body.price)
    };
    menuItems.push(newItem);
    res.status(201).json({ success: true, message: 'Menu item created', data: newItem });
});

app.put('/api/menu-items/:id', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    Object.assign(item, req.body);
    item.price = parseFloat(req.body.price);
    res.json({ success: true, message: 'Menu item updated', data: item });
});

app.delete('/api/menu-items/:id', (req, res) => {
    const index = menuItems.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    menuItems.splice(index, 1);
    res.json({ success: true, message: 'Menu item deleted' });
});

app.get('/api/orders', (req, res) => {
    res.json({ success: true, data: orders });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Food Ordering System is running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`\n📋 Available Routes:`);
    console.log(`   Home: http://localhost:${PORT}/`);
    console.log(`   Menu Items: http://localhost:${PORT}/menu-items`);
    console.log(`   Orders: http://localhost:${PORT}/orders`);
    console.log(`   API: http://localhost:${PORT}/api/menu-items`);
    console.log(`\n✨ Press Ctrl+C to stop the server\n`);
});
