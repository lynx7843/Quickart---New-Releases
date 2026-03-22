package com.example.backend.controller;

import com.example.backend.model.TryOnRequest;
import com.example.backend.model.TryOnResponse;
import com.example.backend.service.TryOnService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/tryon")
@CrossOrigin(origins = "http://localhost:5173")
public class TryOnController {

    private final TryOnService tryOnService;

    public TryOnController(TryOnService tryOnService) {
        this.tryOnService = tryOnService;
    }

    /**
     * @param request  JSON body with userImageBase64, clothImageBase64, selectedSize
     * @return         JSON body with generatedImageBase64, fitMatch, fitReason, fitScore
     */
    @PostMapping("/fit")
    public ResponseEntity<TryOnResponse> fit(@RequestBody TryOnRequest request) {
        TryOnResponse response = tryOnService.process(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("TryOn service is running ✓");
    }
}
