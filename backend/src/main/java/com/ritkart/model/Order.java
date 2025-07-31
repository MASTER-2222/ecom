package com.ritkart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "orders")
public class Order {
    
    @Id
    private String id;
    
    @NotBlank(message = "Order number is required")
    @Indexed(unique = true)
    private String orderNumber;
    
    @NotNull(message = "User ID is required")
    @Indexed
    private String userId;
    
    private List<OrderItem> items = new ArrayList<>();
    
    @NotNull(message = "Order status is required")
    private OrderStatus status = OrderStatus.PENDING;
    
    private OrderPayment payment;
    private OrderShipping shipping;
    
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingCost;
    private BigDecimal discount;
    private BigDecimal total;
    
    private String couponCode;
    private String notes;
    
    @Email
    private String customerEmail;
    private String customerPhone;
    
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;
    
    // Constructors
    public Order() {
        this.orderNumber = generateOrderNumber();
        this.statusHistory.add(new OrderStatusHistory(OrderStatus.PENDING, "Order created"));
    }
    
    public Order(String userId) {
        this();
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public List<OrderItem> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        if (this.status != status) {
            this.status = status;
            addStatusHistory(status, null);
            
            if (status == OrderStatus.DELIVERED) {
                this.deliveredAt = LocalDateTime.now();
            } else if (status == OrderStatus.CANCELLED) {
                this.cancelledAt = LocalDateTime.now();
            }
        }
    }
    
    public OrderPayment getPayment() {
        return payment;
    }
    
    public void setPayment(OrderPayment payment) {
        this.payment = payment;
    }
    
    public OrderShipping getShipping() {
        return shipping;
    }
    
    public void setShipping(OrderShipping shipping) {
        this.shipping = shipping;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getTax() {
        return tax;
    }
    
    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }
    
    public BigDecimal getShippingCost() {
        return shippingCost;
    }
    
    public void setShippingCost(BigDecimal shippingCost) {
        this.shippingCost = shippingCost;
    }
    
    public BigDecimal getDiscount() {
        return discount;
    }
    
    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public String getCouponCode() {
        return couponCode;
    }
    
    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getCustomerPhone() {
        return customerPhone;
    }
    
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
    public List<OrderStatusHistory> getStatusHistory() {
        return statusHistory;
    }
    
    public void setStatusHistory(List<OrderStatusHistory> statusHistory) {
        this.statusHistory = statusHistory;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }
    
    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }
    
    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
    
    // Helper methods
    public boolean canBeCancelled() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }
    
    public boolean isDelivered() {
        return status == OrderStatus.DELIVERED;
    }
    
    public boolean isCancelled() {
        return status == OrderStatus.CANCELLED;
    }
    
    public int getTotalItems() {
        return items.stream().mapToInt(OrderItem::getQuantity).sum();
    }
    
    public void addStatusHistory(OrderStatus status, String note) {
        if (note == null) {
            note = "Status changed to " + status.getDisplayName();
        }
        statusHistory.add(new OrderStatusHistory(status, note));
    }
    
    private String generateOrderNumber() {
        return "RIT" + System.currentTimeMillis();
    }
    
    public enum OrderStatus {
        PENDING("Pending"),
        CONFIRMED("Confirmed"),
        PROCESSING("Processing"),
        SHIPPED("Shipped"),
        OUT_FOR_DELIVERY("Out for Delivery"),
        DELIVERED("Delivered"),
        CANCELLED("Cancelled"),
        RETURNED("Returned");
        
        private final String displayName;
        
        OrderStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public static class OrderItem {
        private String productId;
        private String productName;
        private String productSku;
        private String productImage;
        private Integer quantity;
        private BigDecimal price;
        private String selectedVariant;
        
        public OrderItem() {}
        
        public OrderItem(String productId, String productName, Integer quantity, BigDecimal price) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
        }
        
        // Getters and Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        
        public String getProductSku() { return productSku; }
        public void setProductSku(String productSku) { this.productSku = productSku; }
        
        public String getProductImage() { return productImage; }
        public void setProductImage(String productImage) { this.productImage = productImage; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        
        public String getSelectedVariant() { return selectedVariant; }
        public void setSelectedVariant(String selectedVariant) { this.selectedVariant = selectedVariant; }
        
        public BigDecimal getSubtotal() {
            return price.multiply(BigDecimal.valueOf(quantity));
        }
    }
    
    public static class OrderPayment {
        private PaymentMethod method;
        private PaymentStatus status;
        private String transactionId;
        private String paymentGateway;
        private BigDecimal amount;
        private LocalDateTime paidAt;
        
        public OrderPayment() {}
        
        // Getters and Setters
        public PaymentMethod getMethod() { return method; }
        public void setMethod(PaymentMethod method) { this.method = method; }
        
        public PaymentStatus getStatus() { return status; }
        public void setStatus(PaymentStatus status) { this.status = status; }
        
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        
        public String getPaymentGateway() { return paymentGateway; }
        public void setPaymentGateway(String paymentGateway) { this.paymentGateway = paymentGateway; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public LocalDateTime getPaidAt() { return paidAt; }
        public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
        
        public enum PaymentMethod {
            CREDIT_CARD, DEBIT_CARD, PAYPAL, STRIPE, COD
        }
        
        public enum PaymentStatus {
            PENDING, PAID, FAILED, REFUNDED
        }
    }
    
    public static class OrderShipping {
        private Address address;
        private String method;
        private String trackingNumber;
        private String carrier;
        private BigDecimal cost;
        private LocalDateTime estimatedDelivery;
        private LocalDateTime shippedAt;
        
        public OrderShipping() {}
        
        // Getters and Setters
        public Address getAddress() { return address; }
        public void setAddress(Address address) { this.address = address; }
        
        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        
        public String getTrackingNumber() { return trackingNumber; }
        public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
        
        public String getCarrier() { return carrier; }
        public void setCarrier(String carrier) { this.carrier = carrier; }
        
        public BigDecimal getCost() { return cost; }
        public void setCost(BigDecimal cost) { this.cost = cost; }
        
        public LocalDateTime getEstimatedDelivery() { return estimatedDelivery; }
        public void setEstimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
        
        public LocalDateTime getShippedAt() { return shippedAt; }
        public void setShippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; }
    }
    
    public static class OrderStatusHistory {
        private OrderStatus status;
        private String note;
        private LocalDateTime timestamp;
        
        public OrderStatusHistory() {}
        
        public OrderStatusHistory(OrderStatus status, String note) {
            this.status = status;
            this.note = note;
            this.timestamp = LocalDateTime.now();
        }
        
        // Getters and Setters
        public OrderStatus getStatus() { return status; }
        public void setStatus(OrderStatus status) { this.status = status; }
        
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}