# 🎓 ONLINE FOOD ORDERING SYSTEM
## Professional Web Development Lab Manual

---

**Course:** Web Development & Software Architecture  
**Level:** Undergraduate (3rd/4th Year)  
**Duration:** 6-8 Weeks  
**Framework Options:** Laravel / Django / ASP.NET Core  
**Instructor:** Senior Full Stack Development & UI/UX Mentor

---

## 📋 TABLE OF CONTENTS

1. [Introduction & Learning Outcomes](#introduction)
2. [Project Overview](#project-overview)
3. [Technical Requirements](#technical-requirements)
4. [Phase 1: Models & Scaffolding](#phase-1)
5. [Phase 2: Professional UI/UX Design](#phase-2)
6. [Phase 3: REST Principles & HTTP Methods](#phase-3)
7. [Phase 4: Resource & URI Design](#phase-4)
8. [Complete Folder Structure](#folder-structure)
9. [Database Schema](#database-schema)
10. [API Endpoints & Idempotency](#api-endpoints)
11. [Screenshots Guide](#screenshots-guide)
12. [Grading Rubric](#grading-rubric)
13. [Viva Questions](#viva-questions)
14. [Bonus Challenge](#bonus-challenge)
15. [Common Mistakes](#common-mistakes)
16. [Submission Checklist](#submission-checklist)

---

## 🎯 INTRODUCTION & LEARNING OUTCOMES {#introduction}

### Course Context
This lab project is designed to teach modern web development practices through building a real-world application. You will learn MVC architecture, RESTful API design, and professional UI/UX implementation.

### Learning Outcomes
By completing this project, you will be able to:


1. ✅ Implement MVC (Model-View-Controller) architecture
2. ✅ Use framework scaffolding tools for rapid development
3. ✅ Design and implement RESTful APIs following industry standards
4. ✅ Create professional, responsive UI using Bootstrap 5
5. ✅ Apply modern UI/UX design principles
6. ✅ Understand HTTP methods and their proper usage
7. ✅ Design resource-oriented URIs
8. ✅ Implement stateless authentication patterns
9. ✅ Identify and implement idempotent operations
10. ✅ Deploy a production-ready web application

### Why This Project Matters
- **Real-World Skills:** Build applications that look and function like commercial products
- **Industry Standards:** Learn patterns used by companies like Uber Eats, DoorDash, Zomato
- **Portfolio Ready:** Create a project you can showcase to employers
- **Full Stack Understanding:** Master both backend architecture and frontend design

---

## 📱 PROJECT OVERVIEW {#project-overview}

### What You're Building
An **Online Food Ordering System** that allows users to:
- Browse a menu of food items with images and descriptions
- View detailed information about each dish
- Place orders for delivery
- Manage orders (view, update, cancel)
- Access data through RESTful APIs

### Critical Design Philosophy


**⚠️ IMPORTANT: This is NOT a classroom template project!**

Your website MUST look like a **professional commercial application**. Think:
- 🍕 **Uber Eats** - Modern, clean, appetizing
- 🍔 **DoorDash** - Professional, trustworthy, easy to use
- 🍜 **Zomato** - Vibrant, engaging, food-focused

**What "Professional" Means:**
- ✅ Custom color schemes (food-related: reds, oranges, warm tones)
- ✅ High-quality food images
- ✅ Smooth animations and transitions
- ✅ Modern typography (Google Fonts)
- ✅ Proper spacing and visual hierarchy
- ✅ Responsive design (mobile-first)
- ✅ Attention to details (shadows, rounded corners, hover effects)
- ❌ NO default Bootstrap blue buttons
- ❌ NO plain white backgrounds
- ❌ NO Times New Roman fonts
- ❌ NO basic HTML tables for layout

---

## 🛠️ TECHNICAL REQUIREMENTS {#technical-requirements}

### Framework Selection
Choose ONE MVC framework:

#### Option 1: Laravel (PHP)
```bash
composer create-project laravel/laravel food-ordering-app
php artisan serve
```

#### Option 2: Django (Python)
```bash
django-admin startproject food_ordering_system
python manage.py runserver
```


#### Option 3: ASP.NET Core (C#)
```bash
dotnet new mvc -n FoodOrderingApp
dotnet run
```

### Required Technologies
- **Backend:** Your chosen MVC framework
- **Frontend:** Bootstrap 5.3+ (latest version)
- **Database:** SQLite / MySQL / PostgreSQL
- **Version Control:** Git & GitHub
- **Additional:** Google Fonts, Bootstrap Icons

### Development Environment
- Code Editor: VS Code / PHPStorm / PyCharm
- Browser: Chrome / Firefox (with DevTools)
- Terminal: Command Line / PowerShell / Bash

---

## 📦 PHASE 1: MODELS & SCAFFOLDING {#phase-1}

### Objective
Learn to use your framework's built-in tools to generate models, controllers, and basic views automatically.

### Duration: Week 1-2

### Step 1: Create Models

You need TWO core models:

#### Model 1: MenuItem
**Attributes:**
- `id` (Primary Key, Auto-increment)
- `name` (String, Required, Max 100 chars)
- `description` (Text, Required)
- `price` (Decimal, Required, 2 decimal places)
- `category` (String: appetizer/main/dessert/beverage)
- `image_url` (String, URL to food image)
- `is_available` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)


#### Model 2: Order
**Attributes:**
- `id` (Primary Key, Auto-increment)
- `customer_name` (String, Required, Max 100 chars)
- `customer_email` (String, Required, Email format)
- `customer_phone` (String, Required)
- `delivery_address` (Text, Required)
- `menu_item_id` (Foreign Key → MenuItem)
- `quantity` (Integer, Required, Min: 1)
- `total_price` (Decimal, Calculated: quantity × item price)
- `status` (String: pending/confirmed/delivered/cancelled)
- `order_date` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Relationship:** Order belongs to MenuItem (Many-to-One)

### Step 2: Use Scaffolding Tools

#### For Laravel:
```bash
# Generate MenuItem with migration, model, controller, and views
php artisan make:model MenuItem -mcr
php artisan make:migration create_menu_items_table

# Generate Order
php artisan make:model Order -mcr
php artisan make:migration create_orders_table

# Run migrations
php artisan migrate
```

#### For Django:
```bash
# Create app
python manage.py startapp menu

# Generate models in models.py
# Then create migrations
python manage.py makemigrations
python manage.py migrate

# Create views and templates
```


#### For ASP.NET Core:
```bash
# Add Entity Framework
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# Create models in Models folder
# Then scaffold controllers
dotnet aspnet-codegenerator controller -name MenuItemsController -m MenuItem -dc ApplicationDbContext --relativeFolderPath Controllers --useDefaultLayout

# Apply migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Step 3: Generate CRUD Views

Your scaffolding should automatically create:
- **Index** - List all items
- **Create** - Form to add new item
- **Show/Details** - View single item
- **Edit** - Form to update item
- **Delete** - Confirmation and deletion

**At this stage, views will be PLAIN HTML** - that's expected! We'll enhance them in Phase 2.

### Step 4: Test Basic Functionality

Run your application and verify:
- ✅ Can create new menu items
- ✅ Can view list of menu items
- ✅ Can view individual item details
- ✅ Can edit existing items
- ✅ Can delete items
- ✅ Can create orders
- ✅ Can view orders list

### Understanding MVC Architecture

**Model (M):** Data structure and business logic
- MenuItem.php / MenuItem.py / MenuItem.cs
- Handles database operations

**View (V):** User interface (HTML templates)
- index.blade.php / index.html / Index.cshtml
- Displays data to users


**Controller (C):** Request handler and coordinator
- MenuItemController.php / views.py / MenuItemsController.cs
- Receives requests, processes data, returns responses

**Why MVC Matters:**
- ✅ Separation of concerns
- ✅ Easier testing
- ✅ Better code organization
- ✅ Team collaboration
- ✅ Maintainability

### Phase 1 Deliverables

Submit the following:

1. **Screenshots:**
   - Plain HTML CRUD pages (before styling)
   - Database tables showing data
   - Terminal showing successful migrations

2. **Code Files:**
   - Model definitions
   - Migration files
   - Controller files
   - Plain view templates

3. **Documentation (500 words):**
   - Explain MVC architecture
   - How scaffolding improved productivity
   - Challenges faced and solutions

---

## 🎨 PHASE 2: PROFESSIONAL UI/UX DESIGN {#phase-2}

### Objective
Transform plain HTML into a stunning, professional food ordering website that rivals commercial applications.

### Duration: Week 3-4

### ⚠️ CRITICAL DESIGN REQUIREMENTS

This phase is THE MOST IMPORTANT. Your UI will be heavily graded.


### Step 1: Setup Bootstrap 5

Add to your layout/base template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FoodHub - Order Delicious Food Online</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <!-- Custom CSS -->
    <link href="/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Your content here -->
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### Step 2: Create Professional Navbar

**Requirements:**
- ✅ Gradient background (not solid color)
- ✅ Brand logo with icon
- ✅ Navigation links with icons
- ✅ Mobile responsive (hamburger menu)
- ✅ Active state highlighting
- ✅ Smooth transitions


**Example Code:**

```html
<nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="container">
        <a class="navbar-brand fw-bold" href="/">
            <i class="bi bi-shop"></i> FoodHub
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/">
                        <i class="bi bi-house-door"></i> Home
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/menu-items">
                        <i class="bi bi-grid"></i> Menu
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/orders">
                        <i class="bi bi-bag-check"></i> Orders
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

### Step 3: Design Hero Section (Homepage)

**Requirements:**
- ✅ Large, eye-catching headline
- ✅ Compelling subheading
- ✅ Call-to-action buttons
- ✅ High-quality food image
- ✅ Gradient or image background
- ✅ Floating animation (optional but impressive)


**Example Code:**

```html
<div class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 0; color: white;">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6">
                <h1 class="display-3 fw-bold mb-4">
                    Delicious Food<br>Delivered to You
                </h1>
                <p class="lead mb-4">
                    Order your favorite meals from the comfort of your home. 
                    Fast delivery, fresh ingredients, amazing taste!
                </p>
                <a href="/menu-items" class="btn btn-light btn-lg me-3">
                    <i class="bi bi-grid"></i> Browse Menu
                </a>
                <a href="/orders/create" class="btn btn-outline-light btn-lg">
                    <i class="bi bi-cart-plus"></i> Order Now
                </a>
            </div>
            <div class="col-lg-6 text-center">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600" 
                     alt="Delicious Food" 
                     class="img-fluid rounded-circle shadow-lg"
                     style="max-width: 500px; animation: float 3s ease-in-out infinite;">
            </div>
        </div>
    </div>
</div>

<style>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
</style>
```

### Step 4: Display Menu Items with Bootstrap Cards

**Requirements:**
- ✅ Use Bootstrap Grid (col-md-4 or col-lg-3)
- ✅ Modern card design with shadows
- ✅ Food images at top
- ✅ Title, description, price
- ✅ Category badge
- ✅ Action buttons (View, Edit, Delete)
- ✅ Hover effects (scale, shadow increase)
- ✅ Rounded corners


**Example Code:**

```html
<div class="container my-5">
    <h2 class="text-center mb-5 fw-bold">Our Menu</h2>
    
    <div class="row g-4">
        <!-- Loop through menu items -->
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm" style="border-radius: 20px; overflow: hidden; transition: all 0.3s;">
                <img src="food-image.jpg" class="card-img-top" alt="Food Name" style="height: 200px; object-fit: cover;">
                
                <div class="card-body">
                    <h5 class="card-title fw-bold">Margherita Pizza</h5>
                    <p class="card-text text-muted small">
                        Fresh mozzarella, tomatoes, and basil on crispy crust
                    </p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-warning text-dark">Main Course</span>
                        <span class="fw-bold" style="color: #ff6b6b; font-size: 1.2rem;">$12.99</span>
                    </div>
                </div>
                
                <div class="card-footer bg-transparent border-0">
                    <div class="btn-group w-100">
                        <a href="/menu-items/1" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-eye"></i> View
                        </a>
                        <a href="/menu-items/1/edit" class="btn btn-sm btn-outline-warning">
                            <i class="bi bi-pencil"></i> Edit
                        </a>
                        <button class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

**CSS for Card Hover Effect:**

```css
.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
}
```


### Step 5: Style Forms Professionally

**Requirements:**
- ✅ Floating labels OR styled form groups
- ✅ Proper spacing and alignment
- ✅ Input validation styling
- ✅ Custom buttons (not default blue)
- ✅ Form in a card with shadow
- ✅ Icons in input fields (optional)

**Example Code:**

```html
<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="card shadow-lg" style="border-radius: 20px; border: none;">
                <div class="card-body p-5">
                    <h2 class="text-center mb-4 fw-bold">Add New Menu Item</h2>
                    
                    <form method="POST" action="/menu-items">
                        <!-- Name Field -->
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="name" name="name" 
                                   placeholder="Item Name" required>
                            <label for="name">
                                <i class="bi bi-card-text"></i> Item Name
                            </label>
                        </div>
                        
                        <!-- Description Field -->
                        <div class="form-floating mb-3">
                            <textarea class="form-control" id="description" name="description" 
                                      placeholder="Description" style="height: 100px" required></textarea>
                            <label for="description">
                                <i class="bi bi-file-text"></i> Description
                            </label>
                        </div>
                        
                        <!-- Price Field -->
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" id="price" name="price" 
                                   placeholder="Price" step="0.01" required>
                            <label for="price">
                                <i class="bi bi-currency-dollar"></i> Price
                            </label>
                        </div>
                        

                        <!-- Category Field -->
                        <div class="form-floating mb-3">
                            <select class="form-select" id="category" name="category" required>
                                <option value="">Choose...</option>
                                <option value="appetizer">Appetizer</option>
                                <option value="main">Main Course</option>
                                <option value="dessert">Dessert</option>
                                <option value="beverage">Beverage</option>
                            </select>
                            <label for="category">
                                <i class="bi bi-tag"></i> Category
                            </label>
                        </div>
                        
                        <!-- Image URL Field -->
                        <div class="form-floating mb-4">
                            <input type="url" class="form-control" id="image_url" name="image_url" 
                                   placeholder="Image URL" required>
                            <label for="image_url">
                                <i class="bi bi-image"></i> Image URL
                            </label>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary btn-lg w-100" 
                                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                            <i class="bi bi-plus-circle"></i> Add Menu Item
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Step 6: Create Professional Footer

**Requirements:**
- ✅ Dark background
- ✅ Company/project name
- ✅ Copyright information
- ✅ Social links (optional)
- ✅ Proper padding


**Example Code:**

```html
<footer style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 40px 0; margin-top: 80px;">
    <div class="container text-center">
        <h5 class="mb-3"><i class="bi bi-shop"></i> FoodHub</h5>
        <p class="mb-2">Your Favorite Food Ordering Platform</p>
        <p class="mb-0">© 2024 Food Ordering System | Web Development Course Project</p>
    </div>
</footer>
```

### Step 7: Custom CSS File (style.css)

Create `public/css/style.css` with professional styling:

```css
/* ===== GLOBAL STYLES ===== */
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --danger: #ff6b6b;
    --success: #51cf66;
    --warning: #ffd43b;
    --dark: #2c3e50;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    background: #f8f9fa;
    color: #333;
    line-height: 1.6;
}

/* ===== NAVBAR STYLES ===== */
.navbar {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    padding: 15px 0;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 700;
    transition: transform 0.3s;
}

.navbar-brand:hover {
    transform: scale(1.05);
}

.nav-link {
    font-weight: 500;
    margin: 0 10px;
    transition: all 0.3s;
    border-radius: 8px;
    padding: 8px 16px !important;
}

.nav-link:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
}


/* ===== CARD STYLES ===== */
.card {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.card-img-top {
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s;
}

.card:hover .card-img-top {
    transform: scale(1.1);
}

/* ===== BUTTON STYLES ===== */
.btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border: none;
    border-radius: 12px;
    padding: 12px 30px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

/* ===== FORM STYLES ===== */
.form-control, .form-select {
    border-radius: 12px;
    border: 2px solid #e9ecef;
    padding: 12px;
    transition: all 0.3s;
}

.form-control:focus, .form-select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* ===== ANIMATIONS ===== */
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-slide-left {
    animation: slideInLeft 0.6s ease-out;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .hero-section h1 {
        font-size: 2rem;
    }
    
    .card-img-top {
        height: 150px;
    }
}
```


### Step 8: Color Theme Selection

Choose a food-related color palette:

**Option 1: Warm & Appetizing**
- Primary: `#ff6b6b` (Coral Red)
- Secondary: `#ff8c42` (Orange)
- Accent: `#ffd93d` (Yellow)

**Option 2: Fresh & Modern**
- Primary: `#51cf66` (Green)
- Secondary: `#20c997` (Teal)
- Accent: `#ff6b6b` (Red)

**Option 3: Premium & Elegant**
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Deep Purple)
- Accent: `#f093fb` (Pink)

Apply your chosen colors consistently across:
- Navbar background
- Buttons
- Badges
- Links
- Hover effects

### Step 9: Bootstrap Grid System

**Understanding the 12-Column Grid:**

```html
<div class="container">
    <div class="row">
        <!-- On mobile: full width, tablet: half, desktop: quarter -->
        <div class="col-12 col-md-6 col-lg-3">
            <!-- Content -->
        </div>
    </div>
</div>
```

**Breakpoints:**
- `col-` : Extra small (<576px)
- `col-sm-` : Small (≥576px)
- `col-md-` : Medium (≥768px)
- `col-lg-` : Large (≥992px)
- `col-xl-` : Extra large (≥1200px)

**Your menu items should use:**
```html
<div class="col-12 col-sm-6 col-md-4 col-lg-3">
```
This means:
- Mobile: 1 item per row
- Tablet: 2 items per row
- Desktop: 3-4 items per row


### Step 10: Additional UI Enhancements

**Add these for extra points:**

1. **Loading Animations**
```css
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

2. **Scroll-to-Top Button**
```html
<button id="scrollBtn" onclick="scrollToTop()" 
        style="position: fixed; bottom: 20px; right: 20px; display: none;">
    <i class="bi bi-arrow-up"></i>
</button>

<script>
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        document.getElementById('scrollBtn').style.display = 'block';
    } else {
        document.getElementById('scrollBtn').style.display = 'none';
    }
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}
</script>
```

3. **Toast Notifications** (for success/error messages)
```html
<div class="toast-container position-fixed top-0 end-0 p-3">
    <div class="toast" role="alert">
        <div class="toast-header">
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            Menu item added successfully!
        </div>
    </div>
</div>
```

4. **Modal for Delete Confirmation**
```html
<div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this item?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>
</div>
```


### Phase 2 Deliverables

Submit the following:

1. **Screenshots (Before & After):**
   - Plain HTML version (Phase 1)
   - Styled version (Phase 2)
   - Mobile responsive view
   - Tablet view
   - Desktop view

2. **Code Files:**
   - Updated view templates
   - Custom CSS file
   - Layout/base template

3. **Documentation (800 words):**
   - Explain Bootstrap Grid System
   - List all Bootstrap components used
   - Describe your color theme choice
   - Explain responsive design approach
   - Document custom CSS additions

4. **Design Justification:**
   - Why you chose specific colors
   - How your design improves user experience
   - Accessibility considerations

---

## 🌐 PHASE 3: REST PRINCIPLES & HTTP METHODS {#phase-3}

### Objective
Understand and implement RESTful architecture principles, focusing on statelessness and proper HTTP method usage.

### Duration: Week 5

### Understanding REST

**REST (Representational State Transfer)** is an architectural style for designing networked applications.

**Key Principles:**

1. **Client-Server Architecture**
   - Separation of concerns
   - Client handles UI, server handles data

2. **Statelessness**
   - Each request contains all necessary information
   - Server doesn't store client session
   - Authentication via tokens (not sessions)

3. **Uniform Interface**
   - Consistent URI structure
   - Standard HTTP methods
   - Predictable responses

4. **Resource-Based**
   - Everything is a resource
   - Resources identified by URIs
   - Resources manipulated through representations


### HTTP Methods Explained

#### GET - Retrieve Data
**Purpose:** Fetch resources without modifying them

**Characteristics:**
- ✅ Safe (doesn't change server state)
- ✅ Idempotent (multiple identical requests = same result)
- ✅ Cacheable
- ❌ Should not have request body

**Examples in Your Project:**
```
GET /menu-items          → List all menu items
GET /menu-items/5        → Get specific menu item
GET /orders              → List all orders
GET /orders/10           → Get specific order
```

**Implementation:**
```php
// Laravel
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);
```

#### POST - Create New Resource
**Purpose:** Submit data to create a new resource

**Characteristics:**
- ❌ Not safe (changes server state)
- ❌ NOT idempotent (multiple requests = multiple resources)
- ❌ Not cacheable
- ✅ Has request body

**Examples in Your Project:**
```
POST /menu-items         → Create new menu item
POST /orders             → Create new order
```

**Why NOT Idempotent:**
If you POST the same order 3 times, you'll create 3 separate orders!

**Implementation:**
```php
// Laravel
Route::post('/menu-items', [MenuItemController::class, 'store']);
```


#### PUT - Update Existing Resource (Complete Replacement)
**Purpose:** Replace entire resource with new data

**Characteristics:**
- ❌ Not safe (changes server state)
- ✅ Idempotent (multiple identical requests = same result)
- ❌ Not cacheable
- ✅ Has request body

**Examples in Your Project:**
```
PUT /menu-items/5        → Update menu item #5 (replace all fields)
PUT /orders/10           → Update order #10 (replace all fields)
```

**Why Idempotent:**
If you PUT the same update 3 times, the resource ends up in the same state!

**Implementation:**
```php
// Laravel
Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
```

#### PATCH - Partial Update
**Purpose:** Update specific fields of a resource

**Characteristics:**
- ❌ Not safe
- ✅ Idempotent (usually)
- ❌ Not cacheable
- ✅ Has request body

**Examples:**
```
PATCH /orders/10         → Update only status field
```

#### DELETE - Remove Resource
**Purpose:** Delete a resource

**Characteristics:**
- ❌ Not safe (changes server state)
- ✅ Idempotent (deleting same resource multiple times = same result)
- ❌ Not cacheable
- ❌ Usually no request body

**Examples in Your Project:**
```
DELETE /menu-items/5     → Delete menu item #5
DELETE /orders/10        → Cancel/delete order #10
```

**Why Idempotent:**
If you DELETE the same resource 3 times:
- 1st request: Resource deleted (200 OK)
- 2nd request: Resource already gone (404 Not Found)
- 3rd request: Resource still gone (404 Not Found)
Result is the same: resource doesn't exist!


### Statelessness in Detail

**What is Statelessness?**
The server doesn't remember previous requests from the client. Each request must contain ALL information needed to process it.

**Traditional Session-Based (NOT Stateless):**
```
1. User logs in → Server creates session, stores in memory
2. User makes request → Server checks session storage
3. User logs out → Server deletes session

Problem: Server must maintain session state for every user!
```

**RESTful Token-Based (Stateless):**
```
1. User logs in → Server generates JWT token, sends to client
2. User makes request → Client sends token in header
3. Server validates token (no session lookup needed)

Benefit: Server doesn't store anything! Scales better!
```

**Implementation Example:**

```javascript
// Client sends token with every request
fetch('/api/menu-items', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'Content-Type': 'application/json'
    }
});
```

**Your Documentation Must Explain:**
1. How authentication tokens are passed (Authorization header)
2. Why server doesn't store session data
3. Benefits of statelessness (scalability, reliability)
4. How each request is self-contained

### Idempotency Analysis

Create a table documenting each endpoint:

| HTTP Method | Endpoint | Idempotent? | Explanation |
|-------------|----------|-------------|-------------|
| GET | /menu-items | ✅ Yes | Reading data doesn't change state. Multiple requests return same data. |
| GET | /menu-items/5 | ✅ Yes | Fetching specific item is safe and repeatable. |
| POST | /menu-items | ❌ No | Each request creates a NEW menu item. 3 requests = 3 items. |
| PUT | /menu-items/5 | ✅ Yes | Updating item #5 multiple times with same data results in same final state. |
| DELETE | /menu-items/5 | ✅ Yes | Deleting item #5 once or multiple times has same result: item doesn't exist. |
| GET | /orders | ✅ Yes | Reading orders list is safe and repeatable. |
| POST | /orders | ❌ No | Each request creates a NEW order. Not idempotent! |
| PUT | /orders/10 | ✅ Yes | Updating order #10 multiple times with same data = same final state. |
| DELETE | /orders/10 | ✅ Yes | Canceling order once or multiple times = same result. |


### Mapping UI Actions to HTTP Methods

Document how each user action maps to HTTP methods:

| User Action | HTTP Method | Endpoint | Description |
|-------------|-------------|----------|-------------|
| Click "Browse Menu" | GET | /menu-items | Display all menu items |
| Click "View Details" | GET | /menu-items/5 | Show specific item details |
| Submit "Add Item" form | POST | /menu-items | Create new menu item |
| Submit "Edit Item" form | PUT | /menu-items/5 | Update existing item |
| Click "Delete" button | DELETE | /menu-items/5 | Remove menu item |
| Click "Place Order" | POST | /orders | Create new order |
| Click "View Orders" | GET | /orders | List all orders |
| Click "Cancel Order" | DELETE | /orders/10 | Cancel specific order |

### Phase 3 Deliverables

Submit the following:

1. **API Documentation (1000 words):**
   - Explain REST principles
   - Describe statelessness with examples
   - Explain each HTTP method
   - Create idempotency table for YOUR endpoints
   - Explain why POST is not idempotent
   - Explain why PUT and DELETE are idempotent

2. **Code Implementation:**
   - Route definitions showing HTTP methods
   - Controller methods handling each request type
   - Example API responses (JSON format)

3. **Testing Evidence:**
   - Screenshots of API testing (Postman/Insomnia)
   - Show GET, POST, PUT, DELETE requests
   - Show request headers and responses

---

## 🔗 PHASE 4: RESOURCE & URI DESIGN {#phase-4}

### Objective
Design clean, intuitive, RESTful URIs following industry best practices.

### Duration: Week 6

### URI Design Rules

**STRICT RULES - Follow These!**


#### Rule 1: Use Plural Nouns
✅ **CORRECT:**
```
/menu-items
/orders
/customers
```

❌ **WRONG:**
```
/menu-item
/order
/customer
```

#### Rule 2: NO Verbs in URIs
✅ **CORRECT:**
```
GET /menu-items          (not /getMenuItems)
POST /orders             (not /createOrder)
DELETE /orders/5         (not /deleteOrder/5)
```

❌ **WRONG:**
```
/getMenuItems
/createOrder
/updateMenuItem
/deleteOrder
```

**Why?** The HTTP method IS the verb! URI should only identify the resource.

#### Rule 3: Use Hierarchical Structure
✅ **CORRECT:**
```
/customers/5/orders              → Orders for customer #5
/menu-items/10/reviews           → Reviews for menu item #10
/orders/20/items                 → Items in order #20
```

This shows relationships clearly!

#### Rule 4: Use Hyphens, Not Underscores
✅ **CORRECT:**
```
/menu-items
/order-history
/customer-reviews
```

❌ **WRONG:**
```
/menu_items
/order_history
```

#### Rule 5: Lowercase Only
✅ **CORRECT:**
```
/menu-items
/orders
```

❌ **WRONG:**
```
/Menu-Items
/ORDERS
/menuItems
```


### Complete API Endpoint List

Create this table for your project:

| HTTP Method | URI | Description | Idempotent? | Request Body | Response Code |
|-------------|-----|-------------|-------------|--------------|---------------|
| GET | /menu-items | List all menu items | ✅ Yes | None | 200 OK |
| GET | /menu-items/{id} | Get specific menu item | ✅ Yes | None | 200 OK / 404 Not Found |
| POST | /menu-items | Create new menu item | ❌ No | JSON with item data | 201 Created |
| PUT | /menu-items/{id} | Update menu item (full) | ✅ Yes | JSON with all fields | 200 OK / 404 Not Found |
| PATCH | /menu-items/{id} | Update menu item (partial) | ✅ Yes | JSON with changed fields | 200 OK / 404 Not Found |
| DELETE | /menu-items/{id} | Delete menu item | ✅ Yes | None | 204 No Content / 404 Not Found |
| GET | /orders | List all orders | ✅ Yes | None | 200 OK |
| GET | /orders/{id} | Get specific order | ✅ Yes | None | 200 OK / 404 Not Found |
| POST | /orders | Create new order | ❌ No | JSON with order data | 201 Created |
| PUT | /orders/{id} | Update order | ✅ Yes | JSON with all fields | 200 OK / 404 Not Found |
| DELETE | /orders/{id} | Cancel order | ✅ Yes | None | 204 No Content / 404 Not Found |
| GET | /customers/{id}/orders | Get orders for customer | ✅ Yes | None | 200 OK |
| GET | /menu-items?category=main | Filter by category | ✅ Yes | None | 200 OK |
| GET | /menu-items?sort=price | Sort by price | ✅ Yes | None | 200 OK |

### Query Parameters vs Path Parameters

**Path Parameters** (for resource identification):
```
/menu-items/5           → Specific menu item
/orders/10              → Specific order
/customers/3/orders     → Orders for specific customer
```

**Query Parameters** (for filtering, sorting, pagination):
```
/menu-items?category=dessert        → Filter
/menu-items?sort=price&order=asc    → Sort
/menu-items?page=2&limit=10         → Pagination
/menu-items?search=pizza            → Search
```


### Example API Responses

**GET /menu-items**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "Margherita Pizza",
            "description": "Fresh mozzarella, tomatoes, and basil",
            "price": 12.99,
            "category": "main",
            "image_url": "https://example.com/pizza.jpg",
            "is_available": true,
            "created_at": "2024-01-15T10:30:00Z"
        },
        {
            "id": 2,
            "name": "Caesar Salad",
            "description": "Crispy romaine with parmesan",
            "price": 8.99,
            "category": "appetizer",
            "image_url": "https://example.com/salad.jpg",
            "is_available": true,
            "created_at": "2024-01-15T11:00:00Z"
        }
    ],
    "count": 2
}
```

**POST /orders** (Request)
```json
{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "delivery_address": "123 Main St, City, State 12345",
    "menu_item_id": 1,
    "quantity": 2
}
```

**POST /orders** (Response)
```json
{
    "status": "success",
    "message": "Order created successfully",
    "data": {
        "id": 15,
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "+1234567890",
        "delivery_address": "123 Main St, City, State 12345",
        "menu_item_id": 1,
        "quantity": 2,
        "total_price": 25.98,
        "status": "pending",
        "order_date": "2024-01-20T14:30:00Z"
    }
}
```


### Error Responses

**404 Not Found**
```json
{
    "status": "error",
    "message": "Menu item not found",
    "error_code": "RESOURCE_NOT_FOUND"
}
```

**400 Bad Request**
```json
{
    "status": "error",
    "message": "Validation failed",
    "errors": {
        "price": ["Price must be greater than 0"],
        "name": ["Name is required"]
    }
}
```

**500 Internal Server Error**
```json
{
    "status": "error",
    "message": "An unexpected error occurred",
    "error_code": "INTERNAL_SERVER_ERROR"
}
```

### Phase 4 Deliverables

Submit the following:

1. **Complete API Documentation:**
   - Table of all endpoints (like above)
   - URI design rules explanation
   - Example requests and responses
   - Error handling documentation

2. **Code Implementation:**
   - Route definitions
   - Controller methods
   - API response formatting

3. **Testing:**
   - Postman collection export
   - Screenshots of API tests
   - Proof of proper HTTP status codes

---

## 📁 COMPLETE FOLDER STRUCTURE {#folder-structure}

### Laravel Project Structure

```
food-ordering-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MenuItemController.php
│   │   │   └── OrderController.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── MenuItem.php
│   │   └── Order.php
│   └── Providers/
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_create_menu_items_table.php
│   │   └── 2024_01_01_create_orders_table.php
│   └── seeders/
│       └── MenuItemSeeder.php
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── images/
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── menu-items/
│       │   ├── index.blade.php
│       │   ├── create.blade.php
│       │   ├── edit.blade.php
│       │   └── show.blade.php
│       ├── orders/
│       │   ├── index.blade.php
│       │   ├── create.blade.php
│       │   └── show.blade.php
│       └── home.blade.php
├── routes/
│   ├── web.php
│   └── api.php
├── .env
├── composer.json
└── README.md
```


### Django Project Structure

```
food_ordering_system/
├── food_ordering_system/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── menu/
│   ├── migrations/
│   │   ├── 0001_initial.py
│   │   └── __init__.py
│   ├── templates/
│   │   └── menu/
│   │       ├── base.html
│   │       ├── menu_item_list.html
│   │       ├── menu_item_detail.html
│   │       ├── menu_item_form.html
│   │       ├── order_list.html
│   │       └── order_form.html
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── app.js
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── serializers.py
├── manage.py
├── requirements.txt
└── README.md
```

### ASP.NET Core Project Structure

```
FoodOrderingApp/
├── Controllers/
│   ├── MenuItemsController.cs
│   ├── OrdersController.cs
│   └── HomeController.cs
├── Models/
│   ├── MenuItem.cs
│   ├── Order.cs
│   └── ApplicationDbContext.cs
├── Views/
│   ├── Shared/
│   │   ├── _Layout.cshtml
│   │   └── Error.cshtml
│   ├── MenuItems/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   ├── Edit.cshtml
│   │   ├── Details.cshtml
│   │   └── Delete.cshtml
│   ├── Orders/
│   │   ├── Index.cshtml
│   │   ├── Create.cshtml
│   │   └── Details.cshtml
│   └── Home/
│       └── Index.cshtml
├── wwwroot/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── site.js
│   └── images/
├── Migrations/
├── appsettings.json
├── Program.cs
└── README.md
```

---

## 🗄️ DATABASE SCHEMA {#database-schema}

### Entity Relationship Diagram

```
┌─────────────────────────┐
│      MenuItem           │
├─────────────────────────┤
│ PK  id                  │
│     name                │
│     description         │
│     price               │
│     category            │
│     image_url           │
│     is_available        │
│     created_at          │
│     updated_at          │
└─────────────────────────┘
            │
            │ 1
            │
            │ has many
            │
            │ *
            ▼
┌─────────────────────────┐
│       Order             │
├─────────────────────────┤
│ PK  id                  │
│     customer_name       │
│     customer_email      │
│     customer_phone      │
│     delivery_address    │
│ FK  menu_item_id        │
│     quantity            │
│     total_price         │
│     status              │
│     order_date          │
│     created_at          │
│     updated_at          │
└─────────────────────────┘
```


### SQL Schema (MySQL/PostgreSQL)

```sql
-- Menu Items Table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    category ENUM('appetizer', 'main', 'dessert', 'beverage') NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);

-- Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_customer_email (customer_email),
    INDEX idx_order_date (order_date)
);
```

### Sample Data (Seed Data)

```sql
-- Insert Menu Items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil on crispy crust', 12.99, 'main', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002'),
('Caesar Salad', 'Crispy romaine lettuce with parmesan and croutons', 8.99, 'appetizer', 'https://images.unsplash.com/photo-1546793665-c74683f339c1'),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center', 6.99, 'dessert', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51'),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'beverage', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba');

-- Insert Sample Order
INSERT INTO orders (customer_name, customer_email, customer_phone, delivery_address, menu_item_id, quantity, total_price, status) VALUES
('John Doe', 'john@example.com', '+1234567890', '123 Main St, City, State 12345', 1, 2, 25.98, 'pending');
```

---

## 📸 SCREENSHOTS GUIDE {#screenshots-guide}

### What Screenshots to Capture


#### Phase 1 Screenshots (Before Styling)
1. **Plain HTML CRUD Pages**
   - Menu items list (unstyled)
   - Create menu item form (unstyled)
   - Edit menu item form (unstyled)
   - Order list (unstyled)

2. **Database Evidence**
   - Database tables structure
   - Sample data in tables
   - Migration success messages

3. **Terminal/Console**
   - Successful migration commands
   - Server running confirmation

#### Phase 2 Screenshots (After Styling)
1. **Homepage**
   - Full page view showing hero section
   - Features section
   - Footer

2. **Menu Items Page**
   - Grid layout with cards
   - Responsive view (desktop)
   - Mobile view (use browser DevTools)
   - Tablet view

3. **Individual Item Details**
   - Single item view with all details
   - Professional styling

4. **Forms**
   - Create menu item form (styled)
   - Edit menu item form (styled)
   - Create order form (styled)

5. **Orders Page**
   - Orders list with styling
   - Order details view

6. **Responsive Design**
   - Mobile view (320px width)
   - Tablet view (768px width)
   - Desktop view (1920px width)

#### Phase 3 & 4 Screenshots (API Testing)
1. **Postman/Insomnia**
   - GET request to /menu-items
   - GET request to /menu-items/5
   - POST request creating new item
   - PUT request updating item
   - DELETE request removing item
   - Show request headers
   - Show response bodies
   - Show HTTP status codes

2. **Browser DevTools**
   - Network tab showing API calls
   - Request/response headers
   - JSON responses

### How to Present Screenshots

**Create a document with:**
- Clear labels for each screenshot
- Brief description of what it shows
- Highlight important features
- Use arrows/annotations if needed
- Organize by phase

**Example Format:**

```
Screenshot 1: Homepage - Hero Section
Description: Shows the professional hero section with gradient background,
compelling headline, CTA buttons, and floating food image animation.
Features: Bootstrap grid, custom CSS, Google Fonts (Inter)

Screenshot 2: Menu Items Grid - Desktop View
Description: Displays menu items in a 4-column responsive grid using
Bootstrap cards with hover effects and shadows.
Features: col-lg-3, card component, custom hover animations
```

---

## 📊 GRADING RUBRIC {#grading-rubric}

### Total: 100 Points


#### Phase 1: Models & Scaffolding (15 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Model Creation | 5 | Both MenuItem and Order models with correct attributes |
| Scaffolding Usage | 4 | Proper use of framework's scaffolding tools |
| Database Migrations | 3 | Successful migrations, proper relationships |
| Documentation | 3 | Clear explanation of MVC architecture |

#### Phase 2: UI/UX Design (35 points) ⭐ MOST IMPORTANT

| Criteria | Points | Description |
|----------|--------|-------------|
| Professional Appearance | 10 | Website looks like commercial product, NOT basic template |
| Bootstrap Integration | 8 | Proper use of Grid, Cards, Navbar, Forms |
| Custom CSS | 7 | Google Fonts, shadows, hover effects, animations |
| Color Theme | 3 | Consistent, food-related color scheme |
| Responsive Design | 5 | Works perfectly on mobile, tablet, desktop |
| Hero Section | 2 | Compelling homepage with CTA buttons |

**Deductions:**
- -5 points: Using default Bootstrap blue everywhere
- -5 points: No custom CSS file
- -3 points: Plain white background throughout
- -3 points: No hover effects on cards/buttons
- -5 points: Not responsive on mobile

#### Phase 3: REST Principles (20 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| HTTP Methods | 6 | Correct use of GET, POST, PUT, DELETE |
| Statelessness Explanation | 5 | Clear documentation with token example |
| Idempotency Analysis | 6 | Correct identification and explanation |
| Documentation Quality | 3 | Well-written, clear examples |

#### Phase 4: URI Design (15 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| URI Structure | 5 | Plural nouns, no verbs, hierarchical |
| API Endpoint Table | 5 | Complete table with all endpoints |
| API Testing | 3 | Postman screenshots showing tests |
| Error Handling | 2 | Proper HTTP status codes |


#### Code Quality & Documentation (10 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Code Organization | 3 | Clean, well-structured code |
| Comments | 2 | Meaningful comments where needed |
| README File | 2 | Complete setup instructions |
| Git Usage | 3 | Regular commits with clear messages |

#### Presentation & Screenshots (5 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Screenshot Quality | 2 | Clear, well-organized screenshots |
| Before/After Comparison | 2 | Shows progression from Phase 1 to 2 |
| Documentation | 1 | Professional presentation |

### Bonus Points (Up to +10)

- **+5 points:** Implement shopping cart feature
- **+3 points:** Add search/filter functionality
- **+2 points:** Implement pagination
- **+2 points:** Add user authentication
- **+3 points:** Deploy to cloud (Heroku, AWS, etc.)
- **+2 points:** Add loading animations
- **+2 points:** Implement dark mode toggle

### Grade Scale

- **90-100:** A (Excellent - Professional quality)
- **80-89:** B (Good - Meets all requirements)
- **70-79:** C (Satisfactory - Meets most requirements)
- **60-69:** D (Needs Improvement)
- **Below 60:** F (Incomplete/Poor quality)

---

## 💬 VIVA QUESTIONS {#viva-questions}

### MVC Architecture

1. **Q:** Explain the MVC pattern and its benefits.
   **A:** MVC separates application into Model (data), View (UI), and Controller (logic). Benefits include separation of concerns, easier testing, better organization, and team collaboration.

2. **Q:** What is the role of a Controller?
   **A:** Controller receives HTTP requests, processes them (often using Models), and returns appropriate responses (often rendering Views).

3. **Q:** Why use scaffolding?
   **A:** Scaffolding auto-generates boilerplate code (models, controllers, views), saving time and ensuring consistency.


### Bootstrap & UI/UX

4. **Q:** Explain Bootstrap's 12-column grid system.
   **A:** Bootstrap divides the page into 12 equal columns. You can combine columns to create layouts (e.g., col-md-6 = 6/12 = 50% width on medium screens).

5. **Q:** What are Bootstrap breakpoints?
   **A:** Breakpoints define screen sizes: xs (<576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px), xxl (≥1400px).

6. **Q:** Why use custom CSS instead of only Bootstrap?
   **A:** Custom CSS allows unique branding, specific design requirements, and makes the site look professional rather than generic.

7. **Q:** What makes a website "professional-looking"?
   **A:** Consistent color scheme, proper spacing, modern typography, smooth animations, attention to details (shadows, rounded corners), and responsive design.

### REST Principles

8. **Q:** What does REST stand for?
   **A:** Representational State Transfer - an architectural style for designing networked applications.

9. **Q:** Explain statelessness in REST.
   **A:** Server doesn't store client session data. Each request contains all necessary information (e.g., authentication token in header).

10. **Q:** Why is POST not idempotent?
    **A:** Multiple identical POST requests create multiple resources. Example: Submitting an order form 3 times creates 3 separate orders.

11. **Q:** Why is PUT idempotent?
    **A:** Multiple identical PUT requests result in the same final state. Updating a resource with the same data multiple times doesn't change the outcome.

12. **Q:** Why is DELETE idempotent?
    **A:** Deleting a resource once or multiple times has the same result: the resource doesn't exist. First request deletes it, subsequent requests find it already gone.

13. **Q:** What's the difference between PUT and PATCH?
    **A:** PUT replaces the entire resource (all fields required), PATCH updates only specific fields (partial update).


### URI Design

14. **Q:** Why use plural nouns in URIs?
    **A:** Consistency and clarity. `/menu-items` represents a collection, `/menu-items/5` represents one item from that collection.

15. **Q:** Why no verbs in URIs?
    **A:** The HTTP method IS the verb (GET, POST, PUT, DELETE). URI should only identify the resource.

16. **Q:** What's wrong with `/getMenuItem/5`?
    **A:** Contains verb "get" (redundant with HTTP GET) and singular noun. Should be `GET /menu-items/5`.

17. **Q:** Explain hierarchical URI structure.
    **A:** Shows relationships: `/customers/5/orders` means "orders belonging to customer 5". Clear parent-child relationship.

### HTTP Methods

18. **Q:** When do you use GET vs POST?
    **A:** GET for retrieving data (safe, idempotent, no body). POST for creating new resources (not safe, not idempotent, has body).

19. **Q:** What HTTP status code for successful creation?
    **A:** 201 Created (not 200 OK).

20. **Q:** What's the difference between 200 OK and 204 No Content?
    **A:** 200 OK includes response body. 204 No Content means success but no data to return (common for DELETE).

### Database & Models

21. **Q:** Explain the relationship between MenuItem and Order.
    **A:** One-to-Many. One MenuItem can have many Orders. Order has foreign key `menu_item_id` referencing MenuItem.

22. **Q:** Why use migrations instead of creating tables manually?
    **A:** Version control for database schema, easy rollback, team collaboration, automatic schema updates.

23. **Q:** What is a foreign key constraint?
    **A:** Ensures referential integrity. Order's `menu_item_id` must reference an existing MenuItem. Prevents orphaned records.

### General Web Development

24. **Q:** What is responsive design?
    **A:** Website adapts to different screen sizes (mobile, tablet, desktop) using flexible layouts and media queries.

25. **Q:** Why use CDN for Bootstrap?
    **A:** Faster loading (cached by browser), reduced server load, automatic updates, global distribution.

---

## 🎁 BONUS CHALLENGE {#bonus-challenge}

### Shopping Cart Feature (+5 points)

Implement a shopping cart system that allows users to:


#### Requirements:

1. **Add to Cart Button**
   - On each menu item card
   - Stores items in session/local storage
   - Shows quantity badge on cart icon

2. **Cart Page**
   - List all items in cart
   - Show quantity and subtotal for each
   - Allow quantity adjustment
   - Show total price
   - "Checkout" button

3. **Cart Icon in Navbar**
   - Shows number of items
   - Dropdown preview (optional)
   - Link to cart page

4. **Checkout Process**
   - Convert cart items to orders
   - Single form for customer details
   - Create multiple Order records
   - Clear cart after successful checkout

#### Technical Implementation:

**New Model: CartItem**
```sql
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

**New Endpoints:**
```
POST   /cart/items              → Add item to cart
GET    /cart                    → View cart
PUT    /cart/items/{id}         → Update quantity
DELETE /cart/items/{id}         → Remove from cart
POST   /cart/checkout           → Convert cart to orders
```

**UI Requirements:**
- Cart icon with badge in navbar
- Professional cart page with item cards
- Quantity controls (+/- buttons)
- Smooth animations when adding/removing items
- Toast notifications for cart actions

---

## ⚠️ COMMON MISTAKES {#common-mistakes}

### Phase 1 Mistakes


❌ **Mistake:** Not using framework's scaffolding tools
✅ **Fix:** Use `php artisan make:model`, `python manage.py startapp`, or `dotnet aspnet-codegenerator`

❌ **Mistake:** Missing foreign key relationship
✅ **Fix:** Add `menu_item_id` foreign key in Order model

❌ **Mistake:** Not running migrations
✅ **Fix:** Run `php artisan migrate`, `python manage.py migrate`, or `dotnet ef database update`

### Phase 2 Mistakes (CRITICAL)

❌ **Mistake:** Using default Bootstrap without customization
✅ **Fix:** Add custom CSS file with your own styles

❌ **Mistake:** All buttons are default blue
✅ **Fix:** Use custom colors: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

❌ **Mistake:** No Google Fonts
✅ **Fix:** Add `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap">`

❌ **Mistake:** Cards have no hover effects
✅ **Fix:** Add CSS: `.card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }`

❌ **Mistake:** Not responsive on mobile
✅ **Fix:** Use Bootstrap grid: `col-12 col-sm-6 col-md-4 col-lg-3`

❌ **Mistake:** No hero section on homepage
✅ **Fix:** Add hero section with gradient background, headline, and CTA buttons

❌ **Mistake:** Using Times New Roman or default fonts
✅ **Fix:** Use modern fonts like Inter, Poppins, or Montserrat

❌ **Mistake:** No spacing between elements
✅ **Fix:** Use Bootstrap spacing utilities: `mb-4`, `mt-5`, `py-3`, `px-4`

❌ **Mistake:** Forms look plain and boring
✅ **Fix:** Use floating labels, add icons, style with shadows and rounded corners

### Phase 3 Mistakes

❌ **Mistake:** Using GET for creating resources
✅ **Fix:** Use POST for creation

❌ **Mistake:** Saying DELETE is not idempotent
✅ **Fix:** DELETE IS idempotent (deleting same resource multiple times = same result)

❌ **Mistake:** Not explaining statelessness properly
✅ **Fix:** Explain token-based auth, no session storage on server

❌ **Mistake:** Confusing idempotency with safety
✅ **Fix:** Safe = doesn't change state. Idempotent = multiple requests = same result. DELETE is idempotent but NOT safe.


### Phase 4 Mistakes

❌ **Mistake:** Using singular nouns: `/menu-item`, `/order`
✅ **Fix:** Use plural: `/menu-items`, `/orders`

❌ **Mistake:** Using verbs in URIs: `/getMenuItems`, `/createOrder`
✅ **Fix:** Remove verbs: `GET /menu-items`, `POST /orders`

❌ **Mistake:** Using underscores: `/menu_items`
✅ **Fix:** Use hyphens: `/menu-items`

❌ **Mistake:** Inconsistent casing: `/MenuItems`, `/ORDERS`
✅ **Fix:** Always lowercase: `/menu-items`, `/orders`

❌ **Mistake:** Not showing hierarchical relationships
✅ **Fix:** Use: `/customers/5/orders` instead of `/orders?customer_id=5`

### General Mistakes

❌ **Mistake:** Not testing on different screen sizes
✅ **Fix:** Use browser DevTools to test mobile, tablet, desktop

❌ **Mistake:** Poor Git commit messages: "update", "fix"
✅ **Fix:** Descriptive messages: "Add hero section to homepage", "Implement menu item CRUD"

❌ **Mistake:** No README file
✅ **Fix:** Create README with setup instructions, features, screenshots

❌ **Mistake:** Hardcoded values everywhere
✅ **Fix:** Use configuration files, environment variables

❌ **Mistake:** No error handling
✅ **Fix:** Add try-catch blocks, return proper HTTP status codes

---

## ✅ SUBMISSION CHECKLIST {#submission-checklist}

### Before Submitting, Verify:

#### Code & Files
- [ ] All models created with correct attributes
- [ ] All controllers implemented
- [ ] All views created and styled
- [ ] Custom CSS file exists and is linked
- [ ] Database migrations successful
- [ ] Sample data seeded
- [ ] README.md with setup instructions
- [ ] .gitignore file (exclude node_modules, vendor, etc.)


#### UI/UX Design
- [ ] Website looks professional (NOT basic template)
- [ ] Custom color theme applied consistently
- [ ] Google Fonts integrated
- [ ] Hero section on homepage
- [ ] Professional navbar with gradient
- [ ] Menu items displayed in Bootstrap cards
- [ ] Cards have hover effects
- [ ] Forms are professionally styled
- [ ] Footer section added
- [ ] Responsive on mobile (test at 375px width)
- [ ] Responsive on tablet (test at 768px width)
- [ ] Responsive on desktop (test at 1920px width)
- [ ] All buttons have custom styling (not default blue)
- [ ] Proper spacing throughout (margins, padding)
- [ ] Shadows on cards and elevated elements
- [ ] Smooth transitions and animations

#### REST & API
- [ ] Correct HTTP methods used (GET, POST, PUT, DELETE)
- [ ] All routes defined properly
- [ ] API returns JSON responses
- [ ] Proper HTTP status codes (200, 201, 404, 500)
- [ ] Statelessness documented with examples
- [ ] Idempotency table created and accurate
- [ ] API tested with Postman/Insomnia

#### URI Design
- [ ] All URIs use plural nouns
- [ ] No verbs in URIs
- [ ] Lowercase with hyphens
- [ ] Hierarchical structure where appropriate
- [ ] Complete endpoint table created

#### Documentation
- [ ] MVC architecture explained (500 words)
- [ ] Bootstrap Grid System explained
- [ ] REST principles documented (1000 words)
- [ ] Statelessness explained with token example
- [ ] Idempotency explained for each endpoint
- [ ] URI design rules documented
- [ ] API endpoint table complete

#### Screenshots
- [ ] Before styling (Phase 1)
- [ ] After styling (Phase 2)
- [ ] Homepage with hero section
- [ ] Menu items grid
- [ ] Individual item details
- [ ] Forms (create, edit)
- [ ] Orders page
- [ ] Mobile responsive view
- [ ] Tablet responsive view
- [ ] Desktop view
- [ ] Postman API tests (GET, POST, PUT, DELETE)
- [ ] All screenshots labeled and organized


#### Testing
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Forms validate input
- [ ] Error messages display properly
- [ ] Success messages display
- [ ] Navigation works correctly
- [ ] Links don't break
- [ ] Images load properly
- [ ] Responsive design works on all devices
- [ ] API endpoints return correct data
- [ ] Database relationships work

#### Git & Version Control
- [ ] Repository created
- [ ] Regular commits (not just one big commit)
- [ ] Descriptive commit messages
- [ ] .gitignore configured
- [ ] README.md complete

### Submission Format

Create a ZIP file or GitHub repository containing:

```
submission/
├── code/                          (Your complete project)
├── screenshots/
│   ├── phase1/                    (Before styling)
│   ├── phase2/                    (After styling)
│   ├── responsive/                (Mobile, tablet, desktop)
│   └── api-testing/               (Postman screenshots)
├── documentation/
│   ├── mvc-explanation.pdf
│   ├── rest-principles.pdf
│   ├── api-endpoints.pdf
│   └── uri-design.pdf
├── database/
│   ├── schema.sql
│   └── seed-data.sql
└── README.md                      (Setup instructions)
```

### Submission Deadline

**Week 8** - Submit complete project with all phases

**Late Submission:** -10% per day

---

## 🎓 FINAL NOTES

### What Makes This Project Stand Out

1. **Professional UI/UX**
   - Your website should look like it could be deployed to production
   - Attention to details matters
   - Users should WANT to use your application

2. **Solid Architecture**
   - Clean MVC separation
   - RESTful API design
   - Proper database relationships

3. **Complete Documentation**
   - Clear explanations
   - Real examples from YOUR project
   - Professional presentation


### Tips for Success

1. **Start Early**
   - Don't wait until the last week
   - Each phase builds on the previous one
   - Give yourself time to polish the UI

2. **Focus on UI/UX (Phase 2)**
   - This is worth 35% of your grade
   - Spend extra time making it look professional
   - Test on real devices, not just DevTools

3. **Understand, Don't Just Copy**
   - Understand WHY you're using each HTTP method
   - Understand WHY certain endpoints are idempotent
   - Be ready to explain your choices in viva

4. **Test Thoroughly**
   - Test every feature
   - Test on different browsers
   - Test on different screen sizes
   - Test API endpoints

5. **Document Everything**
   - Take screenshots as you go
   - Write documentation while building
   - Keep track of challenges and solutions

6. **Ask Questions**
   - If something is unclear, ask your instructor
   - Use office hours
   - Collaborate with classmates (but don't copy)

### Resources

**Bootstrap Documentation:**
- https://getbootstrap.com/docs/5.3/

**Google Fonts:**
- https://fonts.google.com/

**Unsplash (Free Images):**
- https://unsplash.com/s/photos/food

**Color Palette Generators:**
- https://coolors.co/
- https://colorhunt.co/

**REST API Best Practices:**
- https://restfulapi.net/

**HTTP Status Codes:**
- https://httpstatuses.com/

**Postman (API Testing):**
- https://www.postman.com/

### Support

**Office Hours:** [Your schedule]  
**Email:** [Your email]  
**Discussion Forum:** [Link if available]

---

## 📝 CONCLUSION

This lab project is designed to give you hands-on experience with modern web development practices. By the end, you'll have:

✅ A portfolio-ready project  
✅ Understanding of MVC architecture  
✅ RESTful API design skills  
✅ Professional UI/UX design abilities  
✅ Real-world development experience

**Remember:** The goal is not just to complete the assignment, but to build something you're proud of. Make it professional, make it beautiful, make it yours!

Good luck! 🚀

---

**Document Version:** 1.0  
**Last Updated:** January 2024  
**Course:** Web Development & Software Architecture  
**Instructor:** [Your Name]

---

