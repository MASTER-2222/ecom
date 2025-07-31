package com.ritkart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "reviews")
public class Review {
    
    @Id
    private String id;
    
    @NotNull(message = "Product ID is required")
    @Indexed
    private String productId;
    
    @NotNull(message = "User ID is required")
    @Indexed
    private String userId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    @Size(max = 100)
    private String title;
    
    @NotBlank(message = "Review comment is required")
    @Size(min = 10, max = 2000)
    private String comment;
    
    private List<String> imageUrls = new ArrayList<>();
    
    private boolean isVerifiedPurchase = false;
    
    private boolean isRecommended = true;
    
    private Integer helpfulVotes = 0;
    
    private Integer totalVotes = 0;
    
    private ReviewStatus status = ReviewStatus.PENDING;
    
    private String moderatorNote;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // User details for display (denormalized for performance)
    private String userName;
    private String userProfileImage;
    
    // Constructors
    public Review() {}
    
    public Review(String productId, String userId, Integer rating, String comment) {
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getProductId() {
        return productId;
    }
    
    public void setProductId(String productId) {
        this.productId = productId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public boolean isVerifiedPurchase() {
        return isVerifiedPurchase;
    }
    
    public void setVerifiedPurchase(boolean verifiedPurchase) {
        isVerifiedPurchase = verifiedPurchase;
    }
    
    public boolean isRecommended() {
        return isRecommended;
    }
    
    public void setRecommended(boolean recommended) {
        isRecommended = recommended;
    }
    
    public Integer getHelpfulVotes() {
        return helpfulVotes;
    }
    
    public void setHelpfulVotes(Integer helpfulVotes) {
        this.helpfulVotes = helpfulVotes;
    }
    
    public Integer getTotalVotes() {
        return totalVotes;
    }
    
    public void setTotalVotes(Integer totalVotes) {
        this.totalVotes = totalVotes;
    }
    
    public ReviewStatus getStatus() {
        return status;
    }
    
    public void setStatus(ReviewStatus status) {
        this.status = status;
    }
    
    public String getModeratorNote() {
        return moderatorNote;
    }
    
    public void setModeratorNote(String moderatorNote) {
        this.moderatorNote = moderatorNote;
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
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getUserProfileImage() {
        return userProfileImage;
    }
    
    public void setUserProfileImage(String userProfileImage) {
        this.userProfileImage = userProfileImage;
    }
    
    // Helper methods
    public boolean isApproved() {
        return status == ReviewStatus.APPROVED;
    }
    
    public boolean isPending() {
        return status == ReviewStatus.PENDING;
    }
    
    public boolean isRejected() {
        return status == ReviewStatus.REJECTED;
    }
    
    public double getHelpfulnessRatio() {
        if (totalVotes == 0) return 0.0;
        return (double) helpfulVotes / totalVotes;
    }
    
    public boolean hasImages() {
        return imageUrls != null && !imageUrls.isEmpty();
    }
    
    public String getStarRating() {
        StringBuilder stars = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.append("★");
            } else {
                stars.append("☆");
            }
        }
        return stars.toString();
    }
    
    public enum ReviewStatus {
        PENDING, APPROVED, REJECTED
    }
}