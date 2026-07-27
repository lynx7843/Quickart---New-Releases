package com.example.backend.controller;

import com.example.backend.dto.CartItemRequest;
import com.example.backend.dto.UpdateCartQuantityRequest;
import com.example.backend.model.CartItem;
import com.example.backend.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartItem addItem(@RequestBody CartItemRequest request, Authentication auth) {
        return cartService.addItem(request, callerId(auth));
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable String userId, Authentication auth) {
        return cartService.getCartItems(userId, callerId(auth));
    }

    @PutMapping("/{userId}/{productId}")
    public CartItem updateQuantity(
            @PathVariable String userId,
            @PathVariable String productId,
            @RequestBody UpdateCartQuantityRequest request,
            Authentication auth
    ) {
        return cartService.updateQuantity(userId, productId, request, callerId(auth));
    }

    @DeleteMapping("/{userId}/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable String userId, @PathVariable String productId, Authentication auth) {
        cartService.removeItem(userId, productId, callerId(auth));
    }

    /** userId from the JWT subject — the only cart identity the service is allowed to trust. */
    private static String callerId(Authentication auth) {
        return auth == null ? null : (String) auth.getPrincipal();
    }
}
