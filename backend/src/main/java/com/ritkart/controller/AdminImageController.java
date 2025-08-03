package com.ritkart.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/images")
@CrossOrigin(origins = {"http://localhost:3000", "https://ritkart-frontend.railway.app"})
public class AdminImageController {

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Upload single image
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "ritkart/products") String folder,
            @RequestParam(value = "publicId", required = false) String publicId,
            @RequestParam(value = "tags", required = false) String tags) {
        
        try {
            Map<String, Object> uploadOptions = new HashMap<>();
            uploadOptions.put("folder", folder);
            uploadOptions.put("resource_type", "image");
            uploadOptions.put("quality", "auto");
            uploadOptions.put("fetch_format", "auto");
            
            if (publicId != null && !publicId.trim().isEmpty()) {
                uploadOptions.put("public_id", publicId);
            }
            
            if (tags != null && !tags.trim().isEmpty()) {
                uploadOptions.put("tags", tags.split(","));
            }
            
            // Add transformations for optimization
            List<Map<String, Object>> transformations = new ArrayList<>();
            transformations.add(ObjectUtils.asMap(
                "width", 1000, 
                "height", 1000, 
                "crop", "limit",
                "quality", "auto"
            ));
            uploadOptions.put("transformation", transformations);
            
            // Add eager transformations for thumbnails
            List<Map<String, Object>> eager = new ArrayList<>();
            eager.add(ObjectUtils.asMap("width", 300, "height", 300, "crop", "thumb", "gravity", "auto"));
            eager.add(ObjectUtils.asMap("width", 150, "height", 150, "crop", "thumb", "gravity", "auto"));
            uploadOptions.put("eager", eager);
            uploadOptions.put("eager_async", true);

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image uploaded successfully");
            response.put("data", ObjectUtils.asMap(
                "public_id", uploadResult.get("public_id"),
                "secure_url", uploadResult.get("secure_url"),
                "width", uploadResult.get("width"),
                "height", uploadResult.get("height"),
                "format", uploadResult.get("format"),
                "bytes", uploadResult.get("bytes"),
                "created_at", uploadResult.get("created_at"),
                "tags", uploadResult.get("tags"),
                "eager", uploadResult.get("eager")
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "File upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Upload multiple images
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "ritkart/products") String folder,
            @RequestParam(value = "tags", required = false) String tags) {
        
        if (files.length > 10) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Maximum 10 files can be uploaded at once");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        List<Map<String, Object>> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        for (MultipartFile file : files) {
            try {
                Map<String, Object> uploadOptions = new HashMap<>();
                uploadOptions.put("folder", folder);
                uploadOptions.put("resource_type", "image");
                uploadOptions.put("quality", "auto");
                uploadOptions.put("fetch_format", "auto");
                
                if (tags != null && !tags.trim().isEmpty()) {
                    uploadOptions.put("tags", tags.split(","));
                }
                
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
                
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("filename", file.getOriginalFilename());
                result.put("public_id", uploadResult.get("public_id"));
                result.put("secure_url", uploadResult.get("secure_url"));
                result.put("format", uploadResult.get("format"));
                result.put("bytes", uploadResult.get("bytes"));
                
                results.add(result);
                successCount++;
                
            } catch (Exception e) {
                Map<String, Object> result = new HashMap<>();
                result.put("success", false);
                result.put("filename", file.getOriginalFilename());
                result.put("error", e.getMessage());
                
                results.add(result);
                failureCount++;
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", String.format("Uploaded %d of %d images successfully", successCount, files.length));
        response.put("data", ObjectUtils.asMap(
            "results", results,
            "summary", ObjectUtils.asMap(
                "total", files.length,
                "successful", successCount,
                "failed", failureCount
            )
        ));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get list of images with pagination and filtering
     */
    @GetMapping("/list")
    public ResponseEntity<?> listImages(
            @RequestParam(value = "folder", required = false) String folder,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pageSize", defaultValue = "20") int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "created_at") String sortBy,
            @RequestParam(value = "order", defaultValue = "desc") String order) {
        
        try {
            Map<String, Object> searchOptions = new HashMap<>();
            searchOptions.put("resource_type", "image");
            searchOptions.put("type", "upload");
            searchOptions.put("max_results", Math.min(pageSize, 100));
            
            if (folder != null && !folder.trim().isEmpty()) {
                searchOptions.put("prefix", folder);
            }
            
            if (tags != null && !tags.trim().isEmpty()) {
                searchOptions.put("tags", true);
            }
            
            Map<?, ?> result = cloudinary.api().resources(searchOptions);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");
            
            List<Map<String, Object>> formattedResources = new ArrayList<>();
            for (Map<String, Object> resource : resources) {
                Map<String, Object> formattedResource = new HashMap<>();
                formattedResource.put("public_id", resource.get("public_id"));
                formattedResource.put("secure_url", resource.get("secure_url"));
                formattedResource.put("format", resource.get("format"));
                formattedResource.put("width", resource.get("width"));
                formattedResource.put("height", resource.get("height"));
                formattedResource.put("bytes", resource.get("bytes"));
                formattedResource.put("created_at", resource.get("created_at"));
                formattedResource.put("tags", resource.get("tags"));
                formattedResource.put("folder", resource.get("folder"));
                formattedResources.add(formattedResource);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", ObjectUtils.asMap(
                "images", formattedResources,
                "total_count", result.get("total_count"),
                "page", page,
                "page_size", pageSize,
                "has_more", formattedResources.size() == pageSize
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to list images: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get image details by public ID
     */
    @GetMapping("/{publicId}")
    public ResponseEntity<?> getImageDetails(@PathVariable String publicId) {
        try {
            // Replace path separators in public ID
            String formattedPublicId = publicId.replace("_", "/");
            
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "image");
            options.put("image_metadata", true);
            options.put("colors", true);
            
            Map<?, ?> result = cloudinary.api().resource(formattedPublicId, options);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", ObjectUtils.asMap(
                "public_id", result.get("public_id"),
                "secure_url", result.get("secure_url"),
                "format", result.get("format"),
                "width", result.get("width"),
                "height", result.get("height"),
                "bytes", result.get("bytes"),
                "created_at", result.get("created_at"),
                "tags", result.get("tags"),
                "folder", result.get("folder"),
                "colors", result.get("colors"),
                "metadata", result.get("metadata"),
                "derived", result.get("derived")
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            if (e.getMessage().toLowerCase().contains("not found")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Image not found");
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to get image details: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Update image metadata (tags, context)
     */
    @PutMapping("/{publicId}")
    public ResponseEntity<?> updateImageMetadata(
            @PathVariable String publicId,
            @RequestBody Map<String, Object> updateData) {
        
        try {
            String formattedPublicId = publicId.replace("_", "/");
            
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "image");
            
            if (updateData.containsKey("tags")) {
                @SuppressWarnings("unchecked")
                List<String> tags = (List<String>) updateData.get("tags");
                options.put("tags", String.join(",", tags));
            }
            
            if (updateData.containsKey("context")) {
                options.put("context", updateData.get("context"));
            }
            
            Map<?, ?> result = cloudinary.uploader().explicit(formattedPublicId, options);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image metadata updated successfully");
            response.put("data", ObjectUtils.asMap(
                "public_id", result.get("public_id"),
                "tags", result.get("tags"),
                "context", result.get("context"),
                "updated_at", System.currentTimeMillis()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to update metadata: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Delete image by public ID
     */
    @DeleteMapping("/{publicId}")
    public ResponseEntity<?> deleteImage(
            @PathVariable String publicId,
            @RequestParam(value = "invalidate", defaultValue = "true") boolean invalidate) {
        
        try {
            String formattedPublicId = publicId.replace("_", "/");
            
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "image");
            options.put("invalidate", invalidate);
            
            Map<?, ?> result = cloudinary.uploader().destroy(formattedPublicId, options);
            
            if ("ok".equals(result.get("result"))) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Image " + publicId + " deleted successfully");
                response.put("public_id", publicId);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Failed to delete image: " + result.get("result"));
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
        } catch (Exception e) {
            if (e.getMessage().toLowerCase().contains("not found")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Image not found");
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Bulk delete images
     */
    @DeleteMapping("/bulk")
    public ResponseEntity<?> bulkDeleteImages(
            @RequestBody Map<String, Object> requestData,
            @RequestParam(value = "invalidate", defaultValue = "true") boolean invalidate) {
        
        try {
            @SuppressWarnings("unchecked")
            List<String> publicIds = (List<String>) requestData.get("publicIds");
            
            if (publicIds == null || publicIds.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "No public IDs provided");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (publicIds.size() > 100) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Maximum 100 images can be deleted at once");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Format public IDs
            List<String> formattedPublicIds = new ArrayList<>();
            for (String publicId : publicIds) {
                formattedPublicIds.add(publicId.replace("_", "/"));
            }
            
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "image");
            options.put("invalidate", invalidate);
            
            Map<?, ?> result = cloudinary.api().deleteResources(formattedPublicIds, options);
            
            @SuppressWarnings("unchecked")
            Map<String, String> deleted = (Map<String, String>) result.get("deleted");
            @SuppressWarnings("unchecked")
            List<String> notFound = (List<String>) result.get("not_found");
            @SuppressWarnings("unchecked")
            List<String> partial = (List<String>) result.get("partial");
            
            int deletedCount = 0;
            if (deleted != null) {
                deletedCount = (int) deleted.values().stream().filter("deleted"::equals).count();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bulk delete completed");
            response.put("data", ObjectUtils.asMap(
                "deleted_count", deletedCount,
                "not_found_count", notFound != null ? notFound.size() : 0,
                "partial_count", partial != null ? partial.size() : 0,
                "deleted", deleted,
                "not_found", notFound,
                "partial", partial
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Bulk delete failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get storage analytics
     */
    @GetMapping("/analytics/storage")
    public ResponseEntity<?> getStorageAnalytics() {
        try {
            // Call usage method with empty options map
            Map<?, ?> usage = cloudinary.api().usage(ObjectUtils.emptyMap());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", ObjectUtils.asMap(
                "plan", usage.get("plan"),
                "last_updated", usage.get("last_updated"),
                "objects", usage.get("objects"),
                "bandwidth", usage.get("bandwidth"),
                "storage", usage.get("storage"),
                "requests", usage.get("requests"),
                "resources", usage.get("resources"),
                "derived_resources", usage.get("derived_resources")
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to get analytics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}