package com.ritkart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "wishlists")
public class Wishlist {
    
    @Id
    private String id;
    
    @NotNull
    @Indexed
    private String userId;
    
    private List<WishlistItem> items = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Wishlist() {}
    
    public Wishlist(String userId) {
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public List<WishlistItem> getItems() {
        return items;
    }
    
    public void setItems(List<WishlistItem> items) {
        this.items = items;
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
    
    // Helper methods
    public void addItem(String productId) {
        // Check if item already exists
        boolean exists = items.stream()
            .anyMatch(item -> item.getProductId().equals(productId));
        
        if (!exists) {
            items.add(new WishlistItem(productId));
        }
    }
    
    public void removeItem(String productId) {
        items.removeIf(item -> item.getProductId().equals(productId));
    }
    
    public boolean containsProduct(String productId) {
        return items.stream()
            .anyMatch(item -> item.getProductId().equals(productId));
    }
    
    public int getTotalItems() {
        return items.size();
    }
    
    // Inner class for Wishlist Items
    public static class WishlistItem {
        
        @NotNull
        private String productId;
        
        @CreatedDate
        private LocalDateTime addedAt;
        
        // Constructors
        public WishlistItem() {}
        
        public WishlistItem(String productId) {
            this.productId = productId;
            this.addedAt = LocalDateTime.now();
        }
        
        // Getters and Setters
        public String getProductId() {
            return productId;
        }
        
        public void setProductId(String productId) {
            this.productId = productId;
        }
        
        public LocalDateTime getAddedAt() {
            return addedAt;
        }
        
        public void setAddedAt(LocalDateTime addedAt) {
            this.addedAt = addedAt;
        }
    }
}