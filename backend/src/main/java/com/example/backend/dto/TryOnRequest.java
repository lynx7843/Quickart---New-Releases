package com.example.backend.dto;

public record TryOnRequest(
        String userImageBase64,
        String clothImageBase64,
        String selectedSize
) {
}
