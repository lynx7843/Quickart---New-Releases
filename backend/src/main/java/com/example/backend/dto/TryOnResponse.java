package com.example.backend.dto;

public record TryOnResponse(
        String message,
        String fitMatch,
        String fitReason,
        int fitScore,
        String generatedImageBase64
) {
    public static TryOnResponse success(String fitMatch, String fitReason, int fitScore, String generatedImageBase64) {
        return new TryOnResponse("Success", fitMatch, fitReason, fitScore, generatedImageBase64);
    }

    public static TryOnResponse error(String message) {
        return new TryOnResponse("Error: " + message, null, null, 0, null);
    }
}
