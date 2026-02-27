# Lab Manual: Online Food Ordering System
## Web Development Course - Undergraduate Level

---

## Course Information
- **Project Title**: Online Food Ordering System
- **Duration**: 4 Phases (8-10 weeks)
- **Prerequisites**: Basic HTML, CSS, JavaScript, Database concepts
- **Difficulty Level**: Intermediate

---

## Project Overview

You will build a complete Online Food Ordering System using an MVC framework of your choice. This project emphasizes:
- Model-View-Controller architecture
- Automated scaffolding and view generation
- Responsive web design with Bootstrap
- RESTful API design principles
- Proper HTTP method usage and URI design

---

## Learning Objectives

By completing this project, you will:
1. Understand MVC architecture and automated scaffolding
2. Implement responsive layouts using Bootstrap's grid system
3. Design RESTful APIs following industry standards
4. Apply correct HTTP methods for different operations
5. Create hierarchical and resource-based URI structures
6. Understand REST principles: Statelessness and Idempotency

---

## Framework Selection

Choose ONE of the following MVC frameworks:
- **Laravel** (PHP) - Recommended for beginners
- **Django** (Python) - Good for rapid development
- **ASP.NET Core** (C#) - Enterprise-level framework
- **Ruby on Rails** (Ruby) - Convention over configuration
- **Express.js with MVC structure** (Node.js) - JavaScript full-stack

---

## System Requirements

### Functional Requirements
1. Menu Management (Admin)
   - Add, view, update, delete menu items
   - Categories: Appetizers, Main Course, Desserts, Beverages
   - Menu item details: name, description, price, image, availability status

2. Order Management (Customer)
   - Browse menu items
   - Add items to cart
   - Place orders
   - View order history
   - Track order status

3. User Roles
   - Admin: Full CRUD access to menu items
   - Customer: Browse menu, place orders, view own orders

### Non-Functional Requirements
- Responsive design (mobile, tablet, desktop)
- Clean and intuitive user interface
- Fast page load times
- Secure data handling

---

# PHASE 1: Models & View Generators (Scaffolding)
**Duration**: Week 1-2 | **Weight**: 25%

## Objectives
- Set up MVC framework
- Create database models
- Generate CRUD views automatically
- Understand scaffolding benefits

## Step-by-Step Instructions

### Step 1.1: Framework Setup

#### For Laravel Users:
```bash
composer create-project laravel/laravel food-ordering-system
cd food-ordering-system
php artisan serve
```

#### For Django Users:
```bash
django-admin startproject food_ordering_system
cd food_ordering_system
python manage.py startapp orders
python manage.py runserver
```

#### For ASP.NET Core Users:
```bash
dotnet new mvc -n FoodOrderingSystem
cd FoodOrderingSystem
dotnet run
```

### Step 1.2: Database Configuration

Configure your database connection in the framework's configuration file:
- Laravel: `.env` file
- Django: `settings.py`
- ASP.NET Core: `appsettings.json`

**Recommended**: Use SQLite for development, MySQL/PostgreSQL for production.

### Step 1.3: Create MenuItem Model

#### Laravel Example:
```bash
php artisan make:model MenuItem -m
```

Edit `app/Models/MenuItem.php`:
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'image_url',
        'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean'
    ];
}
```

Edit migration file `database/migrations/xxxx_create_menu_items_table.php`:
```php
public function up()
{
    Schema::create('menu_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description');
        $table->string('category');
        $table->decimal('price', 8, 2);
        $table->string('image_url')->nullable();
        $table->boolean('is_available')->default(true);
        $table->timestamps();
    });
}
```

#### Django Example:

Edit `orders/models.py`:
```python
from django.db import models

class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('appetizer', 'Appetizer'),
        ('main', 'Main Course'),
        ('dessert', 'Dessert'),
        ('beverage', 'Beverage'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image_url = models.URLField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
```

Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 1.4: Create Order Model

#### Laravel Example:
```bash
php artisan make:model Order -m
```

Edit `app/Models/Order.php`:
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'delivery_address',
        'total_amount',
        'status'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

Edit migration file:
```php
public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('customer_name');
        $table->string('customer_email');
        $table->string('customer_phone');
        $table->text('delivery_address');
        $table->decimal('total_amount', 10, 2);
        $table->enum('status', ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])->default('pending');
        $table->timestamps();
    });

    Schema::create('order_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained()->onDelete('cascade');
        $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
        $table->integer('quantity');
        $table->decimal('price', 8, 2);
        $table->timestamps();
    });
}
```

Run migrations:
```bash
php artisan migrate
```

#### Django Example:

Add to `orders/models.py`:
```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    delivery_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"
```

### Step 1.5: Generate CRUD Views (Scaffolding)

#### Laravel - Using Resource Controllers:
```bash
php artisan make:controller MenuItemController --resource
php artisan make:controller OrderController --resource
```

Add routes in `routes/web.php`:
```php
Route::resource('menu-items', MenuItemController::class);
Route::resource('orders', OrderController::class);
```

Create basic views in `resources/views/menu-items/`:
- `index.blade.php` (List all items)
- `create.blade.php` (Create form)
- `edit.blade.php` (Edit form)
- `show.blade.php` (View single item)

#### Django - Using Generic Views:

Create `orders/views.py`:
```python
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from .models import MenuItem, Order

class MenuItemListView(ListView):
    model = MenuItem
    template_name = 'menu_items/index.html'
    context_object_name = 'menu_items'

class MenuItemCreateView(CreateView):
    model = MenuItem
    template_name = 'menu_items/create.html'
    fields = ['name', 'description', 'category', 'price', 'image_url', 'is_available']
    success_url = reverse_lazy('menuitem-list')

class MenuItemUpdateView(UpdateView):
    model = MenuItem
    template_name = 'menu_items/edit.html'
    fields = ['name', 'description', 'category', 'price', 'image_url', 'is_available']
    success_url = reverse_lazy('menuitem-list')

class MenuItemDeleteView(DeleteView):
    model = MenuItem
    template_name = 'menu_items/delete.html'
    success_url = reverse_lazy('menuitem-list')

class MenuItemDetailView(DetailView):
    model = MenuItem
    template_name = 'menu_items/show.html'
    context_object_name = 'menu_item'
```

Add URLs in `orders/urls.py`:
```python
from django.urls import path
from . import views

urlpatterns = [
    path('menu-items/', views.MenuItemListView.as_view(), name='menuitem-list'),
    path('menu-items/create/', views.MenuItemCreateView.as_view(), name='menuitem-create'),
    path('menu-items/<int:pk>/', views.MenuItemDetailView.as_view(), name='menuitem-detail'),
    path('menu-items/<int:pk>/edit/', views.MenuItemUpdateView.as_view(), name='menuitem-edit'),
    path('menu-items/<int:pk>/delete/', views.MenuItemDeleteView.as_view(), name='menuitem-delete'),
]
```

### Step 1.6: Create Plain HTML Templates

Create basic HTML templates WITHOUT Bootstrap (you'll add Bootstrap in Phase 2).

#### Example: `index.blade.php` (Laravel) or `index.html` (Django)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Menu Items</title>
</head>
<body>
    <h1>Menu Items</h1>
    <a href="/menu-items/create">Add New Item</a>
    
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <!-- Loop through menu items -->
            <tr>
                <td>1</td>
                <td>Pizza</td>
                <td>Main Course</td>
                <td>$12.99</td>
                <td>Yes</td>
                <td>
                    <a href="/menu-items/1">View</a>
                    <a href="/menu-items/1/edit">Edit</a>
                    <form action="/menu-items/1" method="POST" style="display:inline;">
                        <input type="hidden" name="_method" value="DELETE">
                        <button type="submit">Delete</button>
                    </form>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
```

#### Example: `create.blade.php` (Laravel) or `create.html` (Django)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Add Menu Item</title>
</head>
<body>
    <h1>Add New Menu Item</h1>
    
    <form action="/menu-items" method="POST">
        <label>Name:</label>
        <input type="text" name="name" required><br><br>
        
        <label>Description:</label>
        <textarea name="description" required></textarea><br><br>
        
        <label>Category:</label>
        <select name="category" required>
            <option value="appetizer">Appetizer</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
        </select><br><br>
        
        <label>Price:</label>
        <input type="number" name="price" step="0.01" required><br><br>
        
        <label>Image URL:</label>
        <input type="url" name="image_url"><br><br>
        
        <label>Available:</label>
        <input type="checkbox" name="is_available" checked><br><br>
        
        <button type="submit">Create</button>
        <a href="/menu-items">Cancel</a>
    </form>
</body>
</html>
```

## Phase 1 Deliverables

Submit the following:

1. **Source Code** (GitHub repository link)
   - Models with proper relationships
   - Controllers with CRUD operations
   - Plain HTML views (no Bootstrap yet)

2. **Database Schema Document** (PDF)
   - ER diagram showing relationships
   - Table structures with data types
   - Explanation of foreign keys

3. **Screenshots** (PDF)
   - List view of menu items
   - Create form
   - Edit form
   - Delete confirmation
   - Similar screenshots for Orders

4. **Reflection Report** (1-2 pages)
   - Explain the benefits of using scaffolding
   - Compare your chosen framework's scaffolding with others
   - Challenges faced and solutions

## Phase 1 Grading Rubric (25 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Models | 8 | Correct attributes, relationships, validations |
| Controllers | 7 | All CRUD operations working |
| Views | 5 | All required templates created |
| Database | 3 | Proper migrations, schema design |
| Documentation | 2 | Clear, complete documentation |

---

# PHASE 2: Bootstrap Integration
**Duration**: Week 3-4 | **Weight**: 25%

## Objectives
- Integrate Bootstrap framework
- Implement 12-column grid system
- Create responsive layouts
- Use Bootstrap components (Cards, Navbar, Forms, Buttons)

## Step-by-Step Instructions

### Step 2.1: Add Bootstrap to Your Project

Add Bootstrap CDN to your layout file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Ordering System</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="/css/custom.css" rel="stylesheet">
</head>
<body>
    <!-- Content -->
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### Step 2.2: Create Navigation Bar

Create a responsive navbar with Bootstrap:

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="/">
            <img src="/images/logo.png" alt="Logo" height="30">
            Food Ordering System
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/menu-items">Menu</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/orders">Orders</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/cart">
                        <i class="bi bi-cart"></i> Cart (0)
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

### Step 2.3: Implement 12-Column Grid System

Redesign your menu items list using Bootstrap grid:

```html
<div class="container mt-4">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Our Menu</h1>
        </div>
        <div class="col-md-4 text-end">
            <a href="/menu-items/create" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Add New Item
            </a>
        </div>
    </div>
    
    <!-- Filter Section -->
    <div class="row mb-4">
        <div class="col-md-3">
            <select class="form-select" id="categoryFilter">
                <option value="">All Categories</option>
                <option value="appetizer">Appetizers</option>
                <option value="main">Main Course</option>
                <option value="dessert">Desserts</option>
                <option value="beverage">Beverages</option>
            </select>
        </div>
        <div class="col-md-6">
            <input type="text" class="form-control" placeholder="Search menu items...">
        </div>
        <div class="col-md-3">
            <select class="form-select">
                <option>Sort by: Name</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
            </select>
        </div>
    </div>
    
    <!-- Menu Items Grid -->
    <div class="row">
        <!-- Each item takes 4 columns on medium+ screens, 6 on small, 12 on extra small -->
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <!-- Card content here -->
        </div>
    </div>
</div>
```

### Step 2.4: Use Bootstrap Cards for Menu Items

Replace plain HTML with Bootstrap cards:

```html
<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div class="card h-100 shadow-sm">
        <img src="{{ menu_item.image_url }}" class="card-img-top" alt="{{ menu_item.name }}" style="height: 200px; object-fit: cover;">
        
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ menu_item.name }}</h5>
            <p class="card-text text-muted small">{{ menu_item.description }}</p>
            
            <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-secondary">{{ menu_item.category }}</span>
                    <h4 class="text-primary mb-0">${{ menu_item.price }}</h4>
                </div>
                
                {% if menu_item.is_available %}
                    <span class="badge bg-success">Available</span>
                {% else %}
                    <span class="badge bg-danger">Out of Stock</span>
                {% endif %}
            </div>
        </div>
        
        <div class="card-footer bg-transparent">
            <div class="btn-group w-100" role="group">
                <a href="/menu-items/{{ menu_item.id }}" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye"></i> View
                </a>
                <a href="/menu-items/{{ menu_item.id }}/edit" class="btn btn-sm btn-outline-warning">
                    <i class="bi bi-pencil"></i> Edit
                </a>
                <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal{{ menu_item.id }}">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteModal{{ menu_item.id }}" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete "{{ menu_item.name }}"?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <form action="/menu-items/{{ menu_item.id }}" method="POST" style="display:inline;">
                    <input type="hidden" name="_method" value="DELETE">
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </div>
    </div>
</div>
```

### Step 2.5: Style Forms with Bootstrap

Redesign your create/edit forms:

```html
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h3 class="mb-0">Add New Menu Item</h3>
                </div>
                <div class="card-body">
                    <form action="/menu-items" method="POST" enctype="multipart/form-data">
                        
                        <div class="mb-3">
                            <label for="name" class="form-label">Item Name *</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="description" class="form-label">Description *</label>
                            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="category" class="form-label">Category *</label>
                                <select class="form-select" id="category" name="category" required>
                                    <option value="">Choose...</option>
                                    <option value="appetizer">Appetizer</option>
                                    <option value="main">Main Course</option>
                                    <option value="dessert">Dessert</option>
                                    <option value="beverage">Beverage</option>
                                </select>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label for="price" class="form-label">Price ($) *</label>
                                <input type="number" class="form-control" id="price" name="price" step="0.01" min="0" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="image" class="form-label">Upload Image</label>
                            <input type="file" class="form-control" id="image" name="image" accept="image/*">
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="is_available" name="is_available" checked>
                            <label class="form-check-label" for="is_available">
                                Available for ordering
                            </label>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <a href="/menu-items" class="btn btn-secondary">
                                <i class="bi bi-x-circle"></i> Cancel
                            </a>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle"></i> Create Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Step 2.6: Create Responsive Order View

Design the order listing page:

```html
<div class="container mt-4">
    <h1 class="mb-4">Order Management</h1>
    
    <div class="row">
        <!-- Orders List -->
        <div class="col-lg-8">
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><strong>Order #1001</strong></span>
                    <span class="badge bg-warning">Pending</span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Customer:</strong> John Doe</p>
                            <p class="mb-1"><strong>Phone:</strong> (555) 123-4567</p>
                            <p class="mb-1"><strong>Email:</strong> john@example.com</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Order Date:</strong> 2024-01-15</p>
                            <p class="mb-1"><strong>Total:</strong> $45.99</p>
                            <p class="mb-1"><strong>Items:</strong> 3</p>
                        </div>
                    </div>
                    <hr>
                    <p class="mb-2"><strong>Delivery Address:</strong></p>
                    <p class="text-muted">123 Main St, Apt 4B, New York, NY 10001</p>
                </div>
                <div class="card-footer">
                    <div class="btn-group" role="group">
                        <a href="/orders/1" class="btn btn-sm btn-primary">View Details</a>
                        <button class="btn btn-sm btn-success">Confirm</button>
                        <button class="btn btn-sm btn-danger">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Order Statistics Sidebar -->
        <div class="col-lg-4">
            <div class="card bg-light">
                <div class="card-body">
                    <h5 class="card-title">Order Statistics</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Pending</span>
                            <span class="badge bg-warning">5</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Confirmed</span>
                            <span class="badge bg-info">3</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Preparing</span>
                            <span class="badge bg-primary">2</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Delivered</span>
                            <span class="badge bg-success">45</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Step 2.7: Add Custom CSS

Create `public/css/custom.css`:

```css
/* Custom styles to enhance Bootstrap */

:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
}

.navbar-brand {
    font-weight: bold;
    font-size: 1.5rem;
}

.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: #ff5252;
    border-color: #ff5252;
}

.text-primary {
    color: var(--primary-color) !important;
}

.bg-primary {
    background-color: var(--primary-color) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-img-top {
        height: 150px !important;
    }
    
    h1 {
        font-size: 1.75rem;
    }
}
```

## Phase 2 Deliverables

Submit the following:

1. **Updated Source Code** (GitHub repository)
   - All views redesigned with Bootstrap
   - Responsive layouts implemented
   - Custom CSS file

2. **Responsive Design Report** (PDF, 2-3 pages)
   - Screenshots at 3 breakpoints: Mobile (375px), Tablet (768px), Desktop (1200px)
   - Explanation of grid system usage
   - List of Bootstrap components used

3. **Component Documentation** (PDF)
   - Document each Bootstrap component used
   - Explain why you chose specific components
   - Show before/after comparisons

4. **Video Demo** (3-5 minutes)
   - Demonstrate responsive behavior
   - Show all pages on different screen sizes
   - Highlight key Bootstrap features

## Phase 2 Grading Rubric (25 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Grid System | 6 | Proper use of 12-column grid, responsive breakpoints |
| Cards | 5 | Menu items displayed in cards with proper styling |
| Navbar | 4 | Responsive navbar with all required links |
| Forms | 5 | All forms styled with Bootstrap classes |
| Responsiveness | 3 | Works well on mobile, tablet, desktop |
| Documentation | 2 | Clear screenshots and explanations |

---

# PHASE 3: REST Principles & HTTP Method Selection
**Duration**: Week 5-6 | **Weight**: 25%

## Objectives
- Understand REST architectural principles
- Implement proper HTTP methods (GET, POST, PUT, DELETE)
- Apply statelessness principle
- Identify idempotent operations
- Document API design decisions

## REST Principles Overview

### 1. Statelessness
Each request must contain all information needed to process it. The server should not store client context between requests.

**Implementation**: Use tokens (JWT, API keys) passed in headers for authentication.

### 2. Idempotency
An operation is idempotent if calling it multiple times produces the same result as calling it once.

- **Idempotent**: GET, PUT, DELETE
- **Non-Idempotent**: POST

## Step-by-Step Instructions

### Step 3.1: Create API Routes

Separate your web routes from API routes.

#### Laravel Example:

Create `routes/api.php`:
```php
<?php
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;

// Menu Items API
Route::get('/menu-items', [MenuItemController::class, 'index']);           // GET - List all
Route::post('/menu-items', [MenuItemController::class, 'store']);          // POST - Create
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);       // GET - Show one
Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);     // PUT - Update
Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']); // DELETE - Remove

// Orders API
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

// Nested routes for order items
Route::get('/orders/{orderId}/items', [OrderController::class, 'getItems']);
Route::post('/orders/{orderId}/items', [OrderController::class, 'addItem']);
```

#### Django Example:

Create `orders/api_urls.py`:
```python
from django.urls import path
from .api_views import MenuItemAPIView, OrderAPIView

urlpatterns = [
    # Menu Items API
    path('menu-items/', MenuItemAPIView.as_view(), name='api-menuitem-list'),
    path('menu-items/<int:pk>/', MenuItemAPIView.as_view(), name='api-menuitem-detail'),
    
    # Orders API
    path('orders/', OrderAPIView.as_view(), name='api-order-list'),
    path('orders/<int:pk>/', OrderAPIView.as_view(), name='api-order-detail'),
    path('orders/<int:order_id>/items/', OrderItemAPIView.as_view(), name='api-orderitem-list'),
]
```

### Step 3.2: Implement HTTP Methods Correctly

#### GET - Retrieve Resources (Idempotent, Safe)

```php
// Laravel Controller
public function index(Request $request)
{
    // Stateless: No session data used
    $menuItems = MenuItem::where('is_available', true)->get();
    
    return response()->json([
        'success' => true,
        'data' => $menuItems
    ], 200);
}

public function show($id)
{
    $menuItem = MenuItem::find($id);
    
    if (!$menuItem) {
        return response()->json([
            'success' => false,
            'message' => 'Menu item not found'
        ], 404);
    }
    
    return response()->json([
        'success' => true,
        'data' => $menuItem
    ], 200);
}
```

#### POST - Create New Resources (Non-Idempotent)

```php
public function store(Request $request)
{
    // Validate input
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'category' => 'required|in:appetizer,main,dessert,beverage',
        'price' => 'required|numeric|min:0',
        'image_url' => 'nullable|url',
        'is_available' => 'boolean'
    ]);
    
    // Create new resource
    $menuItem = MenuItem::create($validated);
    
    return response()->json([
        'success' => true,
        'message' => 'Menu item created successfully',
        'data' => $menuItem
    ], 201); // 201 Created
}
```

#### PUT - Update Existing Resources (Idempotent)

```php
public function update(Request $request, $id)
{
    $menuItem = MenuItem::find($id);
    
    if (!$menuItem) {
        return response()->json([
            'success' => false,
            'message' => 'Menu item not found'
        ], 404);
    }
    
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'category' => 'required|in:appetizer,main,dessert,beverage',
        'price' => 'required|numeric|min:0',
        'image_url' => 'nullable|url',
        'is_available' => 'boolean'
    ]);
    
    // Update resource - calling multiple times with same data produces same result
    $menuItem->update($validated);
    
    return response()->json([
        'success' => true,
        'message' => 'Menu item updated successfully',
        'data' => $menuItem
    ], 200);
}
```

#### DELETE - Remove Resources (Idempotent)

```php
public function destroy($id)
{
    $menuItem = MenuItem::find($id);
    
    if (!$menuItem) {
        return response()->json([
            'success' => false,
            'message' => 'Menu item not found'
        ], 404);
    }
    
    // Delete resource - calling multiple times has same effect (resource is gone)
    $menuItem->delete();
    
    return response()->json([
        'success' => true,
        'message' => 'Menu item deleted successfully'
    ], 200);
}
```

### Step 3.3: Implement Statelessness with Authentication

Create a simple token-based authentication system:

#### Laravel - API Token Authentication

```php
// Create middleware for API authentication
// app/Http/Middleware/ApiAuthentication.php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiAuthentication
{
    public function handle(Request $request, Closure $next)
    {
        // Get token from header
        $token = $request->header('Authorization');
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization token required'
            ], 401);
        }
        
        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);
        
        // Validate token (simplified - use JWT in production)
        $user = \App\Models\User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token'
            ], 401);
        }
        
        // Attach user to request (stateless - no session)
        $request->merge(['authenticated_user' => $user]);
        
        return $next($request);
    }
}
```

Apply middleware to protected routes:
```php
// routes/api.php
Route::middleware('api.auth')->group(function () {
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);
    
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
});

// Public routes (no authentication)
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);
```

### Step 3.4: Test API with Postman/Insomnia

Create a collection of API requests:

#### Example: GET Request
```
GET http://localhost:8000/api/menu-items
Headers:
  Accept: application/json
```

#### Example: POST Request (with authentication)
```
POST http://localhost:8000/api/menu-items
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer your-api-token-here

Body (JSON):
{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato, mozzarella, and basil",
    "category": "main",
    "price": 12.99,
    "image_url": "https://example.com/pizza.jpg",
    "is_available": true
}
```

#### Example: PUT Request
```
PUT http://localhost:8000/api/menu-items/1
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer your-api-token-here

Body (JSON):
{
    "name": "Margherita Pizza (Updated)",
    "description": "Classic Italian pizza",
    "category": "main",
    "price": 13.99,
    "image_url": "https://example.com/pizza.jpg",
    "is_available": true
}
```

#### Example: DELETE Request
```
DELETE http://localhost:8000/api/menu-items/1
Headers:
  Accept: application/json
  Authorization: Bearer your-api-token-here
```

### Step 3.5: Document REST Principles Implementation

Create a document explaining your implementation:

## REST Principles Documentation Template

### 1. Statelessness Implementation

**Explanation**: 
Our API is stateless because each request contains all necessary information to process it. We do not rely on server-side sessions.

**Implementation Details**:
- Authentication: We use API tokens passed in the `Authorization` header
- No session storage: User context is derived from the token on each request
- Self-contained requests: All required data is included in request body/parameters

**Example**:
```
Request 1: GET /api/orders
Header: Authorization: Bearer abc123token

Request 2: GET /api/orders
Header: Authorization: Bearer abc123token

Both requests are independent. The server doesn't remember Request 1 when processing Request 2.
```

### 2. Idempotency Analysis

| HTTP Method | Endpoint | Idempotent? | Explanation |
|-------------|----------|-------------|-------------|
| GET | /api/menu-items | ✅ Yes | Reading data multiple times doesn't change server state |
| GET | /api/menu-items/{id} | ✅ Yes | Same as above |
| POST | /api/menu-items | ❌ No | Creates a new resource each time; multiple calls create multiple items |
| PUT | /api/menu-items/{id} | ✅ Yes | Updating with same data multiple times results in same final state |
| DELETE | /api/menu-items/{id} | ✅ Yes | First call deletes item, subsequent calls result in same state (item is gone) |
| GET | /api/orders | ✅ Yes | Safe operation, no state change |
| POST | /api/orders | ❌ No | Each call creates a new order |
| PUT | /api/orders/{id} | ✅ Yes | Multiple updates with same data produce same result |
| DELETE | /api/orders/{id} | ✅ Yes | Resource is deleted; subsequent calls have same effect |
| POST | /api/orders/{id}/items | ❌ No | Adds item to order each time called |

### 3. HTTP Status Codes Used

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 OK | Success | GET, PUT, DELETE successful |
| 201 Created | Resource created | POST successful |
| 400 Bad Request | Invalid input | Validation fails |
| 401 Unauthorized | Authentication failed | Missing/invalid token |
| 404 Not Found | Resource doesn't exist | Invalid ID |
| 500 Internal Server Error | Server error | Unexpected errors |

### 4. Request/Response Examples

**Successful GET Request**:
```json
Response (200 OK):
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Margherita Pizza",
            "category": "main",
            "price": 12.99,
            "is_available": true
        }
    ]
}
```

**Failed POST Request (Validation Error)**:
```json
Response (400 Bad Request):
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "price": ["The price field is required"],
        "category": ["The selected category is invalid"]
    }
}
```

## Phase 3 Deliverables

Submit the following:

1. **API Implementation** (GitHub repository)
   - All API routes implemented
   - Proper HTTP methods used
   - Authentication middleware

2. **REST Principles Documentation** (PDF, 3-4 pages)
   - Statelessness explanation with examples
   - Idempotency analysis table (as shown above)
   - HTTP status codes documentation
   - Request/response examples

3. **Postman/Insomnia Collection** (JSON export)
   - All API endpoints
   - Sample requests with proper headers
   - Test cases for success and error scenarios

4. **API Testing Report** (PDF, 2 pages)
   - Screenshots of successful requests
   - Screenshots of error handling
   - Explanation of how you tested idempotency

## Phase 3 Grading Rubric (25 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| HTTP Methods | 6 | Correct use of GET, POST, PUT, DELETE |
| Statelessness | 6 | Token-based auth, no session dependency |
| Idempotency | 5 | Correct identification and implementation |
| Documentation | 5 | Clear explanations with examples |
| API Testing | 3 | Complete Postman collection, test results |

---

# PHASE 4: Resource & URI Design
**Duration**: Week 7-8 | **Weight**: 25%

## Objectives
- Design RESTful URI structures
- Use plural nouns for resources
- Implement hierarchical relationships
- Follow REST naming conventions
- Create comprehensive API documentation

## REST URI Design Principles

### Rules:
1. **Use nouns, not verbs**: `/menu-items` not `/getMenuItems`
2. **Use plural nouns**: `/orders` not `/order`
3. **Use hyphens for readability**: `/menu-items` not `/menuitems`
4. **Lowercase letters**: `/menu-items` not `/MenuItems`
5. **Show hierarchy**: `/orders/5/items` not `/order-items?order_id=5`
6. **No trailing slashes**: `/orders` not `/orders/`
7. **Use query parameters for filtering**: `/menu-items?category=main&available=true`

## Step-by-Step Instructions

### Step 4.1: Design Resource Hierarchy

Identify your resources and their relationships:

```
Resources:
├── menu-items (collection)
│   └── {id} (individual menu item)
│
├── categories (collection)
│   └── {id} (individual category)
│       └── menu-items (nested collection)
│
├── orders (collection)
│   └── {id} (individual order)
│       ├── items (nested collection)
│       └── status (sub-resource)
│
└── customers (collection)
    └── {id} (individual customer)
        └── orders (nested collection)
```

### Step 4.2: Complete API Endpoint List

Create a comprehensive list of all endpoints:

## Menu Items Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/menu-items` | List all menu items | None | Array of menu items |
| GET | `/api/menu-items?category=main` | Filter by category | None | Filtered array |
| GET | `/api/menu-items?available=true` | Filter by availability | None | Filtered array |
| GET | `/api/menu-items?sort=price&order=asc` | Sort by price | None | Sorted array |
| GET | `/api/menu-items/{id}` | Get single menu item | None | Single menu item |
| POST | `/api/menu-items` | Create new menu item | MenuItem object | Created item (201) |
| PUT | `/api/menu-items/{id}` | Update menu item | MenuItem object | Updated item (200) |
| PATCH | `/api/menu-items/{id}` | Partial update | Partial object | Updated item (200) |
| DELETE | `/api/menu-items/{id}` | Delete menu item | None | Success message (200) |

## Categories Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/categories` | List all categories | None | Array of categories |
| GET | `/api/categories/{id}` | Get single category | None | Single category |
| GET | `/api/categories/{id}/menu-items` | Get items in category | None | Array of menu items |
| POST | `/api/categories` | Create category | Category object | Created category (201) |
| PUT | `/api/categories/{id}` | Update category | Category object | Updated category (200) |
| DELETE | `/api/categories/{id}` | Delete category | None | Success message (200) |

## Orders Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/orders` | List all orders | None | Array of orders |
| GET | `/api/orders?status=pending` | Filter by status | None | Filtered array |
| GET | `/api/orders?date=2024-01-15` | Filter by date | None | Filtered array |
| GET | `/api/orders/{id}` | Get single order | None | Single order with items |
| POST | `/api/orders` | Create new order | Order object | Created order (201) |
| PUT | `/api/orders/{id}` | Update order | Order object | Updated order (200) |
| PATCH | `/api/orders/{id}/status` | Update order status | {status: "confirmed"} | Updated order (200) |
| DELETE | `/api/orders/{id}` | Cancel order | None | Success message (200) |

## Order Items Endpoints (Nested Resources)

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/orders/{orderId}/items` | List items in order | None | Array of order items |
| GET | `/api/orders/{orderId}/items/{itemId}` | Get specific item | None | Single order item |
| POST | `/api/orders/{orderId}/items` | Add item to order | OrderItem object | Created item (201) |
| PUT | `/api/orders/{orderId}/items/{itemId}` | Update item quantity | {quantity: 3} | Updated item (200) |
| DELETE | `/api/orders/{orderId}/items/{itemId}` | Remove item from order | None | Success message (200) |

## Customers Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/customers` | List all customers | None | Array of customers |
| GET | `/api/customers/{id}` | Get single customer | None | Single customer |
| GET | `/api/customers/{id}/orders` | Get customer's orders | None | Array of orders |
| GET | `/api/customers/{id}/orders?status=delivered` | Filter customer orders | None | Filtered array |
| POST | `/api/customers` | Create customer | Customer object | Created customer (201) |
| PUT | `/api/customers/{id}` | Update customer | Customer object | Updated customer (200) |
| DELETE | `/api/customers/{id}` | Delete customer | None | Success message (200) |

### Step 4.3: Implement Hierarchical Routes

#### Laravel Implementation:

```php
// routes/api.php
<?php

use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CustomerController;

// Menu Items
Route::apiResource('menu-items', MenuItemController::class);

// Categories with nested menu items
Route::apiResource('categories', CategoryController::class);
Route::get('categories/{categoryId}/menu-items', [CategoryController::class, 'getMenuItems']);

// Orders with nested items
Route::apiResource('orders', OrderController::class);
Route::patch('orders/{orderId}/status', [OrderController::class, 'updateStatus']);

// Nested route: Order Items
Route::get('orders/{orderId}/items', [OrderController::class, 'getItems']);
Route::post('orders/{orderId}/items', [OrderController::class, 'addItem']);
Route::get('orders/{orderId}/items/{itemId}', [OrderController::class, 'getItem']);
Route::put('orders/{orderId}/items/{itemId}', [OrderController::class, 'updateItem']);
Route::delete('orders/{orderId}/items/{itemId}', [OrderController::class, 'removeItem']);

// Customers with nested orders
Route::apiResource('customers', CustomerController::class);
Route::get('customers/{customerId}/orders', [CustomerController::class, 'getOrders']);
```

#### Controller Implementation Example:

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // GET /api/orders/{orderId}/items
    public function getItems($orderId)
    {
        $order = Order::find($orderId);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
        
        $items = $order->orderItems()->with('menuItem')->get();
        
        return response()->json([
            'success' => true,
            'data' => $items
        ], 200);
    }
    
    // POST /api/orders/{orderId}/items
    public function addItem(Request $request, $orderId)
    {
        $order = Order::find($orderId);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
        
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'required|integer|min:1'
        ]);
        
        // Get menu item price
        $menuItem = \App\Models\MenuItem::find($validated['menu_item_id']);
        
        $orderItem = OrderItem::create([
            'order_id' => $orderId,
            'menu_item_id' => $validated['menu_item_id'],
            'quantity' => $validated['quantity'],
            'price' => $menuItem->price
        ]);
        
        // Update order total
        $order->total_amount += ($menuItem->price * $validated['quantity']);
        $order->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Item added to order',
            'data' => $orderItem
        ], 201);
    }
    
    // DELETE /api/orders/{orderId}/items/{itemId}
    public function removeItem($orderId, $itemId)
    {
        $order = Order::find($orderId);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
        
        $orderItem = OrderItem::where('order_id', $orderId)
                              ->where('id', $itemId)
                              ->first();
        
        if (!$orderItem) {
            return response()->json([
                'success' => false,
                'message' => 'Order item not found'
            ], 404);
        }
        
        // Update order total
        $order->total_amount -= ($orderItem->price * $orderItem->quantity);
        $order->save();
        
        $orderItem->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Item removed from order'
        ], 200);
    }
}
```

### Step 4.4: Implement Query Parameters for Filtering

Add filtering, sorting, and pagination:

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::query();
        
        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        // Filter by availability
        if ($request->has('available')) {
            $available = filter_var($request->available, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_available', $available);
        }
        
        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }
        
        // Sorting
        $sortBy = $request->get('sort', 'id');
        $order = $request->get('order', 'asc');
        
        if (in_array($sortBy, ['id', 'name', 'price', 'created_at'])) {
            $query->orderBy($sortBy, $order);
        }
        
        // Pagination
        $perPage = $request->get('per_page', 15);
        $menuItems = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $menuItems->items(),
            'pagination' => [
                'total' => $menuItems->total(),
                'per_page' => $menuItems->perPage(),
                'current_page' => $menuItems->currentPage(),
                'last_page' => $menuItems->lastPage(),
                'from' => $menuItems->firstItem(),
                'to' => $menuItems->lastItem()
            ]
        ], 200);
    }
}
```

### Example API Calls with Query Parameters:

```
GET /api/menu-items?category=main
GET /api/menu-items?available=true
GET /api/menu-items?min_price=10&max_price=20
GET /api/menu-items?search=pizza
GET /api/menu-items?sort=price&order=desc
GET /api/menu-items?category=main&available=true&sort=price&order=asc
GET /api/menu-items?page=2&per_page=10
```

### Step 4.5: URI Design Validation Checklist

Review your URIs against these criteria:

✅ **Correct Examples**:
- `/api/menu-items` - Plural noun
- `/api/orders/5/items` - Hierarchical structure
- `/api/customers/10/orders` - Shows relationship
- `/api/menu-items?category=main` - Query parameters for filtering

❌ **Incorrect Examples**:
- `/api/getMenuItems` - Uses verb
- `/api/menu-item` - Singular noun
- `/api/MenuItems` - Uppercase letters
- `/api/order-items?order_id=5` - Should use hierarchy instead
- `/api/orders/5/items/` - Trailing slash
- `/api/orders/delete/5` - Verb in URI (use DELETE method instead)

### Step 4.6: Create API Documentation

Create comprehensive API documentation using the template below:

## API Documentation Template

### Base URL
```
http://localhost:8000/api
```

### Authentication
All endpoints except public menu viewing require authentication.

**Header**:
```
Authorization: Bearer {your-api-token}
```

---

### Menu Items

#### List All Menu Items
```
GET /menu-items
```

**Query Parameters**:
- `category` (string, optional): Filter by category (appetizer, main, dessert, beverage)
- `available` (boolean, optional): Filter by availability
- `min_price` (decimal, optional): Minimum price
- `max_price` (decimal, optional): Maximum price
- `search` (string, optional): Search by name
- `sort` (string, optional): Sort field (id, name, price, created_at)
- `order` (string, optional): Sort order (asc, desc)
- `page` (integer, optional): Page number
- `per_page` (integer, optional): Items per page (default: 15)

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Margherita Pizza",
            "description": "Classic pizza with tomato and mozzarella",
            "category": "main",
            "price": 12.99,
            "image_url": "https://example.com/pizza.jpg",
            "is_available": true,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ],
    "pagination": {
        "total": 50,
        "per_page": 15,
        "current_page": 1,
        "last_page": 4,
        "from": 1,
        "to": 15
    }
}
```

#### Get Single Menu Item
```
GET /menu-items/{id}
```

**Response (200 OK)**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Margherita Pizza",
        "description": "Classic pizza with tomato and mozzarella",
        "category": "main",
        "price": 12.99,
        "image_url": "https://example.com/pizza.jpg",
        "is_available": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    }
}
```

**Response (404 Not Found)**:
```json
{
    "success": false,
    "message": "Menu item not found"
}
```

#### Create Menu Item
```
POST /menu-items
Authentication: Required
```

**Request Body**:
```json
{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato and mozzarella",
    "category": "main",
    "price": 12.99,
    "image_url": "https://example.com/pizza.jpg",
    "is_available": true
}
```

**Response (201 Created)**:
```json
{
    "success": true,
    "message": "Menu item created successfully",
    "data": {
        "id": 1,
        "name": "Margherita Pizza",
        "description": "Classic pizza with tomato and mozzarella",
        "category": "main",
        "price": 12.99,
        "image_url": "https://example.com/pizza.jpg",
        "is_available": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    }
}
```

---

### Orders

#### Create Order
```
POST /orders
Authentication: Required
```

**Request Body**:
```json
{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "(555) 123-4567",
    "delivery_address": "123 Main St, Apt 4B, New York, NY 10001",
    "items": [
        {
            "menu_item_id": 1,
            "quantity": 2
        },
        {
            "menu_item_id": 5,
            "quantity": 1
        }
    ]
}
```

**Response (201 Created)**:
```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "id": 1001,
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "(555) 123-4567",
        "delivery_address": "123 Main St, Apt 4B, New York, NY 10001",
        "total_amount": 38.97,
        "status": "pending",
        "created_at": "2024-01-15T14:30:00Z",
        "items": [
            {
                "id": 1,
                "menu_item_id": 1,
                "menu_item_name": "Margherita Pizza",
                "quantity": 2,
                "price": 12.99
            },
            {
                "id": 2,
                "menu_item_id": 5,
                "menu_item_name": "Caesar Salad",
                "quantity": 1,
                "price": 12.99
            }
        ]
    }
}
```

#### Get Order Items
```
GET /orders/{orderId}/items
```

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "order_id": 1001,
            "menu_item_id": 1,
            "menu_item": {
                "id": 1,
                "name": "Margherita Pizza",
                "price": 12.99
            },
            "quantity": 2,
            "price": 12.99,
            "subtotal": 25.98
        }
    ]
}
```

#### Add Item to Order
```
POST /orders/{orderId}/items
Authentication: Required
```

**Request Body**:
```json
{
    "menu_item_id": 3,
    "quantity": 1
}
```

**Response (201 Created)**:
```json
{
    "success": true,
    "message": "Item added to order",
    "data": {
        "id": 3,
        "order_id": 1001,
        "menu_item_id": 3,
        "quantity": 1,
        "price": 8.99
    }
}
```

---

### Customers

#### Get Customer Orders
```
GET /customers/{customerId}/orders
```

**Query Parameters**:
- `status` (string, optional): Filter by order status
- `date` (date, optional): Filter by order date

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1001,
            "customer_name": "John Doe",
            "total_amount": 38.97,
            "status": "delivered",
            "created_at": "2024-01-15T14:30:00Z"
        }
    ]
}
```

## Phase 4 Deliverables

Submit the following:

1. **Complete API Implementation** (GitHub repository)
   - All endpoints implemented
   - Hierarchical routes working
   - Query parameters functional

2. **API Endpoint List** (PDF, 2-3 pages)
   - Complete table of all endpoints
   - HTTP methods clearly specified
   - URI structure following REST conventions

3. **API Documentation** (PDF, 5-7 pages)
   - Base URL and authentication
   - All endpoints documented
   - Request/response examples
   - Query parameters explained
   - Error responses documented

4. **URI Design Justification** (PDF, 2 pages)
   - Explain your URI structure choices
   - Show how you followed REST principles
   - Provide examples of hierarchical relationships
   - Explain use of query parameters vs. path parameters

5. **Postman Collection** (JSON export)
   - Organized by resource
   - All endpoints included
   - Example requests with proper data

## Phase 4 Grading Rubric (25 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| URI Structure | 8 | Plural nouns, no verbs, proper hierarchy |
| Hierarchical Routes | 6 | Nested resources properly implemented |
| Query Parameters | 4 | Filtering, sorting, pagination working |
| Documentation | 5 | Complete, clear API documentation |
| Justification | 2 | Clear explanation of design decisions |

---

# FINAL PROJECT SUBMISSION

## Complete Deliverables Checklist

### Code Repository (GitHub)
- [ ] All source code committed
- [ ] README.md with setup instructions
- [ ] .env.example file
- [ ] Database migrations
- [ ] Seed data (optional but recommended)

### Documentation Package (ZIP file containing PDFs)
- [ ] Phase 1: Database Schema & Reflection Report
- [ ] Phase 2: Responsive Design Report & Component Documentation
- [ ] Phase 3: REST Principles Documentation & API Testing Report
- [ ] Phase 4: API Endpoint List, Documentation & URI Design Justification

### Testing Materials
- [ ] Postman/Insomnia collection (JSON)
- [ ] Video demonstration (3-5 minutes)

### Presentation (Optional - Bonus 5%)
- [ ] 10-minute presentation
- [ ] Live demo of the application
- [ ] Explanation of technical decisions

---

# GRADING SUMMARY

| Phase | Weight | Focus Area |
|-------|--------|------------|
| Phase 1 | 25% | Models, Controllers, Scaffolding |
| Phase 2 | 25% | Bootstrap, Responsive Design |
| Phase 3 | 25% | REST Principles, HTTP Methods |
| Phase 4 | 25% | URI Design, API Documentation |
| **Total** | **100%** | |
| Bonus | +5% | Presentation (Optional) |

---

# ADDITIONAL RESOURCES

## Recommended Tools
- **API Testing**: Postman, Insomnia, Thunder Client
- **Database Management**: phpMyAdmin, MySQL Workbench, DBeaver
- **Version Control**: Git, GitHub
- **Code Editor**: VS Code, PhpStorm, PyCharm
- **Documentation**: Swagger/OpenAPI, Postman Documentation

## Learning Resources
- REST API Tutorial: https://restfulapi.net/
- HTTP Methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- Bootstrap Documentation: https://getbootstrap.com/docs/
- Laravel Documentation: https://laravel.com/docs
- Django REST Framework: https://www.django-rest-framework.org/

## Common Pitfalls to Avoid
1. Using verbs in URIs (e.g., `/getOrders`)
2. Singular resource names (e.g., `/order` instead of `/orders`)
3. Not implementing proper error handling
4. Forgetting to validate input data
5. Not testing idempotency of operations
6. Storing state on the server (violating statelessness)
7. Inconsistent response formats
8. Missing authentication on protected endpoints

---

# SUPPORT & OFFICE HOURS

- **Instructor Office Hours**: [Your schedule]
- **TA Office Hours**: [TA schedule]
- **Discussion Forum**: [Link to forum]
- **Email**: [Your email]

## Submission Deadline
- **Phase 1**: End of Week 2
- **Phase 2**: End of Week 4
- **Phase 3**: End of Week 6
- **Phase 4**: End of Week 8
- **Final Submission**: [Specific date and time]

---

# ACADEMIC INTEGRITY

This is an individual project. You may:
- Discuss concepts with classmates
- Use official framework documentation
- Search for solutions to specific technical problems

You may NOT:
- Copy code from classmates
- Submit code generated entirely by AI tools
- Use complete project templates from the internet

All submissions will be checked for plagiarism.

---

**Good luck with your project! Build something you're proud of!** 🚀
