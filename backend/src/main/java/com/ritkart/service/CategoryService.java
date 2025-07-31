package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.Category;
import com.ritkart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Public category operations
    public List<Category> getActiveCategories() {
        return categoryRepository.findActiveSorted();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllSorted();
    }

    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Page<Category> getActiveCategories(Pageable pageable) {
        return categoryRepository.findByIsActive(true, pageable);
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + name));
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlugAndIsActive(slug, true)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    // Parent and subcategory operations
    public List<Category> getParentCategories() {
        return categoryRepository.findActiveParentCategories(Sort.by("sortOrder", "name"));
    }

    public List<Category> getAllParentCategories() {
        return categoryRepository.findParentCategories();
    }

    public List<Category> getSubcategories(String parentId) {
        return categoryRepository.findByParentCategoryIdAndIsActiveSorted(parentId);
    }

    public List<Category> getAllSubcategories(String parentId) {
        return categoryRepository.findByParentCategoryIdSorted(parentId);
    }

    public boolean hasSubcategories(String categoryId) {
        return categoryRepository.countByParentCategoryId(categoryId) > 0;
    }

    // CRUD operations
    public Category createCategory(Category category) {
        // Validate category
        validateCategory(category);

        // Check if category name already exists
        if (categoryRepository.existsByName(category.getName())) {
            throw new BadRequestException("Category with name '" + category.getName() + "' already exists");
        }

        // Generate slug if not provided
        if (category.getSlug() == null || category.getSlug().isEmpty()) {
            category.setSlug(generateSlug(category.getName()));
        }

        // Ensure slug is unique
        String originalSlug = category.getSlug();
        int counter = 1;
        while (categoryRepository.existsBySlug(category.getSlug())) {
            category.setSlug(originalSlug + "-" + counter);
            counter++;
        }

        // Validate parent category if provided
        if (category.getParentCategoryId() != null) {
            Category parentCategory = getCategoryById(category.getParentCategoryId());
            // Add this category to parent's subcategory list
            parentCategory.getSubcategoryIds().add(category.getId());
            categoryRepository.save(parentCategory);
        }

        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category categoryDetails) {
        Category category = getCategoryById(id);

        // Update basic information
        if (categoryDetails.getName() != null && !categoryDetails.getName().trim().isEmpty()) {
            // Check if new name conflicts with existing categories (excluding current one)
            if (!category.getName().equals(categoryDetails.getName()) && 
                categoryRepository.existsByName(categoryDetails.getName())) {
                throw new BadRequestException("Category with name '" + categoryDetails.getName() + "' already exists");
            }
            category.setName(categoryDetails.getName());
        }

        if (categoryDetails.getDescription() != null) {
            category.setDescription(categoryDetails.getDescription());
        }

        if (categoryDetails.getImageUrl() != null) {
            category.setImageUrl(categoryDetails.getImageUrl());
        }

        if (categoryDetails.getMetaTitle() != null) {
            category.setMetaTitle(categoryDetails.getMetaTitle());
        }

        if (categoryDetails.getMetaDescription() != null) {
            category.setMetaDescription(categoryDetails.getMetaDescription());
        }

        // Update sort order
        if (categoryDetails.getSortOrder() != 0) {
            category.setSortOrder(categoryDetails.getSortOrder());
        }

        // Update active status
        category.setActive(categoryDetails.isActive());

        // Handle parent category changes
        if (categoryDetails.getParentCategoryId() != null && 
            !categoryDetails.getParentCategoryId().equals(category.getParentCategoryId())) {
            
            // Remove from old parent if exists
            if (category.getParentCategoryId() != null) {
                try {
                    Category oldParent = getCategoryById(category.getParentCategoryId());
                    oldParent.getSubcategoryIds().remove(category.getId());
                    categoryRepository.save(oldParent);
                } catch (ResourceNotFoundException e) {
                    // Old parent doesn't exist anymore, continue
                }
            }

            // Add to new parent
            Category newParent = getCategoryById(categoryDetails.getParentCategoryId());
            if (!newParent.getSubcategoryIds().contains(category.getId())) {
                newParent.getSubcategoryIds().add(category.getId());
                categoryRepository.save(newParent);
            }

            category.setParentCategoryId(categoryDetails.getParentCategoryId());
        }

        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        Category category = getCategoryById(id);

        // Check if category has subcategories
        if (hasSubcategories(id)) {
            throw new BadRequestException("Cannot delete category that has subcategories. Delete subcategories first.");
        }

        // Remove from parent category if exists
        if (category.getParentCategoryId() != null) {
            try {
                Category parent = getCategoryById(category.getParentCategoryId());
                parent.getSubcategoryIds().remove(id);
                categoryRepository.save(parent);
            } catch (ResourceNotFoundException e) {
                // Parent doesn't exist anymore, continue with deletion
            }
        }

        categoryRepository.delete(category);
    }

    public Category activateCategory(String id) {
        Category category = getCategoryById(id);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    public Category deactivateCategory(String id) {
        Category category = getCategoryById(id);
        category.setActive(false);
        return categoryRepository.save(category);
    }

    // Search and filter operations
    public Page<Category> searchCategories(String searchTerm, Pageable pageable) {
        return categoryRepository.searchCategories(searchTerm, pageable);
    }

    public Page<Category> searchActiveCategories(String searchTerm, Pageable pageable) {
        return categoryRepository.searchActiveCategories(searchTerm, pageable);
    }

    public List<Category> getCategoriesByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Category> getActiveCategoriesByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCaseAndIsActive(name);
    }

    // Statistics and analytics
    public long getTotalCategoriesCount() {
        return categoryRepository.count();
    }

    public long getActiveCategoriesCount() {
        return categoryRepository.countByIsActive(true);
    }

    public long getParentCategoriesCount() {
        return categoryRepository.countActiveParentCategories();
    }

    public long getAllParentCategoriesCount() {
        return categoryRepository.countParentCategories();
    }

    public long getSubcategoriesCount(String parentId) {
        return categoryRepository.countByParentCategoryIdAndIsActive(parentId, true);
    }

    public long getAllSubcategoriesCount(String parentId) {
        return categoryRepository.countByParentCategoryId(parentId);
    }

    // Category hierarchy operations
    public Category moveCategory(String categoryId, String newParentId) {
        Category category = getCategoryById(categoryId);

        // Prevent circular references
        if (newParentId != null && (newParentId.equals(categoryId) || isDescendant(categoryId, newParentId))) {
            throw new BadRequestException("Cannot move category to its descendant or itself");
        }

        // Remove from current parent
        if (category.getParentCategoryId() != null) {
            try {
                Category currentParent = getCategoryById(category.getParentCategoryId());
                currentParent.getSubcategoryIds().remove(categoryId);
                categoryRepository.save(currentParent);
            } catch (ResourceNotFoundException e) {
                // Current parent doesn't exist, continue
            }
        }

        // Add to new parent
        if (newParentId != null) {
            Category newParent = getCategoryById(newParentId);
            if (!newParent.getSubcategoryIds().contains(categoryId)) {
                newParent.getSubcategoryIds().add(categoryId);
                categoryRepository.save(newParent);
            }
        }

        category.setParentCategoryId(newParentId);
        return categoryRepository.save(category);
    }

    public void updateCategorySortOrder(String categoryId, int newSortOrder) {
        Category category = getCategoryById(categoryId);
        category.setSortOrder(newSortOrder);
        categoryRepository.save(category);
    }

    // Helper methods
    private void validateCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new BadRequestException("Category name is required");
        }

        if (category.getName().length() < 2 || category.getName().length() > 100) {
            throw new BadRequestException("Category name must be between 2 and 100 characters");
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

    private boolean isDescendant(String ancestorId, String descendantId) {
        try {
            Category descendant = getCategoryById(descendantId);
            if (descendant.getParentCategoryId() == null) {
                return false;
            }
            if (descendant.getParentCategoryId().equals(ancestorId)) {
                return true;
            }
            return isDescendant(ancestorId, descendant.getParentCategoryId());
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }
}