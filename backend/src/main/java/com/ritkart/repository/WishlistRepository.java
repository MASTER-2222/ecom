package com.ritkart.repository;

import com.ritkart.model.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    
    Optional<Wishlist> findByUserId(String userId);
    
    boolean existsByUserId(String userId);
    
    void deleteByUserId(String userId);
    
    @Query("{'items.productId': ?0}")
    List<Wishlist> findWishlistsContainingProduct(String productId);
    
    @Query("{'items': {$elemMatch: {'productId': ?0}}}")
    Page<Wishlist> findWishlistsWithProduct(String productId, Pageable pageable);
    
    @Query("{'items': {$ne: []}}")
    List<Wishlist> findNonEmptyWishlists();
    
    @Query("{'items': {$size: 0}}")
    List<Wishlist> findEmptyWishlists();
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Wishlist> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'updatedAt': {$gte: ?0, $lte: ?1}}")
    List<Wishlist> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'updatedAt': {$lte: ?0}}")
    List<Wishlist> findByUpdatedAtBefore(LocalDateTime cutoffDate);
    
    @Query("{'updatedAt': {$gte: ?0}}")
    List<Wishlist> findRecentlyUpdated(LocalDateTime since);
    
    // Count queries
    long countByUserId(String userId);
    
    @Query(value = "{'items': {$ne: []}}", count = true)
    long countNonEmptyWishlists();
    
    @Query(value = "{'items': {$size: 0}}", count = true)
    long countEmptyWishlists();
    
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}}", count = true)
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{'items.productId': ?0}", count = true)
    long countWishlistsContainingProduct(String productId);
    
    // Aggregation for wishlist analytics
    @Query(value = "{'items': {$ne: []}}", fields = "{'items': 1, 'userId': 1}")
    List<Wishlist> findWishlistsForAnalytics();
    
    @Query(value = "{'items.productId': ?0}", fields = "{'userId': 1, 'items.addedAt': 1}")
    List<Wishlist> findUsersWhoWishlistedProduct(String productId);
    
    // Popular products in wishlists
    @Query("{'items.productId': ?0}")
    List<Wishlist> findWishlistsForProductPopularity(String productId);
    
    // Recent activity
    @Query(value = "{'updatedAt': {$gte: ?0}}", sort = "{'updatedAt': -1}")
    Page<Wishlist> findRecentlyUpdatedWishlists(LocalDateTime since, Pageable pageable);
    
    // Large wishlists (by item count) 
    @Query("{'items.10': {$exists: true}}")
    List<Wishlist> findLargeWishlists();
    
    // Find wishlists with specific item count
    @Query("{'items': {$size: ?0}}")
    List<Wishlist> findWishlistsByItemCount(int itemCount);
    
    // Find wishlists with minimum item count
    @Query("{'items.?0': {$exists: true}}")
    List<Wishlist> findWishlistsWithMinItems(int minItems);
    
    // Get wishlist activity for specific time periods
    @Query(value = "{'items.addedAt': {$gte: ?0, $lte: ?1}}")
    List<Wishlist> findWishlistsWithItemsAddedBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Clean up operations
    @Query("{'updatedAt': {$lte: ?0}, 'items': {$size: 0}}")
    List<Wishlist> findEmptyWishlistsToCleanup(LocalDateTime cutoffDate);
    
    // User engagement analytics
    @Query(value = "{'updatedAt': {$gte: ?0}}", sort = "{'updatedAt': -1}")
    Page<Wishlist> findMostActiveWishlists(LocalDateTime since, Pageable pageable);
    
    // Find users with multiple wishlist interactions
    @Query("{'items': {$size: {$gte: ?0}}}")
    List<Wishlist> findEngagedUsers(int minItemCount);
}