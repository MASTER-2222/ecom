package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.Review;
import com.ritkart.model.Product;
import com.ritkart.model.User;
import com.ritkart.repository.ReviewRepository;
import com.ritkart.repository.ProductRepository;
import com.ritkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductService productService;

    public Review createReview(String userId, Review review) {
        // Validate user and product exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(review.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check if user already reviewed this product
        if (reviewRepository.existsByProductIdAndUserId(review.getProductId(), userId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        // Set user details
        review.setUserId(userId);
        review.setUserName(user.getFullName());
        review.setUserProfileImage(user.getProfileImageUrl());
        review.setStatus(Review.ReviewStatus.PENDING);

        Review savedReview = reviewRepository.save(review);

        // Update product rating
        updateProductRating(review.getProductId());

        return savedReview;
    }

    public Page<Review> getProductReviews(String productId, Pageable pageable) {
        return reviewRepository.findByProductIdAndStatus(productId, Review.ReviewStatus.APPROVED, pageable);
    }

    public Page<Review> getUserReviews(String userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable);
    }

    public Review approveReview(String reviewId) {
        Review review = getReviewById(reviewId);
        review.setStatus(Review.ReviewStatus.APPROVED);
        Review savedReview = reviewRepository.save(review);
        updateProductRating(review.getProductId());
        return savedReview;
    }

    public Review rejectReview(String reviewId, String reason) {
        Review review = getReviewById(reviewId);
        review.setStatus(Review.ReviewStatus.REJECTED);
        review.setModeratorNote(reason);
        return reviewRepository.save(review);
    }

    private Review getReviewById(String reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    private void updateProductRating(String productId) {
        List<Review> approvedReviews = reviewRepository.findByProductIdAndStatus(productId, Review.ReviewStatus.APPROVED);
        
        if (!approvedReviews.isEmpty()) {
            double averageRating = approvedReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            
            productService.updateProductRating(productId, averageRating, approvedReviews.size());
        }
    }

    public Page<Review> getPendingReviews(Pageable pageable) {
        return reviewRepository.findByStatus(Review.ReviewStatus.PENDING, pageable);
    }
}