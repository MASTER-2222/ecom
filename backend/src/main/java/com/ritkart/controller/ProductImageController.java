package com.ritkart.controller;

import com.ritkart.service.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/product-images")
@Tag(name = "Product Image Management", description = "Admin endpoints for managing product images")
@CrossOrigin(origins = {"http://localhost:3000", "https://ritkart-frontend.railway.app"})
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @Operation(summary = "Auto-assign images to all products based on category")
    @PostMapping("/auto-assign-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> autoAssignImagesForAllProducts() {
        try {
            Map<String, Object> result = productImageService.autoAssignImagesForAllProducts();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "error", "Failed to auto-assign images: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Auto-assign images to products by category")
    @PostMapping("/auto-assign-by-category/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> autoAssignImagesByCategory(@PathVariable String categoryId) {
        try {
            Map<String, Object> result = productImageService.autoAssignImagesByCategory(categoryId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "error", "Failed to auto-assign images for category: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Manually assign specific image to product")
    @PostMapping("/assign-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignImageToProduct(@RequestBody Map<String, Object> request) {
        try {
            String productId = (String) request.get("productId");
            String cloudinaryPublicId = (String) request.get("cloudinaryPublicId");
            Boolean setAsPrimary = (Boolean) request.getOrDefault("setAsPrimary", true);
            
            Map<String, Object> result = productImageService.assignImageToProduct(productId, cloudinaryPublicId, setAsPrimary);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to assign image: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Update product images")
    @PutMapping("/{productId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProductImages(
            @PathVariable String productId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<String> imageUrls = (List<String>) request.get("imageUrls");
            
            Map<String, Object> result = productImageService.updateProductImages(productId, imageUrls);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to update product images: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Remove image from product")
    @DeleteMapping("/{productId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeImageFromProduct(
            @PathVariable String productId,
            @RequestParam String imageUrl) {
        try {
            Map<String, Object> result = productImageService.removeImageFromProduct(productId, imageUrl);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to remove image: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Get products without images")
    @GetMapping("/products-without-images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProductsWithoutImages() {
        try {
            List<Map<String, Object>> products = productImageService.getProductsWithoutImages();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", products,
                "count", products.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "error", "Failed to get products without images: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Get available Cloudinary images for category")
    @GetMapping("/available-images/{categoryName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAvailableImagesForCategory(@PathVariable String categoryName) {
        try {
            List<Map<String, Object>> images = productImageService.getAvailableImagesForCategory(categoryName);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", images,
                "count", images.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "error", "Failed to get available images: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Suggest images for product based on name and category")
    @GetMapping("/suggest-images/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> suggestImagesForProduct(@PathVariable String productId) {
        try {
            List<Map<String, Object>> suggestions = productImageService.suggestImagesForProduct(productId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", suggestions,
                "count", suggestions.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to suggest images: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Get image assignment statistics")
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getImageAssignmentStatistics() {
        try {
            Map<String, Object> stats = productImageService.getImageAssignmentStatistics();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("success", false, "error", "Failed to get statistics: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Bulk update product images from CSV data")
    @PostMapping("/bulk-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkUpdateProductImages(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> updates = (List<Map<String, Object>>) request.get("updates");
            
            Map<String, Object> result = productImageService.bulkUpdateProductImages(updates);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to bulk update: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Replace ALL product images with appropriate category-specific images")
    @PostMapping("/replace-all-images")
<<<<<<< HEAD
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
=======
    @PreAuthorize("hasRole('ADMIN')")
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
    public ResponseEntity<?> replaceAllProductImages() {
        try {
            Map<String, Object> result = productImageService.replaceAllProductImages();
            return ResponseEntity.ok(Map.of("success", true, "data", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to replace all images: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Get all products with current and suggested images for admin overview")
    @GetMapping("/products-with-suggestions")
<<<<<<< HEAD
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
=======
    @PreAuthorize("hasRole('ADMIN')")
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
    public ResponseEntity<?> getProductsWithImageSuggestions() {
        try {
            List<Map<String, Object>> result = productImageService.getProductsWithImageSuggestions();
            return ResponseEntity.ok(Map.of("success", true, "data", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to get products with suggestions: " + e.getMessage())
            );
        }
    }

    @Operation(summary = "Update a specific product with its suggested appropriate image")
    @PutMapping("/{productId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProductWithSuggestedImage(@PathVariable String productId) {
        try {
            Map<String, Object> result = productImageService.updateProductWithSuggestedImage(productId);
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(Map.of("success", true, "data", result));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", result.get("error")));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to update product image: " + e.getMessage())
            );
        }
    }
<<<<<<< HEAD

    @Operation(summary = "Debug endpoint to check current product images")
    @GetMapping("/debug/current-images")
    public ResponseEntity<?> debugCurrentImages() {
        try {
            List<Map<String, Object>> result = productImageService.getProductsWithImageSuggestions();
            return ResponseEntity.ok(Map.of("success", true, "data", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", "Failed to get debug info: " + e.getMessage())
            );
        }
    }
=======
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
}