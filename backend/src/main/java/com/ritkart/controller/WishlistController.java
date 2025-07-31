package com.ritkart.controller;

import com.ritkart.model.Wishlist;
import com.ritkart.model.Product;
import com.ritkart.service.WishlistService;
import com.ritkart.security.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Wishlist management endpoints")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Operation(summary = "Get user's wishlist")
    @GetMapping
    public ResponseEntity<Wishlist> getWishlist() {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.getWishlistByUserId(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get wishlist with full product details")
    @GetMapping("/with-products")
    public ResponseEntity<WishlistService.WishlistWithProducts> getWishlistWithProducts() {
        try {
            String userId = getCurrentUserId();
            WishlistService.WishlistWithProducts wishlistWithProducts = 
                wishlistService.getWishlistWithProducts(userId);
            return ResponseEntity.ok(wishlistWithProducts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get wishlist products with pagination")
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getWishlistProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            String userId = getCurrentUserId();
            Sort sort = Sort.by(sortDir.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Product> products = wishlistService.getWishlistProducts(userId, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Add item to wishlist")
    @PostMapping("/items")
    public ResponseEntity<Wishlist> addItem(@Valid @RequestBody AddToWishlistRequest request) {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.addItemToWishlist(userId, request.getProductId());
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Remove item from wishlist")
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Wishlist> removeItem(@PathVariable String productId) {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.removeItemFromWishlist(userId, productId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Check if product is in wishlist")
    @GetMapping("/items/{productId}/exists")
    public ResponseEntity<Map<String, Boolean>> isProductInWishlist(@PathVariable String productId) {
        try {
            String userId = getCurrentUserId();
            boolean exists = wishlistService.isProductInWishlist(userId, productId);
            
            Map<String, Boolean> response = new HashMap<>();
            response.put("exists", exists);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Clear entire wishlist")
    @DeleteMapping("/clear")
    public ResponseEntity<Wishlist> clearWishlist() {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.clearWishlist(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Add multiple items to wishlist")
    @PostMapping("/items/bulk")
    public ResponseEntity<Wishlist> addMultipleItems(@Valid @RequestBody List<String> productIds) {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.addMultipleItems(userId, productIds);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Remove multiple items from wishlist")
    @DeleteMapping("/items/bulk")
    public ResponseEntity<Wishlist> removeMultipleItems(@Valid @RequestBody List<String> productIds) {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.removeMultipleItems(userId, productIds);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Get wishlist summary")
    @GetMapping("/summary")
    public ResponseEntity<WishlistService.WishlistSummary> getWishlistSummary() {
        try {
            String userId = getCurrentUserId();
            WishlistService.WishlistSummary summary = wishlistService.getWishlistSummary(userId);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Validate and clean wishlist")
    @PostMapping("/validate")
    public ResponseEntity<Wishlist> validateAndCleanWishlist() {
        try {
            String userId = getCurrentUserId();
            Wishlist wishlist = wishlistService.validateAndCleanWishlist(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get invalid items in wishlist")
    @GetMapping("/invalid-items")
    public ResponseEntity<List<String>> getInvalidItems() {
        try {
            String userId = getCurrentUserId();
            List<String> invalidItems = wishlistService.getInvalidWishlistItems(userId);
            return ResponseEntity.ok(invalidItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get shared wishlist products (for sharing with friends/family)")
    @GetMapping("/shared")
    public ResponseEntity<List<Product>> getSharedWishlistProducts() {
        try {
            String userId = getCurrentUserId();
            List<Product> products = wishlistService.getSharedWishlistProducts(userId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Toggle product in wishlist (add if not exists, remove if exists)")
    @PostMapping("/items/{productId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleProduct(@PathVariable String productId) {
        try {
            String userId = getCurrentUserId();
            boolean wasInWishlist = wishlistService.isProductInWishlist(userId, productId);
            
            Wishlist wishlist;
            if (wasInWishlist) {
                wishlist = wishlistService.removeItemFromWishlist(userId, productId);
            } else {
                wishlist = wishlistService.addItemToWishlist(userId, productId);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("wishlist", wishlist);
            response.put("added", !wasInWishlist);
            response.put("inWishlist", !wasInWishlist);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoints
    @Operation(summary = "Get wishlist statistics (Admin only)")
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getWishlistStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalWishlists", wishlistService.getWishlistCount());
            stats.put("nonEmptyWishlists", wishlistService.getNonEmptyWishlistCount());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get product wishlist count (Admin only)")
    @GetMapping("/admin/products/{productId}/wishlist-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getProductWishlistCount(@PathVariable String productId) {
        try {
            long count = wishlistService.getProductWishlistCount(productId);
            
            Map<String, Long> response = new HashMap<>();
            response.put("wishlistCount", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get recent wishlist activity (Admin only)")
    @GetMapping("/admin/recent-activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Wishlist>> getRecentActivity(
            @RequestParam(defaultValue = "7") int days) {
        try {
            List<Wishlist> recentActivity = wishlistService.getRecentWishlistActivity(days);
            return ResponseEntity.ok(recentActivity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Cleanup empty wishlists (Admin only)")
    @DeleteMapping("/admin/cleanup/empty")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> cleanupEmptyWishlists() {
        try {
            wishlistService.cleanupEmptyWishlists();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Empty wishlists cleaned up successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Cleanup old wishlists (Admin only)")
    @DeleteMapping("/admin/cleanup/old")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> cleanupOldWishlists(
            @RequestParam(defaultValue = "365") int days) {
        try {
            wishlistService.cleanupOldWishlists(days);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Old wishlists cleaned up successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to get current user ID from JWT token
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    // DTOs for request bodies
    public static class AddToWishlistRequest {
        private String productId;

        public AddToWishlistRequest() {}

        public AddToWishlistRequest(String productId) {
            this.productId = productId;
        }

        // Getters and Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
    }
}