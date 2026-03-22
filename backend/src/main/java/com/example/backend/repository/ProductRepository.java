package com.example.backend.repository;

import com.example.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByActiveTrue();

    List<Product> findByCategoryAndActiveTrue(String category);

    List<Product> findBySellerIdAndActiveTrue(String sellerId);

    @Query("{ $and: [ { active: true }, { $or: [ { name: { $regex: ?0, $options: 'i' } }, { description: { $regex: ?0, $options: 'i' } }, { category: { $regex: ?0, $options: 'i' } } ] } ] }")
    List<Product> searchByKeyword(String keyword);

    @Query("{ active: true, price: { $gte: ?0, $lte: ?1 } }")
    List<Product> findByPriceBetweenAndActiveTrue(double minPrice, double maxPrice);
}