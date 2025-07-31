package com.ritkart.controller;

import com.ritkart.model.Address;
import com.ritkart.model.User;
import com.ritkart.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management endpoints")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Profile management endpoints
    @Operation(summary = "Get current user profile")
    @GetMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> getCurrentUserProfile() {
        try {
            String email = getCurrentUserEmail();
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Update user profile")
    @PutMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody User profileData) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.updateProfile(currentUser.getId(), profileData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Change password")
    @PostMapping("/profile/change-password")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> request) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Current password and new password are required",
                    "success", "false"
                ));
            }
            
            userService.changePassword(currentUser.getId(), currentPassword, newPassword);
            return ResponseEntity.ok(Map.of(
                "message", "Password changed successfully",
                "success", "true"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "success", "false"
            ));
        }
    }

    @Operation(summary = "Update profile image")
    @PostMapping("/profile/image")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> updateProfileImage(@RequestBody Map<String, String> request) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            String imageUrl = request.get("imageUrl");
            
            if (imageUrl == null) {
                return ResponseEntity.badRequest().build();
            }
            
            User updatedUser = userService.updateProfileImage(currentUser.getId(), imageUrl);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Address management endpoints
    @Operation(summary = "Add new address")
    @PostMapping("/addresses")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> addAddress(@Valid @RequestBody Address address) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.addAddress(currentUser.getId(), address);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update address")
    @PutMapping("/addresses/{addressIndex}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> updateAddress(@PathVariable int addressIndex, @Valid @RequestBody Address address) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.updateAddress(currentUser.getId(), addressIndex, address);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Remove address")
    @DeleteMapping("/addresses/{addressIndex}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> removeAddress(@PathVariable int addressIndex) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.removeAddress(currentUser.getId(), addressIndex);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Set default address")
    @PostMapping("/addresses/{addressIndex}/set-default")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<User> setDefaultAddress(@PathVariable int addressIndex) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.setDefaultAddress(currentUser.getId(), addressIndex);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoints
    @Operation(summary = "Get all users (Admin only)")
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID (Admin only)")
    @GetMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Search users (Admin only)")
    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = userService.searchUsers(q, pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get users by role (Admin only)")
    @GetMapping("/admin/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getUsersByRole(
            @PathVariable User.Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = userService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get active users (Admin only)")
    @GetMapping("/admin/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getActiveUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = userService.getActiveUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Create new user (Admin only)")
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update user (Admin only)")
    @PutMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @Valid @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(userId, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete user (Admin only)")
    @DeleteMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Activate user (Admin only)")
    @PostMapping("/admin/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> activateUser(@PathVariable String userId) {
        try {
            User activatedUser = userService.activateUser(userId);
            return ResponseEntity.ok(activatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Deactivate user (Admin only)")
    @PostMapping("/admin/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deactivateUser(@PathVariable String userId) {
        try {
            User deactivatedUser = userService.deactivateUser(userId);
            return ResponseEntity.ok(deactivatedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Promote user to admin (Admin only)")
    @PostMapping("/admin/{userId}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> promoteToAdmin(@PathVariable String userId) {
        try {
            User promotedUser = userService.promoteToAdmin(userId);
            return ResponseEntity.ok(promotedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Demote admin to customer (Admin only)")
    @PostMapping("/admin/{userId}/demote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> demoteFromAdmin(@PathVariable String userId) {
        try {
            User demotedUser = userService.demoteFromAdmin(userId);
            return ResponseEntity.ok(demotedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Verify user email (Admin only)")
    @PostMapping("/admin/{userId}/verify-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> verifyUserEmail(@PathVariable String userId) {
        try {
            User verifiedUser = userService.verifyUserEmail(userId);
            return ResponseEntity.ok(verifiedUser);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get user statistics (Admin only)")
    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userService.getTotalUsersCount());
        stats.put("activeUsers", userService.getActiveUsersCount());
        stats.put("adminUsers", userService.getUsersCountByRole(User.Role.ADMIN));
        stats.put("customerUsers", userService.getUsersCountByRole(User.Role.CUSTOMER));
        
        // New users in the last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        stats.put("newUsersLast30Days", userService.getNewUsersCount(thirtyDaysAgo));
        
        // New users in the last 7 days
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        stats.put("newUsersLast7Days", userService.getNewUsersCount(sevenDaysAgo));
        
        return ResponseEntity.ok(stats);
    }

    // Helper method to get current user email
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}