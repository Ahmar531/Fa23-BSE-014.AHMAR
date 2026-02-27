# Sample Code - Django Implementation

## Complete Models

```python
# orders/models.py

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
    image_url = models.URLField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'

    def __str__(self):
        return self.name

    def get_category_display_name(self):
        return dict(self.CATEGORY_CHOICES).get(self.category, self.category)


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
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=Decimal('0.00')
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

    def calculate_total(self):
        """Calculate total from order items"""
        total = sum(item.get_subtotal() for item in self.items.all())
        self.total_amount = total
        self.save()
        return total

    def get_status_display_name(self):
        return dict(self.STATUS_CHOICES).get(self.status, self.status)


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name='items'
    )
    menu_item = models.ForeignKey(
        MenuItem, 
        on_delete=models.CASCADE
    )
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

    def get_subtotal(self):
        return self.price * self.quantity
```


## API Views (Django REST Framework)

```python
# orders/api_views.py

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import MenuItem, Order, OrderItem
from .serializers import MenuItemSerializer, OrderSerializer, OrderItemSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'per_page'
    max_page_size = 100


class MenuItemAPIView(APIView):
    """
    API endpoint for menu items
    GET /api/menu-items/ - List all items
    POST /api/menu-items/ - Create new item
    """
    
    def get(self, request):
        """
        List menu items with filtering, sorting, and pagination
        """
        queryset = MenuItem.objects.all()
        
        # Apply filters
        category = request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        available = request.query_params.get('available', None)
        if available is not None:
            is_available = available.lower() == 'true'
            queryset = queryset.filter(is_available=is_available)
        
        min_price = request.query_params.get('min_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        
        max_price = request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Apply sorting
        sort_by = request.query_params.get('sort', 'id')
        order = request.query_params.get('order', 'asc')
        
        if sort_by in ['id', 'name', 'price', 'created_at']:
            if order == 'desc':
                sort_by = f'-{sort_by}'
            queryset = queryset.order_by(sort_by)
        
        # Pagination
        paginator = StandardResultsSetPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        serializer = MenuItemSerializer(paginated_queryset, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'pagination': {
                'total': paginator.page.paginator.count,
                'per_page': paginator.page_size,
                'current_page': paginator.page.number,
                'last_page': paginator.page.paginator.num_pages,
            }
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        Create a new menu item
        """
        serializer = MenuItemSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Menu item created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class MenuItemDetailAPIView(APIView):
    """
    API endpoint for single menu item
    GET /api/menu-items/{id}/ - Get item
    PUT /api/menu-items/{id}/ - Update item
    DELETE /api/menu-items/{id}/ - Delete item
    """
    
    def get(self, request, pk):
        """Get single menu item"""
        menu_item = get_object_or_404(MenuItem, pk=pk)
        serializer = MenuItemSerializer(menu_item)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        """Update menu item"""
        menu_item = get_object_or_404(MenuItem, pk=pk)
        serializer = MenuItemSerializer(menu_item, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Menu item updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Delete menu item"""
        menu_item = get_object_or_404(MenuItem, pk=pk)
        menu_item.delete()
        
        return Response({
            'success': True,
            'message': 'Menu item deleted successfully'
        }, status=status.HTTP_200_OK)


class OrderAPIView(APIView):
    """
    API endpoint for orders
    GET /api/orders/ - List all orders
    POST /api/orders/ - Create new order
    """
    
    def get(self, request):
        """List all orders with filtering"""
        queryset = Order.objects.all()
        
        # Filter by status
        order_status = request.query_params.get('status', None)
        if order_status:
            queryset = queryset.filter(status=order_status)
        
        # Filter by date
        date = request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(created_at__date=date)
        
        paginator = StandardResultsSetPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        serializer = OrderSerializer(paginated_queryset, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Create new order with items"""
        serializer = OrderSerializer(data=request.data)
        
        if serializer.is_valid():
            order = serializer.save()
            
            # Add items to order
            items_data = request.data.get('items', [])
            for item_data in items_data:
                menu_item = get_object_or_404(MenuItem, pk=item_data['menu_item_id'])
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=item_data['quantity'],
                    price=menu_item.price
                )
            
            # Calculate total
            order.calculate_total()
            
            # Return complete order with items
            response_serializer = OrderSerializer(order)
            
            return Response({
                'success': True,
                'message': 'Order created successfully',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class OrderItemAPIView(APIView):
    """
    API endpoint for order items (nested resource)
    GET /api/orders/{order_id}/items/ - List items in order
    POST /api/orders/{order_id}/items/ - Add item to order
    """
    
    def get(self, request, order_id):
        """Get all items in an order"""
        order = get_object_or_404(Order, pk=order_id)
        items = order.items.all()
        serializer = OrderItemSerializer(items, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request, order_id):
        """Add item to order"""
        order = get_object_or_404(Order, pk=order_id)
        
        menu_item_id = request.data.get('menu_item_id')
        quantity = request.data.get('quantity')
        
        if not menu_item_id or not quantity:
            return Response({
                'success': False,
                'message': 'menu_item_id and quantity are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        menu_item = get_object_or_404(MenuItem, pk=menu_item_id)
        
        order_item = OrderItem.objects.create(
            order=order,
            menu_item=menu_item,
            quantity=quantity,
            price=menu_item.price
        )
        
        # Update order total
        order.calculate_total()
        
        serializer = OrderItemSerializer(order_item)
        
        return Response({
            'success': True,
            'message': 'Item added to order',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


class OrderItemDetailAPIView(APIView):
    """
    DELETE /api/orders/{order_id}/items/{item_id}/ - Remove item from order
    """
    
    def delete(self, request, order_id, item_id):
        """Remove item from order"""
        order = get_object_or_404(Order, pk=order_id)
        order_item = get_object_or_404(OrderItem, pk=item_id, order=order)
        
        order_item.delete()
        
        # Update order total
        order.calculate_total()
        
        return Response({
            'success': True,
            'message': 'Item removed from order'
        }, status=status.HTTP_200_OK)
```

## Serializers

```python
# orders/serializers.py

from rest_framework import serializers
from .models import MenuItem, Order, OrderItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'category', 
            'price', 'image_url', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        source='get_subtotal',
        read_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'menu_item', 'menu_item_name',
            'quantity', 'price', 'subtotal', 'created_at'
        ]
        read_only_fields = ['id', 'price', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source='get_status_display_name',
        read_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'total_amount', 'status', 'status_display',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_amount', 'created_at', 'updated_at']
```


## URL Configuration

```python
# orders/urls.py

from django.urls import path
from .views import (
    MenuItemListView, MenuItemCreateView, MenuItemDetailView,
    MenuItemUpdateView, MenuItemDeleteView,
    OrderListView, OrderCreateView, OrderDetailView
)
from .api_views import (
    MenuItemAPIView, MenuItemDetailAPIView,
    OrderAPIView, OrderItemAPIView, OrderItemDetailAPIView
)

# Web routes
web_patterns = [
    # Menu Items
    path('menu-items/', MenuItemListView.as_view(), name='menuitem-list'),
    path('menu-items/create/', MenuItemCreateView.as_view(), name='menuitem-create'),
    path('menu-items/<int:pk>/', MenuItemDetailView.as_view(), name='menuitem-detail'),
    path('menu-items/<int:pk>/edit/', MenuItemUpdateView.as_view(), name='menuitem-edit'),
    path('menu-items/<int:pk>/delete/', MenuItemDeleteView.as_view(), name='menuitem-delete'),
    
    # Orders
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]

# API routes
api_patterns = [
    # Menu Items API
    path('api/menu-items/', MenuItemAPIView.as_view(), name='api-menuitem-list'),
    path('api/menu-items/<int:pk>/', MenuItemDetailAPIView.as_view(), name='api-menuitem-detail'),
    
    # Orders API
    path('api/orders/', OrderAPIView.as_view(), name='api-order-list'),
    
    # Order Items API (nested)
    path('api/orders/<int:order_id>/items/', OrderItemAPIView.as_view(), name='api-orderitem-list'),
    path('api/orders/<int:order_id>/items/<int:item_id>/', OrderItemDetailAPIView.as_view(), name='api-orderitem-detail'),
]

urlpatterns = web_patterns + api_patterns
```

## Django Template with Bootstrap

```html
<!-- templates/menu_items/index.html -->

{% extends 'base.html' %}
{% load static %}

{% block title %}Menu Items{% endblock %}

{% block content %}
<div class="container mt-4">
    <!-- Header -->
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Our Menu</h1>
            <p class="text-muted">Browse our delicious food items</p>
        </div>
        <div class="col-md-4 text-end">
            <a href="{% url 'menuitem-create' %}" class="btn btn-primary">
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
        {% for item in menu_items %}
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" data-category="{{ item.category }}" data-name="{{ item.name|lower }}" data-price="{{ item.price }}">
            <div class="card h-100 shadow-sm">
                {% if item.image_url %}
                <img src="{{ item.image_url }}" class="card-img-top" alt="{{ item.name }}" style="height: 200px; object-fit: cover;">
                {% else %}
                <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="{{ item.name }}" style="height: 200px; object-fit: cover;">
                {% endif %}
                
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text text-muted small">{{ item.description|truncatewords:15 }}</p>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-secondary">{{ item.get_category_display }}</span>
                            <h4 class="text-primary mb-0">${{ item.price }}</h4>
                        </div>
                        
                        {% if item.is_available %}
                            <span class="badge bg-success">Available</span>
                        {% else %}
                            <span class="badge bg-danger">Out of Stock</span>
                        {% endif %}
                    </div>
                </div>
                
                <div class="card-footer bg-transparent">
                    <div class="btn-group w-100" role="group">
                        <a href="{% url 'menuitem-detail' item.id %}" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-eye"></i> View
                        </a>
                        <a href="{% url 'menuitem-edit' item.id %}" class="btn btn-sm btn-outline-warning">
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

        <!-- Delete Modal -->
        <div class="modal fade" id="deleteModal{{ item.id }}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete "{{ item.name }}"?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <form action="{% url 'menuitem-delete' item.id %}" method="POST">
                            {% csrf_token %}
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {% empty %}
        <div class="col-12">
            <div class="alert alert-info">
                No menu items found. <a href="{% url 'menuitem-create' %}">Add your first item</a>
            </div>
        </div>
        {% endfor %}
    </div>

    <!-- Pagination -->
    {% if is_paginated %}
    <div class="row">
        <div class="col-12">
            <nav>
                <ul class="pagination justify-content-center">
                    {% if page_obj.has_previous %}
                    <li class="page-item">
                        <a class="page-link" href="?page=1">First</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="?page={{ page_obj.previous_page_number }}">Previous</a>
                    </li>
                    {% endif %}

                    <li class="page-item active">
                        <span class="page-link">
                            Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}
                        </span>
                    </li>

                    {% if page_obj.has_next %}
                    <li class="page-item">
                        <a class="page-link" href="?page={{ page_obj.next_page_number }}">Next</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="?page={{ page_obj.paginator.num_pages }}">Last</a>
                    </li>
                    {% endif %}
                </ul>
            </nav>
        </div>
    </div>
    {% endif %}
</div>
{% endblock %}

{% block extra_js %}
<script>
// Client-side filtering
document.getElementById('categoryFilter').addEventListener('change', filterItems);
document.getElementById('searchInput').addEventListener('input', filterItems);

function filterItems() {
    const category = document.getElementById('categoryFilter').value.toLowerCase();
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#menuItemsGrid > div[data-category]');

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category').toLowerCase();
        const cardName = card.getAttribute('data-name').toLowerCase();
        
        const matchesCategory = !category || cardCategory === category;
        const matchesSearch = !search || cardName.includes(search);
        
        card.style.display = (matchesCategory && matchesSearch) ? '' : 'none';
    });
}
</script>
{% endblock %}
```
