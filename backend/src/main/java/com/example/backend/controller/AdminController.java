package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository  userRepository;
    private final OrderRepository orderRepository;

    public AdminController(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository  = userRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PatchMapping("/users/{userId}/role")
    public User updateUserRole(@PathVariable String userId,
                               @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole == null || newRole.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "role is required");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setRole(newRole.toUpperCase());
        return userRepository.save(user);
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PatchMapping("/orders/{orderId}/status")
    public Order updateOrderStatus(@PathVariable String orderId,
                                   @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setStatus(status.toUpperCase());
        order.setUpdatedAt(Instant.now());
        return orderRepository.save(order);
    }
}
