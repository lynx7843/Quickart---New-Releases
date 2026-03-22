package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order placeOrder(@RequestBody OrderService.PlaceOrderRequest request,
                            Authentication auth) {
        String buyerId = (String) auth.getPrincipal();
        return orderService.placeOrder(request, buyerId);
    }

    @GetMapping
    public List<Order> myOrders(Authentication auth) {
        String buyerId = (String) auth.getPrincipal();
        return orderService.getMyOrders(buyerId);
    }

    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable String orderId, Authentication auth) {
        String buyerId = (String) auth.getPrincipal();
        return orderService.getOrderById(orderId, buyerId);
    }

    @PatchMapping("/{orderId}/cancel")
    public Order cancelOrder(@PathVariable String orderId, Authentication auth) {
        String buyerId = (String) auth.getPrincipal();
        return orderService.cancelOrder(orderId, buyerId);
    }
}
