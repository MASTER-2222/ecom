package com.ritkart.controller;

import com.ritkart.model.Cart;
import com.ritkart.service.CartService;
import com.ritkart.security.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Shopping cart management endpoints")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Operation(summary = "Get user's cart")
    @GetMapping
    public ResponseEntity<Cart> getCart() {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Add item to cart")
    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@Valid @RequestBody AddToCartRequest request) {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.addItemToCart(
                userId, 
                request.getProductId(), 
                request.getQuantity(), 
                request.getSelectedVariant()
            );
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update item quantity")
    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateItemQuantity(
            @PathVariable String productId, 
            @RequestBody Map<String, Integer> request) {
        try {
            String userId = getCurrentUserId();
            Integer quantity = request.get("quantity");
            
            if (quantity == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Cart cart = cartService.updateItemQuantity(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Remove item from cart")
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(@PathVariable String productId) {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.removeItemFromCart(userId, productId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Clear entire cart")
    @DeleteMapping("/clear")
    public ResponseEntity<Cart> clearCart() {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.clearCart(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Add multiple items to cart")
    @PostMapping("/items/bulk")
    public ResponseEntity<Cart> addMultipleItems(@Valid @RequestBody List<AddToCartRequest> items) {
        try {
            String userId = getCurrentUserId();
            
            List<CartService.CartItemRequest> cartItems = items.stream()
                .map(item -> new CartService.CartItemRequest(
                    item.getProductId(), 
                    item.getQuantity(), 
                    item.getSelectedVariant()
                ))
                .toList();
            
            Cart cart = cartService.addMultipleItems(userId, cartItems);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update multiple items in cart")
    @PutMapping("/items/bulk")
    public ResponseEntity<Cart> updateMultipleItems(@Valid @RequestBody List<UpdateCartItemRequest> items) {
        try {
            String userId = getCurrentUserId();
            
            List<CartService.CartItemRequest> cartItems = items.stream()
                .map(item -> new CartService.CartItemRequest(
                    item.getProductId(), 
                    item.getQuantity(), 
                    item.getSelectedVariant()
                ))
                .toList();
            
            Cart cart = cartService.updateMultipleItems(userId, cartItems);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Apply coupon to cart")
    @PostMapping("/coupon")
    public ResponseEntity<Cart> applyCoupon(@RequestBody Map<String, String> request) {
        try {
            String userId = getCurrentUserId();
            String couponCode = request.get("couponCode");
            
            if (couponCode == null || couponCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Cart cart = cartService.applyCoupon(userId, couponCode);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Remove coupon from cart")
    @DeleteMapping("/coupon")
    public ResponseEntity<Cart> removeCoupon() {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.removeCoupon(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Update shipping cost")
    @PutMapping("/shipping")
    public ResponseEntity<Cart> updateShippingCost(@RequestBody Map<String, BigDecimal> request) {
        try {
            String userId = getCurrentUserId();
            BigDecimal shippingCost = request.get("shippingCost");
            
            if (shippingCost == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Cart cart = cartService.updateShippingCost(userId, shippingCost);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update tax amount")
    @PutMapping("/tax")
    public ResponseEntity<Cart> updateTax(@RequestBody Map<String, BigDecimal> request) {
        try {
            String userId = getCurrentUserId();
            BigDecimal tax = request.get("tax");
            
            if (tax == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Cart cart = cartService.updateTax(userId, tax);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Validate cart items")
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCart() {
        try {
            String userId = getCurrentUserId();
            boolean isValid = cartService.validateCartItems(userId);
            List<String> invalidItems = cartService.getInvalidCartItems(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            response.put("invalidItems", invalidItems);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Remove invalid items from cart")
    @DeleteMapping("/invalid-items")
    public ResponseEntity<Cart> removeInvalidItems() {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.removeInvalidItems(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get cart summary")
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getCartSummary() {
        try {
            String userId = getCurrentUserId();
            Cart cart = cartService.getCartByUserId(userId);
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalItems", cart.getTotalItems());
            summary.put("subtotal", cart.getSubtotal());
            summary.put("tax", cart.getTax());
            summary.put("shippingCost", cart.getShippingCost());
            summary.put("discount", cart.getDiscount());
            summary.put("total", cart.getTotal());
            summary.put("isEmpty", cart.isEmpty());
            summary.put("couponCode", cart.getCouponCode());
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Merge guest cart with user cart")
    @PostMapping("/merge")
    public ResponseEntity<Cart> mergeGuestCart(@RequestBody Cart guestCart) {
        try {
            String userId = getCurrentUserId();
            Cart mergedCart = cartService.mergeGuestCart(userId, guestCart);
            return ResponseEntity.ok(mergedCart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Helper method to get current user ID from JWT token
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // In a real implementation, you'd extract the user ID from the JWT token
        // For now, we'll use the email as the user identifier
        return authentication.getName();
    }

    // DTOs for request bodies
    public static class AddToCartRequest {
        private String productId;
        private Integer quantity;
        private String selectedVariant;

        public AddToCartRequest() {}

        // Getters and Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getSelectedVariant() { return selectedVariant; }
        public void setSelectedVariant(String selectedVariant) { this.selectedVariant = selectedVariant; }
    }

    public static class UpdateCartItemRequest {
        private String productId;
        private Integer quantity;
        private String selectedVariant;

        public UpdateCartItemRequest() {}

        // Getters and Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getSelectedVariant() { return selectedVariant; }
        public void setSelectedVariant(String selectedVariant) { this.selectedVariant = selectedVariant; }
    }
}