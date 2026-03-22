package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String sellerId;  
    private String name;
    private String description;
    private String category;
    private String subCategory;

    private double price;
    private double originalPrice;

    private int stock;       

    private List<String> imageUrls;
    private String modelUrl;  
    private List<String> specs;
    private String badge;      

    @Indexed
    private boolean active = true;

    private double rating     = 0.0;
    private int    reviewCount = 0;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public String getId()                           { return id; }
    public void setId(String id)                    { this.id = id; }
    public String getSellerId()                     { return sellerId; }
    public void setSellerId(String sellerId)        { this.sellerId = sellerId; }
    public String getName()                         { return name; }
    public void setName(String name)                { this.name = name; }
    public String getDescription()                  { return description; }
    public void setDescription(String d)            { this.description = d; }
    public String getCategory()                     { return category; }
    public void setCategory(String category)        { this.category = category; }
    public String getSubCategory()                  { return subCategory; }
    public void setSubCategory(String sub)          { this.subCategory = sub; }
    public double getPrice()                        { return price; }
    public void setPrice(double price)              { this.price = price; }
    public double getOriginalPrice()                { return originalPrice; }
    public void setOriginalPrice(double op)         { this.originalPrice = op; }
    public int getStock()                           { return stock; }
    public void setStock(int stock)                 { this.stock = stock; }
    public List<String> getImageUrls()              { return imageUrls; }
    public void setImageUrls(List<String> urls)     { this.imageUrls = urls; }
    public String getModelUrl()                     { return modelUrl; }
    public void setModelUrl(String modelUrl)        { this.modelUrl = modelUrl; }
    public List<String> getSpecs()                  { return specs; }
    public void setSpecs(List<String> specs)        { this.specs = specs; }
    public String getBadge()                        { return badge; }
    public void setBadge(String badge)              { this.badge = badge; }
    public boolean isActive()                       { return active; }
    public void setActive(boolean active)           { this.active = active; }
    public double getRating()                       { return rating; }
    public void setRating(double rating)            { this.rating = rating; }
    public int getReviewCount()                     { return reviewCount; }
    public void setReviewCount(int rc)              { this.reviewCount = rc; }
    public Instant getCreatedAt()                   { return createdAt; }
    public void setCreatedAt(Instant ca)            { this.createdAt = ca; }
    public Instant getUpdatedAt()                   { return updatedAt; }
    public void setUpdatedAt(Instant ua)            { this.updatedAt = ua; }
}
