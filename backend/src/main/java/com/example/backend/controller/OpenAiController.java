package com.example.backend.controller;

import com.example.backend.service.OpenAiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173") // <-- This relates to Step 4
public class OpenAiController {

    private final OpenAiService openAiService;

    public OpenAiController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody String prompt) {
        return openAiService.getOpenAiResponse(prompt);
    }
}