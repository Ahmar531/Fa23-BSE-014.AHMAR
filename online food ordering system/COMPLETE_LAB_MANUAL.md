```
═══════════════════════════════════════════════════════════════════════════════
                        UNIVERSITY LAB MANUAL
═══════════════════════════════════════════════════════════════════════════════

                    DEPARTMENT OF COMPUTER SCIENCE
                    
                    Course: CS-301 Web Development
                    Lab Title: Advanced Web Application Development
                    
                    PROJECT TITLE:
                    Online Food Ordering System
                    
                    Academic Year: 2024-2025
                    Semester: Spring
                    
═══════════════════════════════════════════════════════════════════════════════
```

---

# LAB MANUAL: ONLINE FOOD ORDERING SYSTEM

**Course Code**: CS-301  
**Course Title**: Web Development  
**Credit Hours**: 3(2+1)  
**Prerequisites**: Data Structures, Database Systems  
**Instructor**: [Instructor Name]  
**Lab Duration**: 8 Weeks (4 Phases)

---

## LEARNING OUTCOMES

Upon successful completion of this lab project, students will be able to:

**LO1**: Understand and implement Model-View-Controller (MVC) architectural pattern  
**LO2**: Utilize framework scaffolding tools for rapid application development  
**LO3**: Design and implement responsive user interfaces using Bootstrap framework  
**LO4**: Apply RESTful architectural principles including statelessness and idempotency  
**LO5**: Design proper resource-based URIs following REST conventions  
**LO6**: Map HTTP methods correctly to CRUD operations  
**LO7**: Implement hierarchical API endpoint structures  
**LO8**: Document API design decisions with technical justification

---

## SUBMISSION INSTRUCTIONS

### Submission Deadline
- **Phase 1**: End of Week 2 (Friday, 11:59 PM)
- **Phase 2**: End of Week 4 (Friday, 11:59 PM)
- **Phase 3**: End of Week 6 (Friday, 11:59 PM)
- **Phase 4**: End of Week 8 (Friday, 11:59 PM)
- **Final Submission**: Week 9 (Complete Package)

### Submission Format
1. **GitHub Repository** (Public or Private with instructor access)
2. **Documentation** (PDF format, professionally formatted)
3. **Video Demonstration** (5-7 minutes, uploaded to YouTube/Drive)
4. **Postman Collection** (JSON export)

### Naming Convention
```
StudentID_Name_Phase#_FoodOrderingSystem
Example: 2024CS001_JohnDoe_Phase1_FoodOrderingSystem.pdf
```

---

## TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Phase 1: Models & View Generators](#phase-1)
3. [Phase 2: Bootstrap Integration](#phase-2)
4. [Phase 3: REST Principles & HTTP Methods](#phase-3)
5. [Phase 4: Resource & URI Design](#phase-4)
6. [Grading Rubric](#grading-rubric)
7. [Common Mistakes](#common-mistakes)
8. [Viva Questions](#viva-questions)
9. [Bonus Challenges](#bonus-challenges)
10. [Submission Checklist](#submission-checklist)

---

# INTRODUCTION

## Overview of MVC Architecture

The Model-View-Controller (MVC) is a software architectural pattern that separates an application into three interconnected components:

### 1. Model (M)
- **Responsibility**: Data and business logic
- **Functions**: 
  - Database interactions
  - Data validation
  - Business rules enforcement
- **Example**: `MenuItem` model handles menu item data and validation

### 2. View (V)
- **Responsibility**: User interface presentation
- **Functions**:
  - Display data to users
  - Collect user input
  - Render HTML/templates
- **Example**: HTML templates showing menu items list

### 3. Controller (C)
- **Responsibility**: Request handling and coordination
- **Functions**:
  - Process user requests
  - Interact with models
  - Select appropriate views
- **Example**: `MenuItemController` handles CRUD operations

### Benefits of MVC
✓ **Separation of Concerns**: Each component has distinct responsibility  
✓ **Maintainability**: Changes in one layer don't affect others  
✓ **Testability**: Components can be tested independently  
✓ **Reusability**: Models can be reused across different views  
✓ **Parallel Development**: Teams can work on different layers simultaneously


## Importance of RESTful Design

REST (Representational State Transfer) is an architectural style for designing networked applications.

### Core Principles

**1. Client-Server Architecture**
- Clear separation between client and server
- Independent evolution of both components

**2. Statelessness** ⭐ CRITICAL
- Server does not store client context
- Each request contains all necessary information
- Authentication via tokens, not sessions

**3. Uniform Interface**
- Consistent API design
- Resource identification through URIs
- Standard HTTP methods

**4. Resource-Based**
- Everything is a resource (menu items, orders)
- Resources identified by URIs
- Resources manipulated through representations (JSON, XML)

**5. Idempotency** ⭐ CRITICAL
- Multiple identical requests have same effect as single request
- GET, PUT, DELETE are idempotent
- POST is NOT idempotent

### Why REST Matters

✓ **Scalability**: Stateless design enables horizontal scaling  
✓ **Simplicity**: Standard HTTP methods are well-understood  
✓ **Flexibility**: Multiple client types (web, mobile, IoT)  
✓ **Visibility**: HTTP methods clearly indicate operation intent  
✓ **Reliability**: Idempotent operations can be safely retried

---

## Role of Frontend Frameworks (Bootstrap)

Bootstrap is the world's most popular front-end framework for building responsive, mobile-first websites.

### Key Features

**1. Grid System**
- 12-column responsive layout
- Flexbox-based
- Mobile-first approach
- Breakpoints: xs, sm, md, lg, xl, xxl

**2. Pre-built Components**
- Navigation bars
- Cards
- Forms
- Buttons
- Modals
- Alerts

**3. Responsive Design**
- Automatically adapts to screen size
- No need for separate mobile version
- Consistent across devices

### Why Bootstrap?

✓ **Rapid Development**: Pre-built components save time  
✓ **Consistency**: Uniform design language  
✓ **Responsive**: Mobile-first by default  
✓ **Browser Compatibility**: Works across all modern browsers  
✓ **Customizable**: Can be themed and extended  
✓ **Community**: Large ecosystem and documentation


---

# PHASE 1: MODELS & VIEW GENERATORS (SCAFFOLDING)

**Duration**: Week 1-2  
**Weight**: 25%  
**Learning Outcome**: LO1, LO2

---

## OBJECTIVES

By the end of Phase 1, students will:
1. Set up an MVC framework environment
2. Create database models with proper relationships
3. Use scaffolding tools to generate CRUD operations
4. Generate plain HTML views automatically
5. Understand the productivity benefits of code generation

---

## FRAMEWORK SELECTION

Students MUST choose ONE of the following MVC frameworks:

| Framework | Language | Difficulty | Recommended For |
|-----------|----------|------------|-----------------|
| **Laravel** | PHP | Beginner | Students familiar with PHP |
| **Django** | Python | Intermediate | Students familiar with Python |
| **ASP.NET Core** | C# | Advanced | Students familiar with C# |

**Note**: Once selected, you must use the same framework throughout all phases.

---

## STEP 1: ENVIRONMENT SETUP

### For Laravel Users

```bash
# Install Composer (if not installed)
# Download from: https://getcomposer.org/

# Create new Laravel project
composer create-project laravel/laravel food-ordering-system

# Navigate to project
cd food-ordering-system

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=food_ordering
DB_USERNAME=root
DB_PASSWORD=

# Start development server
php artisan serve
# Access at: http://localhost:8000
```

### For Django Users

```bash
# Install Python 3.8+ (if not installed)
# Download from: https://www.python.org/

# Install Django
pip install django

# Create new Django project
django-admin startproject food_ordering_system

# Navigate to project
cd food_ordering_system

# Create app
python manage.py startapp orders

# Configure database in settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Start development server
python manage.py runserver
# Access at: http://localhost:8000
```

### For ASP.NET Core Users

```bash
# Install .NET SDK 6.0+ (if not installed)
# Download from: https://dotnet.microsoft.com/

# Create new MVC project
dotnet new mvc -n FoodOrderingSystem

# Navigate to project
cd FoodOrderingSystem

# Run project
dotnet run
# Access at: http://localhost:5000
```

**✅ Checkpoint**: Verify your framework is running by accessing the default welcome page.


---

## STEP 2: CREATE MODELS

### Required Models

You must create TWO models with the following specifications:

#### Model 1: MenuItem

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier |
| name | String(200) | Required, Not Null | Item name |
| description | Text | Required | Item description |
| category | Enum/String | Required | appetizer, main, dessert, beverage |
| price | Decimal(8,2) | Required, Min: 0.01 | Item price |
| image_url | String(500) | Optional | Image URL |
| is_available | Boolean | Default: true | Availability status |
| created_at | Timestamp | Auto | Creation timestamp |
| updated_at | Timestamp | Auto | Last update timestamp |

#### Model 2: Order

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier |
| customer_name | String(200) | Required | Customer full name |
| customer_email | String(200) | Required, Email format | Customer email |
| customer_phone | String(20) | Required | Contact number |
| delivery_address | Text | Required | Full delivery address |
| total_amount | Decimal(10,2) | Required, Min: 0 | Order total |
| status | Enum/String | Default: pending | pending, confirmed, preparing, delivered, cancelled |
| created_at | Timestamp | Auto | Order date/time |
| updated_at | Timestamp | Auto | Last update |

#### Model 3: OrderItem (Relationship Table)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key | Unique identifier |
| order_id | Integer | Foreign Key → Order | Reference to order |
| menu_item_id | Integer | Foreign Key → MenuItem | Reference to menu item |
| quantity | Integer | Required, Min: 1 | Item quantity |
| price | Decimal(8,2) | Required | Price at time of order |

### Relationships

```
Order (1) ──────< (Many) OrderItem (Many) >────── (1) MenuItem

One Order has Many OrderItems
One MenuItem can be in Many OrderItems
```


---

## STEP 3: IMPLEMENT MODELS (Framework-Specific)

### Laravel Implementation

**Create Model and Migration:**
```bash
php artisan make:model MenuItem -m
php artisan make:model Order -m
php artisan make:model OrderItem -m
```

**Edit Migration File** (`database/migrations/xxxx_create_menu_items_table.php`):
```php
<?php
public function up()
{
    Schema::create('menu_items', function (Blueprint $table) {
        $table->id();
        $table->string('name', 200);
        $table->text('description');
        $table->enum('category', ['appetizer', 'main', 'dessert', 'beverage']);
        $table->decimal('price', 8, 2);
        $table->string('image_url', 500)->nullable();
        $table->boolean('is_available')->default(true);
        $table->timestamps();
    });
}
```

**Edit Model File** (`app/Models/MenuItem.php`):
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name', 'description', 'category', 
        'price', 'image_url', 'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean'
    ];

    // Relationship
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

**Run Migrations:**
```bash
php artisan migrate
```

### Django Implementation

**Edit Models** (`orders/models.py`):
```python
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

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
    price = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'menu_items'
        ordering = ['name']

    def __str__(self):
        return self.name
```

**Create and Run Migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**✅ Checkpoint**: Verify tables are created in your database.


---

## STEP 4: GENERATE CRUD CONTROLLERS (SCAFFOLDING)

### Laravel Scaffolding

**Generate Resource Controller:**
```bash
php artisan make:controller MenuItemController --resource
php artisan make:controller OrderController --resource
```

**Register Routes** (`routes/web.php`):
```php
<?php
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;

Route::resource('menu-items', MenuItemController::class);
Route::resource('orders', OrderController::class);
```

**What This Generates:**
- `index()` - List all items (GET /menu-items)
- `create()` - Show create form (GET /menu-items/create)
- `store()` - Save new item (POST /menu-items)
- `show($id)` - Show single item (GET /menu-items/{id})
- `edit($id)` - Show edit form (GET /menu-items/{id}/edit)
- `update($id)` - Update item (PUT /menu-items/{id})
- `destroy($id)` - Delete item (DELETE /menu-items/{id})

### Django Scaffolding

**Create Views** (`orders/views.py`):
```python
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from .models import MenuItem

class MenuItemListView(ListView):
    model = MenuItem
    template_name = 'menu_items/index.html'
    context_object_name = 'menu_items'
    paginate_by = 12

class MenuItemCreateView(CreateView):
    model = MenuItem
    template_name = 'menu_items/create.html'
    fields = ['name', 'description', 'category', 'price', 'image_url', 'is_available']
    success_url = reverse_lazy('menuitem-list')

class MenuItemDetailView(DetailView):
    model = MenuItem
    template_name = 'menu_items/show.html'
    context_object_name = 'menu_item'

class MenuItemUpdateView(UpdateView):
    model = MenuItem
    template_name = 'menu_items/edit.html'
    fields = ['name', 'description', 'category', 'price', 'image_url', 'is_available']
    success_url = reverse_lazy('menuitem-list')

class MenuItemDeleteView(DeleteView):
    model = MenuItem
    template_name = 'menu_items/delete.html'
    success_url = reverse_lazy('menuitem-list')
```

**Register URLs** (`orders/urls.py`):
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

**✅ Checkpoint**: Verify routes are registered by running:
- Laravel: `php artisan route:list`
- Django: Check URLs are accessible


---

## STEP 5: CREATE PLAIN HTML VIEWS

**IMPORTANT**: Views must be PLAIN HTML without any CSS framework. Bootstrap will be added in Phase 2.

### Required Views for MenuItem

1. **index.html** - List all menu items
2. **create.html** - Form to create new item
3. **show.html** - Display single item details
4. **edit.html** - Form to edit existing item
5. **delete.html** - Confirmation page (optional)

### Example: Plain HTML List View

**Laravel** (`resources/views/menu-items/index.blade.php`):
```html
<!DOCTYPE html>
<html>
<head>
    <title>Menu Items</title>
</head>
<body>
    <h1>Menu Items</h1>
    <a href="/menu-items/create">Add New Item</a>
    
    <table border="1" cellpadding="10">
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
            @foreach($menuItems as $item)
            <tr>
                <td>{{ $item->id }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ $item->category }}</td>
                <td>${{ number_format($item->price, 2) }}</td>
                <td>{{ $item->is_available ? 'Yes' : 'No' }}</td>
                <td>
                    <a href="/menu-items/{{ $item->id }}">View</a> |
                    <a href="/menu-items/{{ $item->id }}/edit">Edit</a> |
                    <form action="/menu-items/{{ $item->id }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
```

### Example: Plain HTML Create Form

```html
<!DOCTYPE html>
<html>
<head>
    <title>Add Menu Item</title>
</head>
<body>
    <h1>Add New Menu Item</h1>
    
    <form action="/menu-items" method="POST">
        <label>Name:</label><br>
        <input type="text" name="name" required><br><br>
        
        <label>Description:</label><br>
        <textarea name="description" rows="4" cols="50" required></textarea><br><br>
        
        <label>Category:</label><br>
        <select name="category" required>
            <option value="">Select Category</option>
            <option value="appetizer">Appetizer</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
        </select><br><br>
        
        <label>Price:</label><br>
        <input type="number" name="price" step="0.01" min="0" required><br><br>
        
        <label>Image URL:</label><br>
        <input type="url" name="image_url"><br><br>
        
        <label>
            <input type="checkbox" name="is_available" checked>
            Available for ordering
        </label><br><br>
        
        <button type="submit">Create</button>
        <a href="/menu-items">Cancel</a>
    </form>
</body>
</html>
```

**✅ Checkpoint**: Test all CRUD operations work correctly with plain HTML.


---

## STEP 6: IMPLEMENT CONTROLLER LOGIC

### Laravel Controller Example

**Edit** `app/Http/Controllers/MenuItemController.php`:
```php
<?php
namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    // Display listing
    public function index()
    {
        $menuItems = MenuItem::all();
        return view('menu-items.index', compact('menuItems'));
    }

    // Show create form
    public function create()
    {
        return view('menu-items.create');
    }

    // Store new item
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'description' => 'required|string',
            'category' => 'required|in:appetizer,main,dessert,beverage',
            'price' => 'required|numeric|min:0.01',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean'
        ]);

        MenuItem::create($validated);
        return redirect('/menu-items')->with('success', 'Item created successfully');
    }

    // Show single item
    public function show($id)
    {
        $item = MenuItem::findOrFail($id);
        return view('menu-items.show', compact('item'));
    }

    // Show edit form
    public function edit($id)
    {
        $item = MenuItem::findOrFail($id);
        return view('menu-items.edit', compact('item'));
    }

    // Update item
    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'description' => 'required|string',
            'category' => 'required|in:appetizer,main,dessert,beverage',
            'price' => 'required|numeric|min:0.01',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean'
        ]);

        $item->update($validated);
        return redirect('/menu-items')->with('success', 'Item updated successfully');
    }

    // Delete item
    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->delete();
        return redirect('/menu-items')->with('success', 'Item deleted successfully');
    }
}
```

**✅ Checkpoint**: All CRUD operations should work end-to-end.

---

## PHASE 1 DELIVERABLES

Students must submit the following:

### 1. Source Code (GitHub Repository)
- Complete project with all files
- README.md with setup instructions
- .gitignore file (exclude vendor/, node_modules/, .env)

### 2. Database Schema Document (PDF)
Include:
- ER Diagram showing relationships
- Table structures with data types
- Foreign key constraints
- Sample data (at least 5 menu items, 2 orders)

### 3. Screenshots (PDF Document)
Required screenshots:
- ✓ List view of menu items (with data)
- ✓ Create form (empty)
- ✓ Create form (with validation errors)
- ✓ Edit form (populated with data)
- ✓ Single item view
- ✓ Delete confirmation
- ✓ Similar screenshots for Orders

### 4. Scaffolding Explanation (PDF, 1-2 pages)
Answer these questions:
1. What is scaffolding in MVC frameworks?
2. Which commands did you use to generate code?
3. What files were automatically created?
4. How does scaffolding improve productivity?
5. What are the limitations of scaffolding?
6. Compare scaffolding in your chosen framework with another framework

### 5. MVC Separation Document (PDF, 1 page)
Explain:
- How your project demonstrates separation of concerns
- What code belongs in Model vs Controller vs View
- Benefits you observed from this separation


---

## PHASE 1 GRADING RUBRIC (25 Points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **Models** | 8 | Correct fields, data types, relationships, validations |
| **Controllers** | 7 | All CRUD operations working, proper validation |
| **Views** | 5 | All required views created, functional forms |
| **Database** | 3 | Proper migrations, schema design, sample data |
| **Documentation** | 2 | Clear explanations, complete screenshots |

### Detailed Breakdown

**Models (8 points)**
- MenuItem model: 3 points
- Order model: 3 points
- OrderItem model: 1 point
- Relationships: 1 point

**Controllers (7 points)**
- Index (list): 1 point
- Create/Store: 2 points
- Show: 1 point
- Edit/Update: 2 points
- Delete: 1 point

**Views (5 points)**
- Index view: 1 point
- Create form: 1.5 points
- Edit form: 1.5 points
- Show view: 1 point

**Database (3 points)**
- Migrations: 1 point
- Schema design: 1 point
- Sample data: 1 point

**Documentation (2 points)**
- Screenshots: 1 point
- Explanations: 1 point

---

# PHASE 2: BOOTSTRAP INTEGRATION

**Duration**: Week 3-4  
**Weight**: 25%  
**Learning Outcome**: LO3

---

## OBJECTIVES

By the end of Phase 2, students will:
1. Integrate Bootstrap framework into existing application
2. Implement responsive 12-column grid system
3. Use Bootstrap components (Navbar, Cards, Forms, Buttons)
4. Create mobile-responsive layouts
5. Understand responsive design principles

---

## STEP 1: ADD BOOTSTRAP TO PROJECT

### Method 1: CDN (Recommended for Learning)

Add to your layout/base template `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Ordering System</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <!-- Custom CSS (optional) -->
    <link href="/css/custom.css" rel="stylesheet">
</head>
<body>
    <!-- Content -->
    
    <!-- Bootstrap JS (before closing </body>) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**✅ Checkpoint**: Verify Bootstrap is loaded by checking browser console for no errors.


---

## STEP 2: IMPLEMENT RESPONSIVE NAVBAR

**Requirement**: Create a responsive navigation bar that collapses on mobile devices.

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="/">
            <i class="bi bi-shop"></i> Food Ordering System
        </a>
        
        <!-- Mobile Toggle Button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="/">Home</a>
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

**Key Bootstrap Classes Used:**
- `navbar` - Base navbar component
- `navbar-expand-lg` - Collapse on screens smaller than large
- `navbar-dark bg-dark` - Dark theme
- `container` - Centered content with padding
- `navbar-toggler` - Mobile menu button
- `collapse navbar-collapse` - Collapsible content
- `ms-auto` - Push navigation to right (margin-start: auto)

**✅ Checkpoint**: Test navbar on mobile (resize browser to <992px width).


---

## STEP 3: IMPLEMENT 12-COLUMN GRID SYSTEM

**Requirement**: Display menu items in a responsive grid that adapts to screen size.

### Bootstrap Grid Breakpoints

| Breakpoint | Class Prefix | Screen Width | Columns Per Row |
|------------|--------------|--------------|-----------------|
| Extra Small | `col-` | <576px | 1 (mobile) |
| Small | `col-sm-` | ≥576px | 2 (mobile landscape) |
| Medium | `col-md-` | ≥768px | 3 (tablet) |
| Large | `col-lg-` | ≥992px | 4 (desktop) |
| Extra Large | `col-xl-` | ≥1200px | 4 (large desktop) |

### Implementation Example

```html
<div class="container mt-4">
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Our Menu</h1>
            <p class="text-muted">Browse our delicious food items</p>
        </div>
        <div class="col-md-4 text-end">
            <a href="/menu-items/create" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Add New Item
            </a>
        </div>
    </div>

    <!-- Filter Section (3 columns on medium+ screens) -->
    <div class="row mb-4">
        <div class="col-md-3">
            <select class="form-select">
                <option>All Categories</option>
                <option>Appetizers</option>
                <option>Main Course</option>
                <option>Desserts</option>
                <option>Beverages</option>
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
        <!-- Each card: 12 cols on mobile, 6 on small, 4 on medium, 3 on large -->
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <!-- Card content here -->
        </div>
    </div>
</div>
```

**Grid Explanation:**
- `container` - Fixed-width container with responsive padding
- `row` - Flex container for columns
- `col-12` - Full width on extra small screens (mobile)
- `col-sm-6` - Half width on small screens (2 items per row)
- `col-md-4` - One-third width on medium screens (3 items per row)
- `col-lg-3` - One-quarter width on large screens (4 items per row)
- `mb-4` - Margin bottom (spacing between rows)

**✅ Checkpoint**: Resize browser and verify layout changes at different breakpoints.


---

## STEP 4: USE BOOTSTRAP CARDS FOR MENU ITEMS

**Requirement**: Display each menu item in a Bootstrap Card component.

```html
<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div class="card h-100 shadow-sm">
        <!-- Card Image -->
        <img src="{{ item.image_url }}" 
             class="card-img-top" 
             alt="{{ item.name }}" 
             style="height: 200px; object-fit: cover;">
        
        <!-- Card Body -->
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text text-muted small">
                {{ item.description | truncate:80 }}
            </p>
            
            <!-- Price and Category (pushed to bottom) -->
            <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-secondary">{{ item.category }}</span>
                    <h4 class="text-primary mb-0">${{ item.price }}</h4>
                </div>
                
                <!-- Availability Badge -->
                {% if item.is_available %}
                    <span class="badge bg-success">Available</span>
                {% else %}
                    <span class="badge bg-danger">Out of Stock</span>
                {% endif %}
            </div>
        </div>
        
        <!-- Card Footer with Action Buttons -->
        <div class="card-footer bg-transparent">
            <div class="btn-group w-100" role="group">
                <a href="/menu-items/{{ item.id }}" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye"></i> View
                </a>
                <a href="/menu-items/{{ item.id }}/edit" class="btn btn-sm btn-outline-warning">
                    <i class="bi bi-pencil"></i> Edit
                </a>
                <button type="button" class="btn btn-sm btn-outline-danger" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteModal{{ item.id }}">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        </div>
    </div>
</div>
```

**Bootstrap Classes Explained:**
- `card` - Card container
- `h-100` - Height 100% (equal height cards)
- `shadow-sm` - Small box shadow
- `card-img-top` - Image at top of card
- `card-body` - Main content area
- `d-flex flex-column` - Flexbox column layout
- `card-title` - Card heading
- `card-text` - Card paragraph text
- `mt-auto` - Margin-top auto (push to bottom)
- `badge` - Small status indicator
- `btn-group` - Group buttons together
- `w-100` - Width 100%

**✅ Checkpoint**: All menu items should display in attractive cards.


---

## STEP 5: STYLE FORMS WITH BOOTSTRAP

**Requirement**: Convert plain HTML forms to Bootstrap-styled forms.

```html
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h3 class="mb-0">Add New Menu Item</h3>
                </div>
                <div class="card-body">
                    <form action="/menu-items" method="POST">
                        
                        <!-- Text Input -->
                        <div class="mb-3">
                            <label for="name" class="form-label">Item Name *</label>
                            <input type="text" 
                                   class="form-control" 
                                   id="name" 
                                   name="name" 
                                   placeholder="Enter item name"
                                   required>
                            <div class="form-text">Enter a descriptive name for the menu item</div>
                        </div>
                        
                        <!-- Textarea -->
                        <div class="mb-3">
                            <label for="description" class="form-label">Description *</label>
                            <textarea class="form-control" 
                                      id="description" 
                                      name="description" 
                                      rows="3" 
                                      required></textarea>
                        </div>
                        
                        <!-- Two Columns -->
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
                                <input type="number" 
                                       class="form-control" 
                                       id="price" 
                                       name="price" 
                                       step="0.01" 
                                       min="0" 
                                       required>
                            </div>
                        </div>
                        
                        <!-- URL Input -->
                        <div class="mb-3">
                            <label for="image_url" class="form-label">Image URL</label>
                            <input type="url" 
                                   class="form-control" 
                                   id="image_url" 
                                   name="image_url" 
                                   placeholder="https://example.com/image.jpg">
                        </div>
                        
                        <!-- Checkbox -->
                        <div class="mb-3 form-check">
                            <input type="checkbox" 
                                   class="form-check-input" 
                                   id="is_available" 
                                   name="is_available" 
                                   checked>
                            <label class="form-check-label" for="is_available">
                                Available for ordering
                            </label>
                        </div>
                        
                        <!-- Action Buttons -->
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

**Form Classes Explained:**
- `form-control` - Styled input/textarea
- `form-select` - Styled select dropdown
- `form-label` - Label styling
- `form-text` - Help text below input
- `form-check` - Checkbox/radio container
- `form-check-input` - Styled checkbox/radio
- `form-check-label` - Checkbox/radio label
- `mb-3` - Margin bottom 3 units (spacing)
- `d-grid` - Display grid
- `gap-2` - Gap between grid items

**✅ Checkpoint**: Forms should look professional and be fully responsive.


---

## STEP 6: ADD CUSTOM STYLING (OPTIONAL)

Create `public/css/custom.css`:

```css
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

@media (max-width: 768px) {
    .card-img-top {
        height: 150px !important;
    }
    
    h1 {
        font-size: 1.75rem;
    }
}
```

---

## PHASE 2 DELIVERABLES

### 1. Updated Source Code (GitHub)
- All views redesigned with Bootstrap
- Responsive layouts implemented
- Custom CSS file (if used)

### 2. Responsive Design Report (PDF, 3-4 pages)

**Required Content:**
- Screenshots at THREE breakpoints:
  - Mobile (375px width)
  - Tablet (768px width)
  - Desktop (1200px width)
- For EACH breakpoint, show:
  - Menu items list page
  - Create/Edit form
  - Single item view

### 3. Bootstrap Components Documentation (PDF, 2 pages)

Create a table listing:

| Component | Where Used | Purpose | Bootstrap Classes |
|-----------|------------|---------|-------------------|
| Navbar | All pages | Navigation | navbar, navbar-expand-lg |
| Cards | Menu list | Display items | card, card-body, card-footer |
| Forms | Create/Edit | Data input | form-control, form-select |
| Buttons | All pages | Actions | btn, btn-primary, btn-outline-* |
| Grid | Menu list | Layout | container, row, col-* |
| Badges | Menu cards | Status | badge, bg-success, bg-danger |
| Modals | Delete confirm | Confirmation | modal, modal-dialog |

### 4. Grid System Explanation (PDF, 1 page)

Answer:
1. How does the 12-column grid system work?
2. What are breakpoints and why are they important?
3. Explain the column classes you used (col-12, col-md-6, etc.)
4. How does your layout adapt from mobile to desktop?

### 5. Before/After Comparison (PDF, 2 pages)

Show side-by-side screenshots:
- Before: Plain HTML (Phase 1)
- After: Bootstrap styled (Phase 2)

For at least 3 pages.

---

## PHASE 2 GRADING RUBRIC (25 Points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **Grid System** | 6 | Proper 12-column grid, responsive breakpoints |
| **Cards** | 5 | Menu items in cards, proper styling |
| **Navbar** | 4 | Responsive navbar, mobile menu works |
| **Forms** | 5 | All forms styled, proper Bootstrap classes |
| **Responsiveness** | 3 | Works on mobile, tablet, desktop |
| **Documentation** | 2 | Clear screenshots, explanations |

### Detailed Breakdown

**Grid System (6 points)**
- Container usage: 1 point
- Row/column structure: 2 points
- Responsive breakpoints: 2 points
- Proper spacing: 1 point

**Cards (5 points)**
- Card structure: 2 points
- Image handling: 1 point
- Content layout: 1 point
- Footer buttons: 1 point

**Navbar (4 points)**
- Desktop navbar: 2 points
- Mobile collapse: 2 points

**Forms (5 points)**
- Input styling: 2 points
- Layout (2-column): 1 point
- Validation feedback: 1 point
- Button styling: 1 point

**Responsiveness (3 points)**
- Mobile (< 576px): 1 point
- Tablet (768px): 1 point
- Desktop (≥ 992px): 1 point


---

# PHASE 3: REST PRINCIPLES & HTTP METHOD MAPPING

**Duration**: Week 5-6  
**Weight**: 25%  
**Learning Outcome**: LO4, LO6

---

## OBJECTIVES

By the end of Phase 3, students will:
1. Understand REST architectural principles
2. Implement proper HTTP methods for CRUD operations
3. Apply statelessness principle with token-based authentication
4. Identify and implement idempotent operations
5. Document API design decisions with technical justification

---

## UNDERSTANDING REST PRINCIPLES

### Principle 1: STATELESSNESS ⭐ CRITICAL

**Definition**: The server does NOT store any client context between requests. Each request must contain ALL information needed to process it.

**Why It Matters:**
- Enables horizontal scaling (add more servers)
- Improves reliability (no session data to lose)
- Simplifies server architecture
- Allows load balancing across multiple servers

**Implementation:**

❌ **WRONG (Stateful - Using Sessions):**
```php
// Login stores user in session
Session::put('user_id', $user->id);

// Later requests rely on session
$userId = Session::get('user_id');
```

✅ **CORRECT (Stateless - Using Tokens):**
```php
// Login returns token
$token = $user->createToken('auth-token')->plainTextToken;
return response()->json(['token' => $token]);

// Every request includes token in header
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

// Server validates token on each request
$user = auth()->user(); // Extracted from token
```

**Your Task:**
1. Implement token-based authentication (JWT or API tokens)
2. Pass token in `Authorization` header with every request
3. Server validates token but does NOT store session state
4. Document how your implementation achieves statelessness

---

### Principle 2: IDEMPOTENCY ⭐ CRITICAL

**Definition**: An operation is idempotent if calling it multiple times produces the same result as calling it once.

**Why It Matters:**
- Safe to retry failed requests
- Network issues don't cause duplicate operations
- Predictable behavior

**HTTP Methods and Idempotency:**

| Method | Idempotent? | Explanation | Example |
|--------|-------------|-------------|---------|
| **GET** | ✅ YES | Reading data doesn't change state | GET /api/menu-items/5 |
| **POST** | ❌ NO | Creates new resource each time | POST /api/menu-items |
| **PUT** | ✅ YES | Replaces resource with same data | PUT /api/menu-items/5 |
| **PATCH** | ⚠️ DEPENDS | Depends on implementation | PATCH /api/menu-items/5 |
| **DELETE** | ✅ YES | Resource is gone after first call | DELETE /api/menu-items/5 |

**Detailed Examples:**

**GET (Idempotent):**
```
Request 1: GET /api/menu-items/5
Response: { "id": 5, "name": "Pizza", "price": 12.99 }

Request 2: GET /api/menu-items/5
Response: { "id": 5, "name": "Pizza", "price": 12.99 }

Result: Same data returned, no state change
```

**POST (NOT Idempotent):**
```
Request 1: POST /api/menu-items { "name": "Burger", "price": 9.99 }
Response: { "id": 10, "name": "Burger", "price": 9.99 }

Request 2: POST /api/menu-items { "name": "Burger", "price": 9.99 }
Response: { "id": 11, "name": "Burger", "price": 9.99 }

Result: Two different resources created (different IDs)
```

**PUT (Idempotent):**
```
Request 1: PUT /api/menu-items/5 { "name": "Pizza", "price": 13.99 }
Response: { "id": 5, "name": "Pizza", "price": 13.99 }

Request 2: PUT /api/menu-items/5 { "name": "Pizza", "price": 13.99 }
Response: { "id": 5, "name": "Pizza", "price": 13.99 }

Result: Same final state (price is 13.99)
```

**DELETE (Idempotent):**
```
Request 1: DELETE /api/menu-items/5
Response: 200 OK { "message": "Deleted successfully" }

Request 2: DELETE /api/menu-items/5
Response: 404 Not Found { "message": "Resource not found" }

Result: Resource is gone (same final state)
```

**Your Task:**
Create a table documenting EVERY endpoint in your API:

| HTTP Method | Endpoint | Idempotent? | Justification |
|-------------|----------|-------------|---------------|
| GET | /api/menu-items | ✅ YES | Reading data, no state change |
| GET | /api/menu-items/5 | ✅ YES | Reading single item, no state change |
| POST | /api/menu-items | ❌ NO | Creates new item each time, different IDs |
| PUT | /api/menu-items/5 | ✅ YES | Replaces item, same final state |
| DELETE | /api/menu-items/5 | ✅ YES | Item deleted, subsequent calls find nothing |
| POST | /api/orders/5/items | ❌ NO | Adds item to order each time |


---

## STEP 1: CREATE API ROUTES

Separate your web routes from API routes.

### Laravel Example

Create `routes/api.php`:
```php
<?php
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;

// Public routes (no authentication)
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);
    
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
});
```

### Django Example

Create `orders/api_urls.py`:
```python
from django.urls import path
from .api_views import MenuItemAPIView, MenuItemDetailAPIView

urlpatterns = [
    path('menu-items/', MenuItemAPIView.as_view()),
    path('menu-items/<int:pk>/', MenuItemDetailAPIView.as_view()),
]
```

---

## STEP 2: IMPLEMENT HTTP METHODS CORRECTLY

### GET - Retrieve Resources

```php
// Laravel
public function index(Request $request)
{
    // Stateless: No session data used
    // Idempotent: Multiple calls return same data
    
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

### POST - Create Resources

```php
public function store(Request $request)
{
    // NOT Idempotent: Creates new resource each time
    
    $validated = $request->validate([
        'name' => 'required|string|max:200',
        'description' => 'required|string',
        'category' => 'required|in:appetizer,main,dessert,beverage',
        'price' => 'required|numeric|min:0.01',
        'image_url' => 'nullable|url',
        'is_available' => 'boolean'
    ]);
    
    $menuItem = MenuItem::create($validated);
    
    return response()->json([
        'success' => true,
        'message' => 'Menu item created successfully',
        'data' => $menuItem
    ], 201); // 201 Created
}
```

### PUT - Update Resources

```php
public function update(Request $request, $id)
{
    // Idempotent: Multiple calls with same data produce same result
    
    $menuItem = MenuItem::find($id);
    
    if (!$menuItem) {
        return response()->json([
            'success' => false,
            'message' => 'Menu item not found'
        ], 404);
    }
    
    $validated = $request->validate([
        'name' => 'required|string|max:200',
        'description' => 'required|string',
        'category' => 'required|in:appetizer,main,dessert,beverage',
        'price' => 'required|numeric|min:0.01',
        'image_url' => 'nullable|url',
        'is_available' => 'boolean'
    ]);
    
    $menuItem->update($validated);
    
    return response()->json([
        'success' => true,
        'message' => 'Menu item updated successfully',
        'data' => $menuItem
    ], 200);
}
```

### DELETE - Remove Resources

```php
public function destroy($id)
{
    // Idempotent: Resource is gone after first call
    
    $menuItem = MenuItem::find($id);
    
    if (!$menuItem) {
        return response()->json([
            'success' => false,
            'message' => 'Menu item not found'
        ], 404);
    }
    
    $menuItem->delete();
    
    return response()->json([
        'success' => true,
        'message' => 'Menu item deleted successfully'
    ], 200);
}
```

---

## STEP 3: IMPLEMENT STATELESS AUTHENTICATION

### Laravel - Sanctum Tokens

**Install Sanctum:**
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

**Create Login Endpoint:**
```php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);
    
    if (!Auth::attempt($credentials)) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }
    
    $user = Auth::user();
    $token = $user->createToken('auth-token')->plainTextToken;
    
    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => $user
    ], 200);
}
```

**Use Token in Requests:**
```
POST /api/menu-items
Headers:
  Authorization: Bearer 1|abcdef123456...
  Content-Type: application/json
  
Body:
{
  "name": "Pizza",
  "description": "Delicious pizza",
  "category": "main",
  "price": 12.99
}
```

**✅ Checkpoint**: Test authentication with Postman/Insomnia.


---

## STEP 4: HTTP STATUS CODES

Use appropriate status codes for different scenarios:

| Code | Name | When to Use | Example |
|------|------|-------------|---------|
| **200** | OK | Successful GET, PUT, DELETE | Item retrieved/updated/deleted |
| **201** | Created | Successful POST | New item created |
| **204** | No Content | Successful DELETE (no body) | Item deleted, no response body |
| **400** | Bad Request | Invalid input, validation failed | Missing required field |
| **401** | Unauthorized | Missing/invalid authentication | No token provided |
| **403** | Forbidden | Authenticated but not authorized | User can't delete this item |
| **404** | Not Found | Resource doesn't exist | Item ID not found |
| **409** | Conflict | Resource conflict | Duplicate entry |
| **422** | Unprocessable Entity | Validation error | Email format invalid |
| **500** | Internal Server Error | Unexpected server error | Database connection failed |

**Implementation Example:**
```php
// 200 OK
return response()->json(['data' => $item], 200);

// 201 Created
return response()->json(['data' => $item], 201);

// 400 Bad Request
return response()->json(['error' => 'Invalid input'], 400);

// 404 Not Found
return response()->json(['error' => 'Item not found'], 404);
```

---

## PHASE 3 DELIVERABLES

### 1. API Implementation (GitHub)
- All API routes implemented
- Proper HTTP methods used
- Authentication middleware applied
- Status codes correctly implemented

### 2. REST Principles Documentation (PDF, 4-5 pages)

**Section 1: Statelessness (2 pages)**

Must include:
- **Explanation**: What is statelessness and why it matters
- **Implementation**: How you implemented token-based auth
- **Code Examples**: Show login endpoint and token usage
- **Request Examples**: Show actual HTTP requests with headers
- **Justification**: Explain why your implementation is stateless

Example format:
```
STATELESSNESS IMPLEMENTATION

1. Authentication Method: Laravel Sanctum API Tokens

2. How It Works:
   - User logs in with credentials
   - Server generates unique token
   - Token returned to client
   - Client includes token in Authorization header for every request
   - Server validates token on each request
   - No session data stored on server

3. Example Request:
   POST /api/menu-items
   Headers:
     Authorization: Bearer 1|abc123...
     Content-Type: application/json
   
   Body:
     { "name": "Pizza", "price": 12.99 }

4. Why This Is Stateless:
   - Server doesn't remember previous requests
   - All information needed is in the token
   - Can scale horizontally (multiple servers)
   - No session storage required
```

**Section 2: Idempotency Analysis (2-3 pages)**

Create comprehensive table:

| HTTP Method | Endpoint | Idempotent? | Detailed Justification |
|-------------|----------|-------------|------------------------|
| GET | /api/menu-items | ✅ YES | Safe operation. Reading data multiple times doesn't change server state. Returns same data each time. |
| GET | /api/menu-items/5 | ✅ YES | Safe operation. Retrieving same item multiple times returns identical data. No side effects. |
| POST | /api/menu-items | ❌ NO | Creates new resource each time. Calling twice creates two items with different IDs. Not safe to retry. |
| PUT | /api/menu-items/5 | ✅ YES | Replaces entire resource. Calling multiple times with same data results in same final state. Safe to retry. |
| PATCH | /api/menu-items/5 | ⚠️ DEPENDS | If updating specific fields, may be idempotent. If incrementing values, NOT idempotent. |
| DELETE | /api/menu-items/5 | ✅ YES | First call deletes item. Subsequent calls return 404. Final state is same (item doesn't exist). |
| POST | /api/orders | ❌ NO | Creates new order each time. Multiple calls create multiple orders. |
| POST | /api/orders/5/items | ❌ NO | Adds item to order each time. Calling twice adds item twice. |
| PUT | /api/orders/5/status | ✅ YES | Updates status. Multiple calls with same status result in same final state. |

### 3. API Testing Report (PDF, 2-3 pages)

**Required Tests:**

Test each endpoint and document:
- Request method and URL
- Request headers
- Request body (if applicable)
- Response status code
- Response body
- Screenshot from Postman/Insomnia

**Example:**
```
TEST 1: Create Menu Item (POST)

Request:
  POST http://localhost:8000/api/menu-items
  Headers:
    Authorization: Bearer 1|abc123...
    Content-Type: application/json
  Body:
    {
      "name": "Margherita Pizza",
      "description": "Classic Italian pizza",
      "category": "main",
      "price": 12.99,
      "is_available": true
    }

Response:
  Status: 201 Created
  Body:
    {
      "success": true,
      "message": "Menu item created successfully",
      "data": {
        "id": 1,
        "name": "Margherita Pizza",
        "description": "Classic Italian pizza",
        "category": "main",
        "price": 12.99,
        "is_available": true,
        "created_at": "2024-01-15T10:30:00Z"
      }
    }

[Screenshot attached]
```

### 4. Postman Collection (JSON Export)

Export your complete Postman collection including:
- All endpoints
- Sample requests
- Environment variables
- Test scripts (optional)

---

## PHASE 3 GRADING RUBRIC (25 Points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **HTTP Methods** | 6 | Correct use of GET, POST, PUT, DELETE |
| **Statelessness** | 6 | Token-based auth, no session dependency |
| **Idempotency** | 5 | Correct identification and implementation |
| **Status Codes** | 3 | Appropriate codes for different scenarios |
| **Documentation** | 5 | Clear explanations with examples |

### Detailed Breakdown

**HTTP Methods (6 points)**
- GET endpoints: 1.5 points
- POST endpoints: 1.5 points
- PUT endpoints: 1.5 points
- DELETE endpoints: 1.5 points

**Statelessness (6 points)**
- Token generation: 2 points
- Token validation: 2 points
- Documentation: 2 points

**Idempotency (5 points)**
- Correct identification: 2 points
- Proper implementation: 2 points
- Documentation table: 1 point

**Status Codes (3 points)**
- Success codes (200, 201): 1 point
- Error codes (400, 404): 1 point
- Auth codes (401, 403): 1 point

**Documentation (5 points)**
- Statelessness explanation: 2 points
- Idempotency analysis: 2 points
- API testing report: 1 point


---

# PHASE 4: RESOURCE & URI DESIGN

**Duration**: Week 7-8  
**Weight**: 25%  
**Learning Outcome**: LO5, LO7

---

## OBJECTIVES

By the end of Phase 4, students will:
1. Design proper RESTful URIs following industry standards
2. Use plural nouns for resource names
3. Implement hierarchical URI structures
4. Avoid verbs in URIs
5. Create comprehensive API documentation

---

## URI DESIGN RULES (STRICT ENFORCEMENT)

### Rule 1: Use Plural Nouns ✅

| ✅ CORRECT | ❌ WRONG |
|-----------|----------|
| `/api/menu-items` | `/api/menu-item` |
| `/api/orders` | `/api/order` |
| `/api/customers` | `/api/customer` |

**Justification**: Collections are plural. Even when accessing single item, use plural: `/api/menu-items/5`

### Rule 2: NO Verbs in URIs ✅

| ✅ CORRECT | ❌ WRONG |
|-----------|----------|
| `GET /api/menu-items` | `/api/getMenuItems` |
| `POST /api/orders` | `/api/createOrder` |
| `DELETE /api/menu-items/5` | `/api/deleteMenuItem/5` |
| `PUT /api/orders/5` | `/api/updateOrder/5` |

**Justification**: HTTP method indicates action. URI identifies resource.

### Rule 3: Use Hyphens, Not Underscores ✅

| ✅ CORRECT | ❌ WRONG |
|-----------|----------|
| `/api/menu-items` | `/api/menu_items` |
| `/api/order-items` | `/api/order_items` |

**Justification**: Hyphens are more readable and SEO-friendly.

### Rule 4: Lowercase Only ✅

| ✅ CORRECT | ❌ WRONG |
|-----------|----------|
| `/api/menu-items` | `/api/MenuItems` |
| `/api/orders` | `/api/Orders` |

**Justification**: URIs are case-sensitive. Lowercase prevents confusion.

### Rule 5: No Trailing Slashes ✅

| ✅ CORRECT | ❌ WRONG |
|-----------|----------|
| `/api/menu-items` | `/api/menu-items/` |
| `/api/orders/5` | `/api/orders/5/` |

**Justification**: Trailing slashes are semantically different and cause routing issues.

### Rule 6: Hierarchical Structure ✅

Show relationships through URI hierarchy:

| ✅ CORRECT | ❌ WRONG |
|-----------|----------|
| `/api/orders/5/items` | `/api/order-items?order_id=5` |
| `/api/customers/10/orders` | `/api/orders?customer_id=10` |
| `/api/categories/3/menu-items` | `/api/menu-items?category_id=3` |

**Justification**: Hierarchy shows relationship. More intuitive and RESTful.

---

## STEP 1: DESIGN RESOURCE HIERARCHY

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

---

## STEP 2: COMPLETE ENDPOINT LIST

Create comprehensive documentation of ALL endpoints:

### Menu Items Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/menu-items` | List all menu items | None | Array of items |
| GET | `/api/menu-items?category=main` | Filter by category | None | Filtered array |
| GET | `/api/menu-items?available=true` | Filter by availability | None | Filtered array |
| GET | `/api/menu-items?sort=price&order=asc` | Sort by price | None | Sorted array |
| GET | `/api/menu-items?page=2&per_page=10` | Paginated list | None | Paginated array |
| GET | `/api/menu-items/{id}` | Get single item | None | Single item object |
| POST | `/api/menu-items` | Create new item | MenuItem object | Created item (201) |
| PUT | `/api/menu-items/{id}` | Update entire item | MenuItem object | Updated item (200) |
| PATCH | `/api/menu-items/{id}` | Partial update | Partial object | Updated item (200) |
| DELETE | `/api/menu-items/{id}` | Delete item | None | Success message (200) |

### Categories Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/categories` | List all categories | None | Array of categories |
| GET | `/api/categories/{id}` | Get single category | None | Single category |
| GET | `/api/categories/{id}/menu-items` | Get items in category | None | Array of items |
| POST | `/api/categories` | Create category | Category object | Created category (201) |
| PUT | `/api/categories/{id}` | Update category | Category object | Updated category (200) |
| DELETE | `/api/categories/{id}` | Delete category | None | Success message (200) |

### Orders Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/orders` | List all orders | None | Array of orders |
| GET | `/api/orders?status=pending` | Filter by status | None | Filtered array |
| GET | `/api/orders?date=2024-01-15` | Filter by date | None | Filtered array |
| GET | `/api/orders/{id}` | Get single order | None | Order with items |
| POST | `/api/orders` | Create new order | Order object | Created order (201) |
| PUT | `/api/orders/{id}` | Update order | Order object | Updated order (200) |
| PATCH | `/api/orders/{id}/status` | Update status only | {status: "confirmed"} | Updated order (200) |
| DELETE | `/api/orders/{id}` | Cancel order | None | Success message (200) |

### Order Items Endpoints (Hierarchical)

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/orders/{orderId}/items` | List items in order | None | Array of items |
| GET | `/api/orders/{orderId}/items/{itemId}` | Get specific item | None | Single item |
| POST | `/api/orders/{orderId}/items` | Add item to order | OrderItem object | Created item (201) |
| PUT | `/api/orders/{orderId}/items/{itemId}` | Update item quantity | {quantity: 3} | Updated item (200) |
| DELETE | `/api/orders/{orderId}/items/{itemId}` | Remove item | None | Success message (200) |

### Customers Endpoints

| Method | URI | Description | Request Body | Response |
|--------|-----|-------------|--------------|----------|
| GET | `/api/customers` | List all customers | None | Array of customers |
| GET | `/api/customers/{id}` | Get single customer | None | Single customer |
| GET | `/api/customers/{id}/orders` | Get customer orders | None | Array of orders |
| GET | `/api/customers/{id}/orders?status=delivered` | Filter orders | None | Filtered array |
| POST | `/api/customers` | Create customer | Customer object | Created customer (201) |
| PUT | `/api/customers/{id}` | Update customer | Customer object | Updated customer (200) |
| DELETE | `/api/customers/{id}` | Delete customer | None | Success message (200) |


---

## STEP 3: IMPLEMENT HIERARCHICAL ROUTES

### Laravel Implementation

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

// Hierarchical: Order Items
Route::get('orders/{orderId}/items', [OrderController::class, 'getItems']);
Route::post('orders/{orderId}/items', [OrderController::class, 'addItem']);
Route::get('orders/{orderId}/items/{itemId}', [OrderController::class, 'getItem']);
Route::put('orders/{orderId}/items/{itemId}', [OrderController::class, 'updateItem']);
Route::delete('orders/{orderId}/items/{itemId}', [OrderController::class, 'removeItem']);

// Customers with nested orders
Route::apiResource('customers', CustomerController::class);
Route::get('customers/{customerId}/orders', [CustomerController::class, 'getOrders']);
```

### Controller Implementation for Hierarchical Routes

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
        $order = Order::findOrFail($orderId);
        $items = $order->orderItems()->with('menuItem')->get();
        
        return response()->json([
            'success' => true,
            'data' => $items
        ], 200);
    }
    
    // POST /api/orders/{orderId}/items
    public function addItem(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);
        
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'required|integer|min:1'
        ]);
        
        $menuItem = \App\Models\MenuItem::findOrFail($validated['menu_item_id']);
        
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
        $order = Order::findOrFail($orderId);
        $orderItem = OrderItem::where('order_id', $orderId)
                              ->where('id', $itemId)
                              ->firstOrFail();
        
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

---

## STEP 4: IMPLEMENT QUERY PARAMETERS

Add filtering, sorting, and pagination:

```php
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
            'last_page' => $menuItems->lastPage()
        ]
    ], 200);
}
```

**Example API Calls:**
```
GET /api/menu-items?category=main
GET /api/menu-items?available=true
GET /api/menu-items?min_price=10&max_price=20
GET /api/menu-items?search=pizza
GET /api/menu-items?sort=price&order=desc
GET /api/menu-items?category=main&available=true&sort=price&order=asc
GET /api/menu-items?page=2&per_page=10
```

---

## STEP 5: URI VALIDATION CHECKLIST

Review your URIs against these criteria:

### ✅ CORRECT Examples

- `/api/menu-items` - Plural noun ✓
- `/api/orders/5/items` - Hierarchical structure ✓
- `/api/customers/10/orders` - Shows relationship ✓
- `/api/menu-items?category=main` - Query parameters for filtering ✓
- `/api/orders?status=pending&date=2024-01-15` - Multiple filters ✓

### ❌ INCORRECT Examples

- `/api/getMenuItems` - Uses verb ✗
- `/api/menu-item` - Singular noun ✗
- `/api/MenuItems` - Uppercase letters ✗
- `/api/order-items?order_id=5` - Should use hierarchy ✗
- `/api/orders/5/items/` - Trailing slash ✗
- `/api/orders/delete/5` - Verb in URI ✗
- `/api/menu_items` - Underscore instead of hyphen ✗

---

## PHASE 4 DELIVERABLES

### 1. Complete API Implementation (GitHub)
- All endpoints implemented
- Hierarchical routes working
- Query parameters functional
- Proper error handling

### 2. API Endpoint List (PDF, 3-4 pages)

Create comprehensive table with ALL endpoints:

| Method | URI | Description | Auth Required | Request Body | Response | Status Codes |
|--------|-----|-------------|---------------|--------------|----------|--------------|
| GET | /api/menu-items | List items | No | None | Array | 200 |
| POST | /api/menu-items | Create item | Yes | MenuItem | Object | 201, 400, 401 |
| ... | ... | ... | ... | ... | ... | ... |

**Minimum 20 endpoints required.**

### 3. URI Design Justification (PDF, 2-3 pages)

**Section 1: Design Decisions**
Explain:
- Why you chose specific URI structures
- How you implemented hierarchical relationships
- When you used query parameters vs path parameters

**Section 2: Rule Compliance**
Create table showing compliance:

| Rule | Example from Your API | Compliant? |
|------|----------------------|------------|
| Plural nouns | /api/menu-items | ✅ YES |
| No verbs | GET /api/orders | ✅ YES |
| Hyphens | /api/menu-items | ✅ YES |
| Lowercase | /api/customers | ✅ YES |
| No trailing slash | /api/orders/5 | ✅ YES |
| Hierarchical | /api/orders/5/items | ✅ YES |

**Section 3: Hierarchical Examples**
Show at least 3 hierarchical URI examples:

```
Example 1: Order Items
URI: /api/orders/5/items
Relationship: Order (parent) → OrderItems (children)
Justification: Items belong to specific order, hierarchy shows ownership

Example 2: Customer Orders
URI: /api/customers/10/orders
Relationship: Customer (parent) → Orders (children)
Justification: Orders belong to customer, easier to fetch customer's orders

Example 3: Category Menu Items
URI: /api/categories/3/menu-items
Relationship: Category (parent) → MenuItems (children)
Justification: Items belong to category, natural grouping
```

### 4. Complete API Documentation (PDF, 6-8 pages)

Include:
- Base URL
- Authentication method
- All endpoints with:
  - HTTP method
  - URI
  - Description
  - Request headers
  - Request body (with example)
  - Response body (with example)
  - Possible status codes
  - Error responses

**Example Format:**
```
GET /api/menu-items/{id}

Description: Retrieve a single menu item by ID

Authentication: Not required

Request:
  GET /api/menu-items/5
  Headers:
    Accept: application/json

Response (200 OK):
  {
    "success": true,
    "data": {
      "id": 5,
      "name": "Margherita Pizza",
      "description": "Classic Italian pizza",
      "category": "main",
      "price": 12.99,
      "image_url": "https://example.com/pizza.jpg",
      "is_available": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }

Response (404 Not Found):
  {
    "success": false,
    "message": "Menu item not found"
  }

Status Codes:
  200 - Success
  404 - Item not found
  500 - Server error
```

### 5. Postman Collection (JSON Export)

Organize by resource:
- Menu Items folder (10+ requests)
- Orders folder (10+ requests)
- Customers folder (5+ requests)
- Categories folder (5+ requests)

Include:
- Environment variables
- Example requests
- Pre-request scripts (for auth tokens)
- Test assertions (optional)

---

## PHASE 4 GRADING RUBRIC (25 Points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **URI Structure** | 8 | Plural nouns, no verbs, proper hierarchy |
| **Hierarchical Routes** | 6 | Nested resources properly implemented |
| **Query Parameters** | 4 | Filtering, sorting, pagination working |
| **Documentation** | 5 | Complete, clear API documentation |
| **Justification** | 2 | Clear explanation of design decisions |

### Detailed Breakdown

**URI Structure (8 points)**
- Plural nouns: 2 points
- No verbs: 2 points
- Lowercase/hyphens: 1 point
- No trailing slashes: 1 point
- Consistency: 2 points

**Hierarchical Routes (6 points)**
- Order items: 2 points
- Customer orders: 2 points
- Category items: 2 points

**Query Parameters (4 points)**
- Filtering: 1.5 points
- Sorting: 1 point
- Pagination: 1.5 points

**Documentation (5 points)**
- Endpoint list: 2 points
- Request/response examples: 2 points
- Error handling: 1 point

**Justification (2 points)**
- Design decisions: 1 point
- Rule compliance: 1 point


---

# GRADING RUBRIC - COMPLETE PROJECT

## Overall Grade Distribution

| Phase | Weight | Points |
|-------|--------|--------|
| Phase 1: Models & Scaffolding | 25% | 25 |
| Phase 2: Bootstrap Integration | 25% | 25 |
| Phase 3: REST Principles | 25% | 25 |
| Phase 4: URI Design | 25% | 25 |
| **Total** | **100%** | **100** |
| Bonus Challenges | +5% | +5 |
| **Maximum Possible** | **105%** | **105** |

## Grade Scale

| Percentage | Letter Grade | Description |
|------------|--------------|-------------|
| 90-100% | A | Excellent |
| 80-89% | B | Good |
| 70-79% | C | Satisfactory |
| 60-69% | D | Pass |
| <60% | F | Fail |

## Deductions

| Violation | Penalty |
|-----------|---------|
| Late submission (per day) | -5 points |
| Plagiarism (detected) | -100 points (F grade) |
| Incomplete documentation | -10 points |
| Non-functional code | -20 points |
| Missing GitHub repository | -15 points |
| No video demonstration | -5 points |

---

# COMMON MISTAKES TO AVOID

## Phase 1 Mistakes

### ❌ Mistake 1: Incorrect Model Relationships
```php
// WRONG: No relationship defined
class Order extends Model {
    // Missing relationship
}

// CORRECT: Proper relationship
class Order extends Model {
    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
}
```

### ❌ Mistake 2: Missing Validation
```php
// WRONG: No validation
public function store(Request $request) {
    MenuItem::create($request->all()); // Dangerous!
}

// CORRECT: Proper validation
public function store(Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:200',
        'price' => 'required|numeric|min:0.01'
    ]);
    MenuItem::create($validated);
}
```

### ❌ Mistake 3: Not Using Migrations
```php
// WRONG: Creating tables manually in database

// CORRECT: Using migrations
php artisan make:migration create_menu_items_table
```

---

## Phase 2 Mistakes

### ❌ Mistake 4: Not Using Bootstrap Grid
```html
<!-- WRONG: Fixed widths -->
<div style="width: 300px;">Item</div>

<!-- CORRECT: Responsive grid -->
<div class="col-12 col-md-6 col-lg-3">Item</div>
```

### ❌ Mistake 5: Missing Viewport Meta Tag
```html
<!-- WRONG: No viewport tag -->
<head>
    <title>My Site</title>
</head>

<!-- CORRECT: Viewport for responsive -->
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Site</title>
</head>
```

### ❌ Mistake 6: Inline Styles Instead of Bootstrap Classes
```html
<!-- WRONG: Inline styles -->
<button style="background: blue; color: white; padding: 10px;">Click</button>

<!-- CORRECT: Bootstrap classes -->
<button class="btn btn-primary">Click</button>
```

---

## Phase 3 Mistakes

### ❌ Mistake 7: Using Sessions (Not Stateless)
```php
// WRONG: Stateful with sessions
Session::put('user_id', $user->id);

// CORRECT: Stateless with tokens
$token = $user->createToken('auth')->plainTextToken;
return response()->json(['token' => $token]);
```

### ❌ Mistake 8: Wrong HTTP Methods
```php
// WRONG: Using GET for create
Route::get('/menu-items/create', [Controller::class, 'create']);

// CORRECT: Using POST for create
Route::post('/menu-items', [Controller::class, 'store']);
```

### ❌ Mistake 9: Incorrect Status Codes
```php
// WRONG: Always returning 200
return response()->json(['data' => $item], 200); // Even for create!

// CORRECT: Proper status codes
return response()->json(['data' => $item], 201); // For create
```

---

## Phase 4 Mistakes

### ❌ Mistake 10: Verbs in URIs
```php
// WRONG: Verbs in URI
Route::get('/api/getMenuItems', ...);
Route::post('/api/createOrder', ...);

// CORRECT: Nouns only
Route::get('/api/menu-items', ...);
Route::post('/api/orders', ...);
```

### ❌ Mistake 11: Singular Nouns
```php
// WRONG: Singular
Route::get('/api/menu-item', ...);

// CORRECT: Plural
Route::get('/api/menu-items', ...);
```

### ❌ Mistake 12: Not Using Hierarchical Structure
```php
// WRONG: Flat structure with query params
Route::get('/api/order-items?order_id=5', ...);

// CORRECT: Hierarchical
Route::get('/api/orders/5/items', ...);
```

### ❌ Mistake 13: Trailing Slashes
```php
// WRONG: Trailing slash
Route::get('/api/menu-items/', ...);

// CORRECT: No trailing slash
Route::get('/api/menu-items', ...);
```

---

# VIVA QUESTIONS

## Phase 1 Questions

**Q1**: What is MVC architecture and why is it important?  
**Expected Answer**: MVC separates application into Model (data), View (UI), and Controller (logic). Benefits include separation of concerns, maintainability, testability, and parallel development.

**Q2**: Explain the difference between Model and Controller.  
**Expected Answer**: Model handles data and business logic (database operations, validation). Controller handles request processing and coordinates between Model and View.

**Q3**: What is scaffolding and how does it improve productivity?  
**Expected Answer**: Scaffolding is automatic code generation for common patterns (CRUD). It saves time, ensures consistency, follows best practices, and reduces boilerplate code.

**Q4**: What are migrations and why use them?  
**Expected Answer**: Migrations are version control for database schema. They allow team collaboration, easy rollback, consistent schema across environments, and track database changes.

**Q5**: Explain the relationship between Order and OrderItem models.  
**Expected Answer**: One-to-Many relationship. One Order has many OrderItems. OrderItem has foreign key to Order. Allows tracking multiple items per order.

---

## Phase 2 Questions

**Q6**: How does Bootstrap's 12-column grid system work?  
**Expected Answer**: Page divided into 12 equal columns. Elements span multiple columns using col-* classes. Responsive breakpoints (sm, md, lg) change layout at different screen sizes.

**Q7**: What is mobile-first design?  
**Expected Answer**: Design for mobile devices first, then enhance for larger screens. Uses min-width media queries. Ensures good mobile experience, which is increasingly important.

**Q8**: Explain the difference between col-md-6 and col-lg-6.  
**Expected Answer**: col-md-6 applies at medium screens (≥768px), col-lg-6 at large screens (≥992px). Allows different layouts at different breakpoints.

**Q9**: What is the purpose of the viewport meta tag?  
**Expected Answer**: Tells browser how to control page dimensions and scaling on mobile devices. Essential for responsive design. Without it, mobile browsers render at desktop width.

**Q10**: Why use Bootstrap components instead of custom CSS?  
**Expected Answer**: Faster development, consistent design, tested across browsers, responsive by default, accessible, well-documented, community support.

---

## Phase 3 Questions

**Q11**: What is statelessness in REST and why is it important?  
**Expected Answer**: Server doesn't store client context between requests. Each request contains all needed information. Enables scalability, reliability, load balancing, and horizontal scaling.

**Q12**: Explain the difference between stateful and stateless authentication.  
**Expected Answer**: Stateful uses server-side sessions (stores user data on server). Stateless uses tokens (all info in token, server just validates). Stateless is more scalable.

**Q13**: What is idempotency? Give examples.  
**Expected Answer**: Operation produces same result when called multiple times. GET, PUT, DELETE are idempotent. POST is not. Important for safe retries and predictable behavior.

**Q14**: Why is POST not idempotent?  
**Expected Answer**: POST creates new resource each time. Calling twice creates two resources with different IDs. Cannot safely retry without creating duplicates.

**Q15**: What HTTP status code should be returned when creating a resource?  
**Expected Answer**: 201 Created. Indicates successful creation. Should include Location header with new resource URI. 200 OK is acceptable but less specific.

---

## Phase 4 Questions

**Q16**: Why use plural nouns in REST URIs?  
**Expected Answer**: Represents collections. Consistent pattern (collection and individual use same base). Industry standard. More intuitive (/users/5 reads as "user 5 from users collection").

**Q17**: Why avoid verbs in REST URIs?  
**Expected Answer**: HTTP method indicates action (GET, POST, etc.). URI identifies resource, not action. Keeps URIs clean and consistent. Follows REST principles.

**Q18**: Explain hierarchical URI structure with example.  
**Expected Answer**: Shows parent-child relationships through URI path. Example: /orders/5/items shows items belonging to order 5. More intuitive than query parameters. Shows resource ownership.

**Q19**: When should you use query parameters vs path parameters?  
**Expected Answer**: Path parameters for resource identification (/users/5). Query parameters for filtering, sorting, pagination (?category=main&sort=price). Path is required, query is optional.

**Q20**: What is the difference between PUT and PATCH?  
**Expected Answer**: PUT replaces entire resource (must send all fields). PATCH updates specific fields (send only changed fields). PUT is idempotent, PATCH may not be.

---

# BONUS CHALLENGES (+5 Points)

Complete ANY ONE of the following for bonus points:

## Challenge 1: Advanced Search (+5 points)

Implement full-text search with:
- Search across multiple fields (name, description)
- Fuzzy matching (typo tolerance)
- Search highlighting in results
- Search suggestions/autocomplete

**Deliverable**: Working search feature + documentation

---

## Challenge 2: Real-time Order Tracking (+5 points)

Implement WebSocket-based real-time updates:
- Order status updates in real-time
- Live order notifications
- Real-time cart updates
- No page refresh needed

**Deliverable**: Working real-time feature + documentation

---

## Challenge 3: Payment Integration (+5 points)

Integrate payment gateway:
- Stripe or PayPal integration
- Secure payment processing
- Order confirmation after payment
- Payment history

**Deliverable**: Working payment system + documentation

---

## Challenge 4: Advanced API Features (+5 points)

Implement:
- API versioning (/api/v1/, /api/v2/)
- Rate limiting (max requests per minute)
- API key management
- Request/response logging
- API analytics dashboard

**Deliverable**: Working features + documentation

---

## Challenge 5: Comprehensive Testing (+5 points)

Implement:
- Unit tests for models (minimum 10 tests)
- Integration tests for API (minimum 15 tests)
- Feature tests for UI (minimum 10 tests)
- Test coverage report (>80%)

**Deliverable**: Test suite + coverage report

---

# SUBMISSION CHECKLIST

## Before Final Submission

### ✅ Code Quality
- [ ] All code properly formatted and indented
- [ ] No commented-out code blocks
- [ ] Meaningful variable and function names
- [ ] Code follows framework conventions
- [ ] No hardcoded credentials (use .env)
- [ ] .gitignore properly configured

### ✅ Functionality
- [ ] All CRUD operations work
- [ ] Forms validate input
- [ ] Error messages display properly
- [ ] Responsive design works on mobile
- [ ] API returns correct status codes
- [ ] Authentication works correctly

### ✅ Documentation
- [ ] README.md with setup instructions
- [ ] All phases documented (PDF)
- [ ] Screenshots included
- [ ] API documentation complete
- [ ] Code comments where necessary
- [ ] Database schema documented

### ✅ GitHub Repository
- [ ] Repository is public or instructor has access
- [ ] All code committed and pushed
- [ ] Meaningful commit messages
- [ ] .env.example file included
- [ ] README.md in root directory
- [ ] No sensitive data committed

### ✅ Deliverables
- [ ] Phase 1 documentation (PDF)
- [ ] Phase 2 documentation (PDF)
- [ ] Phase 3 documentation (PDF)
- [ ] Phase 4 documentation (PDF)
- [ ] Postman collection (JSON)
- [ ] Video demonstration (link)
- [ ] All screenshots clear and labeled

### ✅ Testing
- [ ] Tested on different browsers
- [ ] Tested on mobile device
- [ ] All API endpoints tested
- [ ] Error scenarios tested
- [ ] Edge cases considered

---

# FINAL SUBMISSION PACKAGE

Submit a ZIP file named: `StudentID_Name_FoodOrderingSystem_Final.zip`

## Contents:

```
StudentID_Name_FoodOrderingSystem_Final/
├── Documentation/
│   ├── Phase1_Models_Scaffolding.pdf
│   ├── Phase2_Bootstrap_Integration.pdf
│   ├── Phase3_REST_Principles.pdf
│   ├── Phase4_URI_Design.pdf
│   ├── Complete_API_Documentation.pdf
│   └── Screenshots/
│       ├── Phase1/
│       ├── Phase2/
│       ├── Phase3/
│       └── Phase4/
├── Postman_Collection/
│   └── FoodOrderingSystem.postman_collection.json
├── Video_Demo/
│   └── demo_link.txt (YouTube/Drive link)
└── GitHub_Link.txt (repository URL)
```

**Note**: Source code should be in GitHub repository, not in ZIP file.

---

# ACADEMIC INTEGRITY POLICY

## Allowed:
✅ Discussing concepts with classmates  
✅ Using official framework documentation  
✅ Searching for solutions to specific technical problems  
✅ Using Stack Overflow for debugging  
✅ Asking instructor/TA for clarification

## NOT Allowed:
❌ Copying code from classmates  
❌ Submitting code generated entirely by AI tools  
❌ Using complete project templates from internet  
❌ Sharing your code with other students  
❌ Copying code without understanding it

## Plagiarism Detection:
- All submissions will be checked using plagiarism detection tools
- Code similarity analysis will be performed
- Suspicious submissions will be investigated
- Penalties range from zero grade to academic probation

## Consequences:
- **First Offense**: Zero on assignment + warning
- **Second Offense**: F in course + academic probation
- **Third Offense**: Expulsion from program

---

# SUPPORT & RESOURCES

## Office Hours
- **Instructor**: [Days/Times]
- **Teaching Assistant**: [Days/Times]
- **Location**: [Room Number/Online Link]

## Communication
- **Email**: [instructor@university.edu]
- **Discussion Forum**: [Link]
- **Slack/Discord**: [Link]

## Resources
- **Framework Documentation**:
  - Laravel: https://laravel.com/docs
  - Django: https://docs.djangoproject.com/
  - ASP.NET Core: https://docs.microsoft.com/aspnet/core/

- **Bootstrap**: https://getbootstrap.com/docs/
- **REST API Design**: https://restfulapi.net/
- **HTTP Status Codes**: https://httpstatuses.com/
- **Postman**: https://learning.postman.com/

## Additional Help
- **Stack Overflow**: Tag questions appropriately
- **GitHub Issues**: For framework-specific problems
- **YouTube Tutorials**: Supplementary learning
- **Study Groups**: Form groups for discussion (not code sharing)

---

# CONCLUSION

This lab project is designed to give you hands-on experience with:
- Modern web development frameworks
- MVC architectural pattern
- RESTful API design
- Responsive web design
- Professional development practices

**Key Takeaways:**
1. MVC separates concerns for better maintainability
2. Scaffolding accelerates development
3. Bootstrap enables rapid UI development
4. REST principles ensure scalable APIs
5. Proper URI design improves API usability

**Success Tips:**
- Start early, don't wait until deadline
- Test frequently, don't wait until end
- Document as you go, not at the end
- Ask questions when stuck
- Follow best practices, not shortcuts
- Learn from mistakes, iterate and improve

**Good luck with your project!** 🚀

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Course**: CS-301 Web Development  
**Department**: Computer Science

---

**END OF LAB MANUAL**
