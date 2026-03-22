package com.example.backend.service;

import com.example.backend.dto.AuthUserResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.RegisterResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterResponse register(RegisterRequest request) {
        validateRequest(request);

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            User savedUser = userRepository.save(user);
            return new RegisterResponse(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getPhone(),
                    "Account created successfully"
            );
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
    }

    public AuthUserResponse login(LoginRequest request) {
        if (isBlank(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email required");
        }
        if (isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return new AuthUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                "Login successful"
        );
    }

    private void validateRequest(RegisterRequest request) {
        if (isBlank(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name required");
        }
        if (isBlank(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email required");
        }
        if (isBlank(request.getPhone())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number required");
        }
        if (isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password required");
        }
        if (isBlank(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confirm password required");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
