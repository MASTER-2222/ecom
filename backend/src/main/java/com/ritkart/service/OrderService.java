package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.*;
import com.ritkart.repository.OrderRepository;
import com.ritkart.repository.ProductRepository;
import com.ritkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    // Order creation
    public Order createOrderFromCart(String userId, OrderRequest orderRequest) {
        // Get user and cart
        User user = getUserById(userId);
        Cart cart = cartService.getCartByUserId(userId);

        if (cart.isEmpty()) {
            throw new BadRequestException("Cannot create order from empty cart");
        }

        // Validate cart items
        if (!cartService.validateCartItems(userId)) {
            throw new BadRequestException("Cart contains invalid or out-of-stock items");
        }

        // Create order
        Order order = new Order(userId);
        order.setCustomerEmail(user.getEmail());
        order.setCustomerPhone(user.getPhoneNumber());
        order.setNotes(orderRequest.getNotes());

        // Convert cart items to order items
        for (Cart.CartItem cartItem : cart.getItems()) {
            Product product = getProductById(cartItem.getProductId());
            
            Order.OrderItem orderItem = new Order.OrderItem();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setProductSku(cartItem.getProductSku());
            orderItem.setProductImage(cartItem.getProductImage());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setSelectedVariant(cartItem.getSelectedVariant());

            order.getItems().add(orderItem);

            // Reduce product stock
            productRepository.save(product);
        }

        // Set order totals from cart
        order.setSubtotal(cart.getSubtotal());
        order.setTax(cart.getTax());
        order.setShippingCost(cart.getShippingCost());
        order.setDiscount(cart.getDiscount());
        order.setTotal(cart.getTotal());
        order.setCouponCode(cart.getCouponCode());

        // Set shipping information
        if (orderRequest.getShippingAddress() != null) {
            Order.OrderShipping shipping = new Order.OrderShipping();
            shipping.setAddress(orderRequest.getShippingAddress());
            shipping.setMethod(orderRequest.getShippingMethod());
            shipping.setCost(cart.getShippingCost());
            order.setShipping(shipping);
        }

        // Set payment information
        if (orderRequest.getPaymentMethod() != null) {
            Order.OrderPayment payment = new Order.OrderPayment();
            payment.setMethod(orderRequest.getPaymentMethod());
            payment.setStatus(Order.OrderPayment.PaymentStatus.PENDING);
            payment.setAmount(order.getTotal());
            order.setPayment(payment);
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful order creation
        cartService.clearCart(userId);

        // Send order confirmation email
        try {
            emailService.sendOrderConfirmation(user, savedOrder.getOrderNumber());
        } catch (Exception e) {
            // Log error but don't fail order creation
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }

        // Reduce stock for all products
        for (Order.OrderItem item : savedOrder.getItems()) {
            try {
                Product product = getProductById(item.getProductId());
                product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                product.setTotalSales(product.getTotalSales() + item.getQuantity());
                productRepository.save(product);
            } catch (Exception e) {
                System.err.println("Failed to update product stock for product: " + item.getProductId());
            }
        }

        return savedOrder;
    }

    // Order retrieval
    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getOrdersByUser(String userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }

    public Page<Order> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    public Page<Order> getUserOrdersByStatus(String userId, Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByUserIdAndStatus(userId, status, pageable);
    }

    // Order status management
    public Order updateOrderStatus(String orderId, Order.OrderStatus newStatus, String note) {
        Order order = getOrderById(orderId);
        
        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);
        
        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);
        
        if (note != null && !note.trim().isEmpty()) {
            order.addStatusHistory(newStatus, note);
        }

        // Handle specific status changes
        handleStatusChange(order, oldStatus, newStatus);

        Order savedOrder = orderRepository.save(order);

        // Send status update notification
        try {
            User user = getUserById(order.getUserId());
            emailService.sendOrderStatusUpdate(user, order.getOrderNumber(), newStatus.getDisplayName());
        } catch (Exception e) {
            System.err.println("Failed to send status update email: " + e.getMessage());
        }

        return savedOrder;
    }

    public Order confirmOrder(String orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.CONFIRMED, "Order confirmed and being processed");
    }

    public Order processOrder(String orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.PROCESSING, "Order is being processed");
    }

    public Order shipOrder(String orderId, String trackingNumber, String carrier) {
        Order order = getOrderById(orderId);
        
        if (order.getShipping() != null) {
            order.getShipping().setTrackingNumber(trackingNumber);
            order.getShipping().setCarrier(carrier);
            order.getShipping().setShippedAt(LocalDateTime.now());
        }
        
        return updateOrderStatus(orderId, Order.OrderStatus.SHIPPED, 
                "Order shipped with tracking number: " + trackingNumber);
    }

    public Order markOutForDelivery(String orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.OUT_FOR_DELIVERY, "Order is out for delivery");
    }

    public Order deliverOrder(String orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.DELIVERED, "Order has been delivered");
    }

    public Order cancelOrder(String orderId, String reason) {
        Order order = getOrderById(orderId);
        
        if (!order.canBeCancelled()) {
            throw new BadRequestException("Order cannot be cancelled in current status: " + order.getStatus());
        }
        
        // Restore product stock
        for (Order.OrderItem item : order.getItems()) {
            try {
                Product product = getProductById(item.getProductId());
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                product.setTotalSales(Math.max(0, product.getTotalSales() - item.getQuantity()));
                productRepository.save(product);
            } catch (Exception e) {
                System.err.println("Failed to restore stock for product: " + item.getProductId());
            }
        }
        
        return updateOrderStatus(orderId, Order.OrderStatus.CANCELLED, 
                "Order cancelled. Reason: " + (reason != null ? reason : "Not specified"));
    }

    // Payment management
    public Order updatePaymentStatus(String orderId, Order.OrderPayment.PaymentStatus paymentStatus, 
                                   String transactionId) {
        Order order = getOrderById(orderId);
        
        if (order.getPayment() != null) {
            order.getPayment().setStatus(paymentStatus);
            order.getPayment().setTransactionId(transactionId);
            
            if (paymentStatus == Order.OrderPayment.PaymentStatus.PAID) {
                order.getPayment().setPaidAt(LocalDateTime.now());
                // Automatically confirm paid orders
                if (order.getStatus() == Order.OrderStatus.PENDING) {
                    order.setStatus(Order.OrderStatus.CONFIRMED);
                    order.addStatusHistory(Order.OrderStatus.CONFIRMED, "Payment received, order confirmed");
                }
            }
        }
        
        return orderRepository.save(order);
    }

    public Order processPayment(String orderId, PaymentRequest paymentRequest) {
        Order order = getOrderById(orderId);
        
        // TODO: Integrate with actual payment gateway (Stripe, PayPal, etc.)
        // For now, simulate payment processing
        boolean paymentSuccess = simulatePaymentProcessing(order, paymentRequest);
        
        if (paymentSuccess) {
            return updatePaymentStatus(orderId, Order.OrderPayment.PaymentStatus.PAID, 
                    "TXN_" + System.currentTimeMillis());
        } else {
            return updatePaymentStatus(orderId, Order.OrderPayment.PaymentStatus.FAILED, null);
        }
    }

    // Search and filter
    public Page<Order> searchOrders(String searchTerm, Pageable pageable) {
        return orderRepository.searchOrders(searchTerm, pageable);
    }

    public Page<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate, pageable);
    }

    public Page<Order> getOrdersByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, 
                                                   Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByDateRangeAndStatus(startDate, endDate, status, pageable);
    }

    public Page<Order> getOrdersByPaymentMethod(Order.OrderPayment.PaymentMethod paymentMethod, Pageable pageable) {
        return orderRepository.findByPaymentMethod(paymentMethod, pageable);
    }

    // Analytics and reports
    public long getTotalOrdersCount() {
        return orderRepository.count();
    }

    public long getOrdersCountByStatus(Order.OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    public long getOrdersCountByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.countByCreatedAtBetween(startDate, endDate);
    }

    public BigDecimal getTotalRevenue() {
        List<Order> completedOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
        return completedOrders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findDeliveredOrdersInDateRange(startDate, endDate);
        return orders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<Order> getTopOrdersByValue(int limit) {
        return orderRepository.findHighValueOrders(BigDecimal.ZERO, 
                Pageable.ofSize(limit)).getContent();
    }

    public List<Order> getRecentOrders(int limit) {
        return orderRepository.findRecentOrders(Pageable.ofSize(limit)).getContent();
    }

    // Administrative operations
    public List<Order> getDelayedOrders(int hours) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(hours);
        return orderRepository.findDelayedOrders(cutoffTime);
    }

    public List<Order> getOverdueShippedOrders() {
        return orderRepository.findOverdueShippedOrders(LocalDateTime.now());
    }

    // Helper methods
    private User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private Product getProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    private void validateStatusTransition(Order.OrderStatus currentStatus, Order.OrderStatus newStatus) {
        // Define valid status transitions
        switch (currentStatus) {
            case PENDING:
                if (newStatus != Order.OrderStatus.CONFIRMED && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new BadRequestException("Invalid status transition from PENDING to " + newStatus);
                }
                break;
            case CONFIRMED:
                if (newStatus != Order.OrderStatus.PROCESSING && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new BadRequestException("Invalid status transition from CONFIRMED to " + newStatus);
                }
                break;
            case PROCESSING:
                if (newStatus != Order.OrderStatus.SHIPPED && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new BadRequestException("Invalid status transition from PROCESSING to " + newStatus);
                }
                break;
            case SHIPPED:
                if (newStatus != Order.OrderStatus.OUT_FOR_DELIVERY && newStatus != Order.OrderStatus.DELIVERED) {
                    throw new BadRequestException("Invalid status transition from SHIPPED to " + newStatus);
                }
                break;
            case OUT_FOR_DELIVERY:
                if (newStatus != Order.OrderStatus.DELIVERED) {
                    throw new BadRequestException("Invalid status transition from OUT_FOR_DELIVERY to " + newStatus);
                }
                break;
            case DELIVERED:
            case CANCELLED:
                throw new BadRequestException("Cannot change status from " + currentStatus);
        }
    }

    private void handleStatusChange(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        switch (newStatus) {
            case SHIPPED:
                if (order.getShipping() != null && order.getShipping().getShippedAt() == null) {
                    order.getShipping().setShippedAt(LocalDateTime.now());
                }
                break;
            case DELIVERED:
                order.setDeliveredAt(LocalDateTime.now());
                break;
            case CANCELLED:
                order.setCancelledAt(LocalDateTime.now());
                break;
        }
    }

    private boolean simulatePaymentProcessing(Order order, PaymentRequest paymentRequest) {
        // TODO: Replace with actual payment gateway integration
        // For demo purposes, simulate successful payment
        return true;
    }

    // DTOs
    public static class OrderRequest {
        private String notes;
        private Address shippingAddress;
        private String shippingMethod;
        private Order.OrderPayment.PaymentMethod paymentMethod;

        // Getters and Setters
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public Address getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(Address shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getShippingMethod() { return shippingMethod; }
        public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }

        public Order.OrderPayment.PaymentMethod getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(Order.OrderPayment.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class PaymentRequest {
        private Order.OrderPayment.PaymentMethod method;
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private String cardHolderName;

        // Getters and Setters
        public Order.OrderPayment.PaymentMethod getMethod() { return method; }
        public void setMethod(Order.OrderPayment.PaymentMethod method) { this.method = method; }

        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }

        public String getCardHolderName() { return cardHolderName; }
        public void setCardHolderName(String cardHolderName) { this.cardHolderName = cardHolderName; }
    }
}