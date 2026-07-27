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

    public CartItem addItem(CartItemRequest request, String callerId) {
        validateCartItemRequest(request);

        // The body's userId is untrusted. Honour it only as an assertion about the caller;
        // the item is always written to the authenticated user's cart.
        if (!isBlank(request.getUserId())) {
            assertOwner(request.getUserId(), callerId);
        }
        String userId = requireCallerId(callerId);
        ensureUserExists(userId);

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

    public List<CartItem> getCartItems(String userId, String callerId) {
        if (isBlank(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        assertOwner(userId, callerId);

        // Read against the authenticated id, never the path variable.
        String ownerId = requireCallerId(callerId);
        ensureUserExists(ownerId);
        return cartItemRepository.findByUserId(ownerId);
    }

    public CartItem updateQuantity(String userId, String productId, UpdateCartQuantityRequest request, String callerId) {
        if (isBlank(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        assertOwner(userId, callerId);
        if (isBlank(productId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product id required");
        }
        if (request.getQty() == null || request.getQty() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }

        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(requireCallerId(callerId), productId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        cartItem.setQty(request.getQty());
        return cartItemRepository.save(cartItem);
    }

    public void removeItem(String userId, String productId, String callerId) {
        if (isBlank(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id required");
        }
        assertOwner(userId, callerId);
        if (isBlank(productId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product id required");
        }

        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(requireCallerId(callerId), productId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        cartItemRepository.delete(cartItem);
    }

    private void validateCartItemRequest(CartItemRequest request) {
        // No userId check: the owner comes from the JWT, so the body may omit it entirely.
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

    /**
     * A cart is private to its owner. The userId travelling in the URL or request body is
     * attacker-controlled, so it may only ever confirm the caller's own id — it must never
     * be used to select which cart is read or written.
     */
    private void assertOwner(String requestedUserId, String callerId) {
        if (!requireCallerId(callerId).equals(safeTrim(requestedUserId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access another user's cart");
        }
    }

    private String requireCallerId(String callerId) {
        if (isBlank(callerId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return callerId.trim();
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
