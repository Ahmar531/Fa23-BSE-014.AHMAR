# Quick Reference Guide - Online Food Ordering System

## Table of Contents
1. [REST Principles Cheat Sheet](#rest-principles-cheat-sheet)
2. [HTTP Methods Quick Reference](#http-methods-quick-reference)
3. [Bootstrap Grid System](#bootstrap-grid-system)
4. [Common Bootstrap Components](#common-bootstrap-components)
5. [URI Design Rules](#uri-design-rules)
6. [Status Codes](#status-codes)
7. [Common Errors & Solutions](#common-errors--solutions)

---

## REST Principles Cheat Sheet

### 6 Constraints of REST

1. **Client-Server Architecture**
   - Separation of concerns
   - Client handles UI, server handles data

2. **Statelessness** ⭐ REQUIRED FOR THIS PROJECT
   - No client context stored on server
   - Each request contains all needed information
   - Use tokens for authentication

3. **Cacheability**
   - Responses should define if they can be cached
   - Improves performance

4. **Uniform Interface**
   - Consistent API design
   - Resource-based URIs
   - Standard HTTP methods

5. **Layered System**
   - Client doesn't know if connected directly to server
   - Can have intermediaries (load balancers, proxies)

6. **Code on Demand** (Optional)
   - Server can send executable code to client

---

## HTTP Methods Quick Reference

| Method | Purpose | Idempotent? | Safe? | Request Body | Response Body |
|--------|---------|-------------|-------|--------------|---------------|
| **GET** | Retrieve resource(s) | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **POST** | Create new resource | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **PUT** | Update/Replace resource | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **PATCH** | Partial update | ❌ No* | ❌ No | ✅ Yes | ✅ Yes |
| **DELETE** | Remove resource | ✅ Yes | ❌ No | ❌ No | ✅ Optional |

*PATCH can be idempotent depending on implementation

### When to Use Each Method

**GET**: 
- List all items: `GET /api/menu-items`
- Get single item: `GET /api/menu-items/5`
- Filter/search: `GET /api/menu-items?category=main`

**POST**:
- Create new item: `POST /api/menu-items`
- Add item to order: `POST /api/orders/10/items`
- Non-idempotent operations

**PUT**:
- Update entire resource: `PUT /api/menu-items/5`
- Must send all fields
- Idempotent (same result if called multiple times)

**PATCH**:
- Update specific fields: `PATCH /api/orders/10/status`
- Only send changed fields
- Use for partial updates

**DELETE**:
- Remove resource: `DELETE /api/menu-items/5`
- Idempotent (resource is gone after first call)

---

## Bootstrap Grid System

### Breakpoints

| Breakpoint | Class Prefix | Screen Width | Device |
|------------|--------------|--------------|--------|
| Extra Small | col- | <576px | Mobile portrait |
| Small | col-sm- | ≥576px | Mobile landscape |
| Medium | col-md- | ≥768px | Tablet |
| Large | col-lg- | ≥992px | Desktop |
| Extra Large | col-xl- | ≥1200px | Large desktop |
| XXL | col-xxl- | ≥1400px | Extra large desktop |

### Grid Examples

```html
<!-- 4 columns on desktop, 2 on tablet, 1 on mobile -->
<div class="row">
    <div class="col-12 col-md-6 col-lg-3">Item 1</div>
    <div class="col-12 col-md-6 col-lg-3">Item 2</div>
    <div class="col-12 col-md-6 col-lg-3">Item 3</div>
    <div class="col-12 col-md-6 col-lg-3">Item 4</div>
</div>

<!-- Centered content -->
<div class="row justify-content-center">
    <div class="col-md-8">Centered content</div>
</div>

<!-- Offset columns -->
<div class="row">
    <div class="col-md-6 offset-md-3">Centered with offset</div>
</div>
```

### Common Grid Classes

- `container` - Fixed width container
- `container-fluid` - Full width container
- `row` - Horizontal group of columns
- `col-*` - Column with specific width
- `g-*` - Gutter (spacing) between columns
- `justify-content-*` - Horizontal alignment
- `align-items-*` - Vertical alignment

---

## Common Bootstrap Components

### Navbar

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="/">Brand</a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="/menu">Menu</a></li>
            </ul>
        </div>
    </div>
</nav>
```

### Card

```html
<div class="card">
    <img src="image.jpg" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">Title</h5>
        <p class="card-text">Description</p>
        <a href="#" class="btn btn-primary">Button</a>
    </div>
    <div class="card-footer">Footer</div>
</div>
```

### Form

```html
<form>
    <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name">
    </div>
    <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select class="form-select" id="category">
            <option>Option 1</option>
        </select>
    </div>
    <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="check">
        <label class="form-check-label" for="check">Check me</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Modal

```html
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
    Open Modal
</button>

<div class="modal fade" id="myModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal Title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">Modal content</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>
</div>
```

### Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Outline -->
<button class="btn btn-outline-primary">Outline</button>
```

### Badges

```html
<span class="badge bg-primary">Primary</span>
<span class="badge bg-success">Success</span>
<span class="badge bg-danger">Danger</span>
<span class="badge bg-warning">Warning</span>
```

---

## URI Design Rules

### ✅ DO

1. **Use plural nouns**
   - `/api/menu-items` ✅
   - `/api/orders` ✅

2. **Use hyphens for readability**
   - `/api/menu-items` ✅
   - `/api/order-items` ✅

3. **Use lowercase**
   - `/api/menu-items` ✅

4. **Show hierarchy**
   - `/api/orders/5/items` ✅
   - `/api/customers/10/orders` ✅

5. **Use query parameters for filtering**
   - `/api/menu-items?category=main` ✅
   - `/api/orders?status=pending` ✅

### ❌ DON'T

1. **Don't use verbs**
   - `/api/getMenuItems` ❌
   - `/api/createOrder` ❌

2. **Don't use singular nouns**
   - `/api/menu-item` ❌
   - `/api/order` ❌

3. **Don't use uppercase**
   - `/api/MenuItems` ❌
   - `/api/ORDERS` ❌

4. **Don't use underscores**
   - `/api/menu_items` ❌ (use hyphens instead)

5. **Don't use trailing slashes**
   - `/api/menu-items/` ❌

6. **Don't use file extensions**
   - `/api/menu-items.json` ❌

### URI Pattern Examples

```
Collection: /api/menu-items
Single Item: /api/menu-items/5
Nested Collection: /api/orders/10/items
Nested Item: /api/orders/10/items/3
Filter: /api/menu-items?category=main&available=true
Sort: /api/menu-items?sort=price&order=asc
Paginate: /api/menu-items?page=2&per_page=10
```

---

## Status Codes

### Success Codes (2xx)

| Code | Name | When to Use |
|------|------|-------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE (no response body) |

### Client Error Codes (4xx)

| Code | Name | When to Use |
|------|------|-------------|
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation error (alternative to 400) |

### Server Error Codes (5xx)

| Code | Name | When to Use |
|------|------|-------------|
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Server temporarily unavailable |

---

## Common Errors & Solutions

### Error 1: CORS Issues
**Problem**: API requests blocked by browser  
**Solution**: 
- Laravel: Install `fruitcake/laravel-cors` package
- Django: Install `django-cors-headers` package

### Error 2: 404 on API Routes
**Problem**: API endpoints return 404  
**Solution**:
- Check route definitions
- Verify route prefix (e.g., `/api`)
- Check HTTP method matches

### Error 3: Validation Errors Not Showing
**Problem**: Form submits but no error messages  
**Solution**:
- Check validation rules
- Display errors in template
- Return proper error response (400 status)

### Error 4: Bootstrap Not Loading
**Problem**: Styles not applied  
**Solution**:
- Check CDN links
- Verify internet connection
- Check browser console for errors
- Ensure Bootstrap JS is loaded after jQuery (if using Bootstrap 4)

### Error 5: Grid Not Responsive
**Problem**: Layout doesn't change on mobile  
**Solution**:
- Add viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Use proper column classes (col-12, col-md-6, etc.)
- Test at different breakpoints

### Error 6: Foreign Key Constraint Fails
**Problem**: Can't delete record due to relationships  
**Solution**:
- Use cascade delete in migration
- Delete related records first
- Use soft deletes

### Error 7: Token Authentication Not Working
**Problem**: 401 Unauthorized errors  
**Solution**:
- Check token format in header
- Verify token is valid
- Check middleware is applied to routes

---

## Testing Checklist

### Phase 1
- [ ] All models created
- [ ] Migrations run successfully
- [ ] CRUD operations work
- [ ] Plain HTML views display correctly

### Phase 2
- [ ] Bootstrap loaded
- [ ] Navbar responsive
- [ ] Grid system implemented
- [ ] Cards display properly
- [ ] Forms styled
- [ ] Works on mobile, tablet, desktop

### Phase 3
- [ ] API routes defined
- [ ] HTTP methods correct
- [ ] Authentication working
- [ ] Proper status codes returned
- [ ] Idempotency verified

### Phase 4
- [ ] URIs follow REST conventions
- [ ] Hierarchical routes work
- [ ] Query parameters functional
- [ ] API documentation complete
- [ ] Postman collection exported

---

## Useful Commands

### Laravel
```bash
# Create model with migration
php artisan make:model MenuItem -m

# Create controller
php artisan make:controller MenuItemController --resource

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Create seeder
php artisan make:seeder MenuItemSeeder

# Run seeders
php artisan db:seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Django
```bash
# Create app
python manage.py startapp orders

# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Create fixtures
python manage.py dumpdata orders > fixtures.json

# Load fixtures
python manage.py loaddata fixtures.json

# Shell
python manage.py shell
```

---

## Resources

### Documentation
- REST API Tutorial: https://restfulapi.net/
- Bootstrap Docs: https://getbootstrap.com/docs/
- Laravel Docs: https://laravel.com/docs
- Django Docs: https://docs.djangoproject.com/
- HTTP Status Codes: https://httpstatuses.com/

### Tools
- Postman: https://www.postman.com/
- Insomnia: https://insomnia.rest/
- JSON Formatter: https://jsonformatter.org/
- Regex Tester: https://regex101.com/

### Learning
- MDN Web Docs: https://developer.mozilla.org/
- W3Schools: https://www.w3schools.com/
- Bootstrap Examples: https://getbootstrap.com/docs/5.3/examples/

---

**Good luck with your project!** 🚀
