package com.example.backend.dto;

public class AuthUserResponse {

    private final String id;
    private final String name;
    private final String email;
    private final String phone;
    private final String message;
    private final String role;
    private final String token;

    public AuthUserResponse(String id, String name, String email, String phone, String message, String role, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.message = message;
        this.role = role;
        this.token = token;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getMessage() {
        return message;
    }
}
