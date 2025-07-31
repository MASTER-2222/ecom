package com.ritkart.repository;

import com.ritkart.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    Optional<Product> findBySku(String sku);
    
    Optional<Product> findBySlug(String slug);
    
    Optional<Product> findBySkuAndIsActive(String sku, boolean isActive);
    
    Optional<Product> findBySlugAndIsActive(String slug, boolean isActive);
    
    boolean existsBySku(String sku);
    
    boolean existsBySlug(String slug);
    
    List<Product> findByIsActive(boolean isActive);
    
    Page<Product> findByIsActive(boolean isActive, Pageable pageable);
    
    List<Product> findByCategoryId(String categoryId);
    
    List<Product> findByCategoryIdAndIsActive(String categoryId, boolean isActive);
    
    Page<Product> findByCategoryIdAndIsActive(String categoryId, boolean isActive, Pageable pageable);
    
    List<Product> findByBrand(String brand);
    
    List<Product> findByBrandAndIsActive(String brand, boolean isActive);
    
    Page<Product> findByBrandAndIsActive(String brand, boolean isActive, Pageable pageable);
    
    List<Product> findByIsFeatured(boolean isFeatured);
    
    List<Product> findByIsFeaturedAndIsActive(boolean isFeatured, boolean isActive);
    
    Page<Product> findByIsFeaturedAndIsActive(boolean isFeatured, boolean isActive, Pageable pageable);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Product> findByNameContainingIgnoreCase(String name);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    Page<Product> findByNameContainingIgnoreCaseAndIsActive(String name, Pageable pageable);
    
    @Query(value = "{'$text': {'$search': ?0}}", sort = "{'score': {'$meta': 'textScore'}}")
    Page<Product> findByTextSearch(String searchTerm, Pageable pageable);
    
    @Query(value = "{'$text': {'$search': ?0}, 'isActive': true}", sort = "{'score': {'$meta': 'textScore'}}")
    Page<Product> findByTextSearchAndIsActive(String searchTerm, Pageable pageable);
    
    @Query("{'price': {$gte: ?0, $lte: ?1}}")
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("{'price': {$gte: ?0, $lte: ?1}, 'isActive': true}")
    Page<Product> findByPriceBetweenAndIsActive(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("{'categoryId': ?0, 'price': {$gte: ?1, $lte: ?2}, 'isActive': true}")
    Page<Product> findByCategoryAndPriceRange(String categoryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("{'brand': ?0, 'price': {$gte: ?1, $lte: ?2}, 'isActive': true}")
    Page<Product> findByBrandAndPriceRange(String brand, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("{'averageRating': {$gte: ?0}}")
    Page<Product> findByAverageRatingGreaterThanEqual(Double minRating, Pageable pageable);
    
    @Query("{'averageRating': {$gte: ?0}, 'isActive': true}")
    Page<Product> findByAverageRatingGreaterThanEqualAndIsActive(Double minRating, Pageable pageable);
    
    @Query("{'stockQuantity': {$lte: ?0}}")
    List<Product> findLowStockProducts(Integer threshold);
    
    @Query("{'stockQuantity': 0}")
    List<Product> findOutOfStockProducts();
    
    @Query("{'stockQuantity': {$gt: 0}}")
    Page<Product> findInStockProducts(Pageable pageable);
    
    @Query("{'stockQuantity': {$gt: 0}, 'isActive': true}")
    Page<Product> findInStockAndActiveProducts(Pageable pageable);
    
    @Query("{'discountPrice': {$exists: true, $ne: null}}")
    Page<Product> findProductsOnSale(Pageable pageable);
    
    @Query("{'discountPrice': {$exists: true, $ne: null}, 'isActive': true}")
    Page<Product> findActiveProductsOnSale(Pageable pageable);
    
    @Query("{'tags': {$in: ?0}}")
    Page<Product> findByTagsIn(List<String> tags, Pageable pageable);
    
    @Query("{'tags': {$in: ?0}, 'isActive': true}")
    Page<Product> findByTagsInAndIsActive(List<String> tags, Pageable pageable);
    
    @Query("{'createdAt': {$gte: ?0}}")
    Page<Product> findNewProducts(LocalDateTime since, Pageable pageable);
    
    @Query("{'createdAt': {$gte: ?0}, 'isActive': true}")
    Page<Product> findNewActiveProducts(LocalDateTime since, Pageable pageable);
    
    // Complex search with multiple filters
    @Query("{'$and': [" +
           "{'isActive': true}, " +
           "{'$or': [" +
           "  {'categoryId': {$in: ?0}}, " +
           "  {$expr: {$eq: [{$size: ?0}, 0]}}" +
           "]}, " +
           "{'$or': [" +
           "  {'brand': {$in: ?1}}, " +
           "  {$expr: {$eq: [{$size: ?1}, 0]}}" +
           "]}, " +
           "{'price': {$gte: ?2, $lte: ?3}}, " +
           "{'averageRating': {$gte: ?4}}" +
           "]}")
    Page<Product> findWithFilters(List<String> categoryIds, List<String> brands, 
                                 BigDecimal minPrice, BigDecimal maxPrice, 
                                 Double minRating, Pageable pageable);
    
    // Search with text and filters
    @Query("{'$and': [" +
           "{'$text': {'$search': ?0}}, " +
           "{'isActive': true}, " +
           "{'price': {$gte: ?1, $lte: ?2}}" +
           "]}")
    Page<Product> searchWithPriceRange(String searchTerm, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    // Aggregation queries for statistics
    long countByIsActive(boolean isActive);
    
    long countByCategoryId(String categoryId);
    
    long countByCategoryIdAndIsActive(String categoryId, boolean isActive);
    
    long countByBrand(String brand);
    
    long countByBrandAndIsActive(String brand, boolean isActive);
    
    long countByIsFeaturedAndIsActive(boolean isFeatured, boolean isActive);
    
    @Query(value = "{'stockQuantity': {$lte: ?0}}", count = true)
    long countLowStockProducts(Integer threshold);
    
    @Query(value = "{'stockQuantity': 0}", count = true)
    long countOutOfStockProducts();
    
    @Query(value = "{'discountPrice': {$exists: true, $ne: null}, 'isActive': true}", count = true)
    long countActiveProductsOnSale();
    
    // Get distinct values for filters
    @Query(value = "{'isActive': true}", fields = "{'brand': 1}")
    List<String> findDistinctBrands();
    
    @Query(value = "{'isActive': true}", fields = "{'tags': 1}")
    List<String> findDistinctTags();
    
    // Popular products (by total sales)
    @Query(value = "{'isActive': true}", sort = "{'totalSales': -1}")
    Page<Product> findPopularProducts(Pageable pageable);
    
    // Recently added products
    @Query(value = "{'isActive': true}", sort = "{'createdAt': -1}")
    Page<Product> findRecentProducts(Pageable pageable);
    
    // Top rated products
    @Query(value = "{'isActive': true, 'totalReviews': {$gt: 0}}", sort = "{'averageRating': -1, 'totalReviews': -1}")
    Page<Product> findTopRatedProducts(Pageable pageable);
}