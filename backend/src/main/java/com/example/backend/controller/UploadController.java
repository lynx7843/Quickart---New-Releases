package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UploadController {

    private final Cloudinary cloudinary;
    private final String apiKey;

    public UploadController(
            @Value("${cloudinary.cloud.name}") String cloudName,
            @Value("${cloudinary.api.key}")    String apiKey,
            @Value("${cloudinary.api.secret}") String apiSecret) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key",    apiKey,
                "api_secret", apiSecret,
                "secure",     true
        ));
        this.apiKey = apiKey;
    }

    /**
     * GET /api/v1/upload/signature
     * Returns a signed upload signature so the browser can upload
     * directly to Cloudinary without exposing the API secret.
     */
    @GetMapping("/signature")
    public ResponseEntity<Map<String, Object>> getSignature() {
        try {
            long timestamp = System.currentTimeMillis() / 1000L;
            String folder  = "quickart/products";

            Map<String, Object> params = new HashMap<>();
            params.put("timestamp", timestamp);
            params.put("folder",    folder);

            String signature = cloudinary.apiSignRequest(params,
                    cloudinary.config.apiSecret);

            Map<String, Object> response = new HashMap<>();
            response.put("signature", signature);
            response.put("timestamp", timestamp);
            response.put("apiKey",    apiKey);
            response.put("folder",    folder);
            response.put("cloudName", cloudinary.config.cloudName);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Could not generate signature: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}