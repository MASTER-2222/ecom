package com.ritkart.repository;

import com.ritkart.model.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    
    Optional<Cart> findByUserId(String userId);
    
    boolean existsByUserId(String userId);
    
    void deleteByUserId(String userId);
    
    @Query("{'items.productId': ?0}")
    List<Cart> findCartsContainingProduct(String productId);
    
    @Query("{'items': {$elemMatch: {'productId': ?0}}}")
    Page<Cart> findCartsWithProduct(String productId, Pageable pageable);
    
    @Query("{'total': {$gte: ?0}}")
    List<Cart> findByTotalGreaterThanEqual(BigDecimal minTotal);
    
    @Query("{'total': {$gte: ?0, $lte: ?1}}")
    List<Cart> findByTotalBetween(BigDecimal minTotal, BigDecimal maxTotal);
    
    @Query("{'items': {$ne: []}}")
    List<Cart> findNonEmptyCarts();
    
    @Query("{'items': {$ne: []}, 'updatedAt': {$lte: ?0}}")
    List<Cart> findAbandonedCarts(LocalDateTime cutoffDate);
    
    @Query("{'items': {$size: 0}}")
    List<Cart> findEmptyCarts();
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Cart> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'updatedAt': {$gte: ?0, $lte: ?1}}")
    List<Cart> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'updatedAt': {$lte: ?0}}")
    List<Cart> findByUpdatedAtBefore(LocalDateTime cutoffDate);
    
    @Query("{'couponCode': {$exists: true, $ne: null}}")
    List<Cart> findCartsWithCoupons();
    
    @Query("{'couponCode': ?0}")
    List<Cart> findByCouponCode(String couponCode);
    
    @Query("{'shippingMethodId': {$exists: true, $ne: null}}")
    List<Cart> findCartsWithShippingMethod();
    
    @Query("{'shippingMethodId': ?0}")
    List<Cart> findByShippingMethodId(String shippingMethodId);
    
    // Count queries
    long countByExistsUserId();
    
    @Query(value = "{'items': {$ne: []}}", count = true)
    long countNonEmptyCarts();
    
    @Query(value = "{'items': {$size: 0}}", count = true)
    long countEmptyCarts();
    
    @Query(value = "{'total': {$gte: ?0}}", count = true)
    long countByTotalGreaterThanEqual(BigDecimal minTotal);
    
    @Query(value = "{'items': {$ne: []}, 'updatedAt': {$lte: ?0}}", count = true)
    long countAbandonedCarts(LocalDateTime cutoffDate);
    
    @Query(value = "{'couponCode': {$exists: true, $ne: null}}", count = true)
    long countCartsWithCoupons();
    
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}}", count = true)
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Aggregation for cart analytics
    @Query(value = "{'items': {$ne: []}}", fields = "{'total': 1}")
    List<Cart> findCartTotalsForAnalytics();
    
    @Query(value = "{'items.productId': ?0}", fields = "{'items.$': 1, 'userId': 1}")
    List<Cart> findCartsWithSpecificProduct(String productId);
    
    // Clean up operations
    @Query("{'updatedAt': {$lte: ?0}}")
    List<Cart> findCartsToCleanup(LocalDateTime cutoffDate);
    
    // Recent activity
    @Query(value = "{'updatedAt': {$gte: ?0}}", sort = "{'updatedAt': -1}")
    Page<Cart> findRecentlyUpdatedCarts(LocalDateTime since, Pageable pageable);
    
    // Large carts (by item count)
    @Query("{'items.10': {$exists: true}}")
    List<Cart> findLargeCarts();
    
    // Carts with high value
    @Query(value = "{'total': {$gte: ?0}}", sort = "{'total': -1}")
    Page<Cart> findHighValueCarts(BigDecimal minValue, Pageable pageable);
    
    // Get cart statistics for specific products
    @Query(value = "{'items.productId': ?0}")
    List<Cart> findCartsForProductAnalytics(String productId);
}