package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    public ProductService(ProductRepository productRepository, MongoTemplate mongoTemplate) {
        this.productRepository = productRepository;
        this.mongoTemplate     = mongoTemplate;
    }

    public Product createProduct(Product product, String sellerId) {
        product.setSellerId(sellerId);
        product.setActive(true);
        product.setCreatedAt(Instant.now());
        product.setUpdatedAt(Instant.now());
        return productRepository.save(product);
    }

    public Product updateProduct(String productId, Product updated, String sellerId) {
        Product existing = getProductOrThrow(productId);
        assertOwnerOrAdmin(existing, sellerId);

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setSubCategory(updated.getSubCategory());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setStock(updated.getStock());
        existing.setImageUrls(updated.getImageUrls());
        existing.setModelUrl(updated.getModelUrl());
        existing.setSpecs(updated.getSpecs());
        existing.setBadge(updated.getBadge());
        existing.setUpdatedAt(Instant.now());
        return productRepository.save(existing);
    }

    public void deactivateProduct(String productId, String sellerId) {
        Product existing = getProductOrThrow(productId);
        assertOwnerOrAdmin(existing, sellerId);
        existing.setActive(false);
        existing.setUpdatedAt(Instant.now());
        productRepository.save(existing);
    }

    public List<Product> getAllActive() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }

    public List<Product> getBySellerld(String sellerId) {
        return productRepository.findBySellerIdAndActiveTrue(sellerId);
    }

    public List<Product> search(String keyword) {
        return productRepository.searchByKeyword(keyword);
    }

    public Product getById(String productId) {
        return getProductOrThrow(productId);
    }


    public boolean deductStock(String productId, int quantity) {
        Query query = new Query(
                Criteria.where("_id").is(productId)
                        .and("stock").gte(quantity)
                        .and("active").is(true)
        );
        Update update = new Update()
                .inc("stock", -quantity)
                .set("updatedAt", Instant.now());

        Product result = mongoTemplate.findAndModify(query, update, Product.class);
        return result != null; 
    }

  
    public void restoreStock(String productId, int quantity) {
        Query query = new Query(Criteria.where("_id").is(productId));
        Update update = new Update()
                .inc("stock", quantity)
                .set("updatedAt", Instant.now());
        mongoTemplate.findAndModify(query, update, Product.class);
    }

    private Product getProductOrThrow(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private void assertOwnerOrAdmin(Product product, String callerId) {

        if (!product.getSellerId().equals(callerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this product");
        }
    }
}
