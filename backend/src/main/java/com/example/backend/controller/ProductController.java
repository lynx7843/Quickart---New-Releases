package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllActive();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable String id) {
        return productService.getById(id);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return productService.search(q);
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return productService.getByCategory(category);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Product> getBySeller(@PathVariable String sellerId) {
        return productService.getBySellerld(sellerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public Product create(@RequestBody Product product, Authentication auth) {
        String sellerId = (String) auth.getPrincipal(); // userId from JWT subject
        return productService.createProduct(product, sellerId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public Product update(@PathVariable String id,
                          @RequestBody Product product,
                          Authentication auth) {
        String callerId = (String) auth.getPrincipal();
        return productService.updateProduct(id, product, callerId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public void deactivate(@PathVariable String id, Authentication auth) {
        String callerId = (String) auth.getPrincipal();
        productService.deactivateProduct(id, callerId);
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public List<Product> myListings(Authentication auth) {
        String sellerId = (String) auth.getPrincipal();
        return productService.getBySellerld(sellerId);
    }
}
