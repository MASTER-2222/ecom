package com.ritkart.repository;

import com.ritkart.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActive(String email, boolean isActive);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByIsActive(boolean isActive);
    
    Page<User> findByRole(User.Role role, Pageable pageable);
    
    Page<User> findByIsActive(boolean isActive, Pageable pageable);
    
    @Query("{'firstName': {$regex: ?0, $options: 'i'}}")
    List<User> findByFirstNameContainingIgnoreCase(String firstName);
    
    @Query("{'lastName': {$regex: ?0, $options: 'i'}}")
    List<User> findByLastNameContainingIgnoreCase(String lastName);
    
    @Query("{'email': {$regex: ?0, $options: 'i'}}")
    List<User> findByEmailContainingIgnoreCase(String email);
    
    @Query("{'$or': [" +
           "{'firstName': {$regex: ?0, $options: 'i'}}, " +
           "{'lastName': {$regex: ?0, $options: 'i'}}, " +
           "{'email': {$regex: ?0, $options: 'i'}}" +
           "]}")
    Page<User> searchUsers(String searchTerm, Pageable pageable);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'role': ?0, 'isActive': ?1}")
    Page<User> findByRoleAndIsActive(User.Role role, boolean isActive, Pageable pageable);
    
    long countByRole(User.Role role);
    
    long countByIsActive(boolean isActive);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'isEmailVerified': false}")
    List<User> findUnverifiedUsers();
    
    @Query("{'phoneNumber': {$exists: true, $ne: null}}")
    List<User> findUsersWithPhoneNumber();
}