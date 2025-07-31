package com.ritkart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "categories")
public class Category {
    
    @Id
    private String id;
    
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 100)
    @Indexed(unique = true)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    @Indexed
    private String slug;
    
    private String imageUrl;
    
    private String parentCategoryId;
    
    private List<String> subcategoryIds = new ArrayList<>();
    
    private boolean isActive = true;
    
    private int sortOrder = 0;
    
    private String metaTitle;
    private String metaDescription;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Category() {}
    
    public Category(String name, String description) {
        this.name = name;
        this.description = description;
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
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getParentCategoryId() {
        return parentCategoryId;
    }
    
    public void setParentCategoryId(String parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }
    
    public List<String> getSubcategoryIds() {
        return subcategoryIds;
    }
    
    public void setSubcategoryIds(List<String> subcategoryIds) {
        this.subcategoryIds = subcategoryIds;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public int getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
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
    
    public boolean isParentCategory() {
        return parentCategoryId == null;
    }
    
    public boolean hasSubcategories() {
        return !subcategoryIds.isEmpty();
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