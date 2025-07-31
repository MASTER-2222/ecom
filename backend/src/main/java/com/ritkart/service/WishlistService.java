package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.Wishlist;
import com.ritkart.model.Product;
import com.ritkart.model.User;
import com.ritkart.repository.WishlistRepository;
import com.ritkart.repository.ProductRepository;
import com.ritkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Wishlist management
    public Wishlist getWishlistByUserId(String userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> createNewWishlist(userId));
    }

    public Wishlist createNewWishlist(String userId) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Wishlist wishlist = new Wishlist(userId);
        return wishlistRepository.save(wishlist);
    }

    public Wishlist getOrCreateWishlist(String userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> createNewWishlist(userId));
    }

    // Item management
    public Wishlist addItemToWishlist(String userId, String productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = getProductById(productId);

        // Validate product
        validateProduct(product);

        // Check if item already exists
        if (wishlist.containsProduct(productId)) {
            throw new BadRequestException("Product '" + product.getName() + "' is already in your wishlist");
        }

        wishlist.addItem(productId);
        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeItemFromWishlist(String userId, String productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        
        if (!wishlist.containsProduct(productId)) {
            throw new ResourceNotFoundException("Product not found in wishlist");
        }

        wishlist.removeItem(productId);
        return wishlistRepository.save(wishlist);
    }

    public boolean isProductInWishlist(String userId, String productId) {
        Optional<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
        return wishlist.map(w -> w.containsProduct(productId)).orElse(false);
    }

    public Wishlist clearWishlist(String userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        wishlist.getItems().clear();
        return wishlistRepository.save(wishlist);
    }

    // Bulk operations
    public Wishlist addMultipleItems(String userId, List<String> productIds) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        for (String productId : productIds) {
            Product product = getProductById(productId);
            validateProduct(product);

            if (!wishlist.containsProduct(productId)) {
                wishlist.addItem(productId);
            }
        }

        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeMultipleItems(String userId, List<String> productIds) {
        Wishlist wishlist = getWishlistByUserId(userId);

        for (String productId : productIds) {
            wishlist.removeItem(productId);
        }

        return wishlistRepository.save(wishlist);
    }

    // Wishlist with product details
    public WishlistWithProducts getWishlistWithProducts(String userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        List<Product> products = wishlist.getItems().stream()
                .map(item -> {
                    try {
                        return getProductById(item.getProductId());
                    } catch (ResourceNotFoundException e) {
                        // Remove invalid product from wishlist
                        wishlist.removeItem(item.getProductId());
                        return null;
                    }
                })
                .filter(product -> product != null && product.isActive())
                .collect(Collectors.toList());

        // Save wishlist if any invalid items were removed
        if (products.size() != wishlist.getItems().size()) {
            wishlistRepository.save(wishlist);
        }

        return new WishlistWithProducts(wishlist, products);
    }

    public Page<Product> getWishlistProducts(String userId, Pageable pageable) {
        Wishlist wishlist = getWishlistByUserId(userId);
        List<String> productIds = wishlist.getItems().stream()
                .map(Wishlist.WishlistItem::getProductId)
                .collect(Collectors.toList());

        return productRepository.findByIdIn(productIds, pageable);
    }

    // Wishlist validation and cleanup
    public Wishlist validateAndCleanWishlist(String userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        List<String> invalidProductIds = getInvalidWishlistItems(userId);
        
        for (String productId : invalidProductIds) {
            wishlist.removeItem(productId);
        }
        
        return wishlistRepository.save(wishlist);
    }

    public List<String> getInvalidWishlistItems(String userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        return wishlist.getItems().stream()
                .filter(item -> {
                    try {
                        Product product = getProductById(item.getProductId());
                        return !product.isActive();
                    } catch (ResourceNotFoundException e) {
                        return true;
                    }
                })
                .map(Wishlist.WishlistItem::getProductId)
                .collect(Collectors.toList());
    }

    // Wishlist sharing and social features
    public List<Product> getSharedWishlistProducts(String userId) {
        // This could be used for sharing wishlists with friends/family
        return getWishlistWithProducts(userId).getProducts();
    }

    public WishlistSummary getWishlistSummary(String userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        List<Product> products = getWishlistWithProducts(userId).getProducts();
        
        WishlistSummary summary = new WishlistSummary();
        summary.setTotalItems(products.size());
        summary.setCategories(products.stream()
                .map(Product::getCategoryId)
                .distinct()
                .collect(Collectors.toList()));
        summary.setAveragePrice(products.stream()
                .mapToDouble(p -> p.getEffectivePrice().doubleValue())
                .average()
                .orElse(0.0));
        summary.setTotalValue(products.stream()
                .mapToDouble(p -> p.getEffectivePrice().doubleValue())
                .sum());
        
        return summary;
    }

    // Analytics and statistics
    public List<Wishlist> getWishlistsWithProduct(String productId) {
        return wishlistRepository.findWishlistsContainingProduct(productId);
    }

    public long getWishlistCount() {
        return wishlistRepository.count();
    }

    public long getNonEmptyWishlistCount() {
        return wishlistRepository.countNonEmptyWishlists();
    }

    public long getProductWishlistCount(String productId) {
        return wishlistRepository.countWishlistsContainingProduct(productId);
    }

    public List<String> getMostWishlistedProducts(int limit) {
        // This would require aggregation to count products across all wishlists
        // For now, return empty list - could be implemented with MongoDB aggregation
        return List.of();
    }

    public List<Wishlist> getRecentWishlistActivity(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return wishlistRepository.findRecentlyUpdated(since);
    }

    // Cleanup operations
    public void cleanupEmptyWishlists() {
        List<Wishlist> emptyWishlists = wishlistRepository.findEmptyWishlists();
        wishlistRepository.deleteAll(emptyWishlists);
    }

    public void cleanupOldWishlists(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        List<Wishlist> oldWishlists = wishlistRepository.findEmptyWishlistsToCleanup(cutoffDate);
        wishlistRepository.deleteAll(oldWishlists);
    }

    // Helper methods
    private Product getProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    private void validateProduct(Product product) {
        if (!product.isActive()) {
            throw new BadRequestException("Product '" + product.getName() + "' is not available");
        }
    }

    // DTOs for response
    public static class WishlistWithProducts {
        private Wishlist wishlist;
        private List<Product> products;

        public WishlistWithProducts(Wishlist wishlist, List<Product> products) {
            this.wishlist = wishlist;
            this.products = products;
        }

        public Wishlist getWishlist() { return wishlist; }
        public void setWishlist(Wishlist wishlist) { this.wishlist = wishlist; }

        public List<Product> getProducts() { return products; }
        public void setProducts(List<Product> products) { this.products = products; }
    }

    public static class WishlistSummary {
        private int totalItems;
        private List<String> categories;
        private double averagePrice;
        private double totalValue;

        public int getTotalItems() { return totalItems; }
        public void setTotalItems(int totalItems) { this.totalItems = totalItems; }

        public List<String> getCategories() { return categories; }
        public void setCategories(List<String> categories) { this.categories = categories; }

        public double getAveragePrice() { return averagePrice; }
        public void setAveragePrice(double averagePrice) { this.averagePrice = averagePrice; }

        public double getTotalValue() { return totalValue; }
        public void setTotalValue(double totalValue) { this.totalValue = totalValue; }
    }
}