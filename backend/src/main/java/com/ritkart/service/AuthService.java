package com.ritkart.service;

import com.ritkart.dto.auth.LoginRequest;
import com.ritkart.dto.auth.RegisterRequest;
import com.ritkart.dto.auth.AuthResponse;
import com.ritkart.exception.ResourceAlreadyExistsException;
import com.ritkart.exception.BadRequestException;
import com.ritkart.model.User;
import com.ritkart.repository.UserRepository;
import com.ritkart.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Validate request
        validateRegisterRequest(registerRequest);

        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("Email is already registered");
        }

        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        user.setEmailVerified(false);

        // Save user
        User savedUser = userRepository.save(user);

        // Send welcome email (async)
        try {
            emailService.sendWelcomeEmail(savedUser);
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(
            savedUser.getEmail(), 
            savedUser.getId(), 
            savedUser.getRole().name()
        );

        return new AuthResponse(
            token, 
            jwtTokenUtil.getExpirationTime(), 
            savedUser, 
            "Registration successful! Welcome to RitKART."
        );
    }

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Generate JWT token
            String token = jwtTokenUtil.generateToken(
                userDetails, 
                user.getId(), 
                user.getRole().name()
            );

            return new AuthResponse(
                token, 
                jwtTokenUtil.getExpirationTime(), 
                user, 
                "Login successful!"
            );

        } catch (DisabledException e) {
            throw new BadCredentialsException("User account is disabled");
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(String token) {
        if (!jwtTokenUtil.canTokenBeRefreshed(token)) {
            throw new BadRequestException("Token cannot be refreshed");
        }

        String refreshedToken = jwtTokenUtil.refreshToken(token);
        String email = jwtTokenUtil.getUsernameFromToken(refreshedToken);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        return new AuthResponse(
            refreshedToken, 
            jwtTokenUtil.getExpirationTime(), 
            user, 
            "Token refreshed successfully"
        );
    }

    public void logout(String token) {
        // In a real application, you might want to blacklist the token
        // For now, we'll just validate it exists
        if (!jwtTokenUtil.validateToken(token)) {
            throw new BadRequestException("Invalid token");
        }
        
        // Token blacklisting could be implemented here using Redis or database
        // For simplicity, we're not implementing it in this demo
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        return new AuthResponse(null, null, user, "User profile retrieved successfully");
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            // Don't reveal that email doesn't exist for security reasons
            return;
        }

        // Generate password reset token (you could use JWT or random token)
        String resetToken = jwtTokenUtil.generateToken(
            user.getEmail(), 
            user.getId(), 
            "PASSWORD_RESET"
        );

        // Send password reset email
        try {
            emailService.sendPasswordResetEmail(user, resetToken);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send password reset email");
        }
    }

    public void resetPassword(String token, String newPassword) {
        if (!jwtTokenUtil.validateToken(token)) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        String email = jwtTokenUtil.getUsernameFromToken(token);
        String role = jwtTokenUtil.getRoleFromToken(token);

        if (!"PASSWORD_RESET".equals(role)) {
            throw new BadRequestException("Invalid reset token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        // Validate password strength
        validatePasswordStrength(newPassword);

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Send confirmation email
        try {
            emailService.sendPasswordChangeConfirmation(user);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Failed to send password change confirmation: " + e.getMessage());
        }
    }

    public void verifyEmail(String token) {
        if (!jwtTokenUtil.validateToken(token)) {
            throw new BadRequestException("Invalid or expired verification token");
        }

        String email = jwtTokenUtil.getUsernameFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        user.setEmailVerified(true);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        // Generate verification token
        String verificationToken = jwtTokenUtil.generateToken(
            user.getEmail(), 
            user.getId(), 
            "EMAIL_VERIFICATION"
        );

        // Send verification email
        try {
            emailService.sendEmailVerification(user, verificationToken);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email");
        }
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (!request.isPasswordMatching()) {
            throw new BadRequestException("Passwords do not match");
        }

        if (!request.isAcceptTerms()) {
            throw new BadRequestException("You must accept the terms and conditions");
        }

        validatePasswordStrength(request.getPassword());
    }

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