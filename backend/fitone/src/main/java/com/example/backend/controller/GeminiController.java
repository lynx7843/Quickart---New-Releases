package com.example.backend.controller;

import com.example.backend.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173") // Keeps the connection to your React app open
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody String prompt) {
        return geminiService.getGeminiResponse(prompt);
    }
}