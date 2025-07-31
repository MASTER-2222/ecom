package com.ritkart.repository;

import com.ritkart.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    Optional<Category> findByName(String name);
    
    Optional<Category> findBySlug(String slug);
    
    Optional<Category> findByNameAndIsActive(String name, boolean isActive);
    
    Optional<Category> findBySlugAndIsActive(String slug, boolean isActive);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);
    
    List<Category> findByIsActive(boolean isActive);
    
    List<Category> findByIsActive(boolean isActive, Sort sort);
    
    Page<Category> findByIsActive(boolean isActive, Pageable pageable);
    
    @Query("{'parentCategoryId': null}")
    List<Category> findParentCategories();
    
    @Query("{'parentCategoryId': null, 'isActive': true}")
    List<Category> findActiveParentCategories();
    
    @Query("{'parentCategoryId': null, 'isActive': true}")
    List<Category> findActiveParentCategories(Sort sort);
    
    List<Category> findByParentCategoryId(String parentCategoryId);
    
    List<Category> findByParentCategoryIdAndIsActive(String parentCategoryId, boolean isActive);
    
    List<Category> findByParentCategoryIdAndIsActive(String parentCategoryId, boolean isActive, Sort sort);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Category> findByNameContainingIgnoreCase(String name);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    List<Category> findByNameContainingIgnoreCaseAndIsActive(String name);
    
    @Query("{'$or': [" +
           "{'name': {$regex: ?0, $options: 'i'}}, " +
           "{'description': {$regex: ?0, $options: 'i'}}" +
           "]}")
    Page<Category> searchCategories(String searchTerm, Pageable pageable);
    
    @Query("{'$or': [" +
           "{'name': {$regex: ?0, $options: 'i'}}, " +
           "{'description': {$regex: ?0, $options: 'i'}}" +
           "], 'isActive': true}")
    Page<Category> searchActiveCategories(String searchTerm, Pageable pageable);
    
    long countByIsActive(boolean isActive);
    
    long countByParentCategoryId(String parentCategoryId);
    
    long countByParentCategoryIdAndIsActive(String parentCategoryId, boolean isActive);
    
    @Query("{'parentCategoryId': null}")
    long countParentCategories();
    
    @Query("{'parentCategoryId': null, 'isActive': true}")
    long countActiveParentCategories();
    
    @Query(value = "{}", sort = "{'sortOrder': 1, 'name': 1}")
    List<Category> findAllSorted();
    
    @Query(value = "{'isActive': true}", sort = "{'sortOrder': 1, 'name': 1}")
    List<Category> findActiveSorted();
    
    @Query(value = "{'parentCategoryId': ?0}", sort = "{'sortOrder': 1, 'name': 1}")
    List<Category> findByParentCategoryIdSorted(String parentCategoryId);
    
    @Query(value = "{'parentCategoryId': ?0, 'isActive': true}", sort = "{'sortOrder': 1, 'name': 1}")
    List<Category> findByParentCategoryIdAndIsActiveSorted(String parentCategoryId);
}