package com.ritkart.repository;

import com.ritkart.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    List<Review> findByProductId(String productId);
    
    Page<Review> findByProductId(String productId, Pageable pageable);
    
    List<Review> findByProductIdAndStatus(String productId, Review.ReviewStatus status);
    
    Page<Review> findByProductIdAndStatus(String productId, Review.ReviewStatus status, Pageable pageable);
    
    List<Review> findByUserId(String userId);
    
    Page<Review> findByUserId(String userId, Pageable pageable);
    
    List<Review> findByUserIdAndStatus(String userId, Review.ReviewStatus status);
    
    Page<Review> findByUserIdAndStatus(String userId, Review.ReviewStatus status, Pageable pageable);
    
    Optional<Review> findByProductIdAndUserId(String productId, String userId);
    
    boolean existsByProductIdAndUserId(String productId, String userId);
    
    List<Review> findByStatus(Review.ReviewStatus status);
    
    Page<Review> findByStatus(Review.ReviewStatus status, Pageable pageable);
    
    List<Review> findByRating(Integer rating);
    
    Page<Review> findByRating(Integer rating, Pageable pageable);
    
    List<Review> findByProductIdAndRating(String productId, Integer rating);
    
    Page<Review> findByProductIdAndRating(String productId, Integer rating, Pageable pageable);
    
    @Query("{'rating': {$gte: ?0}}")
    Page<Review> findByRatingGreaterThanEqual(Integer minRating, Pageable pageable);
    
    @Query("{'productId': ?0, 'rating': {$gte: ?1}}")
    Page<Review> findByProductIdAndRatingGreaterThanEqual(String productId, Integer minRating, Pageable pageable);
    
    @Query("{'rating': {$lte: ?0}}")
    Page<Review> findByRatingLessThanEqual(Integer maxRating, Pageable pageable);
    
    @Query("{'productId': ?0, 'rating': {$lte: ?1}}")
    Page<Review> findByProductIdAndRatingLessThanEqual(String productId, Integer maxRating, Pageable pageable);
    
    @Query("{'rating': {$gte: ?0, $lte: ?1}}")
    Page<Review> findByRatingBetween(Integer minRating, Integer maxRating, Pageable pageable);
    
    @Query("{'productId': ?0, 'rating': {$gte: ?1, $lte: ?2}}")
    Page<Review> findByProductIdAndRatingBetween(String productId, Integer minRating, Integer maxRating, Pageable pageable);
    
    List<Review> findByIsVerifiedPurchase(boolean isVerifiedPurchase);
    
    Page<Review> findByIsVerifiedPurchase(boolean isVerifiedPurchase, Pageable pageable);
    
    List<Review> findByProductIdAndIsVerifiedPurchase(String productId, boolean isVerifiedPurchase);
    
    Page<Review> findByProductIdAndIsVerifiedPurchase(String productId, boolean isVerifiedPurchase, Pageable pageable);
    
    @Query("{'comment': {$regex: ?0, $options: 'i'}}")
    Page<Review> findByCommentContainingIgnoreCase(String searchTerm, Pageable pageable);
    
    @Query("{'productId': ?0, 'comment': {$regex: ?1, $options: 'i'}}")
    Page<Review> findByProductIdAndCommentContainingIgnoreCase(String productId, String searchTerm, Pageable pageable);
    
    @Query("{'$or': [" +
           "{'title': {$regex: ?0, $options: 'i'}}, " +
           "{'comment': {$regex: ?0, $options: 'i'}}" +
           "]}")
    Page<Review> searchReviews(String searchTerm, Pageable pageable);
    
    @Query("{'productId': ?0, '$or': [" +
           "{'title': {$regex: ?1, $options: 'i'}}, " +
           "{'comment': {$regex: ?1, $options: 'i'}}" +
           "]}")
    Page<Review> searchProductReviews(String productId, String searchTerm, Pageable pageable);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Review> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'productId': ?0, 'createdAt': {$gte: ?1, $lte: ?2}}")
    List<Review> findByProductIdAndCreatedAtBetween(String productId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'imageUrls': {$exists: true, $ne: []}}")
    Page<Review> findReviewsWithImages(Pageable pageable);
    
    @Query("{'productId': ?0, 'imageUrls': {$exists: true, $ne: []}}")
    Page<Review> findProductReviewsWithImages(String productId, Pageable pageable);
    
    @Query("{'helpfulVotes': {$gte: ?0}}")
    Page<Review> findByHelpfulVotesGreaterThanEqual(Integer minVotes, Pageable pageable);
    
    @Query("{'productId': ?0, 'helpfulVotes': {$gte: ?1}}")
    Page<Review> findByProductIdAndHelpfulVotesGreaterThanEqual(String productId, Integer minVotes, Pageable pageable);
    
    // Count queries
    long countByProductId(String productId);
    
    long countByProductIdAndStatus(String productId, Review.ReviewStatus status);
    
    long countByUserId(String userId);
    
    long countByUserIdAndStatus(String userId, Review.ReviewStatus status);
    
    long countByStatus(Review.ReviewStatus status);
    
    long countByRating(Integer rating);
    
    long countByProductIdAndRating(String productId, Integer rating);
    
    long countByIsVerifiedPurchase(boolean isVerifiedPurchase);
    
    long countByProductIdAndIsVerifiedPurchase(String productId, boolean isVerifiedPurchase);
    
    @Query(value = "{'productId': ?0, 'rating': {$gte: ?1}}", count = true)
    long countByProductIdAndRatingGreaterThanEqual(String productId, Integer minRating);
    
    @Query(value = "{'createdAt': {$gte: ?0, $lte: ?1}}", count = true)
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{'imageUrls': {$exists: true, $ne: []}}", count = true)
    long countReviewsWithImages();
    
    @Query(value = "{'productId': ?0, 'imageUrls': {$exists: true, $ne: []}}", count = true)
    long countProductReviewsWithImages(String productId);
    
    // Aggregation queries for statistics
    @Query(value = "{'productId': ?0}")
    List<Review> findByProductIdForAggregation(String productId);
    
    // Get most helpful reviews
    @Query(value = "{'productId': ?0, 'status': ?1}", sort = "{'helpfulVotes': -1, 'createdAt': -1}")
    Page<Review> findMostHelpfulReviews(String productId, Review.ReviewStatus status, Pageable pageable);
    
    // Get recent reviews
    @Query(value = "{'productId': ?0, 'status': ?1}", sort = "{'createdAt': -1}")
    Page<Review> findRecentReviews(String productId, Review.ReviewStatus status, Pageable pageable);
    
    // Get reviews sorted by rating (high to low)
    @Query(value = "{'productId': ?0, 'status': ?1}", sort = "{'rating': -1, 'createdAt': -1}")
    Page<Review> findByRatingDescending(String productId, Review.ReviewStatus status, Pageable pageable);
    
    // Get reviews sorted by rating (low to high)
    @Query(value = "{'productId': ?0, 'status': ?1}", sort = "{'rating': 1, 'createdAt': -1}")
    Page<Review> findByRatingAscending(String productId, Review.ReviewStatus status, Pageable pageable);
    
    // Get pending reviews for moderation
    @Query(value = "{'status': 'PENDING'}", sort = "{'createdAt': 1}")
    Page<Review> findPendingReviewsForModeration(Pageable pageable);
    
    // Get reviews that need attention (low ratings)
    @Query(value = "{'rating': {$lte: 2}, 'status': 'APPROVED'}", sort = "{'createdAt': -1}")
    Page<Review> findLowRatingReviews(Pageable pageable);
    
    @Query(value = "{'productId': ?0, 'rating': {$lte: 2}, 'status': 'APPROVED'}", sort = "{'createdAt': -1}")
    Page<Review> findProductLowRatingReviews(String productId, Pageable pageable);
}