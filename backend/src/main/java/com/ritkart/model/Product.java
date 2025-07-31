package com.ritkart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 200)
    @TextIndexed(weight = 2)
    private String name;
    
    @NotBlank(message = "Product description is required")
    @Size(min = 10, max = 2000)
    @TextIndexed
    private String description;
    
    private String shortDescription;
    
    @NotBlank(message = "SKU is required")
    @Indexed(unique = true)
    private String sku;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    private BigDecimal discountPrice;
    
    private Double discountPercentage;
    
    @NotNull(message = "Category ID is required")
    @Indexed
    private String categoryId;
    
    private String brand;
    
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity = 0;
    
    private Integer lowStockThreshold = 10;
    
    private List<String> imageUrls = new ArrayList<>();
    
    private List<ProductVariant> variants = new ArrayList<>();
    
    private Map<String, String> specifications = new HashMap<>();
    
    private Map<String, Object> attributes = new HashMap<>();
    
    private boolean isActive = true;
    private boolean isFeatured = false;
    private boolean isDigital = false;
    
    private Double weight;
    private ProductDimensions dimensions;
    
    private List<String> tags = new ArrayList<>();
    
    @Indexed
    private String slug;
    
    private String metaTitle;
    private String metaDescription;
    private List<String> metaKeywords = new ArrayList<>();
    
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;
    private Integer totalSales = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Product() {}
    
    public Product(String name, String description, String sku, BigDecimal price, String categoryId) {
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.price = price;
        this.categoryId = categoryId;
        this.slug = generateSlug(name);
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
        this.slug = generateSlug(name);
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getShortDescription() {
        return shortDescription;
    }
    
    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }
    
    public String getSku() {
        return sku;
    }
    
    public void setSku(String sku) {
        this.sku = sku;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
        calculateDiscountPercentage();
    }
    
    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }
    
    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
        calculateDiscountPercentage();
    }
    
    public Double getDiscountPercentage() {
        return discountPercentage;
    }
    
    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    public String getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    
    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }
    
    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public List<ProductVariant> getVariants() {
        return variants;
    }
    
    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }
    
    public Map<String, String> getSpecifications() {
        return specifications;
    }
    
    public void setSpecifications(Map<String, String> specifications) {
        this.specifications = specifications;
    }
    
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public boolean isFeatured() {
        return isFeatured;
    }
    
    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }
    
    public boolean isDigital() {
        return isDigital;
    }
    
    public void setDigital(boolean digital) {
        isDigital = digital;
    }
    
    public Double getWeight() {
        return weight;
    }
    
    public void setWeight(Double weight) {
        this.weight = weight;
    }
    
    public ProductDimensions getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(ProductDimensions dimensions) {
        this.dimensions = dimensions;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
    }
    
    public String getMetaTitle() {
        return metaTitle;
    }
    
    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }
    
    public String getMetaDescription() {
        return metaDescription;
    }
    
    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }
    
    public List<String> getMetaKeywords() {
        return metaKeywords;
    }
    
    public void setMetaKeywords(List<String> metaKeywords) {
        this.metaKeywords = metaKeywords;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Integer getTotalReviews() {
        return totalReviews;
    }
    
    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }
    
    public Integer getTotalSales() {
        return totalSales;
    }
    
    public void setTotalSales(Integer totalSales) {
        this.totalSales = totalSales;
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
    public BigDecimal getEffectivePrice() {
        return discountPrice != null ? discountPrice : price;
    }
    
    public boolean isOnSale() {
        return discountPrice != null && discountPrice.compareTo(price) < 0;
    }
    
    public boolean isInStock() {
        return stockQuantity > 0;
    }
    
    public boolean isLowStock() {
        return stockQuantity <= lowStockThreshold;
    }
    
    public String getMainImageUrl() {
        return imageUrls.isEmpty() ? null : imageUrls.get(0);
    }
    
    private void calculateDiscountPercentage() {
        if (price != null && discountPrice != null && discountPrice.compareTo(price) < 0) {
            BigDecimal difference = price.subtract(discountPrice);
            this.discountPercentage = difference.divide(price, 4, BigDecimal.ROUND_HALF_UP)
                                                .multiply(BigDecimal.valueOf(100))
                                                .doubleValue();
        } else {
            this.discountPercentage = null;
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
    
    public static class ProductVariant {
        private String name;
        private String value;
        private BigDecimal priceAdjustment;
        private Integer stockQuantity;
        private String imageUrl;
        
        public ProductVariant() {}
        
        public ProductVariant(String name, String value) {
            this.name = name;
            this.value = value;
        }
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        
        public BigDecimal getPriceAdjustment() { return priceAdjustment; }
        public void setPriceAdjustment(BigDecimal priceAdjustment) { this.priceAdjustment = priceAdjustment; }
        
        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
    
    public static class ProductDimensions {
        private Double length;
        private Double width;
        private Double height;
        private String unit = "cm";
        
        public ProductDimensions() {}
        
        public ProductDimensions(Double length, Double width, Double height) {
            this.length = length;
            this.width = width;
            this.height = height;
        }
        
        // Getters and Setters
        public Double getLength() { return length; }
        public void setLength(Double length) { this.length = length; }
        
        public Double getWidth() { return width; }
        public void setWidth(Double width) { this.width = width; }
        
        public Double getHeight() { return height; }
        public void setHeight(Double height) { this.height = height; }
        
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }
}