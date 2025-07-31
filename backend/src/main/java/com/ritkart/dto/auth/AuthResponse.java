package com.ritkart.dto.auth;

import com.ritkart.model.User;
import java.time.LocalDateTime;

public class AuthResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserInfo user;
    private String message;
    private boolean success;
    
    public AuthResponse() {}
    
    public AuthResponse(String accessToken, Long expiresIn, User user) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = new UserInfo(user);
        this.success = true;
        this.message = "Authentication successful";
    }
    
    public AuthResponse(String accessToken, Long expiresIn, User user, String message) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = new UserInfo(user);
        this.success = true;
        this.message = message;
    }
    
    public AuthResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
    
    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public UserInfo getUser() {
        return user;
    }
    
    public void setUser(UserInfo user) {
        this.user = user;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String role;
        private boolean isActive;
        private boolean isEmailVerified;
        private String profileImageUrl;
        private LocalDateTime createdAt;
        
        public UserInfo() {}
        
        public UserInfo(User user) {
            this.id = user.getId();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.email = user.getEmail();
            this.phoneNumber = user.getPhoneNumber();
            this.role = user.getRole().name();
            this.isActive = user.isActive();
            this.isEmailVerified = user.isEmailVerified();
            this.profileImageUrl = user.getProfileImageUrl();
            this.createdAt = user.getCreatedAt();
        }
        
        // Getters and Setters
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public boolean isActive() {
            return isActive;
        }
        
        public void setActive(boolean active) {
            isActive = active;
        }
        
        public boolean isEmailVerified() {
            return isEmailVerified;
        }
        
        public void setEmailVerified(boolean emailVerified) {
            isEmailVerified = emailVerified;
        }
        
        public String getProfileImageUrl() {
            return profileImageUrl;
        }
        
        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public String getFullName() {
            return firstName + " " + lastName;
        }
    }
}