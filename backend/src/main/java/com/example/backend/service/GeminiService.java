package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class GeminiService {

    @Value("${gemini.api.keys}")
    private String apiKeysRaw;

    private final RestTemplate restTemplate = new RestTemplate();
    private final AtomicInteger keyIndex = new AtomicInteger(0);

    private List<String> getKeys() {
        return Arrays.asList(apiKeysRaw.split(","));
    }

    private String nextKey() {
        List<String> keys = getKeys();
        int idx = keyIndex.getAndUpdate(i -> (i + 1) % keys.size());
        return keys.get(idx).trim();
    }

    public String getGeminiResponse(String prompt) {
        List<String> keys = getKeys();
        if (keys.isEmpty() || keys.get(0).isBlank()) {
            return "Gemini API keys are not configured.";
        }

        // Try each key once before giving up
        for (int attempt = 0; attempt < keys.size(); attempt++) {
            String apiKey = nextKey();
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "role", "user",
                                    "parts", List.of(Map.of("text", prompt))
                            )
                    )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            try {
                @SuppressWarnings("rawtypes")
                ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

                @SuppressWarnings("unchecked")
                Map<String, Object> body = (Map<String, Object>) response.getBody();

                if (body != null && body.containsKey("candidates")) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                    if (!candidates.isEmpty()) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (!parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
                return "No response text found.";

            } catch (HttpClientErrorException e) {
                if (e.getStatusCode().value() == 429) {
                    // This key is rate limited, try the next one
                    System.err.println("Key " + (attempt + 1) + " rate limited, trying next...");
                    continue;
                }
                System.err.println("Gemini API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                return "Gemini API error " + e.getStatusCode() + ": " + e.getResponseBodyAsString();
            } catch (Exception e) {
                System.err.println("Error calling Gemini API: " + e.getMessage());
                return "Error connecting to Gemini AI: " + e.getMessage();
            }
        }

        return "All API keys are currently rate limited. Please wait a minute and try again.";
    }
}
