package com.ecopantry.repository;

import com.ecopantry.model.ShoppingList;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ShoppingRepository extends MongoRepository<ShoppingList, String> {
    List<ShoppingList> findByUserId(String userId);
}