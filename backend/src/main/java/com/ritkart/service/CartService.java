package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.Cart;
import com.ritkart.model.Product;
import com.ritkart.model.User;
import com.ritkart.repository.CartRepository;
import com.ritkart.repository.ProductRepository;
import com.ritkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Cart management
    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
    }

    public Cart createNewCart(String userId) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Cart cart = new Cart(userId);
        return cartRepository.save(cart);
    }

    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
    }

    // Item management
    public Cart addItemToCart(String userId, String productId, Integer quantity) {
        return addItemToCart(userId, productId, quantity, null);
    }

    public Cart addItemToCart(String userId, String productId, Integer quantity, String selectedVariant) {
        Cart cart = getOrCreateCart(userId);
        Product product = getProductById(productId);

        // Validate product availability
        validateProductAvailability(product, quantity);

        // Create cart item
        Cart.CartItem cartItem = new Cart.CartItem();
        cartItem.setProductId(productId);
        cartItem.setQuantity(quantity);
        cartItem.setPrice(product.getEffectivePrice());
        cartItem.setSelectedVariant(selectedVariant);

        // Set product details for display
        cartItem.setProductName(product.getName());
        cartItem.setProductImage(product.getMainImageUrl());
        cartItem.setProductSku(product.getSku());

        // Add item to cart
        cart.addItem(cartItem);

        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, String productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);

        if (quantity <= 0) {
            return removeItemFromCart(userId, productId);
        }

        // Validate product availability
        Product product = getProductById(productId);
        validateProductAvailability(product, quantity);

        cart.updateItemQuantity(productId, quantity);
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String userId, String productId) {
        Cart cart = getCartByUserId(userId);
        cart.removeItem(productId);
        return cartRepository.save(cart);
    }

    public Cart clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.clearCart();
        return cartRepository.save(cart);
    }

    // Bulk operations
    public Cart addMultipleItems(String userId, List<CartItemRequest> items) {
        Cart cart = getOrCreateCart(userId);

        for (CartItemRequest itemRequest : items) {
            Product product = getProductById(itemRequest.getProductId());
            validateProductAvailability(product, itemRequest.getQuantity());

            Cart.CartItem cartItem = new Cart.CartItem();
            cartItem.setProductId(itemRequest.getProductId());
            cartItem.setQuantity(itemRequest.getQuantity());
            cartItem.setPrice(product.getEffectivePrice());
            cartItem.setSelectedVariant(itemRequest.getSelectedVariant());
            cartItem.setProductName(product.getName());
            cartItem.setProductImage(product.getMainImageUrl());
            cartItem.setProductSku(product.getSku());

            cart.addItem(cartItem);
        }

        return cartRepository.save(cart);
    }

    public Cart updateMultipleItems(String userId, List<CartItemRequest> items) {
        Cart cart = getCartByUserId(userId);

        for (CartItemRequest itemRequest : items) {
            if (itemRequest.getQuantity() <= 0) {
                cart.removeItem(itemRequest.getProductId());
            } else {
                Product product = getProductById(itemRequest.getProductId());
                validateProductAvailability(product, itemRequest.getQuantity());
                cart.updateItemQuantity(itemRequest.getProductId(), itemRequest.getQuantity());
            }
        }

        return cartRepository.save(cart);
    }

    // Pricing and coupons
    public Cart applyCoupon(String userId, String couponCode) {
        Cart cart = getCartByUserId(userId);
        
        // TODO: Implement coupon validation and discount calculation
        // For now, just set the coupon code
        cart.setCouponCode(couponCode);
        
        // Calculate discount based on coupon
        BigDecimal discount = calculateCouponDiscount(cart, couponCode);
        cart.setDiscount(discount);

        return cartRepository.save(cart);
    }

    public Cart removeCoupon(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.setCouponCode(null);
        cart.setDiscount(BigDecimal.ZERO);
        return cartRepository.save(cart);
    }

    public Cart updateShippingCost(String userId, BigDecimal shippingCost) {
        Cart cart = getCartByUserId(userId);
        cart.setShippingCost(shippingCost);
        return cartRepository.save(cart);
    }

    public Cart updateTax(String userId, BigDecimal tax) {
        Cart cart = getCartByUserId(userId);
        cart.setTax(tax);
        return cartRepository.save(cart);
    }

    // Cart validation
    public boolean validateCartItems(String userId) {
        Cart cart = getCartByUserId(userId);
        
        for (Cart.CartItem item : cart.getItems()) {
            try {
                Product product = getProductById(item.getProductId());
                if (!product.isActive() || !product.isInStock() || 
                    product.getStockQuantity() < item.getQuantity()) {
                    return false;
                }
            } catch (ResourceNotFoundException e) {
                return false;
            }
        }
        
        return true;
    }

    public List<String> getInvalidCartItems(String userId) {
        Cart cart = getCartByUserId(userId);
        return cart.getItems().stream()
                .filter(item -> {
                    try {
                        Product product = getProductById(item.getProductId());
                        return !product.isActive() || !product.isInStock() || 
                               product.getStockQuantity() < item.getQuantity();
                    } catch (ResourceNotFoundException e) {
                        return true;
                    }
                })
                .map(Cart.CartItem::getProductId)
                .toList();
    }

    public Cart removeInvalidItems(String userId) {
        Cart cart = getCartByUserId(userId);
        List<String> invalidProductIds = getInvalidCartItems(userId);
        
        for (String productId : invalidProductIds) {
            cart.removeItem(productId);
        }
        
        return cartRepository.save(cart);
    }

    // Cart merging (for guest to user conversion)
    public Cart mergeGuestCart(String userId, Cart guestCart) {
        Cart userCart = getOrCreateCart(userId);
        
        for (Cart.CartItem guestItem : guestCart.getItems()) {
            // Check if item already exists in user cart
            Cart.CartItem existingItem = userCart.getItems().stream()
                    .filter(item -> item.getProductId().equals(guestItem.getProductId()))
                    .findFirst()
                    .orElse(null);
            
            if (existingItem != null) {
                // Combine quantities
                int newQuantity = existingItem.getQuantity() + guestItem.getQuantity();
                userCart.updateItemQuantity(guestItem.getProductId(), newQuantity);
            } else {
                // Add new item
                userCart.addItem(guestItem);
            }
        }
        
        return cartRepository.save(userCart);
    }

    // Analytics and statistics
    public List<Cart> getAbandonedCarts(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return cartRepository.findAbandonedCarts(cutoffDate);
    }

    public List<Cart> getCartsWithProduct(String productId) {
        return cartRepository.findCartsContainingProduct(productId);
    }

    public long getCartCount() {
        return cartRepository.count();
    }

    public long getNonEmptyCartCount() {
        return cartRepository.countNonEmptyCarts();
    }

    public long getAbandonedCartCount(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return cartRepository.countAbandonedCarts(cutoffDate);
    }

    // Cleanup operations
    public void cleanupEmptyCarts() {
        List<Cart> emptyCarts = cartRepository.findEmptyCarts();
        cartRepository.deleteAll(emptyCarts);
    }

    public void cleanupOldCarts(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        List<Cart> oldCarts = cartRepository.findCartsToCleanup(cutoffDate);
        cartRepository.deleteAll(oldCarts);
    }

    // Helper methods
    private Product getProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    private void validateProductAvailability(Product product, Integer quantity) {
        if (!product.isActive()) {
            throw new BadRequestException("Product '" + product.getName() + "' is not available");
        }

        if (!product.isInStock()) {
            throw new BadRequestException("Product '" + product.getName() + "' is out of stock");
        }

        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock for product '" + product.getName() + 
                    "'. Available: " + product.getStockQuantity() + ", Requested: " + quantity);
        }
    }

    private BigDecimal calculateCouponDiscount(Cart cart, String couponCode) {
        // TODO: Implement actual coupon logic
        // This is a simplified implementation
        switch (couponCode.toUpperCase()) {
            case "SAVE10":
                return cart.getSubtotal().multiply(BigDecimal.valueOf(0.10));
            case "SAVE20":
                return cart.getSubtotal().multiply(BigDecimal.valueOf(0.20));
            case "FIRSTORDER":
                return cart.getSubtotal().multiply(BigDecimal.valueOf(0.15));
            default:
                return BigDecimal.ZERO;
        }
    }

    // DTO for bulk operations
    public static class CartItemRequest {
        private String productId;
        private Integer quantity;
        private String selectedVariant;

        public CartItemRequest() {}

        public CartItemRequest(String productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public CartItemRequest(String productId, Integer quantity, String selectedVariant) {
            this.productId = productId;
            this.quantity = quantity;
            this.selectedVariant = selectedVariant;
        }

        // Getters and Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getSelectedVariant() { return selectedVariant; }
        public void setSelectedVariant(String selectedVariant) { this.selectedVariant = selectedVariant; }
    }
}