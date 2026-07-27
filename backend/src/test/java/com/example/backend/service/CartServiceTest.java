package com.example.backend.service;

import com.example.backend.dto.CartItemRequest;
import com.example.backend.dto.UpdateCartQuantityRequest;
import com.example.backend.model.CartItem;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Regression cover for the cart IDOR: a caller must never reach a cart
 * belonging to a different userId, whichever way that id arrives.
 */
class CartServiceTest {

    private static final String VICTIM = "victim-user-id";
    private static final String ATTACKER = "attacker-user-id";
    private static final String PRODUCT = "product-1";

    private CartItemRepository cartItemRepository;
    private UserRepository userRepository;
    private CartService cartService;

    @BeforeEach
    void setUp() {
        cartItemRepository = mock(CartItemRepository.class);
        userRepository = mock(UserRepository.class);
        cartService = new CartService(cartItemRepository, userRepository);
        when(userRepository.existsById(anyString())).thenReturn(true);
    }

    private static ResponseStatusException expectRejection(org.junit.jupiter.api.function.Executable call) {
        ResponseStatusException thrown = assertThrows(ResponseStatusException.class, call);
        assertEquals(HttpStatus.FORBIDDEN, thrown.getStatusCode());
        return thrown;
    }

    @Test
    void readingAnotherUsersCartIsForbidden() {
        expectRejection(() -> cartService.getCartItems(VICTIM, ATTACKER));
        verify(cartItemRepository, never()).findByUserId(VICTIM);
    }

    @Test
    void updatingAnotherUsersCartIsForbidden() {
        UpdateCartQuantityRequest request = new UpdateCartQuantityRequest();
        request.setQty(99);

        expectRejection(() -> cartService.updateQuantity(VICTIM, PRODUCT, request, ATTACKER));
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    void removingFromAnotherUsersCartIsForbidden() {
        expectRejection(() -> cartService.removeItem(VICTIM, PRODUCT, ATTACKER));
        verify(cartItemRepository, never()).delete(any());
    }

    @Test
    void addingToAnotherUsersCartIsForbidden() {
        expectRejection(() -> cartService.addItem(validRequest(VICTIM), ATTACKER));
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    void ownCartIsStillReadable() {
        CartItem item = new CartItem();
        item.setUserId(VICTIM);
        when(cartItemRepository.findByUserId(VICTIM)).thenReturn(List.of(item));

        assertEquals(1, cartService.getCartItems(VICTIM, VICTIM).size());
    }

    @Test
    void addedItemIsWrittenToTheAuthenticatedUsersCart() {
        when(cartItemRepository.findByUserIdAndProductId(ATTACKER, PRODUCT)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(call -> call.getArgument(0));

        // Body userId omitted entirely — the item must still land on the caller's cart.
        CartItemRequest request = validRequest(null);
        CartItem saved = cartService.addItem(request, ATTACKER);

        assertEquals(ATTACKER, saved.getUserId());
    }

    private static CartItemRequest validRequest(String userId) {
        CartItemRequest request = new CartItemRequest();
        request.setUserId(userId);
        request.setProductId(PRODUCT);
        request.setName("Test product");
        request.setPrice(10.0);
        request.setQty(1);
        return request;
    }
}
