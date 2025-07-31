package com.ritkart.repository;

import com.ritkart.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    boolean existsByOrderNumber(String orderNumber);
    
    List<Order> findByUserId(String userId);
    
    Page<Order> findByUserId(String userId, Pageable pageable);
    
    List<Order> findByUserIdAndStatus(String userId, Order.OrderStatus status);
    
    Page<Order> findByUserIdAndStatus(String userId, Order.OrderStatus status, Pageable pageable);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    
    List<Order> findByCustomerEmail(String customerEmail);
    
    Page<Order> findByCustomerEmail(String customerEmail, Pageable pageable);
    
    List<Order> findByCustomerPhone(String customerPhone);
    
    @Query("{'payment.status': ?0}")
    List<Order> findByPaymentStatus(Order.OrderPayment.PaymentStatus paymentStatus);
    
    @Query("{'payment.status': ?0}")
    Page<Order> findByPaymentStatus(Order.OrderPayment.PaymentStatus paymentStatus, Pageable pageable);
    
    @Query("{'payment.method': ?0}")
    List<Order> findByPaymentMethod(Order.OrderPayment.PaymentMethod paymentMethod);
    
    @Query("{'payment.method': ?0}")
    Page<Order> findByPaymentMethod(Order.OrderPayment.PaymentMethod paymentMethod, Pageable pageable);
    
    @Query("{'payment.transactionId': ?0}")
    Optional<Order> findByTransactionId(String transactionId);
    
    @Query("{'shipping.trackingNumber': ?0}")
    Optional<Order> findByTrackingNumber(String trackingNumber);
    
    @Query("{'shipping.carrier': ?0}")
    List<Order> findByShippingCarrier(String carrier);
    
    @Query("{'total': {$gte: ?0}}")
    List<Order> findByTotalGreaterThanEqual(BigDecimal minTotal);
    
    @Query("{'total': {$gte: ?0, $lte: ?1}}")
    List<Order> findByTotalBetween(BigDecimal minTotal, BigDecimal maxTotal);
    
    @Query("{'total': {$gte: ?0, $lte: ?1}}")
    Page<Order> findByTotalBetween(BigDecimal minTotal, BigDecimal maxTotal, Pageable pageable);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    @Query("{'deliveredAt': {$gte: ?0, $lte: ?1}}")
    List<Order> findByDeliveredAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'cancelledAt': {$gte: ?0, $lte: ?1}}")
    List<Order> findByCancelledAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'couponCode': ?0}")
    List<Order> findByCouponCode(String couponCode);
    
    @Query("{'couponCode': {$exists: true, $ne: null}}")
    List<Order> findOrdersWithCoupons();
    
    @Query("{'items.productId': ?0}")
    List<Order> findOrdersContainingProduct(String productId);
    
    @Query("{'items.productId': ?0}")
    Page<Order> findOrdersContainingProduct(String productId, Pageable pageable);
    
    @Query("{'items': {$elemMatch: {'productId': ?0}}}")
    List<Order> findOrdersWithProduct(String productId);
    
    @Query("{'notes': {$regex: ?0, $options: 'i'}}")
    Page<Order> findByNotesContainingIgnoreCase(String searchTerm, Pageable pageable);
    
    @Query("{'$or': [" +
           "{'orderNumber': {$regex: ?0, $options: 'i'}}, " +
           "{'customerEmail': {$regex: ?0, $options: 'i'}}, " +
           "{'customerPhone': {$regex: ?0, $options: 'i'}}" +
           "]}")
    Page<Order> searchOrders(String searchTerm, Pageable pageable);
    
    // Date range queries with status
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}, 'status': ?2}")
    List<Order> findByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, Order.OrderStatus status);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}, 'status': ?2}")
    Page<Order> findByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, Order.OrderStatus status, Pageable pageable);
    
    // User orders with date range
    @Query("{'userId': ?0, 'createdAt': {$gte: ?1, $lte: ?2}}")
    List<Order> findByUserIdAndDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'userId': ?0, 'createdAt': {$gte: ?1, $lte: ?2}}")
    Page<Order> findByUserIdAndDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // Count queries
    long countByStatus(Order.OrderStatus status);
    
    long countByUserId(String userId);
    
    long countByUserIdAndStatus(String userId, Order.OrderStatus status);
    
    @Query(value = "{'payment.status': ?0}", count = true)
    long countByPaymentStatus(Order.OrderPayment.PaymentStatus paymentStatus);
    
    @Query(value = "{'payment.method': ?0}", count = true)
    long countByPaymentMethod(Order.OrderPayment.PaymentMethod paymentMethod);
    
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}}", count = true)
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}, 'status': ?2}", count = true)
    long countByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, Order.OrderStatus status);
    
    @Query(value = "{'total': {$gte: ?0}}", count = true)
    long countByTotalGreaterThanEqual(BigDecimal minTotal);
    
    @Query(value = "{'couponCode': {$exists: true, $ne: null}}", count = true)
    long countOrdersWithCoupons();
    
    @Query(value = "{'items.productId': ?0}", count = true)
    long countOrdersContainingProduct(String productId);
    
    // Recent orders
    @Query(value = "{}", sort = "{'createdAt': -1}")
    Page<Order> findRecentOrders(Pageable pageable);
    
    @Query(value = "{'status': ?0}", sort = "{'createdAt': -1}")
    Page<Order> findRecentOrdersByStatus(Order.OrderStatus status, Pageable pageable);
    
    @Query(value = "{'userId': ?0}", sort = "{'createdAt': -1}")
    Page<Order> findRecentOrdersByUser(String userId, Pageable pageable);
    
    // High value orders
    @Query(value = "{'total': {$gte: ?0}}", sort = "{'total': -1}")
    Page<Order> findHighValueOrders(BigDecimal minValue, Pageable pageable);
    
    // Orders requiring attention
    @Query("{'status': {$in: ['PENDING', 'CONFIRMED']}, 'createdAt': {$lte: ?0}}")
    List<Order> findDelayedOrders(LocalDateTime cutoffTime);
    
    @Query("{'status': 'SHIPPED', 'shipping.estimatedDelivery': {$lte: ?0}}")
    List<Order> findOverdueShippedOrders(LocalDateTime currentTime);
    
    // Analytics queries
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}, 'status': {$ne: 'CANCELLED'}}")
    List<Order> findCompletedOrdersInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}, 'status': 'DELIVERED'}")
    List<Order> findDeliveredOrdersInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Customer analytics
    @Query("{'userId': ?0, 'status': 'DELIVERED'}")
    List<Order> findCompletedOrdersByUser(String userId);
    
    @Query(value = "{'userId': ?0, 'status': 'DELIVERED'}", sort = "{'createdAt': -1}")
    Page<Order> findCompletedOrdersByUser(String userId, Pageable pageable);
    
    // Revenue analytics
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}, 'status': {$ne: 'CANCELLED'}}", fields = "{'total': 1, 'createdAt': 1}")
    List<Order> findOrderTotalsForPeriod(LocalDateTime startDate, LocalDateTime endDate);
    
    // Product performance
    @Query(value = "{'items.productId': ?0, 'status': 'DELIVERED'}")
    List<Order> findDeliveredOrdersForProduct(String productId);
    
    // Shipping analytics
    @Query("{'shipping.carrier': ?0, 'status': 'DELIVERED'}")
    List<Order> findDeliveredOrdersByCarrier(String carrier);
    
    @Query(value = "{'status': 'DELIVERED', 'createdAt': {$gte: ?0, $lte: ?1}}", sort = "{'deliveredAt': 1}")
    List<Order> findDeliveredOrdersWithDeliveryTime(LocalDateTime startDate, LocalDateTime endDate);
}