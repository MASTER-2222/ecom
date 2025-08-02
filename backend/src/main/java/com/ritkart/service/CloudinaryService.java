package com.ritkart.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Upload image to Cloudinary
     */
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Generate unique public ID
        String publicId = "ritkart/" + UUID.randomUUID().toString();

        Map<String, Object> uploadParams = ObjectUtils.asMap(
            "public_id", publicId,
            "folder", "ritkart",
            "resource_type", "image",
            "quality", "auto",
            "format", "auto"
        );

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Upload image from URL to Cloudinary
     */
    public String uploadImageFromUrl(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL is empty");
        }

        // Generate unique public ID
        String publicId = "ritkart/" + UUID.randomUUID().toString();

        Map<String, Object> uploadParams = ObjectUtils.asMap(
            "public_id", publicId,
            "folder", "ritkart",
            "resource_type", "image",
            "quality", "auto",
            "format", "auto"
        );

        Map<String, Object> uploadResult = cloudinary.uploader().upload(imageUrl, uploadParams);
        
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Delete image from Cloudinary
     */
    public boolean deleteImage(String publicId) {
        try {
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Generate transformation URL for images
     */
    public String getTransformedImageUrl(String publicId, int width, int height) {
        return cloudinary.url()
            .transformation(ObjectUtils.asMap(
                "width", width,
                "height", height,
                "crop", "fill",
                "quality", "auto",
                "format", "auto"
            ))
            .publicId(publicId)
            .generate();
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    public String extractPublicId(String cloudinaryUrl) {
        if (cloudinaryUrl == null || !cloudinaryUrl.contains("cloudinary.com")) {
            return null;
        }
        
        try {
            String[] parts = cloudinaryUrl.split("/");
            String filename = parts[parts.length - 1];
            return filename.contains(".") ? filename.substring(0, filename.lastIndexOf(".")) : filename;
        } catch (Exception e) {
            return null;
        }
    }
}