package com.example.backend.controller;

import com.example.backend.security.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/debug")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DebugController {

    private final JwtUtil jwtUtil;

    public DebugController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * GET /api/v1/debug/me
     * Returns what Spring Security sees from your JWT token
     */
    @GetMapping("/me")
    public Map<String, Object> me(
            Authentication auth,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> result = new HashMap<>();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                result.put("tokenUserId",  jwtUtil.getUserId(token));
                result.put("tokenRole",    jwtUtil.getRole(token));
                result.put("tokenValid",   jwtUtil.isValid(token));
            } catch (Exception e) {
                result.put("tokenError", e.getMessage());
            }
        } else {
            result.put("tokenError", "No Bearer token found in Authorization header");
        }

        if (auth != null) {
            result.put("springPrincipal",  auth.getPrincipal());
            result.put("springAuthorities", auth.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
            result.put("springAuthenticated", auth.isAuthenticated());
        } else {
            result.put("springAuth", "null — token was rejected by Spring Security");
        }

        return result;
    }
}
