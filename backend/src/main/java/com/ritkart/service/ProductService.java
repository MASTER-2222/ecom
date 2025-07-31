package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.Product;
import com.ritkart.model.Category;
import com.ritkart.repository.ProductRepository;
import com.ritkart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Basic CRUD operations
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> getActiveProducts(Pageable pageable) {
        return productRepository.findByIsActive(true, pageable);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with SKU: " + sku));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlugAndIsActive(slug, true)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
    }

    public Product createProduct(Product product) {
        // Validate product
        validateProduct(product);

        // Check if SKU already exists
        if (productRepository.existsBySku(product.getSku())) {
            throw new BadRequestException("Product with SKU '" + product.getSku() + "' already exists");
        }

        // Verify category exists
        if (!categoryRepository.existsById(product.getCategoryId())) {
            throw new BadRequestException("Category not found with id: " + product.getCategoryId());
        }

        // Generate slug if not provided
        if (product.getSlug() == null || product.getSlug().isEmpty()) {
            product.setSlug(generateSlug(product.getName()));
        }

        // Ensure slug is unique
        String originalSlug = product.getSlug();
        int counter = 1;
        while (productRepository.existsBySlug(product.getSlug())) {
            product.setSlug(originalSlug + "-" + counter);
            counter++;
        }

        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product productDetails) {
        Product product = getProductById(id);

        // Update basic information
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getShortDescription() != null) {
            product.setShortDescription(productDetails.getShortDescription());
        }
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        if (productDetails.getDiscountPrice() != null) {
            product.setDiscountPrice(productDetails.getDiscountPrice());
        }
        if (productDetails.getBrand() != null) {
            product.setBrand(productDetails.getBrand());
        }
        if (productDetails.getStockQuantity() != null) {
            product.setStockQuantity(productDetails.getStockQuantity());
        }
        if (productDetails.getCategoryId() != null) {
            // Verify new category exists
            if (!categoryRepository.existsById(productDetails.getCategoryId())) {
                throw new BadRequestException("Category not found with id: " + productDetails.getCategoryId());
            }
            product.setCategoryId(productDetails.getCategoryId());
        }

        // Update collections
        if (productDetails.getImageUrls() != null) {
            product.setImageUrls(productDetails.getImageUrls());
        }
        if (productDetails.getVariants() != null) {
            product.setVariants(productDetails.getVariants());
        }
        if (productDetails.getSpecifications() != null) {
            product.setSpecifications(productDetails.getSpecifications());
        }
        if (productDetails.getAttributes() != null) {
            product.setAttributes(productDetails.getAttributes());
        }
        if (productDetails.getTags() != null) {
            product.setTags(productDetails.getTags());
        }

        // Update boolean flags
        product.setActive(productDetails.isActive());
        product.setFeatured(productDetails.isFeatured());
        product.setDigital(productDetails.isDigital());

        // Update dimensions and weight
        if (productDetails.getWeight() != null) {
            product.setWeight(productDetails.getWeight());
        }
        if (productDetails.getDimensions() != null) {
            product.setDimensions(productDetails.getDimensions());
        }

        // Update meta information
        if (productDetails.getMetaTitle() != null) {
            product.setMetaTitle(productDetails.getMetaTitle());
        }
        if (productDetails.getMetaDescription() != null) {
            product.setMetaDescription(productDetails.getMetaDescription());
        }
        if (productDetails.getMetaKeywords() != null) {
            product.setMetaKeywords(productDetails.getMetaKeywords());
        }

        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public Product deactivateProduct(String id) {
        Product product = getProductById(id);
        product.setActive(false);
        return productRepository.save(product);
    }

    public Product activateProduct(String id) {
        Product product = getProductById(id);
        product.setActive(true);
        return productRepository.save(product);
    }

    // Inventory management
    public Product updateStock(String id, Integer quantity) {
        Product product = getProductById(id);
        product.setStockQuantity(quantity);
        return productRepository.save(product);
    }

    public Product adjustStock(String id, Integer adjustment) {
        Product product = getProductById(id);
        int newQuantity = product.getStockQuantity() + adjustment;
        if (newQuantity < 0) {
            throw new BadRequestException("Insufficient stock. Current stock: " + product.getStockQuantity());
        }
        product.setStockQuantity(newQuantity);
        return productRepository.save(product);
    }

    public Product reduceStock(String id, Integer quantity) {
        return adjustStock(id, -quantity);
    }

    public Product increaseStock(String id, Integer quantity) {
        return adjustStock(id, quantity);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts(10); // Default threshold
    }

    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findLowStockProducts(threshold);
    }

    public List<Product> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts();
    }

    // Category-based operations
    public Page<Product> getProductsByCategory(String categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsActive(categoryId, true, pageable);
    }

    public Page<Product> getProductsByBrand(String brand, Pageable pageable) {
        return productRepository.findByBrandAndIsActive(brand, true, pageable);
    }

    // Featured products
    public Page<Product> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeaturedAndIsActive(true, true, pageable);
    }

    public Product setFeatured(String id, boolean featured) {
        Product product = getProductById(id);
        product.setFeatured(featured);
        return productRepository.save(product);
    }

    // Search and filter operations
    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.findByTextSearchAndIsActive(searchTerm, pageable);
    }

    public Page<Product> searchProductsByName(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActive(name, pageable);
    }

    public Page<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceBetweenAndIsActive(minPrice, maxPrice, pageable);
    }

    public Page<Product> getProductsByRating(Double minRating, Pageable pageable) {
        return productRepository.findByAverageRatingGreaterThanEqualAndIsActive(minRating, pageable);
    }

    public Page<Product> getProductsWithFilters(List<String> categoryIds, List<String> brands,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              Double minRating, Pageable pageable) {
        return productRepository.findWithFilters(categoryIds, brands, minPrice, maxPrice, minRating, pageable);
    }

    // Advanced search functionality
    public List<String> getSearchSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        // Get suggestions from product names, brands, and tags
        List<String> suggestions = productRepository.findSearchSuggestions(query.toLowerCase(), limit);
        return suggestions.stream().distinct().limit(limit).toList();
    }

    public Map<String, Object> getSearchAutocomplete(String query, int limit) {
        Map<String, Object> autocomplete = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            return autocomplete;
        }
        
        String lowerQuery = query.toLowerCase();
        
        // Product name suggestions
        List<String> productSuggestions = productRepository.findProductNameSuggestions(lowerQuery, limit);
        
        // Brand suggestions
        List<String> brandSuggestions = productRepository.findBrandSuggestions(lowerQuery, limit);
        
        // Category suggestions
        List<String> categorySuggestions = categoryRepository.findCategorySuggestions(lowerQuery, limit);
        
        // Tag suggestions
        List<String> tagSuggestions = productRepository.findTagSuggestions(lowerQuery, limit);
        
        autocomplete.put("products", productSuggestions);
        autocomplete.put("brands", brandSuggestions);
        autocomplete.put("categories", categorySuggestions);
        autocomplete.put("tags", tagSuggestions);
        
        return autocomplete;
    }

    public Page<Product> advancedSearch(String query, List<String> categories, List<String> brands,
                                      BigDecimal minPrice, BigDecimal maxPrice, Double minRating, Double maxRating,
                                      Boolean hasDiscount, Boolean inStockOnly, Boolean freeShipping,
                                      Pageable pageable) {
        
        // Set default values
        if (minPrice == null) minPrice = BigDecimal.ZERO;
        if (maxPrice == null) maxPrice = BigDecimal.valueOf(Double.MAX_VALUE);
        if (minRating == null) minRating = 0.0;
        if (maxRating == null) maxRating = 5.0;
        if (categories == null) categories = List.of();
        if (brands == null) brands = List.of();
        if (hasDiscount == null) hasDiscount = false;
        if (inStockOnly == null) inStockOnly = true;
        if (freeShipping == null) freeShipping = false;
        
        return productRepository.findWithAdvancedFilters(
            query, categories, brands, minPrice, maxPrice, minRating, maxRating,
            hasDiscount, inStockOnly, freeShipping, pageable);
    }

    public List<String> getPopularSearchTerms(int limit) {
        // For now, return some popular terms. In a real app, you'd track search queries
        List<String> popularTerms = List.of(
            "iphone", "laptop", "headphones", "watch", "camera",
            "shoes", "book", "tablet", "gaming", "clothes",
            "electronics", "home", "kitchen", "sports", "health"
        );
        
        return popularTerms.stream().limit(limit).toList();
    }

    public Map<String, Object> getSearchAnalytics(int days) {
        Map<String, Object> analytics = new HashMap<>();
        
        // In a real application, you would track search queries and their metrics
        // For now, we'll return mock data
        
        analytics.put("totalSearches", 1250);
        analytics.put("uniqueQueries", 845);
        analytics.put("averageResultsPerSearch", 12.5);
        analytics.put("noResultsRate", 8.3);
        
        List<Map<String, Object>> topQueries = List.of(
            Map.of("query", "iphone", "count", 156, "clickRate", 85.2),
            Map.of("query", "laptop", "count", 132, "clickRate", 78.9),
            Map.of("query", "headphones", "count", 98, "clickRate", 92.1),
            Map.of("query", "camera", "count", 87, "clickRate", 76.4),
            Map.of("query", "shoes", "count", 76, "clickRate", 88.7)
        );
        
        List<String> noResultQueries = List.of(
            "flying car", "time machine", "unicorn", "dragon", "magic wand"
        );
        
        analytics.put("topQueries", topQueries);
        analytics.put("noResultQueries", noResultQueries);
        analytics.put("period", days + " days");
        
        return analytics;
    }

    // Special product lists
    public Page<Product> getProductsOnSale(Pageable pageable) {
        return productRepository.findActiveProductsOnSale(pageable);
    }

    public Page<Product> getNewProducts(int days, Pageable pageable) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return productRepository.findNewActiveProducts(since, pageable);
    }

    public Page<Product> getPopularProducts(Pageable pageable) {
        return productRepository.findPopularProducts(pageable);
    }

    public Page<Product> getTopRatedProducts(Pageable pageable) {
        return productRepository.findTopRatedProducts(pageable);
    }

    public Page<Product> getRecentProducts(Pageable pageable) {
        return productRepository.findRecentProducts(pageable);
    }

    // Product recommendations
    public List<Product> getRelatedProducts(String productId, int limit) {
        Product product = getProductById(productId);
        
        // Get products from same category, excluding current product
        List<Product> relatedProducts = productRepository.findByCategoryIdAndIsActive(product.getCategoryId(), true)
                .stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(limit)
                .toList();
        
        return relatedProducts;
    }

    public List<Product> getSimilarProducts(String productId, int limit) {
        Product product = getProductById(productId);
        
        // Get products with similar price range and same category
        BigDecimal priceVariance = product.getPrice().multiply(BigDecimal.valueOf(0.2)); // 20% variance
        BigDecimal minPrice = product.getPrice().subtract(priceVariance);
        BigDecimal maxPrice = product.getPrice().add(priceVariance);
        
        return productRepository.findByCategoryAndPriceRange(product.getCategoryId(), minPrice, maxPrice, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(limit)
                .toList();
    }

    // Analytics and statistics
    public long getTotalProductsCount() {
        return productRepository.count();
    }

    public long getActiveProductsCount() {
        return productRepository.countByIsActive(true);
    }

    public long getProductsCountByCategory(String categoryId) {
        return productRepository.countByCategoryIdAndIsActive(categoryId, true);
    }

    public long getProductsCountByBrand(String brand) {
        return productRepository.countByBrandAndIsActive(brand, true);
    }

    public long getFeaturedProductsCount() {
        return productRepository.countByIsFeaturedAndIsActive(true, true);
    }

    public long getLowStockProductsCount() {
        return productRepository.countLowStockProducts(10);
    }

    public long getOutOfStockProductsCount() {
        return productRepository.countOutOfStockProducts();
    }

    public long getProductsOnSaleCount() {
        return productRepository.countActiveProductsOnSale();
    }

    // Filter options for frontend
    public List<String> getAvailableBrands() {
        return productRepository.findDistinctBrands();
    }

    public List<String> getAvailableTags() {
        return productRepository.findDistinctTags();
    }

    public Map<String, Object> getProductFilters() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("brands", getAvailableBrands());
        filters.put("tags", getAvailableTags());
        filters.put("categories", categoryRepository.findActiveSorted());
        return filters;
    }

    // Review integration
    public Product updateProductRating(String productId, Double averageRating, Integer totalReviews) {
        Product product = getProductById(productId);
        product.setAverageRating(averageRating);
        product.setTotalReviews(totalReviews);
        return productRepository.save(product);
    }

    public Product incrementSalesCount(String productId, Integer quantity) {
        Product product = getProductById(productId);
        product.setTotalSales(product.getTotalSales() + quantity);
        return productRepository.save(product);
    }

    // Helper methods
    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new BadRequestException("Product name is required");
        }
        if (product.getDescription() == null || product.getDescription().trim().isEmpty()) {
            throw new BadRequestException("Product description is required");
        }
        if (product.getSku() == null || product.getSku().trim().isEmpty()) {
            throw new BadRequestException("Product SKU is required");
        }
        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Product price must be greater than zero");
        }
        if (product.getCategoryId() == null || product.getCategoryId().trim().isEmpty()) {
            throw new BadRequestException("Product category is required");
        }
        if (product.getStockQuantity() == null || product.getStockQuantity() < 0) {
            throw new BadRequestException("Stock quantity cannot be negative");
        }
    }

    private String generateSlug(String name) {
        if (name == null) return null;
        return name.toLowerCase()
                  .replaceAll("[^a-z0-9\\s-]", "")
                  .replaceAll("\\s+", "-")
                  .replaceAll("-+", "-")
                  .replaceAll("^-|-$", "");
    }
}