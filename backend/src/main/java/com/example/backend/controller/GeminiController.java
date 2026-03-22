package com.example.backend.controller;

import com.example.backend.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/gemini")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> body) {
        String prompt   = body.getOrDefault("prompt", "");
        String response = geminiService.getGeminiResponse(prompt);
        return Map.of("response", response);
    }

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody Map<String, String> body) {
        String prompt   = body.getOrDefault("prompt", "");
        String response = geminiService.getGeminiResponse(prompt);
        return Map.of("response", response);
    }
}