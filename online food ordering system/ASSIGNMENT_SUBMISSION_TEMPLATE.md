# Online Food Ordering System - Assignment Submission Template

**Student Name**: _______________________  
**Student ID**: _______________________  
**Framework Used**: _______________________  
**Submission Date**: _______________________

---

## PROJECT INFORMATION

### GitHub Repository
**URL**: _______________________  
**Branch**: main / master  
**Last Commit Date**: _______________________

### Live Demo (if deployed)
**URL**: _______________________  
**Admin Credentials**: _______________________  
**Test Customer Credentials**: _______________________

---

## PHASE 1: Models & View Generators (25%)

### 1.1 Framework Setup
- [ ] Framework installed and configured
- [ ] Database connection established
- [ ] Project runs without errors

**Framework Version**: _______________________  
**Database Used**: _______________________

### 1.2 Models Created

#### MenuItem Model
- [ ] All required fields implemented
- [ ] Proper data types used
- [ ] Validation rules applied

**Fields Implemented**:
- [ ] name (string)
- [ ] description (text)
- [ ] category (enum/choice)
- [ ] price (decimal)
- [ ] image_url (url)
- [ ] is_available (boolean)
- [ ] timestamps

#### Order Model
- [ ] All required fields implemented
- [ ] Relationship with OrderItem established
- [ ] Status field with proper choices

**Fields Implemented**:
- [ ] customer_name
- [ ] customer_email
- [ ] customer_phone
- [ ] delivery_address
- [ ] total_amount
- [ ] status
- [ ] timestamps

#### OrderItem Model
- [ ] Foreign keys to Order and MenuItem
- [ ] Quantity and price fields
- [ ] Proper cascade delete

### 1.3 CRUD Operations

**Menu Items**:
- [ ] Create - Working
- [ ] Read (List) - Working
- [ ] Read (Single) - Working
- [ ] Update - Working
- [ ] Delete - Working

**Orders**:
- [ ] Create - Working
- [ ] Read (List) - Working
- [ ] Read (Single) - Working
- [ ] Update - Working
- [ ] Delete - Working

### 1.4 Plain HTML Views
- [ ] All views created without Bootstrap
- [ ] Forms functional
- [ ] Data displays correctly

**Screenshots Included**:
- [ ] Menu items list view
- [ ] Menu item create form
- [ ] Menu item edit form
- [ ] Order list view
- [ ] Order create form

---

## PHASE 2: Bootstrap Integration (25%)

### 2.1 Bootstrap Setup
- [ ] Bootstrap CDN added
- [ ] Bootstrap JavaScript included
- [ ] Custom CSS file created

**Bootstrap Version**: _______________________

### 2.2 Navigation Bar
- [ ] Responsive navbar implemented
- [ ] Logo/brand name included
- [ ] Navigation links working
- [ ] Mobile menu (hamburger) functional

### 2.3 Grid System Implementation

**12-Column Grid Usage**:
- [ ] Menu items displayed in grid
- [ ] Responsive breakpoints used
- [ ] Proper column classes applied

**Breakpoints Implemented**:
- [ ] col-12 (Extra small - mobile)
- [ ] col-sm-6 (Small - tablet portrait)
- [ ] col-md-4 (Medium - tablet landscape)
- [ ] col-lg-3 (Large - desktop)

### 2.4 Bootstrap Components Used

- [ ] Cards (for menu items)
- [ ] Navbar
- [ ] Forms (form-control, form-select, etc.)
- [ ] Buttons (btn classes)
- [ ] Modals (for delete confirmation)
- [ ] Badges (for status/category)
- [ ] Alerts (for messages)

**Additional Components** (bonus):
- [ ] Pagination
- [ ] Dropdowns
- [ ] Tooltips
- [ ] Spinners/Loading indicators

### 2.5 Responsive Design Testing

**Screenshots at Different Breakpoints**:
- [ ] Mobile (375px) - 3 screenshots
- [ ] Tablet (768px) - 3 screenshots
- [ ] Desktop (1200px) - 3 screenshots

**Pages Tested**:
- [ ] Menu items list
- [ ] Menu item form
- [ ] Order list

---

## PHASE 3: REST Principles & HTTP Methods (25%)

### 3.1 API Routes Implemented

**Menu Items API**:
- [ ] GET /api/menu-items (List)
- [ ] GET /api/menu-items/{id} (Show)
- [ ] POST /api/menu-items (Create)
- [ ] PUT /api/menu-items/{id} (Update)
- [ ] DELETE /api/menu-items/{id} (Delete)

**Orders API**:
- [ ] GET /api/orders (List)
- [ ] GET /api/orders/{id} (Show)
- [ ] POST /api/orders (Create)
- [ ] PUT /api/orders/{id} (Update)
- [ ] DELETE /api/orders/{id} (Delete)

### 3.2 Statelessness Implementation

**Authentication Method**: _______________________

- [ ] Token-based authentication implemented
- [ ] Tokens passed in headers
- [ ] No server-side session storage
- [ ] Each request is self-contained

**Explanation** (2-3 sentences):
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

### 3.3 Idempotency Analysis

Complete the table:

| HTTP Method | Endpoint | Idempotent? | Explanation |
|-------------|----------|-------------|-------------|
| GET | /api/menu-items | ✅ Yes / ❌ No | |
| GET | /api/menu-items/{id} | ✅ Yes / ❌ No | |
| POST | /api/menu-items | ✅ Yes / ❌ No | |
| PUT | /api/menu-items/{id} | ✅ Yes / ❌ No | |
| DELETE | /api/menu-items/{id} | ✅ Yes / ❌ No | |
| POST | /api/orders | ✅ Yes / ❌ No | |
| POST | /api/orders/{id}/items | ✅ Yes / ❌ No | |

### 3.4 HTTP Status Codes

**Status Codes Implemented**:
- [ ] 200 OK
- [ ] 201 Created
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 404 Not Found
- [ ] 500 Internal Server Error

### 3.5 API Testing

**Testing Tool Used**: _______________________

- [ ] Postman/Insomnia collection created
- [ ] All endpoints tested
- [ ] Success scenarios documented
- [ ] Error scenarios documented
- [ ] Collection exported and included

---

## PHASE 4: Resource & URI Design (25%)

### 4.1 URI Design Principles

**Checklist**:
- [ ] Plural nouns used (e.g., /menu-items)
- [ ] No verbs in URIs
- [ ] Lowercase letters only
- [ ] Hyphens for readability
- [ ] No trailing slashes
- [ ] Hierarchical structure for relationships

### 4.2 Complete Endpoint List

**Total Endpoints Implemented**: _______

**Menu Items**: _______ endpoints  
**Categories**: _______ endpoints  
**Orders**: _______ endpoints  
**Order Items (nested)**: _______ endpoints  
**Customers**: _______ endpoints

### 4.3 Hierarchical Routes

**Nested Resources Implemented**:
- [ ] /api/orders/{orderId}/items
- [ ] /api/customers/{customerId}/orders
- [ ] /api/categories/{categoryId}/menu-items

**Example Hierarchical URIs**:
1. _______________________
2. _______________________
3. _______________________

### 4.4 Query Parameters

**Filtering Parameters**:
- [ ] category
- [ ] available
- [ ] min_price / max_price
- [ ] search
- [ ] status
- [ ] date

**Sorting Parameters**:
- [ ] sort
- [ ] order (asc/desc)

**Pagination Parameters**:
- [ ] page
- [ ] per_page

**Example Query String**:
_______________________

### 4.5 API Documentation

- [ ] Base URL documented
- [ ] Authentication explained
- [ ] All endpoints listed
- [ ] Request examples provided
- [ ] Response examples provided
- [ ] Error responses documented
- [ ] Query parameters explained

---

## ADDITIONAL FEATURES (Bonus)

- [ ] Image upload functionality
- [ ] User authentication (login/register)
- [ ] Shopping cart functionality
- [ ] Order status tracking
- [ ] Email notifications
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Customer reviews/ratings
- [ ] Search functionality
- [ ] Export orders to PDF/CSV

**Bonus Features Implemented**:
_________________________________________________________________
_________________________________________________________________

---

## CHALLENGES FACED & SOLUTIONS

### Challenge 1:
**Problem**: _______________________  
**Solution**: _______________________

### Challenge 2:
**Problem**: _______________________  
**Solution**: _______________________

### Challenge 3:
**Problem**: _______________________  
**Solution**: _______________________

---

## LEARNING OUTCOMES

### What I Learned:
1. _______________________
2. _______________________
3. _______________________

### Skills Improved:
1. _______________________
2. _______________________
3. _______________________

### What I Would Do Differently:
_________________________________________________________________
_________________________________________________________________

---

## FILES SUBMITTED

### Code Repository
- [ ] GitHub repository link provided
- [ ] README.md with setup instructions
- [ ] .env.example file included
- [ ] All migrations included

### Documentation (PDF Files)
- [ ] Phase 1: Database Schema & Reflection Report
- [ ] Phase 2: Responsive Design Report
- [ ] Phase 3: REST Principles Documentation
- [ ] Phase 4: API Documentation & URI Justification

### Testing Materials
- [ ] Postman/Insomnia collection (JSON)
- [ ] API testing screenshots

### Video Demo
- [ ] Video demonstration (3-5 minutes)
- [ ] Video link: _______________________

---

## DECLARATION

I declare that this assignment is my own work and has been completed in accordance with the academic integrity policy. I have properly cited all sources used.

**Signature**: _______________________  
**Date**: _______________________

---

## FOR INSTRUCTOR USE ONLY

### Phase 1 Score: _____ / 25
**Comments**:

### Phase 2 Score: _____ / 25
**Comments**:

### Phase 3 Score: _____ / 25
**Comments**:

### Phase 4 Score: _____ / 25
**Comments**:

### Bonus Points: _____ / 5
**Comments**:

### Total Score: _____ / 100 (+ Bonus)

**Overall Comments**:
