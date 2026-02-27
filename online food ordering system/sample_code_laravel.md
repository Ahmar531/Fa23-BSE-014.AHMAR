# Sample Code - Laravel Implementation

## Complete MenuItem Model

```php
<?php
// app/Models/MenuItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

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
        'is_available' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Validation rules
    public static function validationRules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:appetizer,main,dessert,beverage',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean'
        ];
    }

    // Relationships
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
```

## Complete Order Model

```php
<?php
// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'delivery_address',
        'total_amount',
        'status'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Validation rules
    public static function validationRules()
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string',
            'status' => 'in:pending,confirmed,preparing,delivered,cancelled'
        ];
    }

    // Calculate total from items
    public function calculateTotal()
    {
        $this->total_amount = $this->orderItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });
        $this->save();
    }
}
```


## Complete API Controller

```php
<?php
// app/Http/Controllers/Api/MenuItemController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuItemController extends Controller
{
    /**
     * Display a listing of menu items
     * GET /api/menu-items
     */
    public function index(Request $request)
    {
        $query = MenuItem::query();

        // Apply filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('available')) {
            $available = filter_var($request->available, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_available', $available);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        // Apply sorting
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

    /**
     * Store a newly created menu item
     * POST /api/menu-items
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), MenuItem::validationRules());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $menuItem = MenuItem::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu item created successfully',
            'data' => $menuItem
        ], 201);
    }

    /**
     * Display the specified menu item
     * GET /api/menu-items/{id}
     */
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

    /**
     * Update the specified menu item
     * PUT /api/menu-items/{id}
     */
    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::find($id);

        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), MenuItem::validationRules());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $menuItem->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu item updated successfully',
            'data' => $menuItem
        ], 200);
    }

    /**
     * Remove the specified menu item
     * DELETE /api/menu-items/{id}
     */
    public function destroy($id)
    {
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
}
```

## Complete Blade Template with Bootstrap

```blade
{{-- resources/views/menu-items/index.blade.php --}}

@extends('layouts.app')

@section('title', 'Menu Items')

@section('content')
<div class="container mt-4">
    <!-- Header -->
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Our Menu</h1>
            <p class="text-muted">Browse our delicious food items</p>
        </div>
        <div class="col-md-4 text-end">
            <a href="{{ route('menu-items.create') }}" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Add New Item
            </a>
        </div>
    </div>

    <!-- Filters -->
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
            <input type="text" class="form-control" id="searchInput" placeholder="Search menu items...">
        </div>
        <div class="col-md-3">
            <select class="form-select" id="sortSelect">
                <option value="name-asc">Sort by: Name (A-Z)</option>
                <option value="name-desc">Sort by: Name (Z-A)</option>
                <option value="price-asc">Sort by: Price (Low to High)</option>
                <option value="price-desc">Sort by: Price (High to Low)</option>
            </select>
        </div>
    </div>

    <!-- Menu Items Grid -->
    <div class="row" id="menuItemsGrid">
        @forelse($menuItems as $item)
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="{{ $item->image_url ?? 'https://via.placeholder.com/300x200' }}" 
                     class="card-img-top" 
                     alt="{{ $item->name }}" 
                     style="height: 200px; object-fit: cover;">
                
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ $item->name }}</h5>
                    <p class="card-text text-muted small">{{ Str::limit($item->description, 80) }}</p>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-secondary">{{ ucfirst($item->category) }}</span>
                            <h4 class="text-primary mb-0">${{ number_format($item->price, 2) }}</h4>
                        </div>
                        
                        @if($item->is_available)
                            <span class="badge bg-success">Available</span>
                        @else
                            <span class="badge bg-danger">Out of Stock</span>
                        @endif
                    </div>
                </div>
                
                <div class="card-footer bg-transparent">
                    <div class="btn-group w-100" role="group">
                        <a href="{{ route('menu-items.show', $item->id) }}" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-eye"></i> View
                        </a>
                        <a href="{{ route('menu-items.edit', $item->id) }}" class="btn btn-sm btn-outline-warning">
                            <i class="bi bi-pencil"></i> Edit
                        </a>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                data-bs-toggle="modal" 
                                data-bs-target="#deleteModal{{ $item->id }}">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <div class="modal fade" id="deleteModal{{ $item->id }}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete "{{ $item->name }}"?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <form action="{{ route('menu-items.destroy', $item->id) }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        @empty
        <div class="col-12">
            <div class="alert alert-info">
                No menu items found. <a href="{{ route('menu-items.create') }}">Add your first item</a>
            </div>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    <div class="row">
        <div class="col-12">
            {{ $menuItems->links() }}
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
// Client-side filtering and sorting
document.getElementById('categoryFilter').addEventListener('change', filterItems);
document.getElementById('searchInput').addEventListener('input', filterItems);
document.getElementById('sortSelect').addEventListener('change', sortItems);

function filterItems() {
    const category = document.getElementById('categoryFilter').value.toLowerCase();
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#menuItemsGrid .col-12');

    cards.forEach(card => {
        const cardCategory = card.querySelector('.badge.bg-secondary').textContent.toLowerCase();
        const cardName = card.querySelector('.card-title').textContent.toLowerCase();
        
        const matchesCategory = !category || cardCategory.includes(category);
        const matchesSearch = !search || cardName.includes(search);
        
        card.style.display = (matchesCategory && matchesSearch) ? '' : 'none';
    });
}

function sortItems() {
    // Implement sorting logic
}
</script>
@endsection
```
