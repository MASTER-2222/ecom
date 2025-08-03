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

    // Enhanced Product name to Cloudinary public_id mapping
    private static final Map<String, String> PRODUCT_IMAGE_MAPPING;
    static {
        Map<String, String> map = new HashMap<>();

        // Electronics
        map.put("samsung", "ritkart/electronics/samsung-galaxy-s24-ultra");
        map.put("galaxy", "ritkart/electronics/samsung-galaxy-s24-ultra");
        map.put("s24", "ritkart/electronics/samsung-galaxy-s24-ultra");
        map.put("iphone", "ritkart/electronics/iphone-15-pro-max");
        map.put("apple", "ritkart/electronics/iphone-15-pro-max");
        map.put("15", "ritkart/electronics/iphone-15-pro-max");
        map.put("sony", "ritkart/electronics/sony-wh1000xm5");
        map.put("headphones", "ritkart/electronics/sony-wh1000xm5");
        map.put("wh1000xm5", "ritkart/electronics/sony-wh1000xm5");
        map.put("macbook", "ritkart/electronics/macbook-air-m2");
        map.put("laptop", "ritkart/electronics/macbook-air-m2");
        map.put("air", "ritkart/electronics/macbook-air-m2");
        map.put("dell", "ritkart/electronics/dell-xps-13");
        map.put("xps", "ritkart/electronics/dell-xps-13");
        map.put("lg", "ritkart/electronics/lg-oled-tv-55");
        map.put("tv", "ritkart/electronics/lg-oled-tv-55");
        map.put("oled", "ritkart/electronics/lg-oled-tv-55");
        map.put("canon", "ritkart/electronics/canon-eos-r6");
        map.put("camera", "ritkart/electronics/canon-eos-r6");
        map.put("playstation", "ritkart/electronics/playstation-5");
        map.put("ps5", "ritkart/electronics/playstation-5");
        map.put("nintendo", "ritkart/electronics/nintendo-switch-oled");
        map.put("switch", "ritkart/electronics/nintendo-switch-oled");

        // Mobiles
        map.put("oneplus", "ritkart/mobiles/oneplus-12");
        map.put("12", "ritkart/mobiles/oneplus-12");
        map.put("pixel", "ritkart/mobiles/google-pixel-8");
        map.put("google", "ritkart/mobiles/google-pixel-8");
        map.put("xiaomi", "ritkart/mobiles/xiaomi-14-ultra");
        map.put("14", "ritkart/mobiles/xiaomi-14-ultra");
        map.put("ultra", "ritkart/mobiles/xiaomi-14-ultra");

        // Fashion
        map.put("levis", "ritkart/fashion/levis-jeans-men");
        map.put("jeans", "ritkart/fashion/levis-jeans-men");
        map.put("dress", "ritkart/fashion/womens-floral-dress");
        map.put("floral", "ritkart/fashion/womens-floral-dress");
        map.put("nike", "ritkart/fashion/nike-air-force-1");
        map.put("shoes", "ritkart/fashion/nike-air-force-1");
        map.put("sneakers", "ritkart/fashion/nike-air-force-1");
        map.put("tshirt", "ritkart/fashion/mens-cotton-tshirt");
        map.put("cotton", "ritkart/fashion/mens-cotton-tshirt");
        map.put("jacket", "ritkart/fashion/womens-denim-jacket");
        map.put("denim", "ritkart/fashion/womens-denim-jacket");
        map.put("adidas", "ritkart/fashion/adidas-ultraboost");
        map.put("ultraboost", "ritkart/fashion/adidas-ultraboost");

        // Home
        map.put("bed", "ritkart/home/wooden-bed-frame");
        map.put("wooden", "ritkart/home/wooden-bed-frame");
        map.put("sofa", "ritkart/home/navy-fabric-sofa");
        map.put("fabric", "ritkart/home/navy-fabric-sofa");
        map.put("desk", "ritkart/home/wooden-study-desk");
        map.put("study", "ritkart/home/wooden-study-desk");
        map.put("dining", "ritkart/home/dining-table-set");
        map.put("table", "ritkart/home/dining-table-set");
        map.put("cabinet", "ritkart/home/kitchen-cabinet-white");
        map.put("kitchen", "ritkart/home/kitchen-cabinet-white");
        map.put("mattress", "ritkart/home/memory-foam-mattress");
        map.put("memory", "ritkart/home/memory-foam-mattress");
        map.put("foam", "ritkart/home/memory-foam-mattress");
        map.put("wardrobe", "ritkart/home/wooden-wardrobe");
        map.put("light", "ritkart/home/led-ceiling-light");
        map.put("led", "ritkart/home/led-ceiling-light");
        map.put("ceiling", "ritkart/home/led-ceiling-light");

        // Appliances
        map.put("refrigerator", "ritkart/appliances/lg-double-door-fridge");
        map.put("fridge", "ritkart/appliances/lg-double-door-fridge");
        map.put("washing", "ritkart/appliances/front-load-washer");
        map.put("washer", "ritkart/appliances/front-load-washer");
        map.put("machine", "ritkart/appliances/front-load-washer");
        map.put("air conditioner", "ritkart/appliances/split-air-conditioner");
        map.put("ac", "ritkart/appliances/split-air-conditioner");
        map.put("split", "ritkart/appliances/split-air-conditioner");
        map.put("microwave", "ritkart/appliances/convection-microwave");
        map.put("convection", "ritkart/appliances/convection-microwave");
        map.put("induction", "ritkart/appliances/induction-cooktop");
        map.put("cooktop", "ritkart/appliances/induction-cooktop");

        // Books
        map.put("psychology", "ritkart/books/psychology-money-book");
        map.put("money", "ritkart/books/psychology-money-book");
        map.put("programming", "ritkart/books/programming-book");
        map.put("java", "ritkart/books/programming-book");
        map.put("python", "ritkart/books/programming-book");
        map.put("novel", "ritkart/books/fiction-novel");
        map.put("fiction", "ritkart/books/fiction-novel");
        map.put("cookbook", "ritkart/books/cookbook");
        map.put("recipe", "ritkart/books/cookbook");
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
            Map<String, Object> searchOptions = new HashMap<>();
            searchOptions.put("resource_type", "image");
            searchOptions.put("type", "upload");
            searchOptions.put("prefix", folderPath);
            searchOptions.put("max_results", 50);

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
                // The entry.getValue() already contains the full path like "ritkart/electronics/samsung-galaxy-s24-ultra"
                return entry.getValue();
            }
        }

        // If no exact match, return a default image for the category
        try {
            Map<String, Object> searchOptions = new HashMap<>();
            searchOptions.put("resource_type", "image");
            searchOptions.put("type", "upload");
            searchOptions.put("prefix", folderPath);
            searchOptions.put("max_results", 1);

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

    /**
     * Replace ALL product images with appropriate category-specific images
     */
    public Map<String, Object> replaceAllProductImages() {
        List<Product> allProducts = productRepository.findAll();
        int totalProducts = allProducts.size();
        int updatedProducts = 0;
        int failedProducts = 0;
        List<String> errors = new ArrayList<>();

        for (Product product : allProducts) {
            try {
<<<<<<< HEAD
                // Get category name
                String categoryName = "Unknown";
                if (product.getCategoryId() != null) {
                    Optional<Category> categoryOpt = categoryRepository.findById(product.getCategoryId());
                    if (categoryOpt.isPresent()) {
                        categoryName = categoryOpt.get().getName();
                    }
                }

                String bestImagePublicId = findBestImageForProduct(product.getName(), categoryName);
                if (bestImagePublicId != null) {
                    String imageUrl = constructCloudinaryUrl(bestImagePublicId);

                    // FORCE replace all existing images with the new appropriate image
                    List<String> newImageUrls = new ArrayList<>();
                    newImageUrls.add(imageUrl);
                    product.setImageUrls(newImageUrls);
=======
                String bestImagePublicId = findBestImageForProduct(product);
                if (bestImagePublicId != null) {
                    String imageUrl = cloudinaryService.getImageUrl(bestImagePublicId);

                    // Replace all existing images with the new appropriate image
                    product.setImageUrls(Arrays.asList(imageUrl));
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
                    productRepository.save(product);
                    updatedProducts++;
                }
            } catch (Exception e) {
                failedProducts++;
                errors.add("Product " + product.getName() + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalProducts", totalProducts);
        result.put("updatedCount", updatedProducts);
        result.put("failedCount", failedProducts);
        result.put("errors", errors);

        return result;
    }

    /**
     * Get all products with their current images and suggested images for admin overview
     */
    public List<Map<String, Object>> getProductsWithImageSuggestions() {
        List<Product> allProducts = productRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Product product : allProducts) {
            Map<String, Object> productInfo = new HashMap<>();

            // Basic product info
            productInfo.put("id", product.getId());
            productInfo.put("name", product.getName());
            productInfo.put("sku", product.getSku());
<<<<<<< HEAD

            // Get category name from categoryId
            String categoryName = "Unknown";
            if (product.getCategoryId() != null) {
                Optional<Category> categoryOpt = categoryRepository.findById(product.getCategoryId());
                if (categoryOpt.isPresent()) {
                    categoryName = categoryOpt.get().getName();
                }
            }
            productInfo.put("categoryName", categoryName);
=======
            productInfo.put("categoryName", product.getCategory() != null ? product.getCategory().getName() : "Unknown");
>>>>>>> 080160958002700a996641f27063056b33d1e5f6

            // Current images
            List<String> currentImages = product.getImageUrls() != null ? product.getImageUrls() : new ArrayList<>();
            productInfo.put("currentImages", currentImages);
            productInfo.put("hasImages", !currentImages.isEmpty());

            // Suggested image
<<<<<<< HEAD
            String suggestedImagePublicId = findBestImageForProduct(product.getName(), categoryName);
            if (suggestedImagePublicId != null) {
                String suggestedImageUrl = constructCloudinaryUrl(suggestedImagePublicId);
=======
            String suggestedImagePublicId = findBestImageForProduct(product);
            if (suggestedImagePublicId != null) {
                String suggestedImageUrl = cloudinaryService.getImageUrl(suggestedImagePublicId);
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
                productInfo.put("suggestedImagePublicId", suggestedImagePublicId);
                productInfo.put("suggestedImageUrl", suggestedImageUrl);

                // Check if needs update (either no images or current image is generic)
                boolean needsUpdate = currentImages.isEmpty() ||
<<<<<<< HEAD
                    currentImages.stream().anyMatch(url ->
                        url.contains("clothing-store") ||
                        url.contains("generic") ||
                        url.contains("placeholder") ||
                        url.contains("default") ||
                        url.contains("sample") ||
                        url.contains("demo") ||
                        // Check if it's the same generic image being used everywhere
                        currentImages.size() == 1
                    );
=======
                    currentImages.stream().anyMatch(url -> url.contains("clothing-store") || url.contains("generic"));
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
                productInfo.put("needsUpdate", needsUpdate);
            } else {
                productInfo.put("suggestedImagePublicId", null);
                productInfo.put("suggestedImageUrl", null);
                productInfo.put("needsUpdate", true);
            }

            result.add(productInfo);
        }

        return result;
    }

    /**
     * Update a specific product's images with the suggested appropriate image
     */
    public Map<String, Object> updateProductWithSuggestedImage(String productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", "Product not found");
            return result;
        }

        Product product = productOpt.get();
<<<<<<< HEAD

        // Get category name
        String categoryName = "Unknown";
        if (product.getCategoryId() != null) {
            Optional<Category> categoryOpt = categoryRepository.findById(product.getCategoryId());
            if (categoryOpt.isPresent()) {
                categoryName = categoryOpt.get().getName();
            }
        }

        String bestImagePublicId = findBestImageForProduct(product.getName(), categoryName);

        if (bestImagePublicId != null) {
            String imageUrl = constructCloudinaryUrl(bestImagePublicId);
=======
        String bestImagePublicId = findBestImageForProduct(product);

        if (bestImagePublicId != null) {
            String imageUrl = cloudinaryService.getImageUrl(bestImagePublicId);
>>>>>>> 080160958002700a996641f27063056b33d1e5f6
            product.setImageUrls(Arrays.asList(imageUrl));
            productRepository.save(product);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("updatedImageUrl", imageUrl);
            result.put("publicId", bestImagePublicId);
            return result;
        } else {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", "No appropriate image found for this product");
            return result;
        }
    }
}