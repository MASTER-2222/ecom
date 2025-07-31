package com.ritkart.controller;

import com.ritkart.model.Order;
import com.ritkart.service.OrderService;
import com.ritkart.security.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Order management endpoints")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // Customer endpoints
    @Operation(summary = "Create order from cart")
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderService.OrderRequest orderRequest) {
        try {
            String userId = getCurrentUserId();
            Order order = orderService.createOrderFromCart(userId, orderRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Get user's orders")
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Order>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            String userId = getCurrentUserId();
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Order> orders = orderService.getOrdersByUser(userId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get order by ID")
    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderById(@PathVariable String orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            
            // Check if user owns this order (unless admin)
            String userId = getCurrentUserId();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && !order.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get order by order number")
    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            Order order = orderService.getOrderByNumber(orderNumber);
            
            // Check if user owns this order (unless admin)
            String userId = getCurrentUserId();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && !order.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Cancel order")
    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Order> cancelOrder(@PathVariable String orderId, @RequestBody(required = false) Map<String, String> request) {
        try {
            Order order = orderService.getOrderById(orderId);
            
            // Check if user owns this order (unless admin)
            String userId = getCurrentUserId();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && !order.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            String reason = request != null ? request.get("reason") : null;
            Order cancelledOrder = orderService.cancelOrder(orderId, reason);
            return ResponseEntity.ok(cancelledOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Process payment for order")
    @PostMapping("/{orderId}/payment")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Order> processPayment(@PathVariable String orderId, @Valid @RequestBody OrderService.PaymentRequest paymentRequest) {
        try {
            Order order = orderService.getOrderById(orderId);
            
            // Check if user owns this order (unless admin)
            String userId = getCurrentUserId();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && !order.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Order paidOrder = orderService.processPayment(orderId, paymentRequest);
            return ResponseEntity.ok(paidOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoints
    @Operation(summary = "Get all orders (Admin only)")
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get orders by status (Admin only)")
    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Order>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderService.getOrdersByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Update order status (Admin only)")
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, Object> request) {
        try {
            String statusStr = (String) request.get("status");
            String note = (String) request.get("note");
            
            Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr);
            Order updatedOrder = orderService.updateOrderStatus(orderId, status, note);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Ship order (Admin only)")
    @PostMapping("/admin/{orderId}/ship")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> shipOrder(@PathVariable String orderId, @RequestBody Map<String, String> request) {
        try {
            String trackingNumber = request.get("trackingNumber");
            String carrier = request.get("carrier");
            
            if (trackingNumber == null || carrier == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Order shippedOrder = orderService.shipOrder(orderId, trackingNumber, carrier);
            return ResponseEntity.ok(shippedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Mark order as delivered (Admin only)")
    @PostMapping("/admin/{orderId}/deliver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> deliverOrder(@PathVariable String orderId) {
        try {
            Order deliveredOrder = orderService.deliverOrder(orderId);
            return ResponseEntity.ok(deliveredOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update payment status (Admin only)")
    @PutMapping("/admin/{orderId}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updatePaymentStatus(@PathVariable String orderId, @RequestBody Map<String, Object> request) {
        try {
            String statusStr = (String) request.get("status");
            String transactionId = (String) request.get("transactionId");
            
            Order.OrderPayment.PaymentStatus status = Order.OrderPayment.PaymentStatus.valueOf(statusStr);
            Order updatedOrder = orderService.updatePaymentStatus(orderId, status, transactionId);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Search orders (Admin only)")
    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Order>> searchOrders(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderService.searchOrders(q, pageable);
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get orders by date range (Admin only)")
    @GetMapping("/admin/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<Order> orders;
        if (status != null) {
            orders = orderService.getOrdersByDateRangeAndStatus(startDate, endDate, status, pageable);
        } else {
            orders = orderService.getOrdersByDateRange(startDate, endDate, pageable);
        }
        
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get order statistics (Admin only)")
    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getOrderStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalOrders", orderService.getTotalOrdersCount());
        stats.put("pendingOrders", orderService.getOrdersCountByStatus(Order.OrderStatus.PENDING));
        stats.put("confirmedOrders", orderService.getOrdersCountByStatus(Order.OrderStatus.CONFIRMED));
        stats.put("shippedOrders", orderService.getOrdersCountByStatus(Order.OrderStatus.SHIPPED));
        stats.put("deliveredOrders", orderService.getOrdersCountByStatus(Order.OrderStatus.DELIVERED));
        stats.put("cancelledOrders", orderService.getOrdersCountByStatus(Order.OrderStatus.CANCELLED));
        stats.put("totalRevenue", orderService.getTotalRevenue());
        
        // Recent orders
        stats.put("recentOrders", orderService.getRecentOrders(10));
        
        // Revenue for current month
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();
        stats.put("monthlyRevenue", orderService.getRevenueByDateRange(startOfMonth, now));
        stats.put("monthlyOrderCount", orderService.getOrdersCountByDateRange(startOfMonth, now));
        
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Get delayed orders (Admin only)")
    @GetMapping("/admin/delayed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getDelayedOrders(@RequestParam(defaultValue = "24") int hours) {
        List<Order> delayedOrders = orderService.getDelayedOrders(hours);
        return ResponseEntity.ok(delayedOrders);
    }

    @Operation(summary = "Get overdue shipped orders (Admin only)")
    @GetMapping("/admin/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOverdueShippedOrders() {
        List<Order> overdueOrders = orderService.getOverdueShippedOrders();
        return ResponseEntity.ok(overdueOrders);
    }

    // Helper method to get current user ID
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // In production, extract user ID from JWT token properly
        return authentication.getName();
    }
}