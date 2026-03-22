package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Indexed
    private String buyerId;

    private List<OrderItem> items;

    private double subtotal;
    private double deliveryFee;
    private double total;

    private String status; 

    private ShippingAddress shippingAddress;
    private String paymentMethod; 

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

  
    public static class OrderItem {
        private String productId;
        private String productName;
        private String sellerId;
        private int quantity;
        private double unitPrice;
        private double sellerCommission; 

        public String getProductId()                    { return productId; }
        public void setProductId(String productId)      { this.productId = productId; }
        public String getProductName()                  { return productName; }
        public void setProductName(String name)         { this.productName = name; }
        public String getSellerId()                     { return sellerId; }
        public void setSellerId(String sellerId)        { this.sellerId = sellerId; }
        public int getQuantity()                        { return quantity; }
        public void setQuantity(int quantity)           { this.quantity = quantity; }
        public double getUnitPrice()                    { return unitPrice; }
        public void setUnitPrice(double unitPrice)      { this.unitPrice = unitPrice; }
        public double getSellerCommission()             { return sellerCommission; }
        public void setSellerCommission(double sc)      { this.sellerCommission = sc; }
    }

    public static class ShippingAddress {
        private String fullName;
        private String addressLine;
        private String city;
        private String postalCode;
        private String phone;

        public String getFullName()                     { return fullName; }
        public void setFullName(String fullName)        { this.fullName = fullName; }
        public String getAddressLine()                  { return addressLine; }
        public void setAddressLine(String addr)         { this.addressLine = addr; }
        public String getCity()                         { return city; }
        public void setCity(String city)                { this.city = city; }
        public String getPostalCode()                   { return postalCode; }
        public void setPostalCode(String postalCode)    { this.postalCode = postalCode; }
        public String getPhone()                        { return phone; }
        public void setPhone(String phone)              { this.phone = phone; }
    }

    public String getId()                               { return id; }
    public void setId(String id)                        { this.id = id; }
    public String getBuyerId()                          { return buyerId; }
    public void setBuyerId(String buyerId)              { this.buyerId = buyerId; }
    public List<OrderItem> getItems()                   { return items; }
    public void setItems(List<OrderItem> items)         { this.items = items; }
    public double getSubtotal()                         { return subtotal; }
    public void setSubtotal(double subtotal)            { this.subtotal = subtotal; }
    public double getDeliveryFee()                      { return deliveryFee; }
    public void setDeliveryFee(double deliveryFee)      { this.deliveryFee = deliveryFee; }
    public double getTotal()                            { return total; }
    public void setTotal(double total)                  { this.total = total; }
    public String getStatus()                           { return status; }
    public void setStatus(String status)                { this.status = status; }
    public ShippingAddress getShippingAddress()         { return shippingAddress; }
    public void setShippingAddress(ShippingAddress sa)  { this.shippingAddress = sa; }
    public String getPaymentMethod()                    { return paymentMethod; }
    public void setPaymentMethod(String pm)             { this.paymentMethod = pm; }
    public Instant getCreatedAt()                       { return createdAt; }
    public void setCreatedAt(Instant ca)                { this.createdAt = ca; }
    public Instant getUpdatedAt()                       { return updatedAt; }
    public void setUpdatedAt(Instant ua)                { this.updatedAt = ua; }
}
