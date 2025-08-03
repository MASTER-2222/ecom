package com.ritkart.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ritkart.model.Product;
import com.ritkart.model.Category;
import com.ritkart.repository.ProductRepository;
import com.ritkart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductImageService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private Cloudinary cloudinary;

    // Cloudinary base URL for constructing image URLs
    private static final String CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dv0lg87ib/image/upload";
    
    // Cloudinary folder mapping for categories
    private static final Map<String, String> CATEGORY_FOLDER_MAPPING;
    static {
        Map<String, String> map = new HashMap<>();
        map.put("Electronics", "ritkart/electronics");
        map.put("Mobiles", "ritkart/mobiles");
        map.put("Fashion", "ritkart/fashion");
        map.put("Home", "ritkart/home");
        map.put("Appliances", "ritkart/appliances");
        map.put("Books", "ritkart/books");
        CATEGORY_FOLDER_MAPPING = Collections.unmodifiableMap(map);
    }

    // Product name to Cloudinary public_id mapping
    private static final Map<String, String> PRODUCT_IMAGE_MAPPING;
    static {
        Map<String, String> map = new HashMap<>();
        // Electronics
        map.put("samsung", "samsung-galaxy-s24-ultra");
        map.put("iphone", "iphone-15-pro-max");
        map.put("sony", "sony-wh1000xm5");
        map.put("macbook", "macbook-air-m2");
        map.put("dell", "dell-xps-13");
        map.put("lg", "lg-oled-tv-55");
        map.put("canon", "canon-eos-r6");
        map.put("playstation", "playstation-5");
        map.put("nintendo", "nintendo-switch-oled");
        // Mobiles
        map.put("oneplus", "oneplus-12");
        map.put("pixel", "google-pixel-8");
        map.put("xiaomi", "xiaomi-14-ultra");
        // Fashion
        map.put("levis", "levis-jeans-men");
        map.put("dress", "womens-floral-dress");
        map.put("nike", "nike-air-force-1");
        map.put("tshirt", "mens-cotton-tshirt");
        map.put("jacket", "womens-denim-jacket");
        map.put("adidas", "adidas-ultraboost");
        // Home
        map.put("bed", "wooden-bed-frame");
        map.put("sofa", "navy-fabric-sofa");
        map.put("desk", "wooden-study-desk");
        map.put("dining", "dining-table-set");
        map.put("cabinet", "kitchen-cabinet-white");
        map.put("mattress", "memory-foam-mattress");
        map.put("wardrobe", "wooden-wardrobe");
        map.put("light", "led-ceiling-light");
        // Appliances
        map.put("refrigerator", "lg-double-door-fridge");
        map.put("washing", "front-load-washer");
        map.put("air conditioner", "split-air-conditioner");
        map.put("microwave", "convection-microwave");
        map.put("induction", "induction-cooktop");
        // Books
        map.put("psychology", "psychology-money-book");
        PRODUCT_IMAGE_MAPPING = Collections.unmodifiableMap(map);
    }

    public Map<String, Object> autoAssignImagesForAllProducts() {
        List<Product> allProducts = productRepository.findAll();
        int totalProducts = allProducts.size();
        int updatedProducts = 0;
        int failedProducts = 0;
        List<String> errors = new ArrayList<>();

        for (Product product : allProducts) {
            try {
                if (assignBestImageToProduct(product)) {
                    productRepository.save(product);
                    updatedProducts++;
                }
            } catch (Exception e) {
                failedProducts++;
                errors.add("Product " + product.getName() + ": " + e.getMessage());
            }
        }

        return Map.of(
            "success", true,
            "message", "Auto-assignment completed",
            "totalProducts", totalProducts,
            "updatedProducts", updatedProducts,
            "failedProducts", failedProducts,
            "errors", errors
        );
    }

    public Map<String, Object> autoAssignImagesByCategory(String categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
            
            List<Product> categoryProducts = productRepository.findByCategoryId(categoryId);
            int totalProducts = categoryProducts.size();
            int updatedProducts = 0;
            int failedProducts = 0;
            List<String> errors = new ArrayList<>();

            for (Product product : categoryProducts) {
                try {
                    if (assignBestImageToProduct(product)) {
                        productRepository.save(product);
                        updatedProducts++;
                    }
                } catch (Exception e) {
                    failedProducts++;
                    errors.add("Product " + product.getName() + ": " + e.getMessage());
                }
            }

            return Map.of(
                "success", true,
                "message", "Auto-assignment completed for category: " + category.getName(),
                "categoryName", category.getName(),
                "totalProducts", totalProducts,
                "updatedProducts", updatedProducts,
                "failedProducts", failedProducts,
                "errors", errors
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", e.getMessage()
            );
        }
    }

    public Map<String, Object> assignImageToProduct(String productId, String cloudinaryPublicId, Boolean setAsPrimary) {
        try {
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

            // Construct the full Cloudinary URL
            String imageUrl = constructCloudinaryUrl(cloudinaryPublicId);
            
            List<String> imageUrls = new ArrayList<>(product.getImageUrls());
            
            if (setAsPrimary) {
                // Add as first image (primary)
                imageUrls.remove(imageUrl); // Remove if already exists
                imageUrls.add(0, imageUrl);
            } else {
                // Add as additional image
                if (!imageUrls.contains(imageUrl)) {
                    imageUrls.add(imageUrl);
                }
            }
            
            product.setImageUrls(imageUrls);
            productRepository.save(product);

            return Map.of(
                "success", true,
                "message", "Image assigned successfully",
                "productName", product.getName(),
                "imageUrl", imageUrl,
                "isPrimary", setAsPrimary
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to assign image: " + e.getMessage());
        }
    }

    public Map<String, Object> updateProductImages(String productId, List<String> imageUrls) {
        try {
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setImageUrls(imageUrls != null ? imageUrls : new ArrayList<>());
            productRepository.save(product);

            return Map.of(
                "success", true,
                "message", "Product images updated successfully",
                "productName", product.getName(),
                "imageCount", product.getImageUrls().size()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product images: " + e.getMessage());
        }
    }

    public Map<String, Object> removeImageFromProduct(String productId, String imageUrl) {
        try {
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

            List<String> imageUrls = new ArrayList<>(product.getImageUrls());
            boolean removed = imageUrls.remove(imageUrl);
            
            if (removed) {
                product.setImageUrls(imageUrls);
                productRepository.save(product);
                
                return Map.of(
                    "success", true,
                    "message", "Image removed successfully",
                    "productName", product.getName(),
                    "removedImage", imageUrl
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "Image not found in product",
                    "productName", product.getName()
                );
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove image: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getProductsWithoutImages() {
        List<Product> products = productRepository.findAll();
        
        return products.stream()
            .filter(product -> product.getImageUrls().isEmpty())
            .map(product -> {
                Optional<Category> category = categoryRepository.findById(product.getCategoryId());
                return Map.of(
                    "id", product.getId(),
                    "name", product.getName(),
                    "sku", product.getSku(),
                    "categoryName", category.map(Category::getName).orElse("Unknown"),
                    "price", product.getPrice(),
                    "stockQuantity", product.getStockQuantity(),
                    "isActive", product.isActive()
                );
            })
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAvailableImagesForCategory(String categoryName) {
        try {
            String folderPath = CATEGORY_FOLDER_MAPPING.get(categoryName);
            if (folderPath == null) {
                return Collections.emptyList();
            }

            // Get images from Cloudinary folder
            Map<String, Object> searchOptions = Map.of(
                "resource_type", "image",
                "type", "upload",
                "prefix", folderPath,
                "max_results", 50
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.api().resources(searchOptions);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");

            return resources.stream()
                .map(resource -> Map.of(
                    "public_id", resource.get("public_id"),
                    "secure_url", resource.get("secure_url"),
                    "width", resource.get("width"),
                    "height", resource.get("height"),
                    "format", resource.get("format"),
                    "bytes", resource.get("bytes"),
                    "created_at", resource.get("created_at")
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<Map<String, Object>> suggestImagesForProduct(String productId) {
        try {
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

            Optional<Category> categoryOpt = categoryRepository.findById(product.getCategoryId());
            if (categoryOpt.isEmpty()) {
                return Collections.emptyList();
            }

            Category category = categoryOpt.get();
            List<Map<String, Object>> availableImages = getAvailableImagesForCategory(category.getName());
            
            // Score images based on product name similarity
            return availableImages.stream()
                .map(image -> {
                    String publicId = (String) image.get("public_id");
                    int score = calculateImageScore(product.getName(), publicId);
                    Map<String, Object> scoredImage = new HashMap<>(image);
                    scoredImage.put("score", score);
                    scoredImage.put("reason", getMatchReason(product.getName(), publicId));
                    return scoredImage;
                })
                .sorted((a, b) -> Integer.compare((Integer) b.get("score"), (Integer) a.get("score")))
                .limit(5)
                .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public Map<String, Object> getImageAssignmentStatistics() {
        List<Product> allProducts = productRepository.findAll();
        
        long totalProducts = allProducts.size();
        long productsWithImages = allProducts.stream()
            .filter(product -> !product.getImageUrls().isEmpty())
            .count();
        long productsWithoutImages = totalProducts - productsWithImages;
        
        // Count by category
        Map<String, Long> imagesByCategory = allProducts.stream()
            .collect(Collectors.groupingBy(
                product -> {
                    Optional<Category> category = categoryRepository.findById(product.getCategoryId());
                    return category.map(Category::getName).orElse("Unknown");
                },
                Collectors.counting()
            ));

        Map<String, Long> imagesAssignedByCategory = allProducts.stream()
            .filter(product -> !product.getImageUrls().isEmpty())
            .collect(Collectors.groupingBy(
                product -> {
                    Optional<Category> category = categoryRepository.findById(product.getCategoryId());
                    return category.map(Category::getName).orElse("Unknown");
                },
                Collectors.counting()
            ));

        return Map.of(
            "totalProducts", totalProducts,
            "productsWithImages", productsWithImages,
            "productsWithoutImages", productsWithoutImages,
            "assignmentPercentage", totalProducts > 0 ? (productsWithImages * 100.0 / totalProducts) : 0,
            "productsByCategory", imagesByCategory,
            "imagesAssignedByCategory", imagesAssignedByCategory
        );
    }

    public Map<String, Object> bulkUpdateProductImages(List<Map<String, Object>> updates) {
        int successCount = 0;
        int failureCount = 0;
        List<String> errors = new ArrayList<>();

        for (Map<String, Object> update : updates) {
            try {
                String productId = (String) update.get("productId");
                @SuppressWarnings("unchecked")
                List<String> imageUrls = (List<String>) update.get("imageUrls");
                
                updateProductImages(productId, imageUrls);
                successCount++;
            } catch (Exception e) {
                failureCount++;
                errors.add("Failed to update product " + update.get("productId") + ": " + e.getMessage());
            }
        }

        return Map.of(
            "success", true,
            "message", "Bulk update completed",
            "totalUpdates", updates.size(),
            "successCount", successCount,
            "failureCount", failureCount,
            "errors", errors
        );
    }

    // Helper methods
    private boolean assignBestImageToProduct(Product product) {
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(product.getCategoryId());
            if (categoryOpt.isEmpty()) {
                return false;
            }

            Category category = categoryOpt.get();
            String bestImagePublicId = findBestImageForProduct(product.getName(), category.getName());
            
            if (bestImagePublicId != null) {
                String imageUrl = constructCloudinaryUrl(bestImagePublicId);
                List<String> currentImages = new ArrayList<>(product.getImageUrls());
                
                // Only update if the image is not already assigned
                if (!currentImages.contains(imageUrl)) {
                    currentImages.clear(); // Clear existing images
                    currentImages.add(imageUrl); // Add the best match as primary image
                    product.setImageUrls(currentImages);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private String findBestImageForProduct(String productName, String categoryName) {
        String folderPath = CATEGORY_FOLDER_MAPPING.get(categoryName);
        if (folderPath == null) {
            return null;
        }

        // First try to find exact match in product mapping
        String lowerProductName = productName.toLowerCase();
        for (Map.Entry<String, String> entry : PRODUCT_IMAGE_MAPPING.entrySet()) {
            if (lowerProductName.contains(entry.getKey())) {
                return folderPath + "/" + entry.getValue();
            }
        }

        // If no exact match, return a default image for the category
        try {
            Map<String, Object> searchOptions = Map.of(
                "resource_type", "image",
                "type", "upload",
                "prefix", folderPath,
                "max_results", 1
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.api().resources(searchOptions);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");
            
            if (!resources.isEmpty()) {
                return (String) resources.get(0).get("public_id");
            }
        } catch (Exception e) {
            // Return null if we can't access Cloudinary
        }

        return null;
    }

    private String constructCloudinaryUrl(String publicId) {
        return CLOUDINARY_BASE_URL + "/w_250,h_250,c_fill,f_auto,q_auto/" + publicId;
    }

    private int calculateImageScore(String productName, String publicId) {
        String lowerProductName = productName.toLowerCase();
        String lowerPublicId = publicId.toLowerCase();
        
        int score = 0;
        
        // Check for exact keyword matches
        for (String keyword : PRODUCT_IMAGE_MAPPING.keySet()) {
            if (lowerProductName.contains(keyword) && lowerPublicId.contains(keyword)) {
                score += 10;
            }
        }
        
        // Check for partial matches
        String[] productWords = lowerProductName.split("\\s+");
        for (String word : productWords) {
            if (word.length() > 3 && lowerPublicId.contains(word)) {
                score += 5;
            }
        }
        
        return score;
    }

    private String getMatchReason(String productName, String publicId) {
        String lowerProductName = productName.toLowerCase();
        String lowerPublicId = publicId.toLowerCase();
        
        for (Map.Entry<String, String> entry : PRODUCT_IMAGE_MAPPING.entrySet()) {
            if (lowerProductName.contains(entry.getKey()) && lowerPublicId.contains(entry.getKey())) {
                return "Exact keyword match: " + entry.getKey();
            }
        }
        
        String[] productWords = lowerProductName.split("\\s+");
        for (String word : productWords) {
            if (word.length() > 3 && lowerPublicId.contains(word)) {
                return "Partial match: " + word;
            }
        }
        
        return "Category-based suggestion";
    }
}