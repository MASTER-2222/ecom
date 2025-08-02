package com.ritkart.controller;

import com.ritkart.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/upload")
@Tag(name = "Upload", description = "File upload endpoints")
@CrossOrigin(origins = "*")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Operation(summary = "Upload image to Cloudinary")
    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "File must be an image");
                return ResponseEntity.badRequest().body(response);
            }

            String imageUrl = cloudinaryService.uploadImage(file);
            
            response.put("success", true);
            response.put("message", "Image uploaded successfully");
            response.put("data", Map.of("url", imageUrl));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(summary = "Upload image from URL to Cloudinary")
    @PostMapping("/image/from-url")
    public ResponseEntity<Map<String, Object>> uploadImageFromUrl(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String imageUrl = request.get("url");
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Image URL is required");
                return ResponseEntity.badRequest().body(response);
            }

            String cloudinaryUrl = cloudinaryService.uploadImageFromUrl(imageUrl);
            
            response.put("success", true);
            response.put("message", "Image uploaded successfully from URL");
            response.put("data", Map.of("url", cloudinaryUrl));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload image from URL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(summary = "Delete image from Cloudinary")
    @DeleteMapping("/image")
    public ResponseEntity<Map<String, Object>> deleteImage(@RequestParam("publicId") String publicId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean deleted = cloudinaryService.deleteImage(publicId);
            
            if (deleted) {
                response.put("success", true);
                response.put("message", "Image deleted successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete image");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}