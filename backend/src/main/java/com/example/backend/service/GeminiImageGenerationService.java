package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiImageGenerationService {

    private static final String DEFAULT_MODEL = "gemini-2.5-flash-image";
    private static final String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.image.model:" + DEFAULT_MODEL + "}")
    private String imageModel;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateTryOnImage(String userMimeType, byte[] userImage, String clothMimeType, byte[] clothImage, String selectedSize) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is not configured.");
        }

        String prompt = """
                Create a realistic virtual try-on image.
                Use the first image as the person.
                Use the second image as the clothing reference.
                Dress the person in the clothing from the second image while preserving the person's face, body pose, background, and lighting.
                Keep the garment structure, fabric appearance, and colors accurate.
                The requested clothing size is %s.
                Return the edited image.
                """.formatted(selectedSize);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt),
                                Map.of("inline_data", Map.of(
                                        "mime_type", userMimeType,
                                        "data", Base64.getEncoder().encodeToString(userImage)
                                )),
                                Map.of("inline_data", Map.of(
                                        "mime_type", clothMimeType,
                                        "data", Base64.getEncoder().encodeToString(clothImage)
                                ))
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    API_URL_TEMPLATE.formatted(imageModel),
                    new HttpEntity<>(requestBody, headers),
                    Map.class
            );

            return extractImageDataUrl(response.getBody());
        } catch (RestClientException ex) {
            throw new IllegalStateException("Gemini image generation failed: " + ex.getMessage(), ex);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractImageDataUrl(Map<String, Object> body) {
        if (body == null || !body.containsKey("candidates")) {
            throw new IllegalStateException("Gemini image generation returned an empty response.");
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
        for (Map<String, Object> candidate : candidates) {
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            if (content == null) {
                continue;
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null) {
                continue;
            }

            for (Map<String, Object> part : parts) {
                Map<String, Object> inlineData = (Map<String, Object>) part.get("inlineData");
                if (inlineData == null) {
                    inlineData = (Map<String, Object>) part.get("inline_data");
                }
                if (inlineData == null) {
                    continue;
                }

                String mimeType = (String) inlineData.getOrDefault("mimeType", inlineData.get("mime_type"));
                String data = (String) inlineData.get("data");
                if (mimeType != null && data != null && mimeType.startsWith("image/")) {
                    return "data:" + mimeType + ";base64," + data;
                }
            }
        }

        throw new IllegalStateException("Gemini image generation did not return an image.");
    }
}
