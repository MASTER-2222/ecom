package com.ritkart.service;

import com.ritkart.exception.BadRequestException;
import com.ritkart.exception.ResourceNotFoundException;
import com.ritkart.model.Address;
import com.ritkart.model.User;
import com.ritkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // User CRUD operations
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Encrypt password if provided
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    public User updateUser(String id, User userDetails) {
        User user = getUserById(id);

        // Update basic info
        if (userDetails.getFirstName() != null) {
            user.setFirstName(userDetails.getFirstName());
        }
        if (userDetails.getLastName() != null) {
            user.setLastName(userDetails.getLastName());
        }
        if (userDetails.getPhoneNumber() != null) {
            user.setPhoneNumber(userDetails.getPhoneNumber());
        }
        if (userDetails.getProfileImageUrl() != null) {
            user.setProfileImageUrl(userDetails.getProfileImageUrl());
        }

        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public User deactivateUser(String id) {
        User user = getUserById(id);
        user.setActive(false);
        return userRepository.save(user);
    }

    public User activateUser(String id) {
        User user = getUserById(id);
        user.setActive(true);
        return userRepository.save(user);
    }

    // Profile management
    public User updateProfile(String userId, User profileData) {
        User user = getUserById(userId);

        if (profileData.getFirstName() != null) {
            user.setFirstName(profileData.getFirstName());
        }
        if (profileData.getLastName() != null) {
            user.setLastName(profileData.getLastName());
        }
        if (profileData.getPhoneNumber() != null) {
            user.setPhoneNumber(profileData.getPhoneNumber());
        }

        return userRepository.save(user);
    }

    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = getUserById(userId);

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Validate new password strength
        validatePasswordStrength(newPassword);

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User updateProfileImage(String userId, String imageUrl) {
        User user = getUserById(userId);
        user.setProfileImageUrl(imageUrl);
        return userRepository.save(user);
    }

    // Address management
    public User addAddress(String userId, Address address) {
        User user = getUserById(userId);

        // If this is the first address or marked as default, make it default
        if (user.getAddresses().isEmpty() || address.isDefault()) {
            // Remove default from other addresses
            user.getAddresses().forEach(addr -> addr.setDefault(false));
            address.setDefault(true);
        }

        user.getAddresses().add(address);
        return userRepository.save(user);
    }

    public User updateAddress(String userId, int addressIndex, Address addressDetails) {
        User user = getUserById(userId);

        if (addressIndex < 0 || addressIndex >= user.getAddresses().size()) {
            throw new BadRequestException("Invalid address index");
        }

        Address existingAddress = user.getAddresses().get(addressIndex);

        // Update address fields
        if (addressDetails.getFullName() != null) {
            existingAddress.setFullName(addressDetails.getFullName());
        }
        if (addressDetails.getPhoneNumber() != null) {
            existingAddress.setPhoneNumber(addressDetails.getPhoneNumber());
        }
        if (addressDetails.getAddressLine1() != null) {
            existingAddress.setAddressLine1(addressDetails.getAddressLine1());
        }
        if (addressDetails.getAddressLine2() != null) {
            existingAddress.setAddressLine2(addressDetails.getAddressLine2());
        }
        if (addressDetails.getCity() != null) {
            existingAddress.setCity(addressDetails.getCity());
        }
        if (addressDetails.getState() != null) {
            existingAddress.setState(addressDetails.getState());
        }
        if (addressDetails.getPostalCode() != null) {
            existingAddress.setPostalCode(addressDetails.getPostalCode());
        }
        if (addressDetails.getCountry() != null) {
            existingAddress.setCountry(addressDetails.getCountry());
        }
        if (addressDetails.getType() != null) {
            existingAddress.setType(addressDetails.getType());
        }

        // Handle default address
        if (addressDetails.isDefault()) {
            user.getAddresses().forEach(addr -> addr.setDefault(false));
            existingAddress.setDefault(true);
        }

        return userRepository.save(user);
    }

    public User removeAddress(String userId, int addressIndex) {
        User user = getUserById(userId);

        if (addressIndex < 0 || addressIndex >= user.getAddresses().size()) {
            throw new BadRequestException("Invalid address index");
        }

        Address removedAddress = user.getAddresses().remove(addressIndex);

        // If removed address was default and there are other addresses, make the first one default
        if (removedAddress.isDefault() && !user.getAddresses().isEmpty()) {
            user.getAddresses().get(0).setDefault(true);
        }

        return userRepository.save(user);
    }

    public User setDefaultAddress(String userId, int addressIndex) {
        User user = getUserById(userId);

        if (addressIndex < 0 || addressIndex >= user.getAddresses().size()) {
            throw new BadRequestException("Invalid address index");
        }

        // Remove default from all addresses
        user.getAddresses().forEach(addr -> addr.setDefault(false));

        // Set new default
        user.getAddresses().get(addressIndex).setDefault(true);

        return userRepository.save(user);
    }

    // Search and filter operations
    public Page<User> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.searchUsers(searchTerm, pageable);
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public Page<User> getUsersByRole(User.Role role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }

    public List<User> getActiveUsers() {
        return userRepository.findByIsActive(true);
    }

    public Page<User> getActiveUsers(Pageable pageable) {
        return userRepository.findByIsActive(true, pageable);
    }

    public List<User> getUsersCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findByCreatedAtBetween(startDate, endDate);
    }

    // Statistics
    public long getTotalUsersCount() {
        return userRepository.count();
    }

    public long getActiveUsersCount() {
        return userRepository.countByIsActive(true);
    }

    public long getUsersCountByRole(User.Role role) {
        return userRepository.countByRole(role);
    }

    public long getNewUsersCount(LocalDateTime since) {
        return userRepository.countByCreatedAtBetween(since, LocalDateTime.now());
    }

    // Admin operations
    public User promoteToAdmin(String userId) {
        User user = getUserById(userId);
        user.setRole(User.Role.ADMIN);
        return userRepository.save(user);
    }

    public User demoteFromAdmin(String userId) {
        User user = getUserById(userId);
        user.setRole(User.Role.CUSTOMER);
        return userRepository.save(user);
    }

    public User verifyUserEmail(String userId) {
        User user = getUserById(userId);
        user.setEmailVerified(true);
        return userRepository.save(user);
    }

    // Helper methods
    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new BadRequestException("Password must contain at least one lowercase letter");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new BadRequestException("Password must contain at least one uppercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new BadRequestException("Password must contain at least one digit");
        }
    }
}