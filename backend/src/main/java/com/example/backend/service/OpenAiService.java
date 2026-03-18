package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenAiService {

    // This grabs the key from application.properties
    @Value("${openai.api.key}")
    private String apiKey;

    public String getOpenAiResponse(String prompt) {
        // Later, you will write the HTTP request to OpenAI here.
        // You will pass the apiKey in the "Authorization: Bearer" header.
        System.out.println("Using API Key: " + apiKey.substring(0, 5) + "...");

        return "Simulated AI response to: " + prompt;
    }
}