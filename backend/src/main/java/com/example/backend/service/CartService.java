package com.example.backend.service;

import com.example.backend.dto.CartItemRequest;
import com.example.backend.dto.UpdateCartQuantityRequest;
import com.example.backend.model.CartItem;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    public CartItem addItem(CartItemRequest request) {
        validateCartItemRequest(request);
        ensureUserExists(request.getUserId().trim());

        String userId = request.getUserId().trim();
        String productId = request.getProductId().trim();
        int requestedQty = request.getQty() == null ? 1 : request.getQty();

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(CartItem::new);

        cartItem.setUserId(userId);
        cartItem.setProductId(productId);
        cartItem.setName(request.getName().trim());
        cartItem.setDescription(safeTrim(request.getDescription()));
        cartItem.setImageUrl(safeTrim(request.getImageUrl()));
        cartItem.setPrice(request.getPrice());
        cartItem.setQty((cartItem.getQty() == null ? 0 : cartItem.getQty()) + requestedQty);

        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getCartItems(String userId) {
        if (isBlank(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        ensureUserExists(userId.trim());
        return cartItemRepository.findByUserId(userId.trim());
    }

    public CartItem updateQuantity(String userId, String productId, UpdateCartQuantityRequest request) {
        if (isBlank(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        if (isBlank(productId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product id required");
        }
        if (request.getQty() == null || request.getQty() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId.trim(), productId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        cartItem.setQty(request.getQty());
        return cartItemRepository.save(cartItem);
    }

    public void removeItem(String userId, String productId) {
        if (isBlank(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        if (isBlank(productId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product id required");
        }

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId.trim(), productId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        cartItemRepository.delete(cartItem);
    }

    private void validateCartItemRequest(CartItemRequest request) {
        if (isBlank(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        if (isBlank(request.getProductId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product id required");
        }
        if (isBlank(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name required");
        }
        if (request.getPrice() == null || request.getPrice() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid price required");
        }
        if (request.getQty() != null && request.getQty() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }
    }

    private void ensureUserExists(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String safeTrim(String value) {
        return value == null ? null : value.trim();
    }
}
