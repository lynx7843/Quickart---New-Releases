package com.example.backend.service;

import com.example.backend.model.Order;
import com.example.backend.model.Order.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final double COMMISSION_RATE = 0.10;
    private static final double DELIVERY_FEE    = 350.0;

    private final OrderRepository  orderRepository;
    private final ProductService   productService;

    public OrderService(OrderRepository orderRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService  = productService;
    }

    public Order placeOrder(PlaceOrderRequest request, String buyerId) {
        List<OrderItem> orderItems  = new ArrayList<>();
        List<String>    deducted    = new ArrayList<>();
        double          subtotal    = 0;

        for (PlaceOrderRequest.CartEntry entry : request.getItems()) {
            Product product = productService.getById(entry.getProductId());

            boolean ok = productService.deductStock(entry.getProductId(), entry.getQuantity());
            if (!ok) {
                for (String pid : deducted) {
                    productService.restoreStock(pid,
                            request.getItems().stream()
                                    .filter(e -> e.getProductId().equals(pid))
                                    .findFirst()
                                    .map(PlaceOrderRequest.CartEntry::getQuantity)
                                    .orElse(0));
                }
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Insufficient stock for: " + product.getName());
            }
            deducted.add(entry.getProductId());

            double lineTotal  = product.getPrice() * entry.getQuantity();
            double commission = lineTotal * COMMISSION_RATE;
            subtotal         += lineTotal;

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setSellerId(product.getSellerId());
            item.setQuantity(entry.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setSellerCommission(commission);
            orderItems.add(item);
        }

        Order order = new Order();
        order.setBuyerId(buyerId);
        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setDeliveryFee(DELIVERY_FEE);
        order.setTotal(subtotal + DELIVERY_FEE);
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String buyerId) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId);
    }

    public Order getOrderById(String orderId, String buyerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        if (!order.getBuyerId().equals(buyerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return order;
    }

    public Order cancelOrder(String orderId, String buyerId) {
        Order order = getOrderById(orderId, buyerId);
        if (!order.getStatus().equals("PENDING")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING orders can be cancelled");
        }
        for (OrderItem item : order.getItems()) {
            productService.restoreStock(item.getProductId(), item.getQuantity());
        }
        order.setStatus("CANCELLED");
        order.setUpdatedAt(Instant.now());
        return orderRepository.save(order);
    }

    // --- Request DTO ---
    public static class PlaceOrderRequest {
        private List<CartEntry> items;
        private Order.ShippingAddress shippingAddress;
        private String paymentMethod;

        public List<CartEntry> getItems()                           { return items; }
        public void setItems(List<CartEntry> items)                 { this.items = items; }
        public Order.ShippingAddress getShippingAddress()           { return shippingAddress; }
        public void setShippingAddress(Order.ShippingAddress sa)    { this.shippingAddress = sa; }
        public String getPaymentMethod()                            { return paymentMethod; }
        public void setPaymentMethod(String pm)                     { this.paymentMethod = pm; }

        public static class CartEntry {
            private String productId;
            private int quantity;

            public String getProductId()                { return productId; }
            public void setProductId(String productId)  { this.productId = productId; }
            public int getQuantity()                    { return quantity; }
            public void setQuantity(int quantity)       { this.quantity = quantity; }
        }
    }
}